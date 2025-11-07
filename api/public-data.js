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
      const { post_id, topic_id, event_id } = req.query;
      let query = supabaseAdmin
        .from('comments')
        .select(`
          *,
          users(id, name, avatar_url)
        `)
        .order('created_at', { ascending: true });
      
      if (post_id) query = query.eq('post_id', post_id);
      if (topic_id) query = query.eq('topic_id', topic_id);
      if (event_id) query = query.eq('event_id', event_id);
      
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ comments: data || [] });
    }
    if (type === 'comments' && req.method === 'GET' && id) {
      const { data, error } = await supabaseAdmin
        .from('comments')
        .select(`
          *,
          users(id, name, avatar_url)
        `)
        .eq('id', id)
        .single();
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
      const { data, error } = await supabaseAdmin
        .from('comments')
        .insert(insertData)
        .select(`
          *,
          users(id, name, avatar_url)
        `)
        .single();
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
    
    // ========================================
    // USER PROGRESS TRACKING
    // ========================================
    
    // GET course progress for user
    if (type === 'course-progress' && req.method === 'GET') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      
      const { course_id } = req.query;
      
      let query = supabaseAdmin
        .from('user_course_progress')
        .select(`
          *,
          courses(id, title, cover_image_url)
        `)
        .eq('user_id', req.user.id)
        .order('updated_at', { ascending: false });
      
      if (course_id) {
        query = query.eq('course_id', course_id).single();
        const { data, error } = await query;
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
        return res.status(200).json({ progress: data || null });
      } else {
        const { data, error } = await query;
        if (error) throw error;
        return res.status(200).json({ progress: data || [] });
      }
    }
    
    // UPSERT course progress (cria ou atualiza)
    if (type === 'course-progress' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      
      const { course_id, topic_id, progress_seconds, last_position, completed } = req.body;
      
      if (!course_id) {
        return res.status(400).json({ error: 'course_id é obrigatório' });
      }
      
      // UPSERT: se existir atualiza, senão cria
      const { data, error } = await supabaseAdmin
        .from('user_course_progress')
        .upsert(
          {
            user_id: req.user.id,
            course_id,
            topic_id: topic_id || null,
            progress_seconds: progress_seconds || 0,
            last_position: last_position || null,
            completed: completed || false,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,course_id', // unique constraint
            returning: 'representation'
          }
        )
        .select(`
          *,
          courses(id, title, thumbnail_url, duration)
        `)
        .single();
      
      if (error) throw error;
      return res.status(200).json({ progress: data });
    }
    
    // DELETE course progress
    if (type === 'course-progress' && req.method === 'DELETE') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      
      const { course_id } = req.query;
      if (!course_id) {
        return res.status(400).json({ error: 'course_id é obrigatório' });
      }
      
      const { error } = await supabaseAdmin
        .from('user_course_progress')
        .delete()
        .eq('user_id', req.user.id)
        .eq('course_id', course_id);
      
      if (error) throw error;
      return res.status(200).json({ message: 'Progresso deletado' });
    }
    
    // GET post progress for user
    if (type === 'post-progress' && req.method === 'GET') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      
      const { post_id } = req.query;
      
      let query = supabaseAdmin
        .from('user_post_progress')
        .select(`
          *,
          posts(id, title, cover_image_url)
        `)
        .eq('user_id', req.user.id)
        .order('updated_at', { ascending: false });
      
      if (post_id) {
        query = query.eq('post_id', post_id).single();
        const { data, error } = await query;
        if (error && error.code !== 'PGRST116') throw error;
        return res.status(200).json({ progress: data || null });
      } else {
        const { data, error } = await query;
        if (error) throw error;
        return res.status(200).json({ progress: data || [] });
      }
    }
    
    // UPSERT post progress
    if (type === 'post-progress' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      
      const { post_id, scroll_position, scroll_percentage, completed, reading_time_seconds } = req.body;
      
      if (!post_id) {
        return res.status(400).json({ error: 'post_id é obrigatório' });
      }
      
      const { data, error } = await supabaseAdmin
        .from('user_post_progress')
        .upsert(
          {
            user_id: req.user.id,
            post_id,
            scroll_position: scroll_position || 0,
            scroll_percentage: scroll_percentage || 0,
            completed: completed || false,
            reading_time_seconds: reading_time_seconds || 0,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,post_id',
            returning: 'representation'
          }
        )
        .select(`
          *,
          posts(id, title, thumbnail_url)
        `)
        .single();
      
      if (error) throw error;
      return res.status(200).json({ progress: data });
    }
    
    // DELETE post progress
    if (type === 'post-progress' && req.method === 'DELETE') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      
      const { post_id } = req.query;
      if (!post_id) {
        return res.status(400).json({ error: 'post_id é obrigatório' });
      }
      
      const { error } = await supabaseAdmin
        .from('user_post_progress')
        .delete()
        .eq('user_id', req.user.id)
        .eq('post_id', post_id);
      
      if (error) throw error;
      return res.status(200).json({ message: 'Progresso deletado' });
    }
    
    // BIBLE NOTES
    // GET all notes or by location
    if (type === 'bible-notes' && req.method === 'GET' && !id) {
      const { book_abbrev, chapter, verse } = req.query;
      let query = supabaseAdmin
        .from('bible_notes')
        .select(`
          *,
          author:users!bible_notes_author_id_fkey(id, name, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (book_abbrev) query = query.eq('book_abbrev', book_abbrev);
      if (chapter) query = query.eq('chapter', parseInt(chapter));
      if (verse) query = query.eq('verse', parseInt(verse));
      
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ notes: data || [] });
    }
    
    // GET note by ID
    if (type === 'bible-notes' && req.method === 'GET' && id) {
      const { data, error } = await supabaseAdmin
        .from('bible_notes')
        .select(`
          *,
          author:users!bible_notes_author_id_fkey(id, name, avatar_url)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return res.status(200).json({ note: data });
    }
    
    // POST new note (admin only)
    if (type === 'bible-notes' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas administradores podem criar notas bíblicas' });
      
      const { book_abbrev, chapter, verse, title, content } = req.body;
      
      if (!book_abbrev || !chapter || !verse || !title || !content) {
        return res.status(400).json({ error: 'Campos obrigatórios: book_abbrev, chapter, verse, title, content' });
      }
      
      const { data, error } = await supabaseAdmin
        .from('bible_notes')
        .insert({
          book_abbrev,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          title,
          content,
          author_id: req.user.id
        })
        .select(`
          *,
          author:users!bible_notes_author_id_fkey(id, name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      return res.status(201).json({ note: data });
    }
    
    // PUT update note (admin only)
    if (type === 'bible-notes' && req.method === 'PUT' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas administradores podem editar notas bíblicas' });
      
      const { title, content } = req.body;
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      
      const { data, error } = await supabaseAdmin
        .from('bible_notes')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          author:users!bible_notes_author_id_fkey(id, name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      return res.status(200).json({ note: data });
    }
    
    // DELETE note (admin only)
    if (type === 'bible-notes' && req.method === 'DELETE' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Autenticação necessária' });
      
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      if (!isAdmin) return res.status(403).json({ error: 'Apenas administradores podem deletar notas bíblicas' });
      
      const { error } = await supabaseAdmin.from('bible_notes').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ message: 'Nota deletada com sucesso' });
    }
    
    // ====================================
    // BIBLE - Leitura da Bíblia do banco
    // ====================================
    
    // GET all books
    if (type === 'bible-books' && req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('bible_books')
        .select('*')
        .order('book_order');
      
      if (error) throw error;
      return res.status(200).json({ books: data || [] });
    }
    
    // GET chapters of a book
    if (type === 'bible-chapters' && req.method === 'GET') {
      const { book_id } = req.query;
      if (!book_id) return res.status(400).json({ error: 'book_id é obrigatório' });
      
      const { data, error } = await supabaseAdmin
        .from('bible_chapters')
        .select('*')
        .eq('book_id', book_id)
        .order('chapter_number');
      
      if (error) throw error;
      return res.status(200).json({ chapters: data || [] });
    }
    
    // GET verses of a chapter
    if (type === 'bible-verses' && req.method === 'GET') {
      const { book_abbrev, chapter_number } = req.query;
      
      if (!book_abbrev || !chapter_number) {
        return res.status(400).json({ error: 'book_abbrev e chapter_number são obrigatórios' });
      }
      
      // Buscar o livro pela abreviação
      const { data: book, error: bookError } = await supabaseAdmin
        .from('bible_books')
        .select('id, name, abbrev, testament')
        .eq('abbrev', book_abbrev)
        .single();
      
      if (bookError || !book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      // Buscar o capítulo
      const { data: chapter, error: chapterError } = await supabaseAdmin
        .from('bible_chapters')
        .select('id, total_verses')
        .eq('book_id', book.id)
        .eq('chapter_number', chapter_number)
        .single();
      
      if (chapterError || !chapter) {
        return res.status(404).json({ error: 'Capítulo não encontrado' });
      }
      
      // Buscar os versículos
      const { data: verses, error: versesError } = await supabaseAdmin
        .from('bible_verses')
        .select('verse_number, text')
        .eq('chapter_id', chapter.id)
        .order('verse_number');
      
      if (versesError) throw versesError;
      
      return res.status(200).json({
        book: {
          name: book.name,
          abbrev: book.abbrev,
          testament: book.testament
        },
        chapter: parseInt(chapter_number),
        total_verses: chapter.total_verses,
        verses: verses || []
      });
    }
    
    return res.status(404).json({ error: 'Tipo inválido ou rota não encontrada' });
  } catch (error) {
    console.error('Public data error:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição' });
  }
}
