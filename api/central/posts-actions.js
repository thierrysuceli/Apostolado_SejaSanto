// =====================================================
// API - CENTRAL POSTS ACTIONS (CONSOLIDADA)
// Combina pin, delete, edit, comments em 1 função
// =====================================================

import { authenticate, hasPermission } from '../middleware/auth.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';

export default async function handler(req, res) {
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const { id: postId, action } = req.query;
  
  if (!postId) {
    return res.status(400).json({ error: 'ID do post é obrigatório' });
  }

  // Verificar se é admin
  const { data: adminRole } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('name', 'ADMIN')
    .single();
  
  const { data: userRoles } = await supabaseAdmin
    .from('user_roles')
    .select('role_id')
    .eq('user_id', req.user.id);
  
  const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
  const isAdmin = adminRole && userRoleIds.includes(adminRole.id);

  try {
    // ============================================
    // 1. PUT ?action=pin - Fixar/desfixar post
    // ============================================
    if (req.method === 'PUT' && action === 'pin') {
      await new Promise((resolve) => hasPermission(req, res, resolve));
      
      if (!req.userPermissions?.includes('manage_events')) {
        return res.status(403).json({ error: 'Sem permissão' });
      }
      
      const { is_pinned, pinned_until } = req.body;
      
      const updateData = {
        is_pinned: is_pinned ?? false,
        pinned_until: pinned_until || null,
        pinned_at: is_pinned ? new Date().toISOString() : null,
        pinned_by: is_pinned ? req.user.id : null
      };
      
      const { data: post, error } = await supabaseAdmin
        .from('central_posts')
        .update(updateData)
        .eq('id', postId)
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(200).json({ post });
    }
    
    // ============================================
    // 2. DELETE ?action=delete - Deletar post
    // ============================================
    if (req.method === 'DELETE' && action === 'delete') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem deletar posts' });
      }

      // Verificar se o post existe
      const { data: post, error: fetchError } = await supabaseAdmin
        .from('central_posts')
        .select('id, group_id')
        .eq('id', postId)
        .single();

      if (fetchError || !post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      // Deletar comentários relacionados primeiro
      await supabaseAdmin
        .from('central_comments')
        .delete()
        .eq('post_id', postId);

      // Deletar o post
      const { error: deleteError } = await supabaseAdmin
        .from('central_posts')
        .delete()
        .eq('id', postId);

      if (deleteError) throw deleteError;

      return res.status(200).json({ 
        message: 'Post deletado com sucesso',
        deleted_id: postId
      });
    }
    
    // ============================================
    // 3. PUT ?action=edit - Editar post
    // ============================================
    if (req.method === 'PUT' && action === 'edit') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem editar posts' });
      }

      const { title, content, is_pinned } = req.body;

      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }

      // Verificar se o post existe
      const { data: post, error: fetchError } = await supabaseAdmin
        .from('central_posts')
        .select('id, group_id')
        .eq('id', postId)
        .single();

      if (fetchError || !post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      // Atualizar o post
      const { data, error: updateError } = await supabaseAdmin
        .from('central_posts')
        .update({
          title: title || null,
          content: content.trim(),
          is_pinned: is_pinned || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select()
        .single();

      if (updateError) throw updateError;

      return res.status(200).json({ 
        message: 'Post atualizado com sucesso',
        post: data
      });
    }
    
    // ============================================
    // 4. GET - Listar comentários do post
    // ============================================
    if (req.method === 'GET' && !action) {
      const { data: comments, error } = await supabaseAdmin
        .from('central_comments')
        .select(`
          *,
          author:users!central_comments_author_id_fkey(id, name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return res.status(200).json({ comments: comments || [] });
    }
    
    // ============================================
    // 5. POST - Criar comentário
    // ============================================
    if (req.method === 'POST' && !action) {
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }

      // Verificar se o post existe
      const { data: post, error: postError } = await supabaseAdmin
        .from('central_posts')
        .select('id, group_id')
        .eq('id', postId)
        .single();

      if (postError || !post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      // Verificar se usuário tem acesso ao grupo
      const { data: group } = await supabaseAdmin
        .from('central_groups')
        .select('role_id')
        .eq('id', post.group_id)
        .single();

      if (!group || !userRoleIds.includes(group.role_id)) {
        return res.status(403).json({ error: 'Você não tem acesso a este grupo' });
      }

      // Criar comentário
      const { data: comment, error: createError } = await supabaseAdmin
        .from('central_comments')
        .insert({
          post_id: postId,
          author_id: req.user.id,
          content: content.trim()
        })
        .select(`
          *,
          author:users!central_comments_author_id_fkey(id, name, avatar_url)
        `)
        .single();

      if (createError) throw createError;

      return res.status(201).json({ comment });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
    
  } catch (error) {
    console.error('Post action error:', error);
    return res.status(500).json({ error: 'Erro ao processar ação' });
  }
}
