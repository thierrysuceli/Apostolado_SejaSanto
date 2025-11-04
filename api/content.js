// API - CONTENT CONSOLIDATED (courses + posts + events)
import { authenticate, hasPermission, hasRole } from '../middleware-api/auth.js';
import { supabaseAdmin } from '../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  const { type, id, resource } = req.query;
  
  if (!type) return res.status(400).json({ error: 'Tipo é obrigatório (courses, posts ou events)' });
  
  try {
    const table = type === 'courses' ? 'courses' : type === 'posts' ? 'posts' : type === 'events' ? 'events' : null;
    if (!table) return res.status(400).json({ error: 'Tipo inválido' });
    
    // GET /:type - Listar itens (público para courses/posts)
    if (req.method === 'GET' && !id) {
      let query;
      
      if (type === 'courses') {
        query = supabaseAdmin.from(table).select(`
          *,
          course_tags(role_id, roles(id, name, display_name, color))
        `);
      } else if (type === 'posts') {
        query = supabaseAdmin.from(table).select(`
          *,
          users!author_id(id, name, avatar_url),
          post_tags(role_id, roles(id, name, display_name, color))
        `);
      } else if (type === 'events') {
        query = supabaseAdmin.from(table).select(`
          *,
          users!created_by(id, name, email),
          event_tags(role_id, roles(id, name, display_name)),
          event_category_tags(category_id, event_categories(id, name, color, icon))
        `);
      }
      
      if (type === 'events') query.order('start_date', { ascending: true });
      else query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      
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
        return item;
      });
      
      return res.status(200).json({ [type]: formattedData });
    }
    
    // GET /:type/:id - Buscar item específico (público para courses/posts)
    if (req.method === 'GET' && id && !resource) {
      let query;
      
      if (type === 'courses') {
        query = supabaseAdmin.from(table).select(`
          *,
          course_tags(role_id, roles(id, name, display_name, color)),
          modules(id, title, description, order, course_id, topics(id, title, description, content, order, module_id))
        `).eq('id', id);
      } else if (type === 'posts') {
        query = supabaseAdmin.from(table).select(`
          *,
          users!author_id(id, name, avatar_url),
          post_tags(role_id, roles(id, name, display_name, color))
        `).eq('id', id);
      } else if (type === 'events') {
        query = supabaseAdmin.from(table).select(`
          *,
          users!created_by(id, name, email),
          event_tags(role_id, roles(id, name, display_name)),
          event_category_tags(category_id, event_categories(id, name, color, icon))
        `).eq('id', id);
      }
      
      const { data, error } = await query.single();
      if (error) throw error;
      
      // Formatar dados
      if (type === 'posts' && data.users) {
        data.author = data.users;
        delete data.users;
      }
      if (type === 'events' && data.users) {
        data.author = data.users;
        delete data.users;
      }
      
      return res.status(200).json({ [type.slice(0, -1)]: data });
    }
    
    // Rotas protegidas
    await authenticate(req, res);
    if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
    
    // Verificar permissão inline (hasPermission não é middleware aqui)
    const requiredPermission = type === 'events' ? 'manage_events' : 'manage_content';
    const userHasPermission = await hasPermission(req.user.id, requiredPermission);
    if (!userHasPermission) {
      return res.status(403).json({ error: 'Sem permissão' });
    }
    
    // POST /:type - Criar item
    if (req.method === 'POST' && !id) {
      const { tags, categories, thematicTags, ...itemData } = req.body;
      
      // Criar item principal
      const { data, error } = await supabaseAdmin.from(table).insert(itemData).select().single();
      if (error) throw error;
      
      // Associar tags (roles) para posts/events/courses
      if (tags && Array.isArray(tags) && tags.length > 0) {
        const tagTable = type === 'posts' ? 'post_tags' : type === 'events' ? 'event_tags' : 'course_tags';
        const itemTags = tags.map(roleId => ({
          [`${type.slice(0, -1)}_id`]: data.id,
          role_id: roleId
        }));
        
        const { error: tagsError } = await supabaseAdmin.from(tagTable).insert(itemTags);
        if (tagsError) console.error(`Error inserting ${tagTable}:`, tagsError);
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
      
      return res.status(201).json({ [type.slice(0, -1)]: data });
    }
    
    // PUT /:type/:id - Atualizar item
    if (req.method === 'PUT' && id && !resource) {
      const { tags, categories, thematicTags, ...itemData } = req.body;
      
      // Atualizar item principal
      const { data, error } = await supabaseAdmin.from(table).update(itemData).eq('id', id).select().single();
      if (error) throw error;
      
      // Atualizar tags (roles) se fornecidas
      if (tags && Array.isArray(tags)) {
        const tagTable = type === 'posts' ? 'post_tags' : type === 'events' ? 'event_tags' : 'course_tags';
        const idField = `${type.slice(0, -1)}_id`;
        
        // Remover tags antigas
        await supabaseAdmin.from(tagTable).delete().eq(idField, id);
        
        // Adicionar novas tags
        if (tags.length > 0) {
          const itemTags = tags.map(roleId => ({
            [idField]: id,
            role_id: roleId
          }));
          
          const { error: tagsError } = await supabaseAdmin.from(tagTable).insert(itemTags);
          if (tagsError) console.error(`Error updating ${tagTable}:`, tagsError);
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
      
      return res.status(200).json({ [type.slice(0, -1)]: data });
    }
    
    // DELETE /:type/:id - Deletar item
    if (req.method === 'DELETE' && id) {
      const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
      if (error) throw error;
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

