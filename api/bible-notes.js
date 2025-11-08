// =====================================================
// API - BIBLE NOTES (Admin Study Notes)
// Notas de estudo administrativas para versículos
// =====================================================

import { authenticate } from '../middleware-api/auth.js';
import { supabaseAdmin } from '../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  try {
    // ============================================
    // GET - Buscar notas por versículo
    // ============================================
    if (req.method === 'GET') {
      const { book_abbrev, chapter, verse } = req.query;
      
      if (!book_abbrev || !chapter || !verse) {
        return res.status(400).json({ error: 'Parâmetros incompletos: book_abbrev, chapter, verse são obrigatórios' });
      }

      const { data, error } = await supabaseAdmin
        .from('bible_notes')
        .select(`
          *,
          author:users!bible_notes_author_id_fkey (
            id,
            name,
            avatar_url
          )
        `)
        .eq('book_abbrev', book_abbrev)
        .eq('chapter', parseInt(chapter))
        .eq('verse', parseInt(verse))
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[BIBLE NOTES GET] Error:', error);
        throw error;
      }

      // Retornar array mesmo se vazio (frontend espera array)
      return res.status(200).json({ notes: data || [] });
    }

    // ============================================
    // POST - Criar nova nota (apenas admin)
    // ============================================
    if (req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
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

      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas administradores podem criar notas de estudo' });
      }

      const { book_abbrev, chapter, verse, title, content, tags } = req.body;
      
      if (!book_abbrev || !chapter || !verse || !title || !content) {
        return res.status(400).json({ 
          error: 'Dados incompletos',
          required: ['book_abbrev', 'chapter', 'verse', 'title', 'content']
        });
      }

      // Inserir nota (UNIQUE constraint em book_abbrev, chapter, verse garante 1 nota por versículo)
      const { data, error } = await supabaseAdmin
        .from('bible_notes')
        .insert({
          book_abbrev,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          author_id: req.user.id,
          title: title.trim(),
          content: content.trim(),
          tags: tags || []
        })
        .select(`
          *,
          author:users!bible_notes_author_id_fkey (
            id,
            name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('[BIBLE NOTES POST] Error:', error);
        
        // Se já existe nota para esse versículo
        if (error.code === '23505') {
          return res.status(409).json({ 
            error: 'Já existe uma nota de estudo para este versículo',
            hint: 'Use PUT para atualizar a nota existente'
          });
        }
        
        throw error;
      }

      console.log('[BIBLE NOTES POST] Success:', { book_abbrev, chapter, verse, noteId: data.id });
      return res.status(201).json({ note: data });
    }

    // ============================================
    // PUT - Atualizar nota existente (apenas admin)
    // ============================================
    if (req.method === 'PUT') {
      await authenticate(req, res);
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
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

      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas administradores podem editar notas de estudo' });
      }

      const { id } = req.query;
      const { title, content, tags } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID da nota é obrigatório' });
      }

      if (!title && !content && !tags) {
        return res.status(400).json({ error: 'Nenhum dado para atualizar' });
      }

      // Montar objeto de atualização
      const updateData = {
        updated_at: new Date().toISOString()
      };
      
      if (title) updateData.title = title.trim();
      if (content) updateData.content = content.trim();
      if (tags !== undefined) updateData.tags = tags;

      const { data, error } = await supabaseAdmin
        .from('bible_notes')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          author:users!bible_notes_author_id_fkey (
            id,
            name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('[BIBLE NOTES PUT] Error:', error);
        
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Nota não encontrada' });
        }
        
        throw error;
      }

      console.log('[BIBLE NOTES PUT] Success:', { noteId: id });
      return res.status(200).json({ note: data });
    }

    // ============================================
    // DELETE - Deletar nota (apenas admin)
    // ============================================
    if (req.method === 'DELETE') {
      await authenticate(req, res);
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
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

      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas administradores podem deletar notas de estudo' });
      }

      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID da nota é obrigatório' });
      }

      const { error } = await supabaseAdmin
        .from('bible_notes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[BIBLE NOTES DELETE] Error:', error);
        throw error;
      }

      console.log('[BIBLE NOTES DELETE] Success:', { noteId: id });
      return res.status(200).json({ message: 'Nota deletada com sucesso' });
    }

    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('[BIBLE NOTES API] Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar requisição',
      details: error.message 
    });
  }
}
