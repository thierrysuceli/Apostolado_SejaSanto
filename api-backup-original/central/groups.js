// =====================================================
// API - CENTRAL GROUPS
// GET /api/central/groups - Listar grupos do usuário
// =====================================================

import { authenticate } from '../middleware/auth.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';

export default async function handler(req, res) {
  // Autenticação obrigatória
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const user = req.user;
  
  // GET - Listar grupos que o usuário tem acesso
  if (req.method === 'GET') {
    try {
      // Buscar roles do usuário
      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id);
      
      const roleIds = userRoles?.map(ur => ur.role_id) || [];
      
      if (roleIds.length === 0) {
        return res.status(200).json({ groups: [] });
      }
      
      // Buscar grupos dessas roles
      const { data: groups, error } = await supabaseAdmin
        .from('central_groups')
        .select(`
          *,
          roles(id, name, display_name, color)
        `)
        .in('role_id', roleIds)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      // Formatar
      groups?.forEach(group => {
        group.role = group.roles;
        delete group.roles;
      });
      
      return res.status(200).json({ groups: groups || [] });
      
    } catch (error) {
      console.error('Get central groups error:', error);
      return res.status(500).json({ error: 'Erro ao buscar grupos' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
