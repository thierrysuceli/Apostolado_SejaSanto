// =====================================================
// API - LISTAR PERMISSÕES
// GET /api/admin/permissions
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  
  // Exigir role ADMIN
  await new Promise((resolve, reject) =>
    requireRole('ADMIN')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    })
  );
  
  try {
    const { data: permissions, error } = await supabaseAdmin
      .from('permissions')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    // Agrupar por categoria
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
