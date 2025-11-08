// =====================================================
// API: Bible Comments & Notes
// =====================================================

import { supabaseAdmin } from '../../lib-api/supabaseServer.js';
import { authenticate } from '../../middleware-api/auth.js';

export default async function handler(req, res) {
  const { book_abbrev, chapter, verse } = req.query;

  try {
    // ============================================
    // GET - Buscar comentários e notas de um versículo
    // ============================================
    if (req.method === 'GET') {
      if (!book_abbrev || !chapter || !verse) {
        return res.status(400).json({ error: 'book_abbrev, chapter e verse são obrigatórios' });
      }

      // Buscar nota do admin (bible_notes)
      const { data: note, error: noteError } = await supabaseAdmin
        .from('bible_notes')
        .select('*, author:users!bible_notes_author_id_fkey(id, name, email)')
        .eq('book_abbrev', book_abbrev)
        .eq('chapter', parseInt(chapter))
        .eq('verse', parseInt(verse))
        .maybeSingle();

      if (noteError && noteError.code !== 'PGRST116') {
        console.error('[BIBLE COMMENTS] Error fetching note:', noteError);
      }

      // Buscar comentários dos usuários (bible_verse_comments)
      const { data: comments, error: commentsError } = await supabaseAdmin
        .from('bible_verse_comments')
        .select('*, user:users!bible_verse_comments_user_id_fkey(id, name, email, avatar_url)')
        .eq('book_abbrev', book_abbrev)
        .eq('chapter', parseInt(chapter))
        .eq('verse', parseInt(verse))
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('[BIBLE COMMENTS] Error fetching comments:', commentsError);
        return res.status(500).json({ error: 'Erro ao buscar comentários' });
      }

      return res.status(200).json({
        note: note || null,
        comments: comments || []
      });
    }

    // ============================================
    // POST - Adicionar comentário OU nota
    // ============================================
    if (req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

      const { comment_text, is_note, title, content } = req.body;

      if (!book_abbrev || !chapter || !verse) {
        return res.status(400).json({ error: 'book_abbrev, chapter e verse são obrigatórios' });
      }

      // Verificar se é admin (tem permissão ADMIN_MANAGE)
      const { data: permissions } = await supabaseAdmin
        .from('user_roles')
        .select('roles!inner(name)')
        .eq('user_id', req.user.id);

      const isAdmin = permissions?.some(p => p.roles.name === 'ADMIN');

      // Se is_note=true E usuário é admin = criar/atualizar note
      if (is_note && isAdmin) {
        if (!title || !content) {
          return res.status(400).json({ error: 'title e content são obrigatórios para notas' });
        }

        const { data, error } = await supabaseAdmin
          .from('bible_notes')
          .upsert({
            book_abbrev,
            chapter: parseInt(chapter),
            verse: parseInt(verse),
            title,
            content,
            author_id: req.user.id,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'book_abbrev,chapter,verse'
          })
          .select('*, author:users!bible_notes_author_id_fkey(id, name, email)')
          .single();

        if (error) {
          console.error('[BIBLE COMMENTS] Error creating note:', error);
          return res.status(500).json({ error: 'Erro ao salvar nota' });
        }

        return res.status(200).json({ note: data });
      }

      // Caso contrário, criar comentário normal
      if (!comment_text) {
        return res.status(400).json({ error: 'comment_text é obrigatório' });
      }

      const { data, error } = await supabaseAdmin
        .from('bible_verse_comments')
        .insert({
          book_abbrev,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          user_id: req.user.id,
          comment_text
        })
        .select('*, user:users!bible_verse_comments_user_id_fkey(id, name, email, avatar_url)')
        .single();

      if (error) {
        console.error('[BIBLE COMMENTS] Error creating comment:', error);
        return res.status(500).json({ error: 'Erro ao criar comentário' });
      }

      return res.status(200).json({ comment: data });
    }

    // ============================================
    // DELETE - Apagar comentário (admin only)
    // ============================================
    if (req.method === 'DELETE') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

      const { comment_id } = req.body;

      if (!comment_id) {
        return res.status(400).json({ error: 'comment_id é obrigatório' });
      }

      // Verificar se é admin
      const { data: permissions } = await supabaseAdmin
        .from('user_roles')
        .select('roles!inner(name)')
        .eq('user_id', req.user.id);

      const isAdmin = permissions?.some(p => p.roles.name === 'ADMIN');

      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas administradores podem deletar comentários' });
      }

      const { error } = await supabaseAdmin
        .from('bible_verse_comments')
        .delete()
        .eq('id', comment_id);

      if (error) {
        console.error('[BIBLE COMMENTS] Error deleting comment:', error);
        return res.status(500).json({ error: 'Erro ao deletar comentário' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[BIBLE COMMENTS] Fatal error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
