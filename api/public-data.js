// API - PUBLIC DATA CONSOLIDATED
// Consolida: comments, event-categories, modules, topics, misc (roles/tags)
import { authenticate } from '../middleware-api/auth.js';
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
    
    // TAGS
    if (type === 'tags') {
      const { data, error } = await supabaseAdmin.from('tags').select('*').order('name');
      if (error) throw error;
      return res.status(200).json({ tags: data || [] });
    }
    
    // EVENT CATEGORIES
    if (type === 'event-categories') {
      const { data, error } = await supabaseAdmin.from('event_categories').select('*').order('name');
      if (error) throw error;
      return res.status(200).json({ categories: data || [] });
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
      const { course_id, title, description, order_index } = req.body;
      if (!course_id || !title) return res.status(400).json({ error: 'course_id e title são obrigatórios' });
      const { data, error } = await supabaseAdmin.from('modules').insert({ course_id, title, description, order_index: order_index || 0 }).select().single();
      if (error) throw error;
      return res.status(201).json({ module: data });
    }
    if (type === 'modules' && req.method === 'PUT' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const { data, error } = await supabaseAdmin.from('modules').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ module: data });
    }
    if (type === 'modules' && req.method === 'DELETE' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
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
      const { module_id, title, content_before, video_url, content_after, duration, order_index } = req.body;
      if (!module_id || !title) return res.status(400).json({ error: 'module_id e title são obrigatórios' });
      const { data, error } = await supabaseAdmin.from('topics').insert({ module_id, title, content_before, video_url, content_after, duration, order_index: order_index || 0 }).select().single();
      if (error) throw error;
      return res.status(201).json({ topic: data });
    }
    if (type === 'topics' && req.method === 'PUT' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      const { data, error } = await supabaseAdmin.from('topics').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ topic: data });
    }
    if (type === 'topics' && req.method === 'DELETE' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
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
      const { content, post_id } = req.body;
      const { data, error } = await supabaseAdmin.from('comments').insert({ content, post_id, author_id: req.user.id }).select().single();
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
