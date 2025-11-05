// =====================================================
// API - GERENCIAMENTO DE ROLE INDIVIDUAL (ADMIN)
// /api/admin/roles/[id]
// =====================================================

import { supabaseAdmin } from '../../lib/supabaseServer.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export default async function handler(req, res) {
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  
  await new Promise((resolve, reject) =>
    requireRole('ADMIN')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    })
  );

  const roleId = req.url.split('/').pop();

  // PUT - Atualizar role
  if (req.method === 'PUT') {
    try {
      const { display_name, description, color } = req.body;

      if (!display_name) {
        return res.status(400).json({ error: 'Nome de exibição é obrigatório' });
      }

      const { error } = await supabaseAdmin
        .from('roles')
        .update({
          display_name,
          description: description || null,
          color: color || '#6B7280'
        })
        .eq('id', roleId);

      if (error) throw error;

      return res.status(200).json({ message: 'Role atualizada com sucesso' });
    } catch (error) {
      console.error('Update role error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE - Deletar role
  if (req.method === 'DELETE') {
    try {
      // Verificar se a role é do sistema
      const { data: role, error: checkError } = await supabaseAdmin
        .from('roles')
        .select('name, is_system')
        .eq('id', roleId)
        .single();

      if (checkError) throw checkError;

      if (role.is_system || role.name === 'ADMIN' || role.name === 'VISITANTE') {
        return res.status(403).json({ error: 'Não é possível deletar roles do sistema' });
      }

      // First delete user_roles associations
      const { error: userRolesError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('role_id', roleId);

      if (userRolesError) throw userRolesError;

      // Then delete role
      const { error: roleError } = await supabaseAdmin
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (roleError) throw roleError;

      return res.status(200).json({ message: 'Role deletada com sucesso' });
    } catch (error) {
      console.error('Delete role error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
