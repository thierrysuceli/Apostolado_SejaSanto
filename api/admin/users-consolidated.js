// =====================================================
// API - ADMIN USERS (CONSOLIDADA)
// Combina GET/POST users + GET/PUT/DELETE users/[id] + GET/PUT users/[id]/roles
// =====================================================

import { authenticate, hasRole } from '../../middleware-api/auth.js';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  await authenticate(req, res);
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  // 🔒 Apenas ADMIN pode gerenciar usuários
  const isAdmin = await hasRole(req.user.id, 'ADMIN');
  if (!isAdmin) {
    console.log(`[Admin Users] Access denied for user ${req.user.id} - not admin`);
    return res.status(403).json({ error: 'Apenas administradores podem gerenciar usuários' });
  }
  
  console.log(`[Admin Users] Admin access granted for user ${req.user.id}`);

  const { id, resource } = req.query;

  try {
    // GET /admin/users - Listar usuários
    if (req.method === 'GET' && !id) {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select(`
          id, name, email, avatar_url, is_active, created_at, last_login,
          user_roles!user_roles_user_id_fkey(role_id, roles(id, name, display_name, color))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Formatar roles
      users?.forEach(user => {
        user.roles = user.user_roles?.map(ur => ur.roles) || [];
        delete user.user_roles;
      });

      return res.status(200).json({ users: users || [] });
    }

    // POST /admin/users - Criar novo usuário
    if (req.method === 'POST' && !id) {
      const { name, email, password, role_ids } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.hash(password, 10);

      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          name,
          email,
          password_hash: passwordHash
        })
        .select()
        .single();

      if (userError) throw userError;

      // Adicionar roles se fornecidas
      if (role_ids && Array.isArray(role_ids) && role_ids.length > 0) {
        const inserts = role_ids.map(role_id => ({
          user_id: user.id,
          role_id
        }));
        
        await supabaseAdmin.from('user_roles').insert(inserts);
      }

      return res.status(201).json({ user });
    }

    // GET /admin/users/:id - Buscar usuário específico
    if (req.method === 'GET' && id && !resource) {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          user_roles!user_roles_user_id_fkey(role_id, roles(id, name, display_name, color))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Formatar roles
      user.roles = user.user_roles?.map(ur => ur.roles) || [];
      delete user.user_roles;

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
      // Aceitar tanto 'roles' quanto 'role_ids' para compatibilidade com frontend antigo
      const { role_ids, roles } = req.body;
      const roleIdsArray = role_ids || roles;

      console.log('=== UPDATE USER ROLES ===');
      console.log('User ID:', id);
      console.log('Roles recebidas (role_ids):', role_ids);
      console.log('Roles recebidas (roles):', roles);
      console.log('Final roleIdsArray:', roleIdsArray);

      if (!Array.isArray(roleIdsArray)) {
        return res.status(400).json({ error: 'roles deve ser um array' });
      }

      // Remover todas as roles atuais
      console.log('Removendo roles atuais...');
      await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', id);

      // Adicionar novas roles
      if (roleIdsArray.length > 0) {
        const inserts = roleIdsArray.map(role_id => ({
          user_id: id,
          role_id,
          assigned_by: req.user.id
        }));

        console.log('Inserindo novas roles:', inserts);

        const { error } = await supabaseAdmin
          .from('user_roles')
          .insert(inserts);

        if (error) {
          console.error('Erro ao inserir roles:', error);
          throw error;
        }
      }

      console.log('✅ Roles atualizadas com sucesso');

      // Retornar usuário atualizado com roles
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select(`
          id,
          email,
          name,
          avatar_url,
          is_active,
          user_roles!user_roles_user_id_fkey(
            roles(id, name, display_name, color)
          )
        `)
        .eq('id', id)
        .single();

      if (userError) throw userError;

      user.roles = user.user_roles?.map(ur => ur.roles) || [];
      delete user.user_roles;

      return res.status(200).json({ user });
    }

    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição' });
  }
}
