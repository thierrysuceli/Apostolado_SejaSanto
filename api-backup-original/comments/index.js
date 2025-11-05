// =====================================================
// API - COMENTÁRIOS
// GET/POST /api/comments
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, hasPermission } from '../middleware/auth.js';
import { sanitizeHTML } from '../lib/sanitize.js';

export default async function handler(req, res) {
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  // GET - Listar comentários
  if (req.method === 'GET') {
    try {
      const { post_id, topic_id, event_id } = req.query;
      
      if (!post_id && !topic_id && !event_id) {
        return res.status(400).json({ error: 'post_id, topic_id ou event_id é obrigatório' });
      }
      
      let query = supabaseAdmin
        .from('comments')
        .select(`
          *,
          users!author_id(id, name, avatar_url)
        `)
        .order('created_at', { ascending: true });
      
      if (post_id) query = query.eq('post_id', post_id);
      if (topic_id) query = query.eq('topic_id', topic_id);
      if (event_id) query = query.eq('event_id', event_id);
      
      const { data: comments, error } = await query;
      
      if (error) throw error;
      
      // Organizar comentários em árvore (pais e respostas)
      const commentMap = {};
      const rootComments = [];
      
      comments?.forEach(comment => {
        comment.replies = [];
        commentMap[comment.id] = comment;
      });
      
      comments?.forEach(comment => {
        if (comment.parent_comment_id) {
          const parent = commentMap[comment.parent_comment_id];
          if (parent) {
            parent.replies.push(comment);
          }
        } else {
          rootComments.push(comment);
        }
      });
      
      return res.status(200).json({ comments: rootComments });
      
    } catch (error) {
      console.error('Get comments error:', error);
      return res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
  }
  
  // POST - Criar comentário
  if (req.method === 'POST') {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
      }
      
      const hasCreatePermission = await hasPermission(req.user.id, 'CREATE_COMMENT');
      const hasReplyPermission = await hasPermission(req.user.id, 'REPLY_COMMENT');
      
      const { content, post_id, topic_id, event_id, parent_comment_id } = req.body;
      
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }
      
      if (!post_id && !topic_id && !event_id) {
        return res.status(400).json({ error: 'post_id, topic_id ou event_id é obrigatório' });
      }
      
      // Se é resposta, precisa de REPLY_COMMENT
      if (parent_comment_id && !hasReplyPermission) {
        return res.status(403).json({ error: 'Sem permissão para responder comentários' });
      }
      
      // Se é comentário novo, precisa de CREATE_COMMENT
      if (!parent_comment_id && !hasCreatePermission) {
        return res.status(403).json({ error: 'Sem permissão para criar comentários' });
      }
      
      const cleanContent = sanitizeHTML(content);
      
      const { data: comment, error } = await supabaseAdmin
        .from('comments')
        .insert({
          content: cleanContent,
          author_id: req.user.id,
          post_id: post_id || null,
          topic_id: topic_id || null,
          event_id: event_id || null,
          parent_comment_id: parent_comment_id || null,
        })
        .select(`
          *,
          users!author_id(id, name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({ comment });
      
    } catch (error) {
      console.error('Create comment error:', error);
      return res.status(500).json({ error: 'Erro ao criar comentário' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
