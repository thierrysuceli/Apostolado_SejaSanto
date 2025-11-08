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
      const { data, error } = await supabaseAdmin
        .from('topics')
        .select(`
          *,
          modules!inner(
            id,
            title,
            course_id,
            courses!inner(
              id,
              title,
              description,
              cover_image_url
            )
          )
        `)
        .eq('id', id)
        .single();
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
          courses!inner(id, title, cover_image_url)
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
      
      console.log('[COURSE PROGRESS] Saving:', {
        user_id: req.user.id,
        course_id,
        topic_id,
        progress_seconds,
        completed
      });
      
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
            onConflict: 'user_id, course_id'
          }
        )
        .select(`
          *,
          courses!inner(id, title, cover_image_url)
        `)
        .single();
      
      if (error) {
        console.error('[COURSE PROGRESS] ERROR:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('[COURSE PROGRESS] Success!', data.id);
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
          posts!inner(id, title, cover_image_url)
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
            onConflict: 'user_id, post_id'
          }
        )
        .select(`
          *,
          posts!inner(id, title, cover_image_url)
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

    // Bible Verse Comments - GET
    if (type === 'bible-verse-comments' && req.method === 'GET') {
      const { book_abbrev, chapter, verse } = req.query;
      
      let query = supabaseAdmin
        .from('bible_verse_comments')
        .select(`
          *,
          users (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (book_abbrev) query = query.eq('book_abbrev', book_abbrev);
      if (chapter) query = query.eq('chapter', parseInt(chapter));
      if (verse) query = query.eq('verse', parseInt(verse));
      
      const { data, error } = await query;
      if (error) throw error;
      
      return res.status(200).json({ comments: data || [] });
    }

    // Bible Verse Comments - POST
    if (type === 'bible-verse-comments' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

      const { book_abbrev, chapter, verse, comment_text } = req.body;
      
      if (!book_abbrev || !chapter || !verse || !comment_text) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      console.log('[BIBLE COMMENT] Creating:', {
        user_id: req.user.id,
        book_abbrev,
        chapter,
        verse
      });

      const { data, error } = await supabaseAdmin
        .from('bible_verse_comments')
        .insert({
          book_abbrev,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          user_id: req.user.id,
          comment_text
        })
        .select(`
          *,
          users (
            id,
            name,
            email
          )
        `)
        .single();

      if (error) {
        console.error('[BIBLE COMMENT] ERROR:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('[BIBLE COMMENT] Success!', data.id);
      return res.status(201).json({ comment: data });
    }

    // Bible Verse Comments - DELETE
    if (type === 'bible-verse-comments' && req.method === 'DELETE' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

      // Verificar se é o dono ou admin
      const { data: comment } = await supabaseAdmin
        .from('bible_verse_comments')
        .select('user_id')
        .eq('id', id)
        .single();

      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      const isOwner = comment?.user_id === req.user.id;

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Sem permissão' });
      }

      const { error } = await supabaseAdmin
        .from('bible_verse_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Comentário deletado' });
    }

    // Bible Progress - GET
    if (type === 'bible-progress' && req.method === 'GET') {
      await authenticate(req, res);
      if (!req.user) {
        return res.status(401).json({ error: 'Não autorizado' });
      }
      
      const { data, error } = await supabaseAdmin
        .from('user_bible_progress')
        .select('*')
        .eq('user_id', req.user.id)
        .order('last_read_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      return res.status(200).json({ progress: data });
    }

    // Bible Progress - POST/UPDATE
    if (type === 'bible-progress' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

      const { book_abbrev, chapter, verse } = req.body;
      
      if (!book_abbrev || !chapter) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      console.log('[BIBLE PROGRESS] Saving:', {
        user_id: req.user.id,
        book_abbrev,
        chapter,
        verse
      });

      try {
        // UPSERT direto (tabela foi recriada com FK correta)
        const { data, error } = await supabaseAdmin
          .from('user_bible_progress')
          .upsert({
            user_id: req.user.id,
            book_abbrev,
            chapter: parseInt(chapter),
            verse: parseInt(verse || 1),
            last_read_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,book_abbrev'
          })
          .select()
          .single();

        if (error) {
          console.error('[BIBLE PROGRESS] UPSERT ERROR:', error);
          return res.status(500).json({ error: 'Erro ao salvar progresso' });
        }

        console.log('[BIBLE PROGRESS] ✅ Success!', data.id);
        return res.status(200).json({ progress: data });
      } catch (err) {
        console.error('[BIBLE PROGRESS] FATAL ERROR:', err);
        return res.status(500).json({ error: 'Erro interno ao salvar progresso' });
      }
    }

    // ============================================
    // BIBLE NOTES (Admin Study Notes)
    // ============================================
    
    // Bible Notes - GET
    if (type === 'bible-notes' && req.method === 'GET') {
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

      if (error) throw error;
      return res.status(200).json({ notes: data || [] });
    }

    // Bible Notes - POST (criar nota - apenas admin)
    if (type === 'bible-notes' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

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
        return res.status(400).json({ error: 'Dados incompletos' });
      }

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
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Já existe uma nota para este versículo' });
        }
        throw error;
      }

      return res.status(201).json({ note: data });
    }

    // Bible Notes - PUT (atualizar - apenas admin)
    if (type === 'bible-notes' && req.method === 'PUT') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

      // Verificar admin
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
        return res.status(403).json({ error: 'Apenas administradores podem editar notas' });
      }

      const { title, content, tags } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID da nota é obrigatório' });
      }

      const updateData = { updated_at: new Date().toISOString() };
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

      if (error) throw error;
      return res.status(200).json({ note: data });
    }

    // Bible Notes - DELETE (apenas admin)
    if (type === 'bible-notes' && req.method === 'DELETE' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

      // Verificar admin
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
        return res.status(403).json({ error: 'Apenas administradores podem deletar notas' });
      }

      const { error } = await supabaseAdmin
        .from('bible_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Nota deletada com sucesso' });
    }

    // ============================================
    // BIBLE VERSE COMMENTS (Comentários de Usuários)
    // ============================================

    // Bible Verse Comments - GET
    if (type === 'bible-verse-comments' && req.method === 'GET') {
      const { book_abbrev, chapter, verse } = req.query;
      
      if (!book_abbrev || !chapter || !verse) {
        return res.status(400).json({ error: 'book_abbrev, chapter e verse são obrigatórios' });
      }

      const { data, error } = await supabaseAdmin
        .from('bible_verse_comments')
        .select(`
          *,
          user:users!bible_verse_comments_user_id_fkey (
            id,
            name,
            email,
            avatar_url
          )
        `)
        .eq('book_abbrev', book_abbrev)
        .eq('chapter', parseInt(chapter))
        .eq('verse', parseInt(verse))
        .order('created_at', { ascending: true });

      if (error) throw error;
      return res.status(200).json({ comments: data || [] });
    }

    // Bible Verse Comments - POST (criar comentário)
    if (type === 'bible-verse-comments' && req.method === 'POST') {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

      const { book_abbrev, chapter, verse, comment_text } = req.body;
      
      if (!book_abbrev || !chapter || !verse || !comment_text) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const { data, error } = await supabaseAdmin
        .from('bible_verse_comments')
        .insert({
          book_abbrev,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          user_id: req.user.id,
          comment_text: comment_text.trim()
        })
        .select(`
          *,
          user:users!bible_verse_comments_user_id_fkey (
            id,
            name,
            email,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      return res.status(201).json({ comment: data });
    }

    // Bible Verse Comments - DELETE (admin only)
    if (type === 'bible-verse-comments' && req.method === 'DELETE' && id) {
      await authenticate(req, res);
      if (!req.user) return res.status(401).json({ error: 'Não autorizado' });

      // Verificar admin
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
        return res.status(403).json({ error: 'Apenas administradores podem deletar comentários' });
      }

      const { error } = await supabaseAdmin
        .from('bible_verse_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Comentário deletado com sucesso' });
    }
    
    return res.status(404).json({ error: 'Tipo inválido ou rota não encontrada' });
  } catch (error) {
    console.error('Public data error:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição' });
  }
}
