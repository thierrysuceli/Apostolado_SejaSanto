// =====================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// Verificar JWT e carregar usuário
// =====================================================

import { verifyJWT, extractToken } from '../lib-api/jwt.js';
import { supabaseAdmin } from '../lib-api/supabaseServer.js';

/**
 * Middleware para autenticar usuário
 * Adiciona req.user se autenticado
 * VERSÃO ASYNC PARA VERCEL SERVERLESS (sem callback next)
 */
export async function authenticate(req, res) {
  try {
    const token = extractToken(req);
    
    if (!token) {
      req.user = null;
      return;
    }
    
    const payload = verifyJWT(token);
    
    if (!payload) {
      req.user = null;
      return;
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
      return;
    }
    
    // Formatar roles
    user.roles = user.user_roles.map(ur => ur.roles);
    delete user.user_roles;
    delete user.password_hash;
    
    req.user = user;
  } catch (error) {
    console.error('Authentication error:', error);
    req.user = null;
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
 * @param {string} permissionCode - Código da permissão (UPPERCASE)
 * @returns {Promise<boolean>}
 */
export async function hasPermission(userId, permissionCode) {
  try {
    // Buscar roles do usuário
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId);
    
    if (rolesError || !userRoles || userRoles.length === 0) {
      return false;
    }
    
    const roleIds = userRoles.map(ur => ur.role_id);
    
    // Buscar permissões dessas roles
    const { data: rolePermissions, error: permsError } = await supabaseAdmin
      .from('role_permissions')
      .select(`
        permissions!inner (code)
      `)
      .in('role_id', roleIds)
      .eq('permissions.code', permissionCode.toUpperCase());
    
    return rolePermissions && rolePermissions.length > 0;
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
      .eq('roles.name', roleName.toUpperCase());
    
    // Não usar .single() porque usuário pode ter múltiplas roles
    // Retorna true se encontrou pelo menos uma role com esse nome
    return data && data.length > 0;
  } catch (error) {
    console.error(`hasRole error for user ${userId}, role ${roleName}:`, error);
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
