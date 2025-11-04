// =====================================================
// API - ADMIN ROLES (CONSOLIDADA)
// Combina GET/POST roles + GET/PUT/DELETE roles/[id]
// =====================================================

import { authenticate, hasPermission } from '../../middleware-api/auth.js';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  await authenticate(req, res);
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const userHasPermission = await hasPermission(req.user.id, 'manage_roles');
  if (!userHasPermission) {
    return res.status(403).json({ error: 'Sem permissão para gerenciar roles' });
  }

  const { id } = req.query;

  try {
    // GET /admin/roles - Listar roles
    if (req.method === 'GET' && !id) {
      const { data: roles, error } = await supabaseAdmin
        .from('roles')
        .select('*')
        .order('display_name');

      if (error) throw error;

      return res.status(200).json({ roles: roles || [] });
    }

    // POST /admin/roles - Criar role
    if (req.method === 'POST' && !id) {
      const { name, display_name, description, color, permissions } = req.body;

      if (!name || !display_name) {
        return res.status(400).json({ error: 'Nome e nome de exibição são obrigatórios' });
      }

      const { data: role, error } = await supabaseAdmin
        .from('roles')
        .insert({
          name: name.toUpperCase(),
          display_name,
          description: description || null,
          color: color || '#6b7280',
          permissions: permissions || [],
          is_system: false
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ role });
    }

    // GET /admin/roles/:id - Buscar role específica
    if (req.method === 'GET' && id) {
      const { data: role, error } = await supabaseAdmin
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return res.status(200).json({ role });
    }

    // PUT /admin/roles/:id - Atualizar role
    if (req.method === 'PUT' && id) {
      const { display_name, description, color, permissions } = req.body;

      const updateData = {};
      if (display_name) updateData.display_name = display_name;
      if (description !== undefined) updateData.description = description;
      if (color) updateData.color = color;
      if (permissions) updateData.permissions = permissions;

      const { data: role, error } = await supabaseAdmin
        .from('roles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ role });
    }

    // DELETE /admin/roles/:id - Deletar role
    if (req.method === 'DELETE' && id) {
      // Verificar se é role de sistema
      const { data: role } = await supabaseAdmin
        .from('roles')
        .select('is_system, name')
        .eq('id', id)
        .single();

      if (role?.is_system) {
        return res.status(403).json({ error: 'Não é possível deletar roles de sistema' });
      }

      const { error } = await supabaseAdmin
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ message: 'Role deletada com sucesso' });
    }

    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('Admin roles error:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição' });
  }
}
