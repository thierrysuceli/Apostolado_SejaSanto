// =====================================================
// API - EDITAR/DELETAR COMENTÁRIO
// PUT/DELETE /api/comments/:id
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, hasPermission } from '../middleware/auth.js';
import { sanitizeHTML } from '../lib/sanitize.js';

export default async function handler(req, res) {
  const id = req.query?.id || req._expressParams?.id;
  
  if (!id) {
    return res.status(400).json({ error: 'ID do comentário é obrigatório' });
  }
  
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  
  // PUT - Editar comentário
  if (req.method === 'PUT') {
    try {
      const { content } = req.body;
      
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }
      
      // Buscar comentário
      const { data: comment } = await supabaseAdmin
        .from('comments')
        .select('author_id')
        .eq('id', id)
        .single();
      
      if (!comment) {
        return res.status(404).json({ error: 'Comentário não encontrado' });
      }
      
      // Verificar permissão
      const isAuthor = comment.author_id === req.user.id;
      const hasEditOwn = await hasPermission(req.user.id, 'EDIT_OWN_COMMENT');
      const hasEditAny = await hasPermission(req.user.id, 'EDIT_ANY_COMMENT');
      
      if (!isAuthor && !hasEditAny) {
        return res.status(403).json({ error: 'Sem permissão para editar este comentário' });
      }
      
      if (isAuthor && !hasEditOwn && !hasEditAny) {
        return res.status(403).json({ error: 'Sem permissão para editar comentários' });
      }
      
      const cleanContent = sanitizeHTML(content);
      
      const { data: updatedComment, error } = await supabaseAdmin
        .from('comments')
        .update({
          content: cleanContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(`
          *,
          users!author_id(id, name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      
      return res.status(200).json({ comment: updatedComment });
      
    } catch (error) {
      console.error('Update comment error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
  }
  
  // DELETE - Deletar comentário
  if (req.method === 'DELETE') {
    try {
      // Buscar comentário
      const { data: comment } = await supabaseAdmin
        .from('comments')
        .select('author_id')
        .eq('id', id)
        .single();
      
      if (!comment) {
        return res.status(404).json({ error: 'Comentário não encontrado' });
      }
      
      // Verificar permissão
      const isAuthor = comment.author_id === req.user.id;
      const hasDeleteOwn = await hasPermission(req.user.id, 'DELETE_OWN_COMMENT');
      const hasDeleteAny = await hasPermission(req.user.id, 'DELETE_ANY_COMMENT');
      
      if (!isAuthor && !hasDeleteAny) {
        return res.status(403).json({ error: 'Sem permissão para deletar este comentário' });
      }
      
      if (isAuthor && !hasDeleteOwn && !hasDeleteAny) {
        return res.status(403).json({ error: 'Sem permissão para deletar comentários' });
      }
      
      const { error } = await supabaseAdmin
        .from('comments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: 'Comentário deletado com sucesso' });
      
    } catch (error) {
      console.error('Delete comment error:', error);
      return res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
