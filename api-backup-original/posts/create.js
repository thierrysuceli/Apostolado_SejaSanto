// =====================================================
// API - CRIAR POST
// POST /api/posts/create
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, requirePermission } from '../middleware/auth.js';
import { sanitizeHTML, generateSlug } from '../lib/sanitize.js';

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    // Autenticar
    await new Promise((resolve) => authenticate(req, res, resolve));
    
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }
    
    // Verificar permissão CREATE_POST
    await new Promise((resolve, reject) => 
      requirePermission('CREATE_POST')(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      })
    );
    
    const { title, content, excerpt, cover_image_url, status, tags, thematicTags } = req.body;
    
    // Validações
    if (!title || !content) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }
    
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: 'Tags são obrigatórias (quem pode ver)' });
    }
    
    const slug = generateSlug(title);
    const cleanContent = sanitizeHTML(content);
    
    // Verificar se slug já existe
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existing) {
      return res.status(409).json({ error: 'Já existe um post com este título' });
    }
    
    // Criar post
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title,
        slug,
        content: cleanContent,
        excerpt: excerpt || null,
        cover_image_url: cover_image_url || null,
        author_id: req.user.id,
        status: status || 'draft',
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Associar tags de permissão (roles)
    const postTags = tags.map(roleId => ({
      post_id: post.id,
      role_id: roleId
    }));
    
    const { error: tagsError } = await supabaseAdmin
      .from('post_tags')
      .insert(postTags);
    
    if (tagsError) {
      console.error('Error inserting post tags:', tagsError);
    }
    
    // Associar tags temáticas (se fornecidas)
    if (thematicTags && Array.isArray(thematicTags) && thematicTags.length > 0) {
      const contentTags = thematicTags.map(tagId => ({
        post_id: post.id,
        tag_id: tagId
      }));
      
      const { error: contentTagsError } = await supabaseAdmin
        .from('post_content_tags')
        .insert(contentTags);
      
      if (contentTagsError) {
        console.error('Error inserting post content tags:', contentTagsError);
      }
    }
    
    return res.status(201).json({ post });
    
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({ error: 'Erro ao criar post' });
  }
}
