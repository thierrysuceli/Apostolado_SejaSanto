// =====================================================
// API - ATRIBUIR ROLES A USUÁRIO
// PUT /api/admin/users/:id/roles
// =====================================================

import { supabaseAdmin } from '../../../lib/supabaseServer.js';
import { authenticate, requireRole } from '../../../middleware/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  const id = req.query?.id || req._expressParams?.id;
  
  if (!id) {
    return res.status(400).json({ error: 'ID do usuário é obrigatório' });
  }
  
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
  
  try {
    const { roles } = req.body;
    
    console.log('=== UPDATE USER ROLES ===');
    console.log('User ID:', id);
    console.log('Roles recebidas:', roles);
    
    if (!roles || !Array.isArray(roles)) {
      return res.status(400).json({ error: 'Roles é obrigatório e deve ser um array' });
    }
    
    // Remover roles atuais
    console.log('Removendo roles atuais...');
    const { error: deleteError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', id);
    
    if (deleteError) {
      console.error('Erro ao deletar roles:', deleteError);
      throw deleteError;
    }
    
    // Adicionar novas roles
    if (roles.length > 0) {
      const userRoles = roles.map(roleId => ({
        user_id: id,
        role_id: roleId
      }));
      
      console.log('Inserindo novas roles:', userRoles);
      
      const { error: insertError } = await supabaseAdmin
        .from('user_roles')
        .insert(userRoles);
      
      if (insertError) {
        console.error('Erro ao inserir roles:', insertError);
        throw insertError;
      }
    }
    
    console.log('Buscando usuário atualizado...');
    
    // Buscar usuário atualizado
    const { data: user, error } = await supabaseAdmin
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
    
    if (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
    
    console.log('Usuário encontrado:', user);
    
    user.roles = user.user_roles?.map(ur => ur.roles) || [];
    delete user.user_roles;
    
    console.log('✅ Roles atualizadas com sucesso:', user.roles.map(r => r.name));
    
    return res.status(200).json({ user });
    
  } catch (error) {
    console.error('❌ Update user roles error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
      error: 'Erro ao atualizar roles do usuário',
      details: error.message 
    });
  }
}
