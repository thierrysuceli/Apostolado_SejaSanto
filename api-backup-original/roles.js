// =====================================================
// API - LISTAR ROLES PÚBLICAS (para seleção em formulários)
// GET /api/roles
// =====================================================

import { supabaseAdmin } from './lib/supabaseServer.js';

export default async function handler(req, res) {
  // GET - Listar roles públicas (não requer autenticação)
  if (req.method === 'GET') {
    try {
      const { data: roles, error } = await supabaseAdmin
        .from('roles')
        .select('id, name, display_name, color')
        .eq('is_system', true) // Apenas roles do sistema
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return res.status(200).json({ roles: roles || [] });
      
    } catch (error) {
      console.error('Get public roles error:', error);
      return res.status(500).json({ error: 'Erro ao buscar roles' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
