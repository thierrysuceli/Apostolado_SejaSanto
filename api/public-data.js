// API - PUBLIC DATA CONSOLIDATED
// Consolida: comments, event-categories, modules, topics, misc (roles/tags)
import { authenticate, hasRole } from '../middleware-api/auth.js';
import { supabaseAdmin } from '../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  const { type, id } = req.query;
  
  try {
    // ROLES
    if (type === 'roles') {
      const { data, error } = await supabaseAdmin.from('roles').select('*').order('display_name');
      if (error) throw error;
      return res.status(200).json({ roles: data || [] });
    }
    
    // PERMISSIONS (admin only)
    if (type === 'permissions' && req.method === 'GET') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem visualizar permissões' });
      const { data: permissions, error } = await supabaseAdmin
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      const grouped = permissions?.reduce((acc, perm) => {
        if (!acc[perm.category]) {
          acc[perm.category] = [];
        }
        acc[perm.category].push(perm);
        return acc;
      }, {});
      return res.status(200).json({ 
        permissions: permissions || [],
        grouped: grouped || {}
      });
    }
    
    // TAGS
    if (type === 'tags' && req.method === 'GET') {
      const { data, error } = await supabaseAdmin.from('tags').select('*').order('name');
      if (error) throw error;
      return res.status(200).json({ tags: data || [] });
    }
    if (type === 'tags' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem criar tags' });
      const { name, description, color } = req.body;
      if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });
      const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const { data, error } = await supabaseAdmin.from('tags').insert({ name, slug, description: description || null, color: color || '#6b7280' }).select().single();
      if (error) throw error;
      return res.status(201).json({ tag: data });
    }
    if (type === 'tags' && req.method === 'PUT') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem editar tags' });
      const { id, name, description, color } = req.body;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
      const updateData = {};
      if (name) {
        updateData.name = name;
        updateData.slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }
      if (description !== undefined) updateData.description = description;
      if (color) updateData.color = color;
      const { data, error } = await supabaseAdmin.from('tags').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ tag: data });
    }
    if (type === 'tags' && req.method === 'DELETE') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem deletar tags' });
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
      const { error } = await supabaseAdmin.from('tags').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ message: 'Tag deletada' });
    }
    
    // EVENT CATEGORIES
    if (type === 'event-categories' && req.method === 'GET') {
      const { data, error } = await supabaseAdmin.from('event_categories').select('*').order('name');
      if (error) throw error;
      return res.status(200).json({ categories: data || [] });
    }
    if (type === 'event-categories' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem criar categorias' });
      const { name, description, color, icon } = req.body;
      if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });
      const { data, error } = await supabaseAdmin.from('event_categories').insert({ name, description, color: color || '#6b7280', icon }).select().single();
      if (error) throw error;
      return res.status(201).json({ category: data });
    }
    if (type === 'event-categories' && req.method === 'PUT') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem editar categorias' });
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
      const { data, error } = await supabaseAdmin.from('event_categories').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ category: data });
    }
    if (type === 'event-categories' && req.method === 'DELETE') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem deletar categorias' });
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
      const { error } = await supabaseAdmin.from('event_categories').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ message: 'Categoria deletada' });
    }
    
    // MODULES
    if (type === 'modules' && req.method === 'GET' && !id) {
      const { data, error } = await supabaseAdmin.from('modules').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      return res.status(200).json({ modules: data || [] });
    }
    if (type === 'modules' && req.method === 'GET' && id) {
      const { data, error} = await supabaseAdmin.from('modules').select('*').eq('id', id).single();
      if (error) throw error;
      return res.status(200).json({ module: data });
    }
    if (type === 'modules' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem criar módulos' });
      const { course_id, title, description, order_index } = req.body;
      if (!course_id || !title) return res.status(400).json({ error: 'course_id e title são obrigatórios' });
      
      // Se order_index não fornecido, calcular próximo
      let finalOrderIndex = order_index;
      if (finalOrderIndex === undefined || finalOrderIndex === null) {
        const { data: existingModules } = await supabaseAdmin
          .from('modules')
          .select('order_index')
          .eq('course_id', course_id)
          .order('order_index', { ascending: false })
          .limit(1);
        
        finalOrderIndex = existingModules && existingModules.length > 0 
          ? (existingModules[0].order_index || 0) + 1 
          : 0;
      }
      
      const { data, error } = await supabaseAdmin.from('modules').insert({ course_id, title, description, order_index: finalOrderIndex }).select().single();
      if (error) throw error;
      return res.status(201).json({ module: data });
    }
    if (type === 'modules' && req.method === 'PUT' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem editar módulos' });
      const { data, error } = await supabaseAdmin.from('modules').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ module: data });
    }
    if (type === 'modules' && req.method === 'DELETE' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem deletar módulos' });
      const { error } = await supabaseAdmin.from('modules').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ message: 'Módulo deletado' });
    }
    
    // TOPICS
    if (type === 'topics' && req.method === 'GET' && !id) {
      const { data, error } = await supabaseAdmin.from('topics').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      return res.status(200).json({ topics: data || [] });
    }
    if (type === 'topics' && req.method === 'GET' && id) {
      const { data, error } = await supabaseAdmin.from('topics').select('*').eq('id', id).single();
      if (error) throw error;
      return res.status(200).json({ topic: data });
    }
    if (type === 'topics' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem criar tópicos' });
      const { module_id, title, content_before, video_url, content_after, duration, order_index } = req.body;
      if (!module_id || !title) return res.status(400).json({ error: 'module_id e title são obrigatórios' });
      
      // Se order_index não fornecido, calcular próximo
      let finalOrderIndex = order_index;
      if (finalOrderIndex === undefined || finalOrderIndex === null) {
        const { data: existingTopics } = await supabaseAdmin
          .from('topics')
          .select('order_index')
          .eq('module_id', module_id)
          .order('order_index', { ascending: false })
          .limit(1);
        
        finalOrderIndex = existingTopics && existingTopics.length > 0 
          ? (existingTopics[0].order_index || 0) + 1 
          : 0;
      }
      
      const { data, error } = await supabaseAdmin.from('topics').insert({ module_id, title, content_before, video_url, content_after, duration, order_index: finalOrderIndex }).select().single();
      if (error) throw error;
      return res.status(201).json({ topic: data });
    }
    if (type === 'topics' && req.method === 'PUT' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem editar tópicos' });
      const { data, error } = await supabaseAdmin.from('topics').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ topic: data });
    }
    if (type === 'topics' && req.method === 'DELETE' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas admins podem deletar tópicos' });
      const { error } = await supabaseAdmin.from('topics').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ message: 'Tópico deletado' });
    }
    
    // COMMENTS
    if (type === 'comments' && req.method === 'GET' && !id) {
      const { data, error } = await supabaseAdmin.from('comments').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ comments: data || [] });
    }
    if (type === 'comments' && req.method === 'GET' && id) {
      const { data, error } = await supabaseAdmin.from('comments').select('*').eq('id', id).single();
      if (error) throw error;
      return res.status(200).json({ comment: data });
    }
    if (type === 'comments' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const { content, post_id, topic_id, event_id, parent_comment_id } = req.body;
      const insertData = { 
        content, 
        author_id: req.user.id,
        ...(post_id && { post_id }),
        ...(topic_id && { topic_id }),
        ...(event_id && { event_id }),
        ...(parent_comment_id && { parent_comment_id })
      };
      const { data, error } = await supabaseAdmin.from('comments').insert(insertData).select().single();
      if (error) throw error;
      return res.status(201).json({ comment: data });
    }
    if (type === 'comments' && req.method === 'DELETE' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const { error } = await supabaseAdmin.from('comments').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ message: 'Comentário deletado' });
    }
    
    return res.status(404).json({ error: 'Tipo inválido ou rota não encontrada' });
  } catch (error) {
    console.error('Public data error:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição' });
  }
}
