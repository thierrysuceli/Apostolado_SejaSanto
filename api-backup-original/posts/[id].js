// =====================================================
// API - OPERAÇÕES EM POST ESPECÍFICO
// GET/PUT/DELETE /api/posts/:id
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, hasPermission, hasRole } from '../middleware/auth.js';
import { sanitizeHTML, generateSlug } from '../lib/sanitize.js';
import { runMiddleware } from '../lib/expressHelpers.js';

export default async function handler(req, res) {
  // Suporte para Express (req._expressParams) e Vercel (req.query)
  const id = req.query?.id || req._expressParams?.id;
  
  if (!id) {
    return res.status(400).json({ error: 'ID do post é obrigatório' });
  }
  
  // Autenticar usuário
  await runMiddleware(authenticate)(req, res);
  
  // GET - Obter detalhes do post
  if (req.method === 'GET') {
    try {
      let post;
      
      if (req.user) {
        // Usuário autenticado
        const isAdmin = await hasRole(req.user.id, 'ADMIN');
        
        if (isAdmin) {
          // Admin vê tudo
          const { data, error } = await supabaseAdmin
            .from('posts')
            .select(`
              *,
              users!author_id(id, name, avatar_url),
              post_tags(role_id, roles(id, name, display_name, color)),
              post_content_tags(tag_id, tags(id, name, color))
            `)
            .eq('id', id)
            .single();
          
          if (error) throw error;
          post = data;
        } else {
          // Usuário comum - verificar se tem acesso
          const { data: userRoles } = await supabaseAdmin
            .from('user_roles')
            .select('role_id')
            .eq('user_id', req.user.id);
          
          const roleIds = userRoles ? userRoles.map(ur => ur.role_id) : [];
          
          const { data, error } = await supabaseAdmin
            .from('posts')
            .select(`
              *,
              users!author_id(id, name, avatar_url),
              post_tags!inner(role_id, roles(id, name, display_name, color)),
              post_content_tags(tag_id, tags(id, name, color))
            `)
            .eq('id', id)
            .eq('status', 'published')
            .in('post_tags.role_id', roleIds)
            .single();
          
          if (error) throw error;
          post = data;
        }
      } else {
        // Não autenticado - role VISITANTE
        const { data: visitanteRole } = await supabaseAdmin
          .from('roles')
          .select('id')
          .eq('name', 'VISITANTE')
          .single();
        
        const { data, error } = await supabaseAdmin
          .from('posts')
          .select(`
            *,
            users!author_id(id, name, avatar_url),
            post_tags!inner(role_id, roles(id, name, display_name, color)),
            post_content_tags(tag_id, tags(id, name, color))
          `)
          .eq('id', id)
          .eq('status', 'published')
          .eq('post_tags.role_id', visitanteRole.id)
          .single();
        
        if (error) throw error;
        post = data;
      }
      
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado ou sem acesso' });
      }
      
      return res.status(200).json({ post });
      
    } catch (error) {
      console.error('Get post error:', error);
      return res.status(500).json({ error: 'Erro ao buscar post' });
    }
  }
  
  // PUT - Editar post
  if (req.method === 'PUT') {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
      }
      
      // Verificar se é o autor ou admin
      const { data: post } = await supabaseAdmin
        .from('posts')
        .select('author_id')
        .eq('id', id)
        .single();
      
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }
      
      const isAuthor = post.author_id === req.user.id;
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      const hasEditPermission = await hasPermission(req.user.id, 'EDIT_POST');
      
      if (!isAuthor && !isAdmin && !hasEditPermission) {
        return res.status(403).json({ error: 'Sem permissão para editar este post' });
      }
      
      const { title, content, excerpt, cover_image_url, status, tags, thematicTags } = req.body;
      
      const updateData = {};
      if (title) {
        updateData.title = title;
        updateData.slug = generateSlug(title);
      }
      if (content) updateData.content = sanitizeHTML(content);
      if (excerpt) updateData.excerpt = excerpt;
      if (cover_image_url !== undefined) updateData.cover_image_url = cover_image_url;
      if (status) updateData.status = status;
      updateData.updated_at = new Date().toISOString();
      
      // Atualizar post
      const { data: updatedPost, error } = await supabaseAdmin
        .from('posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar tags de permissão (roles) se fornecidas
      if (tags && Array.isArray(tags)) {
        // Remover tags antigas
        await supabaseAdmin
          .from('post_tags')
          .delete()
          .eq('post_id', id);
        
        // Adicionar novas tags
        if (tags.length > 0) {
          const postTags = tags.map(roleId => ({
            post_id: id,
            role_id: roleId
          }));
          
          await supabaseAdmin
            .from('post_tags')
            .insert(postTags);
        }
      }
      
      // Atualizar tags temáticas se fornecidas
      if (thematicTags && Array.isArray(thematicTags)) {
        // Remover tags antigas
        await supabaseAdmin
          .from('post_content_tags')
          .delete()
          .eq('post_id', id);
        
        // Adicionar novas tags
        if (thematicTags.length > 0) {
          const contentTags = thematicTags.map(tagId => ({
            post_id: id,
            tag_id: tagId
          }));
          
          await supabaseAdmin
            .from('post_content_tags')
            .insert(contentTags);
        }
      }
      
      return res.status(200).json({ post: updatedPost });
      
    } catch (error) {
      console.error('Update post error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar post' });
    }
  }
  
  // DELETE - Deletar post
  if (req.method === 'DELETE') {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
      }
      
      // Verificar se é o autor ou admin
      const { data: post } = await supabaseAdmin
        .from('posts')
        .select('author_id')
        .eq('id', id)
        .single();
      
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }
      
      const isAuthor = post.author_id === req.user.id;
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      const hasDeletePermission = await hasPermission(req.user.id, 'DELETE_POST');
      
      if (!isAuthor && !isAdmin && !hasDeletePermission) {
        return res.status(403).json({ error: 'Sem permissão para deletar este post' });
      }
      
      // Deletar post (cascade deletará tags e comentários)
      const { error } = await supabaseAdmin
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: 'Post deletado com sucesso' });
      
    } catch (error) {
      console.error('Delete post error:', error);
      return res.status(500).json({ error: 'Erro ao deletar post' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
