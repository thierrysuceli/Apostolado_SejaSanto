// =====================================================
// API - LISTAR POSTS
// GET /api/posts
// Retorna posts visíveis para o usuário
// =====================================================

import { supabase, supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate } from '../middleware/auth.js';
import { runMiddleware } from '../lib/expressHelpers.js';

export default async function handler(req, res) {
  // Apenas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    // Autenticar usuário (opcional)
    await runMiddleware(authenticate)(req, res);
    
    let roleIds = [];
    
    if (req.user) {
      // Usuário autenticado - buscar suas roles
      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role_id')
        .eq('user_id', req.user.id);
      
      roleIds = userRoles ? userRoles.map(ur => ur.role_id) : [];
      
      // Se é admin, buscar todos os posts
      const isAdmin = req.user.roles?.some(r => r.name === 'ADMIN');
      if (isAdmin) {
        const { data: posts, error } = await supabaseAdmin
          .from('posts')
          .select(`
            *,
            users!author_id(id, name, avatar_url),
            post_tags(role_id, roles(name, display_name, color))
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        
        if (error) throw error;
        
        return res.status(200).json({ posts: posts || [] });
      }
    } else {
      // Não autenticado - role VISITANTE
      const { data: visitanteRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'VISITANTE')
        .single();
      
      if (visitanteRole) {
        roleIds = [visitanteRole.id];
      }
    }
    
    if (roleIds.length === 0) {
      return res.status(200).json({ posts: [] });
    }
    
    // Buscar IDs dos posts visíveis via tags
    const { data: postTags, error: tagError } = await supabaseAdmin
      .from('post_tags')
      .select('post_id')
      .in('role_id', roleIds);
    
    if (tagError) throw tagError;
    
    const postIds = postTags ? [...new Set(postTags.map(pt => pt.post_id))] : [];
    
    if (postIds.length === 0) {
      return res.status(200).json({ posts: [] });
    }
    
    // Buscar posts completos
    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        users!author_id(id, name, avatar_url),
        post_tags(role_id, roles(name, display_name, color))
      `)
      .eq('status', 'published')
      .in('id', postIds)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    
    return res.status(200).json({ posts: posts || [] });
    
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({ error: 'Erro ao buscar posts' });
  }
}
