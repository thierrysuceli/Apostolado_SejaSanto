// =====================================================
// API - FIXAR/DESFIXAR POST
// PUT /api/central/posts/:id/pin
// =====================================================

import { supabaseAdmin } from '../../../lib/supabaseServer.js';
import { authenticate, hasPermission } from '../../../middleware/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  
  await new Promise((resolve) => hasPermission(req, res, resolve));
  
  if (!req.userPermissions?.includes('manage_events')) {
    return res.status(403).json({ error: 'Sem permissão' });
  }
  
  const postId = req.query?.id || req._expressParams?.id;
  
  if (!postId) {
    return res.status(400).json({ error: 'ID do post é obrigatório' });
  }
  
  try {
    const { is_pinned, pinned_until } = req.body;
    
    const updateData = {
      is_pinned: is_pinned ?? false,
      pinned_until: pinned_until || null,
      pinned_at: is_pinned ? new Date().toISOString() : null,
      pinned_by: is_pinned ? req.user.id : null
    };
    
    const { data: post, error } = await supabaseAdmin
      .from('central_posts')
      .update(updateData)
      .eq('id', postId)
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(200).json({ post });
    
  } catch (error) {
    console.error('Pin post error:', error);
    return res.status(500).json({ error: 'Erro ao fixar post' });
  }
}
