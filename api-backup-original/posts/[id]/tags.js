// =====================================================
// POST TAGS ENDPOINT
// =====================================================

import { supabaseAdmin } from '../../lib/supabaseServer.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

// POST /api/posts/:id/tags - Adicionar tag ao post
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

    const id = req.params?.id || req._expressParams?.id;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role é obrigatório' });
    }

    // Buscar role_id pelo nome
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', role)
      .single();

    if (roleError || !roleData) {
      return res.status(404).json({ error: 'Role não encontrada' });
    }

    // Inserir post_tag
    const { data: tagData, error: tagError } = await supabaseAdmin
      .from('post_tags')
      .insert({
        post_id: id,
        role_id: roleData.id
      })
      .select()
      .single();

    if (tagError) {
      // Se já existir, ignorar erro de duplicata
      if (tagError.code === '23505') {
        return res.json({ message: 'Tag já existe para este post' });
      }
      throw tagError;
    }

    res.json({ tag: tagData });
  } catch (error) {
    console.error('Error adding post tag:', error);
    res.status(500).json({ error: error.message || 'Erro ao adicionar tag ao post' });
  }
}
