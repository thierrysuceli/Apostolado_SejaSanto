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
        .select(`
          *,
          role_permissions(
            permissions(*)
          )
        `)
        .order('is_system', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;

      // Formatar permissões
      roles?.forEach(role => {
        role.permissions = role.role_permissions?.map(rp => rp.permissions) || [];
        delete role.role_permissions;
      });

      return res.status(200).json({ roles: roles || [] });
    }

    // POST /admin/roles - Criar role
    if (req.method === 'POST' && !id) {
      const { name, display_name, description, color, permissions } = req.body;

      if (!name || !display_name) {
        return res.status(400).json({ error: 'Nome e nome de exibição são obrigatórios' });
      }

      // Verificar se já existe
      const { data: existing } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', name.toUpperCase())
        .single();

      if (existing) {
        return res.status(409).json({ error: 'Já existe uma role com este nome' });
      }

      const { data: role, error } = await supabaseAdmin
        .from('roles')
        .insert({
          name: name.toUpperCase(),
          display_name,
          description: description || null,
          color: color || '#6b7280',
          is_system: false
        })
        .select()
        .single();

      if (error) throw error;

      // Associar permissões
      if (permissions && Array.isArray(permissions) && permissions.length > 0) {
        const rolePermissions = permissions.map(permId => ({
          role_id: role.id,
          permission_id: permId
        }));

        const { error: permError } = await supabaseAdmin
          .from('role_permissions')
          .insert(rolePermissions);
        
        if (permError) console.error('Error inserting role_permissions:', permError);
      }

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
      const { name, display_name, description, color, permissions } = req.body;

      // Verificar se role existe e se pode ser editada
      const { data: existingRole } = await supabaseAdmin
        .from('roles')
        .select('is_system')
        .eq('id', id)
        .single();

      if (!existingRole) {
        return res.status(404).json({ error: 'Role não encontrada' });
      }

      if (existingRole.is_system) {
        return res.status(403).json({ error: 'Não é possível editar roles do sistema' });
      }

      const updateData = {};
      if (name) updateData.name = name.toUpperCase();
      if (display_name) updateData.display_name = display_name;
      if (description !== undefined) updateData.description = description || null;
      if (color) updateData.color = color;

      const { data: role, error } = await supabaseAdmin
        .from('roles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar permissões
      if (permissions && Array.isArray(permissions)) {
        // Remover permissões antigas
        await supabaseAdmin
          .from('role_permissions')
          .delete()
          .eq('role_id', id);

        // Adicionar novas permissões
        if (permissions.length > 0) {
          const rolePermissions = permissions.map(permId => ({
            role_id: id,
            permission_id: permId
          }));

          const { error: permError } = await supabaseAdmin
            .from('role_permissions')
            .insert(rolePermissions);
          
          if (permError) console.error('Error updating role_permissions:', permError);
        }
      }

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

      // Verificar se existem usuários com esta role
      const { data: usersWithRole } = await supabaseAdmin
        .from('user_roles')
        .select('id')
        .eq('role_id', id)
        .limit(1);

      if (usersWithRole && usersWithRole.length > 0) {
        return res.status(409).json({ error: 'Não é possível deletar role que possui usuários associados' });
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
