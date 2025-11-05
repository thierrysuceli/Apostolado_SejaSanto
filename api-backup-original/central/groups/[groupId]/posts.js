// =====================================================
// API - CENTRAL POSTS
// GET/POST /api/central/groups/:groupId/posts
// =====================================================

import { supabaseAdmin } from '../../../lib/supabaseServer.js';
import { authenticate } from '../../../middleware/auth.js';

export default async function handler(req, res) {
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  
  const groupId = req.query?.groupId || req._expressParams?.groupId;
  
  if (!groupId) {
    return res.status(400).json({ error: 'ID do grupo é obrigatório' });
  }
  
  // GET - Listar posts do grupo
  if (req.method === 'GET') {
    try {
      // Verificar se usuário tem acesso ao grupo
      const { data: group } = await supabaseAdmin
        .from('central_groups')
        .select('role_id')
        .eq('id', groupId)
        .single();
      
      if (!group) {
        return res.status(404).json({ error: 'Grupo não encontrado' });
      }
      
      // Verificar se usuário tem a role do grupo OU é admin
      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role_id')
        .eq('user_id', req.user.id);
      
      const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
      const hasAccess = userRoleIds.includes(group.role_id);
      
      // Verificar se é admin
      const { data: adminRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'ADMIN')
        .single();
      
      const isAdmin = adminRole && userRoleIds.includes(adminRole.id);
      
      if (!hasAccess && !isAdmin) {
        return res.status(403).json({ error: 'Sem acesso a este grupo' });
      }
      
      // Buscar posts
      const { data: posts, error } = await supabaseAdmin
        .from('central_posts')
        .select(`
          *,
          author:users!central_posts_author_id_fkey(id, name, avatar_url)
        `)
        .eq('group_id', groupId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return res.status(200).json({ posts: posts || [] });
      
    } catch (error) {
      console.error('Get central posts error:', error);
      return res.status(500).json({ error: 'Erro ao buscar posts' });
    }
  }
  
  // POST - Criar post
  if (req.method === 'POST') {
    try {
      // Verificar acesso ao grupo (mesmo código do GET)
      const { data: group } = await supabaseAdmin
        .from('central_groups')
        .select('role_id')
        .eq('id', groupId)
        .single();
      
      if (!group) {
        return res.status(404).json({ error: 'Grupo não encontrado' });
      }
      
      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role_id')
        .eq('user_id', req.user.id);
      
      const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
      const hasAccess = userRoleIds.includes(group.role_id);
      
      const { data: adminRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'ADMIN')
        .single();
      
      const isAdmin = adminRole && userRoleIds.includes(adminRole.id);
      
      if (!hasAccess && !isAdmin) {
        return res.status(403).json({ error: 'Sem acesso a este grupo' });
      }
      
      const { title, content, type, metadata, attachments } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }
      
      const { data: post, error } = await supabaseAdmin
        .from('central_posts')
        .insert({
          group_id: groupId,
          author_id: req.user.id,
          title: title || null,
          content,
          type: type || 'post',
          metadata: metadata || {},
          attachments: attachments || []
        })
        .select(`
          *,
          author:users!central_posts_author_id_fkey(id, name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({ post });
      
    } catch (error) {
      console.error('Create central post error:', error);
      return res.status(500).json({ error: 'Erro ao criar post' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
