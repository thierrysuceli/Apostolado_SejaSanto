// =====================================================
// API - LOGIN DE USUÁRIO
// POST /api/auth/login
// =====================================================

import { compare } from 'bcryptjs';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';
import { generateJWT } from '../../lib-api/jwt.js';
import { sanitizeEmail } from '../../lib-api/sanitize.js';

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    const { email, password } = req.body;
    
    console.log(`\n🔐 Login: ${email}`);
    
    // Validações
    if (!email || !password) {
      console.log('❌ Email ou senha não fornecidos');
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const cleanEmail = sanitizeEmail(email);
    
    // Buscar usuário com roles e permissões
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        user_roles!user_roles_user_id_fkey (
          roles (
            id,
            name,
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
      .eq('email', cleanEmail)
      .eq('is_active', true)
      .single();
    
    if (error || !user) {
      console.log('❌ Usuário não encontrado ou inativo');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    const valid = await compare(password, user.password_hash);
    
    if (!valid) {
      console.log('❌ Senha incorreta');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    // Atualizar último login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);
    
    // Formatar roles
    user.roles = user.user_roles?.map(ur => ur.roles) || [];
    
    // Extrair permissões únicas combinando TODAS as roles (OR lógico)
    // Se qualquer role tiver uma permissão, o usuário tem essa permissão
    const permissionsSet = new Set();
    user.roles.forEach(role => {
      role.role_permissions?.forEach(rp => {
        permissionsSet.add(rp.permissions.code); // Apenas o código
      });
      delete role.role_permissions; // Limpar
    });
    
    user.permissions = Array.from(permissionsSet); // Array de strings (códigos)
    delete user.user_roles;
    delete user.password_hash;
    
    // Gerar JWT
    const token = generateJWT(user.id);
    
    console.log(`✅ Login bem-sucedido: ${user.name}\n`);
    
    return res.status(200).json({
      user,
      token,
    });
    
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
