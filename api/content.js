// API - CONTENT CONSOLIDATED (courses + posts + events)
import { authenticate, hasPermission } from '../middleware-api/auth.js';
import { supabaseAdmin } from '../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  const { type, id, resource } = req.query;
  
  if (!type) return res.status(400).json({ error: 'Tipo é obrigatório (courses, posts ou events)' });
  
  try {
    const table = type === 'courses' ? 'courses' : type === 'posts' ? 'posts' : type === 'events' ? 'events' : null;
    if (!table) return res.status(400).json({ error: 'Tipo inválido' });
    
    // GET /:type - Listar itens (público para courses/posts)
    if (req.method === 'GET' && !id) {
      const query = supabaseAdmin.from(table).select('*');
      // TODO: Adicionar filtro is_published quando a coluna existir no banco
      // if (type !== 'events') query.eq('is_published', true);
      // Removido order para courses pois coluna 'order' não existe no banco
      // if (type === 'courses') query.order('order', { ascending: true });
      if (type === 'events') query.order('start_date', { ascending: true });
      else query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ [type]: data || [] });
    }
    
    // GET /:type/:id - Buscar item específico (público para courses/posts)
    if (req.method === 'GET' && id && !resource) {
      const query = supabaseAdmin.from(table).select('*').eq('id', id);
      // Removido filtro is_published pois coluna não existe no banco
      // if (type !== 'events') query.eq('is_published', true);
      const { data, error } = await query.single();
      if (error) throw error;
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
      const { data, error } = await supabaseAdmin.from(table).insert(req.body).select().single();
      if (error) throw error;
      return res.status(201).json({ [type.slice(0, -1)]: data });
    }
    
    // PUT /:type/:id - Atualizar item
    if (req.method === 'PUT' && id && !resource) {
      const { data, error } = await supabaseAdmin.from(table).update(req.body).eq('id', id).select().single();
      if (error) throw error;
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

