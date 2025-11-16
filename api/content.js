// API - CONTENT CONSOLIDATED (courses + posts + events)
import { authenticate, hasPermission, hasRole } from '../middleware-api/auth.js';
import { supabaseAdmin } from '../lib-api/supabaseServer.js';
import { sanitizeHTML, sanitizeText, generateSlug } from '../lib-api/sanitize.js';

export default async function handler(req, res) {
  const { type, id, resource } = req.query;
  
  if (!type) return res.status(400).json({ error: 'Tipo é obrigatório (courses, posts, events, articles ou news)' });
  
  const tableMap = {
    courses: 'courses',
    posts: 'posts',
    events: 'events',
    articles: 'articles',
    news: 'news'
  };
  
  const singularMap = {
    courses: 'course',
    posts: 'post',
    events: 'event',
    articles: 'article',
    news: 'news'
  };
  
  const roleRelationMap = {
    courses: 'course_tags',
    posts: 'post_tags',
    events: 'event_tags',
    articles: 'article_tags',
    news: 'news_visibility'
  };
  
  const roleIdColumnMap = {
    courses: 'course_id',
    posts: 'post_id',
    events: 'event_id',
    articles: 'article_id',
    news: 'news_id'
  };
  
  const table = tableMap[type];
  const singular = singularMap[type];
  const relationKey = roleRelationMap[type];
  const relationIdColumn = roleIdColumnMap[type];
  const isUuid = typeof id === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  const primaryKeyColumn = 'id';
  
  if (!table || !singular) return res.status(400).json({ error: 'Tipo inválido' });
  
  try {
    let effectiveId = id;
    if ((type === 'articles' || type === 'news') && effectiveId && !isUuid && req.method !== 'POST') {
      const { data: slugRecord, error: slugError } = await supabaseAdmin
        .from(table)
        .select('id')
        .eq('slug', effectiveId)
        .maybeSingle();
      if (slugError && slugError.code !== 'PGRST116') throw slugError;
      if (!slugRecord) {
        return res.status(404).json({ error: `${singular} não encontrado ou sem acesso` });
      }
      effectiveId = slugRecord.id;
    }

    
    // ==============================================================
    // 🔒 GET /:type - Listar itens COM CONTROLE DE ACESSO
    // ==============================================================
    if (req.method === 'GET' && !id) {
      // Autenticar (não obrigatório, mas define req.user se houver)
      await authenticate(req, res);
      
      let baseSelect;
      
      // Definir SELECT base
      if (type === 'courses') {
        baseSelect = `
          *,
          course_tags(role_id, roles(id, name, display_name, color)),
          course_content_tags(tag_id, tags(id, name, slug, description, color)),
          modules(id, title, order_index)
        `;
      } else if (type === 'posts') {
        baseSelect = `
          id, title, slug, content, excerpt, cover_image_url, author_id, status, published_at, created_at, updated_at,
          users!author_id(id, name, avatar_url),
          post_tags(role_id, roles(id, name, display_name, color)),
          post_content_tags(tag_id, tags(id, name, color))
        `;
      } else if (type === 'events') {
        baseSelect = `
          *,
          users(id, name, email),
          event_tags(roles(id, name, display_name)),
          event_category_tags(category_id, event_categories(id, name, color, icon))
        `;
      } else if (type === 'articles') {
        baseSelect = `
          id, title, slug, content, excerpt, cover_image_url, author_id, status, published_at, created_at, updated_at, is_featured, views_count,
          editorial_column:editorial_columns(id, name, slug, color, description),
          users!author_id(id, name, avatar_url),
          article_tags(role_id, roles(id, name, display_name, color))
        `;
      } else if (type === 'news') {
        baseSelect = `
          id, title, slug, content, excerpt, cover_image_url, author_id, status, published_at, created_at, updated_at, is_featured, views_count,
          users!author_id(id, name, avatar_url),
          news_visibility(role_id, roles(id, name, display_name, color)),
          news_tag_assignments(tag:news_tags(id, name, slug, color))
        `;
      }
      
      let data;
      
      // 🔑 CONTROLE DE ACESSO: Admin vs User vs Visitante
      if (req.user) {
        const isAdmin = await hasRole(req.user.id, 'ADMIN');
        
        if (isAdmin) {
          // ✅ ADMIN: Vê TUDO (inclusive drafts)
          console.log(`[${type}] Admin access - showing all items`);
          const { data: items, error } = await supabaseAdmin
            .from(table)
            .select(baseSelect)
            .order(type === 'events' ? 'start_date' : 'created_at', { ascending: type === 'events' });
          
          if (error) throw error;
          data = items;
        } else {
          // ✅ USER AUTENTICADO: Vê apenas published + suas roles
          console.log(`[${type}] Authenticated user access - filtering by roles`);
          
          // Buscar roles do usuário
          const { data: userRoles } = await supabaseAdmin
            .from('user_roles')
            .select('role_id')
            .eq('user_id', req.user.id);
          
          const roleIds = userRoles?.map(ur => ur.role_id) || [];
          
          if (roleIds.length === 0) {
            // User sem roles = sem acesso
            return res.status(200).json({ [type]: [] });
          }
          
          // 1️⃣ Buscar IDs dos itens acessíveis via tags
          const tagTable = relationKey;
          const idColumn = relationIdColumn;
          
          const { data: itemTags, error: tagError } = await supabaseAdmin
            .from(tagTable)
            .select(idColumn)
            .in('role_id', roleIds);
          
          if (tagError) throw tagError;
          
          const itemIds = itemTags ? [...new Set(itemTags.map(t => t[idColumn]))] : [];
          
          if (itemIds.length === 0) {
            return res.status(200).json({ [type]: [] });
          }
          
          // 2️⃣ Buscar itens completos
          const { data: items, error } = await supabaseAdmin
            .from(table)
            .select(baseSelect)
            .eq('status', 'published')
            .in('id', itemIds)
            .order(type === 'events' ? 'start_date' : 'created_at', { ascending: type === 'events' });
          
          if (error) throw error;
          data = items;
        }
      } else {
        // ✅ VISITANTE NÃO AUTENTICADO: Apenas published + role VISITANTE
        console.log(`[${type}] Visitor access - showing only VISITANTE content`);
        
        const { data: visitanteRole } = await supabaseAdmin
          .from('roles')
          .select('id')
          .eq('name', 'VISITANTE')
          .single();
        
        if (!visitanteRole) {
          // Sem role VISITANTE no banco = sem acesso público
          return res.status(200).json({ [type]: [] });
        }
        
        // 1️⃣ Buscar IDs dos itens com role VISITANTE
        const tagTable = relationKey;
        const idColumn = relationIdColumn;
        
        const { data: itemTags, error: tagError } = await supabaseAdmin
          .from(tagTable)
          .select(idColumn)
          .eq('role_id', visitanteRole.id);
        
        if (tagError) throw tagError;
        
        const itemIds = itemTags ? [...new Set(itemTags.map(t => t[idColumn]))] : [];
        
        console.log(`[${type}] Visitor - Found ${itemIds.length} items with VISITANTE role`);
        
        if (itemIds.length === 0) {
          console.log(`[${type}] ⚠️ No items found with VISITANTE role - returning empty array`);
          return res.status(200).json({ [type]: [] });
        }
        
        // 2️⃣ Buscar itens completos
        const { data: items, error } = await supabaseAdmin
          .from(table)
          .select(baseSelect)
          .eq('status', 'published')
          .in('id', itemIds)
          .order(type === 'events' ? 'start_date' : 'created_at', { ascending: type === 'events' });
        
        if (error) throw error;
        data = items;
      }
      
      // Formatar dados
      const formattedData = (data || []).map(item => {
        if ((type === 'posts' || type === 'articles' || type === 'news') && item.users) {
          item.author = item.users;
          delete item.users;
        }
        if (type === 'events' && item.users) {
          item.author = item.users;
          delete item.users;
        }
        // Ordenar módulos para courses
        if (type === 'courses' && item.modules) {
          item.modules.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        }
        // Extrair tags (roles) para facilitar acesso no frontend
        if (relationKey && item[relationKey]) {
          item.tags = item[relationKey].map(t => t.roles).filter(Boolean);
        }
        if (type === 'news' && item.news_tag_assignments) {
          item.news_tags = item.news_tag_assignments.map(entry => entry.tag).filter(Boolean);
        }
        return item;
      });
      
      // 🚫 Cache busting para listagens
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      return res.status(200).json({ [type]: formattedData });
    }
    
    // ==============================================================
    // 🔒 GET /:type/:id - Buscar item específico COM CONTROLE DE ACESSO
    // ==============================================================
    if (req.method === 'GET' && id && !resource) {
      // Autenticar (não obrigatório)
      await authenticate(req, res);
      
      let baseSelect;
      
      // Definir SELECT base
      if (type === 'courses') {
        baseSelect = `
          *,
          course_tags(role_id, roles(id, name, display_name, color)),
          course_content_tags(tag_id, tags(id, name, slug, description, color)),
          modules(*,topics(*))
        `;
      } else if (type === 'posts') {
        baseSelect = `
          id, title, slug, content, excerpt, cover_image_url, author_id, status, published_at, created_at, updated_at,
          users!author_id(id, name, avatar_url),
          post_tags(role_id, roles(id, name, display_name, color)),
          post_content_tags(tag_id, tags(id, name, color))
        `;
      } else if (type === 'events') {
        baseSelect = `
          *,
          users(id, name, email),
          event_tags(roles(id, name, display_name)),
          event_category_tags(category_id, event_categories(id, name, color, icon))
        `;
      } else if (type === 'articles') {
        baseSelect = `
          id, title, slug, content, excerpt, cover_image_url, author_id, status, published_at, created_at, updated_at, is_featured, views_count,
          editorial_column:editorial_columns(id, name, slug, color, description),
          users!author_id(id, name, avatar_url),
          article_tags(role_id, roles(id, name, display_name, color))
        `;
      } else if (type === 'news') {
        baseSelect = `
          id, title, slug, content, excerpt, cover_image_url, author_id, status, published_at, created_at, updated_at, is_featured, views_count,
          users!author_id(id, name, avatar_url),
          news_visibility(role_id, roles(id, name, display_name, color)),
          news_tag_assignments(tag:news_tags(id, name, slug, color))
        `;
      }
      
      let data = null;
      
      // 🔑 CONTROLE DE ACESSO POR ID
      if (req.user) {
        const isAdmin = await hasRole(req.user.id, 'ADMIN');
        
        if (isAdmin) {
          // ✅ ADMIN: Vê tudo
          const { data: item, error } = await supabaseAdmin
            .from(table)
            .select(baseSelect)
            .eq(primaryKeyColumn, effectiveId)
            .single();
          
          if (error && error.code !== 'PGRST116') throw error;
          data = item;
        } else {
          // ✅ USER AUTENTICADO: Verifica se tem role do item
          const { data: userRoles } = await supabaseAdmin
            .from('user_roles')
            .select('role_id')
            .eq('user_id', req.user.id);
          
          const roleIds = userRoles?.map(ur => ur.role_id) || [];
          
          if (roleIds.length === 0) {
            return res.status(404).json({ error: `${singular} não encontrado ou sem acesso` });
          }
          
          // 1️⃣ Verificar se usuário tem acesso via tags
          const tagTable = relationKey;
          const idColumn = relationIdColumn;
          
          const { data: itemTag } = await supabaseAdmin
            .from(tagTable)
            .select('role_id')
            .eq(idColumn, effectiveId)
            .in('role_id', roleIds)
            .limit(1)
            .maybeSingle();
          
          if (!itemTag) {
            return res.status(404).json({ error: `${singular} não encontrado ou sem acesso` });
          }
          
          // 2️⃣ Buscar item completo (já sabemos que tem acesso)
          const { data: item, error } = await supabaseAdmin
            .from(table)
            .select(baseSelect)
            .eq(primaryKeyColumn, effectiveId)
            .eq('status', 'published')
            .single();
          
          if (error && error.code !== 'PGRST116') throw error;
          data = item;
        }
      } else {
        // ✅ VISITANTE: Apenas VISITANTE role
        const { data: visitanteRole } = await supabaseAdmin
          .from('roles')
          .select('id')
          .eq('name', 'VISITANTE')
          .single();
        
        if (!visitanteRole) {
          return res.status(404).json({ error: `${singular} não encontrado ou sem acesso` });
        }
        
        // 1️⃣ Verificar se item tem role VISITANTE
        const tagTable = relationKey;
        const idColumn = relationIdColumn;
        
        const { data: itemTag } = await supabaseAdmin
          .from(tagTable)
          .select('role_id')
          .eq(idColumn, effectiveId)
          .eq('role_id', visitanteRole.id)
          .limit(1)
          .maybeSingle();
        
        if (!itemTag) {
          return res.status(404).json({ error: `${singular} não encontrado ou sem acesso` });
        }
        
        // 2️⃣ Buscar item completo
        const { data: item, error } = await supabaseAdmin
          .from(table)
          .select(baseSelect)
          .eq(primaryKeyColumn, effectiveId)
          .eq('status', 'published')
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        data = item;
      }
      
      if (!data) {
        return res.status(404).json({ error: `${singular} não encontrado ou sem acesso` });
      }
      
      // Formatar dados
      if ((type === 'posts' || type === 'articles' || type === 'news') && data.users) {
        data.author = data.users;
        delete data.users;
      }
      if (type === 'events' && data.users) {
        data.author = data.users;
        delete data.users;
      }
      
      // Ordenar módulos e tópicos para courses
      if (type === 'courses' && data.modules) {
        data.modules.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        data.modules.forEach(module => {
          if (module.topics) {
            module.topics.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
          }
        });
      }
      
      // Extrair tags (roles)
      const tagField = relationKey;
      if (tagField && data[tagField]) {
        data.tags = data[tagField].map(t => t.roles).filter(Boolean);
      }
      if (type === 'news' && data.news_tag_assignments) {
        data.news_tags = data.news_tag_assignments.map(entry => entry.tag).filter(Boolean);
      }
      
      // Formatar event_category_tags
      if (type === 'events' && data.event_category_tags) {
        data.categories = data.event_category_tags.map(t => t.event_categories).filter(Boolean);
      }
      
      // 🚫 Cache busting
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      return res.status(200).json({ [singular]: data });
    }
    
    // ==============================================================
    // 🔐 ROTAS PROTEGIDAS (POST/PUT/DELETE) - Verificação por método
    // ==============================================================
    await authenticate(req, res);
    if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
    
    // 🔐 REGRA ESPECIAL: Apenas ADMIN pode criar/editar/deletar EVENTS
    const isAdmin = await hasRole(req.user.id, 'ADMIN');
    
    if (type === 'events' && !isAdmin) {
      console.log(`[${req.method} ${type}] Access denied - events require admin`);
      return res.status(403).json({ 
        error: 'Apenas administradores podem gerenciar eventos'
      });
    }
    
    // Para courses e posts: verificar permissão específica por método
    if (type !== 'events') {
      let requiredPermission = null;
      
      if (req.method === 'POST') {
        requiredPermission = type === 'courses' ? 'CREATE_COURSE' : 'CREATE_POST';
      } else if (req.method === 'PUT') {
        requiredPermission = type === 'courses' ? 'EDIT_COURSE' : 'EDIT_POST';
      } else if (req.method === 'DELETE') {
        requiredPermission = type === 'courses' ? 'DELETE_COURSE' : 'DELETE_POST';
      }
      
      const userHasPermission = isAdmin || (requiredPermission && await hasPermission(req.user.id, requiredPermission));
      
      console.log(`[${req.method} ${type}] Permission check:`, { 
        userId: req.user.id, 
        required: requiredPermission, 
        isAdmin, 
        hasPermission: userHasPermission 
      });
      
      if (!userHasPermission) {
        return res.status(403).json({ 
          error: 'Sem permissão para esta ação',
          required: requiredPermission
        });
      }
    }
    
    // POST /:type - Criar item
    if (req.method === 'POST' && !id) {
      const { tags, roles, categories, thematicTags, newsTags, visibilityRoles, ...itemData } = req.body;
      
      console.log('=== POST CONTENT ===');
      console.log('Type:', type);
      console.log('Body received:', JSON.stringify(req.body, null, 2));
      console.log('Tags:', tags);
      console.log('Roles:', roles);
      console.log('Categories:', categories);
      console.log('ThematicTags:', thematicTags);
      console.log('ItemData:', itemData);
      
      // 🧹 SANITIZAR DADOS
      if (itemData.title) {
        itemData.title = sanitizeText(itemData.title);
        itemData.slug = generateSlug(itemData.title);
      }
      
      if (itemData.description) {
        itemData.description = sanitizeHTML(itemData.description);
      }
      
      if (itemData.location) {
        itemData.location = sanitizeText(itemData.location);
      }
      if (itemData.excerpt) {
        itemData.excerpt = sanitizeText(itemData.excerpt);
      }
      if (itemData.content) {
        itemData.content = sanitizeHTML(itemData.content);
      }
      
      if ((type === 'articles' || type === 'news') && !itemData.content) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }
      if (type === 'articles') {
        if (!itemData.editorial_column_id) {
          return res.status(400).json({ error: 'editorial_column_id é obrigatório para artigos' });
        }
        if (!itemData.cover_image_url) {
          return res.status(400).json({ error: 'Artigos precisam de imagem de capa' });
        }
      }
      
      // Validações específicas para events
      if (type === 'events') {
        if (!itemData.title || !itemData.start_date) {
          return res.status(400).json({ error: 'title e start_date são obrigatórios' });
        }
        if (itemData.end_date && new Date(itemData.end_date) < new Date(itemData.start_date)) {
          return res.status(400).json({ error: 'end_date deve ser posterior a start_date' });
        }
        // Garantir created_by e status
        itemData.created_by = req.user.id;
        itemData.status = itemData.status || 'published';
      }
      
      // Garantir author_id para conteúdos editoriais
      if (type === 'posts' || type === 'articles' || type === 'news') {
        itemData.author_id = req.user.id;
      }
      
      // Criar item principal (sem joins, apenas dados diretos)
      console.log(`[POST ${type}] Inserting itemData:`, itemData);
      console.log(`[POST ${type}] Table:`, table);
      
      // 🔥 CRITICAL FIX: Especificar colunas explicitamente para evitar schema cache do Supabase
      // O Supabase PostgREST tem bug onde .select() sem params tenta resolver foreign keys do cache
      // NUNCA use .select() ou .select('*') em INSERT/UPDATE!
      const columnsMap = {
        events: 'id,title,description,start_date,end_date,location,meeting_link,created_by,created_at,updated_at,slug,status,color,all_day',
        posts: 'id,title,slug,content,excerpt,cover_image_url,author_id,status,published_at,created_at,updated_at',
        courses: 'id,title,slug,description,cover_image_url,status,created_at,updated_at'
      };
      
      const selectColumns = columnsMap[type] || '*';
      
      // 🚨 WORKAROUND: INSERT sem SELECT para evitar schema cache bug!
      // Depois fazemos GET separado para buscar o item
      const { data: insertResult, error } = await supabaseAdmin
        .from(table)
        .insert(itemData)
        .select('id')  // Só pegar o ID
        .single();
      
      if (error) {
        console.error(`[POST ${type}] Insert error:`, error);
        console.error(`[POST ${type}] Failed itemData was:`, itemData);
        throw error;
      }
      
      console.log(`[POST ${type}] Inserted successfully! ID:`, insertResult.id);
      
      const itemId = insertResult.id;
      
      // Associar tags (roles) para conteúdo restrito
      const roleTags = Array.isArray(visibilityRoles) && visibilityRoles.length > 0
        ? visibilityRoles
        : Array.isArray(roles) && roles.length > 0
          ? roles
          : Array.isArray(tags)
            ? tags
            : [];
      console.log(`[POST ${type}] Processing roleTags:`, roleTags);
      if (Array.isArray(roleTags) && roleTags.length > 0) {
        const tagTable = relationKey;
        const itemTags = roleTags.map(roleId => ({
          [`${singular}_id`]: itemId,
          role_id: roleId
        }));
        
        console.log(`[POST ${type}] Inserting into ${tagTable}:`, itemTags);
        const { error: tagsError } = await supabaseAdmin.from(tagTable).insert(itemTags);
        if (tagsError) {
          console.error(`❌ Error inserting ${tagTable}:`, tagsError);
        } else {
          console.log(`✅ ${tagTable} inserted successfully`);
        }
      }
      
      // Associar thematic tags (content_tags) para courses e posts
      if (thematicTags && Array.isArray(thematicTags) && thematicTags.length > 0 && (type === 'courses' || type === 'posts')) {
        const contentTagTable = type === 'courses' ? 'course_content_tags' : 'post_content_tags';
        const contentTags = thematicTags.map(tagId => ({
          [`${singular}_id`]: itemId,
          tag_id: tagId
        }));
        
        const { error: contentTagsError } = await supabaseAdmin.from(contentTagTable).insert(contentTags);
        if (contentTagsError) console.error(`Error inserting ${contentTagTable}:`, contentTagsError);
      }
      
      if (type === 'news' && Array.isArray(newsTags)) {
        await supabaseAdmin
          .from('news_tag_assignments')
          .delete()
          .eq('news_id', itemId);
        if (newsTags.length > 0) {
          const newsAssignments = newsTags.map(tagId => ({
            news_id: itemId,
            tag_id: tagId
          }));
          const { error: newsTagsError } = await supabaseAdmin
            .from('news_tag_assignments')
            .insert(newsAssignments);
          if (newsTagsError) console.error('Error inserting news_tag_assignments:', newsTagsError);
        }
      }
      
      // Associar categorias para events
      if (type === 'events' && categories && Array.isArray(categories) && categories.length > 0) {
        const eventCategories = categories.map(categoryId => ({
          event_id: itemId,
          category_id: categoryId
        }));
        
        console.log(`[POST events] Inserting event_category_tags:`, eventCategories);
        const { error: catError } = await supabaseAdmin.from('event_category_tags').insert(eventCategories);
        if (catError) {
          console.error('❌ Error inserting event_category_tags:', catError);
        } else {
          console.log('✅ event_category_tags inserted successfully');
        }
      }
      
      // 🚫 Cache busting para mutações
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // Buscar item completo DEPOIS das associações (evita schema cache bug)
      const { data: fullItem, error: fetchError } = await supabaseAdmin
        .from(table)
        .select(selectColumns)
        .eq('id', itemId)
        .single();
      
      if (fetchError) {
        console.warn(`[POST ${type}] Fetch error (item created but fetch failed):`, fetchError);
        // Retornar pelo menos o ID se o fetch falhar
        return res.status(201).json({ [singular]: insertResult });
      }
      
      console.log(`[POST ${type}] Created successfully:`, itemId);
      return res.status(201).json({ [singular]: fullItem });
    }
    
    // PUT /:type/:id - Atualizar item
    if (req.method === 'PUT' && id && !resource) {
      const { tags, roles, categories, thematicTags, newsTags, ...itemData } = req.body;
      
      // 🧹 SANITIZAR DADOS
      if (itemData.title !== undefined) {
        itemData.title = sanitizeText(itemData.title);
        itemData.slug = generateSlug(itemData.title);
      }
      
      if (itemData.description !== undefined) {
        itemData.description = sanitizeHTML(itemData.description);
      }
      
      if (itemData.location !== undefined) {
        itemData.location = itemData.location ? sanitizeText(itemData.location) : null;
      }
      
      // Validar datas para events
      if (type === 'events' && itemData.end_date !== undefined && itemData.start_date !== undefined) {
        if (itemData.end_date && new Date(itemData.end_date) < new Date(itemData.start_date)) {
          return res.status(400).json({ error: 'end_date deve ser posterior a start_date' });
        }
      }
      
      // Atualizar item principal (sem joins, apenas dados diretos)
      // 🔥 CRITICAL FIX: Especificar colunas explicitamente para evitar schema cache bug do Supabase
      const columnsMap = {
        events: 'id,title,description,start_date,end_date,location,meeting_link,created_by,created_at,updated_at,slug,status,color,all_day',
        posts: 'id,title,slug,content,excerpt,cover_image_url,author_id,status,published_at,created_at,updated_at',
        courses: 'id,title,slug,description,cover_image_url,status,created_at,updated_at'
      };
      
      const selectColumns = columnsMap[type] || '*';
      
      const { data, error } = await supabaseAdmin
        .from(table)
        .update(itemData)
        .eq(primaryKeyColumn, effectiveId)
        .select(selectColumns)
        .single();
      
      if (error) {
        console.error(`[PUT ${type}] Update error:`, error);
        throw error;
      }
      
      // Atualizar tags (roles) se fornecidas
      // Aceita tanto 'tags' quanto 'roles' para compatibilidade
      const roleTags = tags || roles;
      if (roleTags && Array.isArray(roleTags)) {
        const tagTable = relationKey;
        const idField = `${singular}_id`;
        
        // Remover tags antigas
        await supabaseAdmin.from(tagTable).delete().eq(idField, id);
        
        // Adicionar novas tags
        if (roleTags.length > 0) {
          const itemTags = roleTags.map(roleId => ({
            [idField]: id,
            role_id: roleId
          }));
          
          const { error: tagsError } = await supabaseAdmin.from(tagTable).insert(itemTags);
          if (tagsError) console.error(`Error updating ${tagTable}:`, tagsError);
        }
      }
      
      // Atualizar thematic tags (content_tags) para courses e posts
      if (thematicTags && Array.isArray(thematicTags) && (type === 'courses' || type === 'posts')) {
        const contentTagTable = type === 'courses' ? 'course_content_tags' : 'post_content_tags';
        const idField = `${singular}_id`;
        
        // Remover tags antigas
        await supabaseAdmin.from(contentTagTable).delete().eq(idField, id);
        
        // Adicionar novas tags
        if (thematicTags.length > 0) {
          const contentTags = thematicTags.map(tagId => ({
            [idField]: id,
            tag_id: tagId
          }));
          
          const { error: contentTagsError } = await supabaseAdmin.from(contentTagTable).insert(contentTags);
          if (contentTagsError) console.error(`Error updating ${contentTagTable}:`, contentTagsError);
        }
      }
      
      if (type === 'news' && Array.isArray(newsTags)) {
        await supabaseAdmin
          .from('news_tag_assignments')
          .delete()
          .eq('news_id', id);
        if (newsTags.length > 0) {
          const newsAssignments = newsTags.map(tagId => ({
            news_id: id,
            tag_id: tagId
          }));
          const { error: newsTagsError } = await supabaseAdmin
            .from('news_tag_assignments')
            .insert(newsAssignments);
          if (newsTagsError) console.error('Error updating news_tag_assignments:', newsTagsError);
        }
      }
      
      // Atualizar categorias para events
      if (type === 'events' && categories && Array.isArray(categories)) {
        // Remover categorias antigas
        await supabaseAdmin.from('event_category_tags').delete().eq('event_id', id);
        
        // Adicionar novas categorias
        if (categories.length > 0) {
          const eventCategories = categories.map(categoryId => ({
            event_id: id,
            category_id: categoryId
          }));
          
          const { error: catError } = await supabaseAdmin.from('event_category_tags').insert(eventCategories);
          if (catError) console.error('Error updating event_category_tags:', catError);
        }
      }
      
      // 🚫 Cache busting para mutações
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      console.log(`[PUT ${type}] Updated successfully:`, id);
      return res.status(200).json({ [singular]: data });
    }
    
    // DELETE /:type/:id - Deletar item
    if (req.method === 'DELETE' && id) {
      const { error } = await supabaseAdmin.from(table).delete().eq(primaryKeyColumn, effectiveId);
      if (error) throw error;
      
      // 🚫 Cache busting para mutações
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      console.log(`[DELETE ${type}] Deleted successfully:`, id);
      return res.status(200).json({ message: `${singular} deletado com sucesso` });
    }
    
    // Nota: Tags para courses/posts usam tabelas relacionais (course_tags/post_tags)
    // não uma coluna 'tags'. Remover endpoint incorreto que causava erro.
    
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Content error:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição' });
  }
}

