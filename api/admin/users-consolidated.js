// =====================================================
// API - ADMIN USERS (CONSOLIDADA)
// Combina GET/POST users + GET/PUT/DELETE users/[id] + GET/PUT users/[id]/roles
// =====================================================

import { authenticate, hasPermission } from '../../middleware-api/auth.js';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  await authenticate(req, res);
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  await new Promise((resolve) => hasPermission(req, res, resolve));
  
  if (!req.userPermissions?.includes('manage_users')) {
    return res.status(403).json({ error: 'Sem permissão para gerenciar usuários' });
  }

  const { id, resource } = req.query;

  try {
    // GET /admin/users - Listar usuários
    if (req.method === 'GET' && !id) {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select(`
          id, name, email, avatar_url, created_at,
          user_roles(role_id, roles(id, name, display_name, color))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ users: users || [] });
    }

    // GET /admin/users/:id - Buscar usuário específico
    if (req.method === 'GET' && id && !resource) {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          user_roles(role_id, roles(id, name, display_name, color))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return res.status(200).json({ user });
    }

    // PUT /admin/users/:id - Atualizar usuário
    if (req.method === 'PUT' && id && !resource) {
      const { name, email, avatar_url } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ user });
    }

    // DELETE /admin/users/:id - Deletar usuário
    if (req.method === 'DELETE' && id && !resource) {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    }

    // GET /admin/users/:id/roles - Listar roles do usuário
    if (req.method === 'GET' && id && resource === 'roles') {
      const { data: userRoles, error } = await supabaseAdmin
        .from('user_roles')
        .select(`
          *,
          role:roles(id, name, display_name, color, description)
        `)
        .eq('user_id', id);

      if (error) throw error;

      return res.status(200).json({ roles: userRoles || [] });
    }

    // PUT /admin/users/:id/roles - Atualizar roles do usuário
    if (req.method === 'PUT' && id && resource === 'roles') {
      const { role_ids } = req.body;

      if (!Array.isArray(role_ids)) {
        return res.status(400).json({ error: 'role_ids deve ser um array' });
      }

      // Remover todas as roles atuais
      await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', id);

      // Adicionar novas roles
      if (role_ids.length > 0) {
        const inserts = role_ids.map(role_id => ({
          user_id: id,
          role_id,
          assigned_by: req.user.id
        }));

        const { error } = await supabaseAdmin
          .from('user_roles')
          .insert(inserts);

        if (error) throw error;
      }

      return res.status(200).json({ message: 'Roles atualizadas com sucesso' });
    }

    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição' });
  }
}
