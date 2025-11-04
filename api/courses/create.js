// =====================================================
// CREATE COURSE ENDPOINT
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { sanitizeText, sanitizeHTML } from '../lib/sanitize.js';

// POST /api/courses/create - Criar novo curso
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Autenticar
    await new Promise((resolve) => authenticate(req, res, resolve));
    
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }
    
    // Verificar se é admin
    await new Promise((resolve, reject) =>
      requireRole('ADMIN')(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      })
    );

    // Criar curso
    const { title, slug, description, cover_image_url, status, tags, thematicTags } = req.body;

    if (!title || !slug || !description) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Sanitizar dados
    const cleanTitle = sanitizeText(title);
    const cleanDescription = sanitizeHTML(description);
    const cleanSlug = sanitizeText(slug);

    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .insert({
        title: cleanTitle,
        slug: cleanSlug,
        description: cleanDescription,
        cover_image_url: cover_image_url || null,
        status: status || 'draft'
      })
      .select()
      .single();

    if (courseError) {
      throw courseError;
    }

    // Associar roles (permissões de visualização)
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const courseTags = tags.map(roleId => ({
        course_id: course.id,
        role_id: roleId
      }));

      const { error: tagsError } = await supabaseAdmin
        .from('course_tags')
        .insert(courseTags);

      if (tagsError) {
        console.error('Error associating roles:', tagsError);
      }
    }

    // Associar tags temáticas
    if (thematicTags && Array.isArray(thematicTags) && thematicTags.length > 0) {
      const contentTags = thematicTags.map(tagId => ({
        course_id: course.id,
        tag_id: tagId
      }));

      const { error: contentTagsError } = await supabaseAdmin
        .from('course_content_tags')
        .insert(contentTags);

      if (contentTagsError) {
        console.error('Error associating thematic tags:', contentTagsError);
      }
    }

    res.json({ course });
  } catch (error) {
    console.error('Error creating course:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Já existe um curso com esse slug' });
    }
    
    res.status(500).json({ error: error.message || 'Erro ao criar curso' });
  }
}
