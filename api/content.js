// API - CONTENT CONSOLIDATED (courses + posts + events)
import { authenticate, hasPermission, hasRole } from '../middleware-api/auth.js';
import { supabaseAdmin } from '../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  const { type, id, resource } = req.query;
  
  if (!type) return res.status(400).json({ error: 'Tipo é obrigatório (courses, posts ou events)' });
  
  try {
    const table = type === 'courses' ? 'courses' : type === 'posts' ? 'posts' : type === 'events' ? 'events' : null;
    if (!table) return res.status(400).json({ error: 'Tipo inválido' });
    
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
          *,
          users!author_id(id, name, avatar_url),
          post_tags(role_id, roles(id, name, display_name, color)),
          post_content_tags(tag_id, tags(id, name, color))
        `;
      } else if (type === 'events') {
        baseSelect = `
          *,
          users!created_by(id, name, email),
          event_tags(role_id, roles(id, name, display_name)),
          event_category_tags(category_id, event_categories(id, name, color, icon))
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
          const tagTable = type === 'courses' ? 'course_tags' : type === 'posts' ? 'post_tags' : 'event_tags';
          const idColumn = type === 'courses' ? 'course_id' : type === 'posts' ? 'post_id' : 'event_id';
          
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
        const tagTable = type === 'courses' ? 'course_tags' : type === 'posts' ? 'post_tags' : 'event_tags';
        const idColumn = type === 'courses' ? 'course_id' : type === 'posts' ? 'post_id' : 'event_id';
        
        const { data: itemTags, error: tagError } = await supabaseAdmin
          .from(tagTable)
          .select(idColumn)
          .eq('role_id', visitanteRole.id);
        
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
      
      // Formatar dados
      const formattedData = (data || []).map(item => {
        if (type === 'posts' && item.users) {
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
        if (item[`${type.slice(0, -1)}_tags`]) {
          item.tags = item[`${type.slice(0, -1)}_tags`].map(t => t.roles).filter(Boolean);
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
          *,
          users!author_id(id, name, avatar_url),
          post_tags(role_id, roles(id, name, display_name, color)),
          post_content_tags(tag_id, tags(id, name, color))
        `;
      } else if (type === 'events') {
        baseSelect = `
          *,
          users!created_by(id, name, email),
          event_tags(role_id, roles(id, name, display_name)),
          event_category_tags(category_id, event_categories(id, name, color, icon))
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
            .eq('id', id)
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
            return res.status(404).json({ error: `${type.slice(0, -1)} não encontrado ou sem acesso` });
          }
          
          // 1️⃣ Verificar se usuário tem acesso via tags
          const tagTable = type === 'courses' ? 'course_tags' : type === 'posts' ? 'post_tags' : 'event_tags';
          const idColumn = type === 'courses' ? 'course_id' : type === 'posts' ? 'post_id' : 'event_id';
          
          const { data: itemTag } = await supabaseAdmin
            .from(tagTable)
            .select('role_id')
            .eq(idColumn, id)
            .in('role_id', roleIds)
            .limit(1)
            .maybeSingle();
          
          if (!itemTag) {
            return res.status(404).json({ error: `${type.slice(0, -1)} não encontrado ou sem acesso` });
          }
          
          // 2️⃣ Buscar item completo (já sabemos que tem acesso)
          const { data: item, error } = await supabaseAdmin
            .from(table)
            .select(baseSelect)
            .eq('id', id)
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
          return res.status(404).json({ error: `${type.slice(0, -1)} não encontrado ou sem acesso` });
        }
        
        // 1️⃣ Verificar se item tem role VISITANTE
        const tagTable = type === 'courses' ? 'course_tags' : type === 'posts' ? 'post_tags' : 'event_tags';
        const idColumn = type === 'courses' ? 'course_id' : type === 'posts' ? 'post_id' : 'event_id';
        
        const { data: itemTag } = await supabaseAdmin
          .from(tagTable)
          .select('role_id')
          .eq(idColumn, id)
          .eq('role_id', visitanteRole.id)
          .limit(1)
          .maybeSingle();
        
        if (!itemTag) {
          return res.status(404).json({ error: `${type.slice(0, -1)} não encontrado ou sem acesso` });
        }
        
        // 2️⃣ Buscar item completo
        const { data: item, error } = await supabaseAdmin
          .from(table)
          .select(baseSelect)
          .eq('id', id)
          .eq('status', 'published')
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        data = item;
      }
      
      if (!data) {
        return res.status(404).json({ error: `${type.slice(0, -1)} não encontrado ou sem acesso` });
      }
      
      // Formatar dados
      if (type === 'posts' && data.users) {
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
      const tagField = `${type.slice(0, -1)}_tags`;
      if (data[tagField]) {
        data.tags = data[tagField].map(t => t.roles).filter(Boolean);
      }
      
      // Formatar event_category_tags
      if (type === 'events' && data.event_category_tags) {
        data.categories = data.event_category_tags.map(t => t.event_categories).filter(Boolean);
      }
      
      // 🚫 Cache busting
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      return res.status(200).json({ [type.slice(0, -1)]: data });
    }
    
    // ==============================================================
    // 🔐 ROTAS PROTEGIDAS (POST/PUT/DELETE) - Verificação por método
    // ==============================================================
    await authenticate(req, res);
    if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
    
    // Determinar permissão ESPECÍFICA baseada no método HTTP
    let requiredPermission = null;
    
    if (req.method === 'POST') {
      requiredPermission = type === 'courses' ? 'CREATE_COURSE' : 
                          type === 'posts' ? 'CREATE_POST' : 
                          'CREATE_EVENT';
    } else if (req.method === 'PUT') {
      requiredPermission = type === 'courses' ? 'EDIT_COURSE' : 
                          type === 'posts' ? 'EDIT_POST' : 
                          'EDIT_EVENT';
    } else if (req.method === 'DELETE') {
      requiredPermission = type === 'courses' ? 'DELETE_COURSE' : 
                          type === 'posts' ? 'DELETE_POST' : 
                          'DELETE_EVENT';
    }
    
    // Verificar permissão: Admin OU permissão específica
    const isAdmin = await hasRole(req.user.id, 'ADMIN');
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
    
    // POST /:type - Criar item
    if (req.method === 'POST' && !id) {
      const { tags, roles, categories, thematicTags, ...itemData } = req.body;
      
      // Validações específicas para events
      if (type === 'events') {
        if (!itemData.title || !itemData.start_date) {
          return res.status(400).json({ error: 'title e start_date são obrigatórios' });
        }
        if (itemData.end_date && new Date(itemData.end_date) < new Date(itemData.start_date)) {
          return res.status(400).json({ error: 'end_date deve ser posterior a start_date' });
        }
        // Garantir created_by
        itemData.created_by = req.user.id;
      }
      
      // Garantir author_id para posts
      if (type === 'posts') {
        itemData.author_id = req.user.id;
      }
      
      // Criar item principal
      const { data, error } = await supabaseAdmin.from(table).insert(itemData).select().single();
      if (error) throw error;
      
      // Associar tags (roles) para posts/events/courses
      // Aceita tanto 'tags' quanto 'roles' para compatibilidade
      const roleTags = tags || roles || [];
      if (Array.isArray(roleTags) && roleTags.length > 0) {
        const tagTable = type === 'posts' ? 'post_tags' : type === 'events' ? 'event_tags' : 'course_tags';
        const itemTags = roleTags.map(roleId => ({
          [`${type.slice(0, -1)}_id`]: data.id,
          role_id: roleId
        }));
        
        const { error: tagsError } = await supabaseAdmin.from(tagTable).insert(itemTags);
        if (tagsError) console.error(`Error inserting ${tagTable}:`, tagsError);
      }
      
      // Associar thematic tags (content_tags) para courses e posts
      if (thematicTags && Array.isArray(thematicTags) && thematicTags.length > 0 && (type === 'courses' || type === 'posts')) {
        const contentTagTable = type === 'courses' ? 'course_content_tags' : 'post_content_tags';
        const contentTags = thematicTags.map(tagId => ({
          [`${type.slice(0, -1)}_id`]: data.id,
          tag_id: tagId
        }));
        
        const { error: contentTagsError } = await supabaseAdmin.from(contentTagTable).insert(contentTags);
        if (contentTagsError) console.error(`Error inserting ${contentTagTable}:`, contentTagsError);
      }
      
      // Associar categorias para events
      if (type === 'events' && categories && Array.isArray(categories) && categories.length > 0) {
        const eventCategories = categories.map(categoryId => ({
          event_id: data.id,
          category_id: categoryId
        }));
        
        const { error: catError } = await supabaseAdmin.from('event_category_tags').insert(eventCategories);
        if (catError) console.error('Error inserting event_category_tags:', catError);
      }
      
      // 🚫 Cache busting para mutações
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      console.log(`[POST ${type}] Created successfully:`, data.id);
      return res.status(201).json({ [type.slice(0, -1)]: data });
    }
    
    // PUT /:type/:id - Atualizar item
    if (req.method === 'PUT' && id && !resource) {
      const { tags, roles, categories, thematicTags, ...itemData } = req.body;
      
      // Atualizar item principal
      const { data, error } = await supabaseAdmin.from(table).update(itemData).eq('id', id).select().single();
      if (error) throw error;
      
      // Atualizar tags (roles) se fornecidas
      // Aceita tanto 'tags' quanto 'roles' para compatibilidade
      const roleTags = tags || roles;
      if (roleTags && Array.isArray(roleTags)) {
        const tagTable = type === 'posts' ? 'post_tags' : type === 'events' ? 'event_tags' : 'course_tags';
        const idField = `${type.slice(0, -1)}_id`;
        
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
        const idField = `${type.slice(0, -1)}_id`;
        
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
      return res.status(200).json({ [type.slice(0, -1)]: data });
    }
    
    // DELETE /:type/:id - Deletar item
    if (req.method === 'DELETE' && id) {
      const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
      if (error) throw error;
      
      // 🚫 Cache busting para mutações
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      console.log(`[DELETE ${type}] Deleted successfully:`, id);
      return res.status(200).json({ message: `${type.slice(0, -1)} deletado com sucesso` });
    }
    
    // Nota: Tags para courses/posts usam tabelas relacionais (course_tags/post_tags)
    // não uma coluna 'tags'. Remover endpoint incorreto que causava erro.
    
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Content error:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição' });
  }
}

