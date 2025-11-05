// =====================================================
// API - GERENCIAMENTO DE USUÁRIO INDIVIDUAL (ADMIN)
// /api/admin/users/[id]
// =====================================================

import { supabaseAdmin } from '../../lib/supabaseServer.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export default async function handler(req, res) {
  // Autenticar e verificar se é admin
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

  const userId = req.query?.id || req._expressParams?.id;
  
  if (!userId) {
    return res.status(400).json({ error: 'ID do usuário é obrigatório' });
  }

  try {

    // PUT - Update user
    if (req.method === 'PUT') {
      const { name, email, password, roles } = req.body;

      if (!name || !email || !roles || roles.length === 0) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      // Update user basic info
      const updateData = { name, email };
      if (password && password.trim()) {
        updateData.password = password; // TODO: implement proper hashing
      }

      const { error: userError } = await supabaseAdmin
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (userError) throw userError;

      // Delete existing roles
      const { error: deleteError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Assign new roles
      const userRoles = roles.map(roleId => ({
        user_id: userId,
        role_id: roleId
      }));

      const { error: rolesError } = await supabaseAdmin
        .from('user_roles')
        .insert(userRoles);

      if (rolesError) throw rolesError;

      return res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    }

    // DELETE - Delete user
    if (req.method === 'DELETE') {
      // First delete user_roles
      const { error: rolesError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (rolesError) throw rolesError;

      // Then delete user
      const { error: userError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId);

      if (userError) throw userError;

      return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('User API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
