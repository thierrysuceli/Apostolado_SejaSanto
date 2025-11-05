// =====================================================
// API - GERENCIAR USUÁRIOS
// GET /api/admin/users
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, requireRole } from '../middleware/auth.js';

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
  
  // GET - Listar usuários
  if (req.method === 'GET') {
    try {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select(`
          id,
          email,
          name,
          avatar_url,
          is_active,
          created_at,
          last_login,
          user_roles!user_roles_user_id_fkey(
            roles(id, name, display_name, color)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Formatar roles
      users?.forEach(user => {
        user.roles = user.user_roles?.map(ur => ur.roles) || [];
        delete user.user_roles;
      });
      
      return res.status(200).json({ users: users || [] });
      
    } catch (error) {
      console.error('Get users error:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }
  
  // POST - Criar novo usuário
  if (req.method === 'POST') {
    try {
      const { name, email, password, roles } = req.body;

      if (!name || !email || !password || !roles || roles.length === 0) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      // Hash password (in production, use bcrypt)
      const hashedPassword = password; // TODO: implement proper hashing

      // Create user
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          name,
          email,
          password: hashedPassword,
          is_active: true
        })
        .select()
        .single();

      if (userError) throw userError;

      // Assign roles
      const userRoles = roles.map(roleId => ({
        user_id: user.id,
        role_id: roleId
      }));

      const { error: rolesError } = await supabaseAdmin
        .from('user_roles')
        .insert(userRoles);

      if (rolesError) throw rolesError;

      return res.status(201).json({ message: 'Usuário criado com sucesso', user });
    } catch (error) {
      console.error('Create user error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
