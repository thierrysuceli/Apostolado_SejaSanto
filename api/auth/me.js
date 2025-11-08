// =====================================================
// API - OBTER USUÁRIO ATUAL
// GET /api/auth/me
// =====================================================

import { verifyJWT, extractToken } from '../../lib-api/jwt.js';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  // Apenas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    const payload = verifyJWT(token);
    
    if (!payload) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    
    // Buscar usuário com roles e permissões
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        user_roles!user_roles_user_id_fkey (
          roles (
            id,
            name,
            code:name,
            display_name,
            color,
            role_permissions (
              permissions (
                code,
                name,
                category
              )
            )
          )
        )
      `)
      .eq('id', payload.userId)
      .eq('is_active', true)
      .single();
    
    if (error || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Formatar roles e permissões
    user.roles = user.user_roles.map(ur => ur.roles);
    
    // Extrair permissões únicas combinando TODAS as roles (OR lógico)
    // Se qualquer role tiver uma permissão, o usuário tem essa permissão
    const permissionsSet = new Set();
    user.roles.forEach(role => {
      role.role_permissions.forEach(rp => {
        permissionsSet.add(rp.permissions.code); // Apenas o código
      });
      delete role.role_permissions; // Limpar para não enviar ao cliente
    });
    
    user.permissions = Array.from(permissionsSet); // Array de strings (códigos)
    delete user.user_roles;
    delete user.password_hash;
    
    return res.status(200).json({ user });
    
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
