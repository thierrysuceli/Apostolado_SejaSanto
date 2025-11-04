// =====================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// Verificar JWT e carregar usuário
// =====================================================

import { verifyJWT, extractToken } from '../lib/jwt.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';

/**
 * Middleware para autenticar usuário
 * Adiciona req.user se autenticado
 */
export async function authenticate(req, res, next) {
  try {
    const token = extractToken(req);
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const payload = verifyJWT(token);
    
    if (!payload) {
      req.user = null;
      return next();
    }
    
    // Buscar usuário do banco
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        user_roles!user_roles_user_id_fkey (
          roles (
            id,
            name,
            display_name,
            color
          )
        )
      `)
      .eq('id', payload.userId)
      .eq('is_active', true)
      .single();
    
    if (error || !user) {
      req.user = null;
      return next();
    }
    
    // Formatar roles
    user.roles = user.user_roles.map(ur => ur.roles);
    delete user.user_roles;
    delete user.password_hash;
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    req.user = null;
    next();
  }
}

/**
 * Middleware para exigir autenticação
 */
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  next();
}

/**
 * Verificar se usuário tem permissão
 * @param {string} userId - ID do usuário
 * @param {string} permissionCode - Código da permissão
 * @returns {Promise<boolean>}
 */
export async function hasPermission(userId, permissionCode) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        user_roles!user_roles_user_id_fkey (
          roles (
            role_permissions (
              permissions (code)
            )
          )
        )
      `)
      .eq('id', userId)
      .eq('user_roles.roles.role_permissions.permissions.code', permissionCode)
      .single();
    
    return !!data;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}

/**
 * Middleware para exigir permissão específica
 * @param {string} permissionCode - Código da permissão
 */
export function requirePermission(permissionCode) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }
    
    const allowed = await hasPermission(req.user.id, permissionCode);
    
    if (!allowed) {
      return res.status(403).json({ error: 'Sem permissão para esta ação' });
    }
    
    next();
  };
}

/**
 * Verificar se usuário tem role específica
 * @param {string} userId - ID do usuário
 * @param {string} roleName - Nome da role (ADMIN, INSCRITO, etc.)
 * @returns {Promise<boolean>}
 */
export async function hasRole(userId, roleName) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_roles')
      .select(`
        roles!inner (name)
      `)
      .eq('user_id', userId)
      .eq('roles.name', roleName.toUpperCase())
      .single();
    
    return !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Middleware para exigir role específica
 * @param {string} roleName - Nome da role
 */
export function requireRole(roleName) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }
    
    const allowed = await hasRole(req.user.id, roleName);
    
    if (!allowed) {
      return res.status(403).json({ error: `Role ${roleName} necessária` });
    }
    
    next();
  };
}
