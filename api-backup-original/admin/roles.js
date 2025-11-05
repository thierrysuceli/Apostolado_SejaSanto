// =====================================================
// API - GERENCIAR ROLES
// GET/POST/PUT/DELETE /api/admin/roles
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function handler(req, res) {
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
  
  // GET - Listar roles
  if (req.method === 'GET') {
    try {
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
      
    } catch (error) {
      console.error('Get roles error:', error);
      return res.status(500).json({ error: 'Erro ao buscar roles' });
    }
  }
  
  // POST - Criar nova role
  if (req.method === 'POST') {
    try {
      const { name, display_name, description, color, permissions } = req.body;
      
      if (!name || !display_name) {
        return res.status(400).json({ error: 'Nome e nome de exibição são obrigatórios' });
      }
      
      const upperName = name.toUpperCase();
      
      // Verificar se já existe
      const { data: existing } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', upperName)
        .single();
      
      if (existing) {
        return res.status(409).json({ error: 'Já existe uma role com este nome' });
      }
      
      // Criar role
      const { data: role, error } = await supabaseAdmin
        .from('roles')
        .insert({
          name: upperName,
          display_name,
          description: description || null,
          color: color || '#6b7280',
          is_system: false,
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
        
        await supabaseAdmin
          .from('role_permissions')
          .insert(rolePermissions);
      }
      
      return res.status(201).json({ role });
      
    } catch (error) {
      console.error('Create role error:', error);
      return res.status(500).json({ error: 'Erro ao criar role' });
    }
  }
  
  // PUT - Editar role
  if (req.method === 'PUT') {
    try {
      const id = req.query?.id || req._expressParams?.id;
      
      if (!id) {
        return res.status(400).json({ error: 'ID da role é obrigatório' });
      }
      
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
      
      // Atualizar role
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
          
          await supabaseAdmin
            .from('role_permissions')
            .insert(rolePermissions);
        }
      }
      
      return res.status(200).json({ role });
      
    } catch (error) {
      console.error('Update role error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar role' });
    }
  }
  
  // DELETE - Deletar role
  if (req.method === 'DELETE') {
    try {
      const id = req.query?.id || req._expressParams?.id;
      
      if (!id) {
        return res.status(400).json({ error: 'ID da role é obrigatório' });
      }
      
      // Verificar se role existe e se pode ser deletada
      const { data: existingRole } = await supabaseAdmin
        .from('roles')
        .select('is_system, name')
        .eq('id', id)
        .single();
      
      if (!existingRole) {
        return res.status(404).json({ error: 'Role não encontrada' });
      }
      
      if (existingRole.is_system) {
        return res.status(403).json({ error: 'Não é possível deletar roles do sistema' });
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
      
      // Deletar role (permissões são deletadas automaticamente por CASCADE)
      const { error } = await supabaseAdmin
        .from('roles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: 'Role deletada com sucesso' });
      
    } catch (error) {
      console.error('Delete role error:', error);
      return res.status(500).json({ error: 'Erro ao deletar role' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
