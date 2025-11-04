// =====================================================
// API - LISTAR PERMISSÕES
// GET /api/admin/permissions
// =====================================================

import { authenticate, hasRole } from '../../middleware-api/auth.js';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  await authenticate(req, res);
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  
  const isAdmin = await hasRole(req.user.id, 'ADMIN');
  if (!isAdmin) {
    return res.status(403).json({ error: 'Apenas admins podem visualizar permissões' });
  }
  
  try {
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
    
  } catch (error) {
    console.error('Get permissions error:', error);
    return res.status(500).json({ error: 'Erro ao buscar permissões' });
  }
}
