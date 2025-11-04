// =====================================================
// API - REGISTRO DE USUÁRIO
// POST /api/auth/register
// =====================================================

import { hash } from 'bcryptjs';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import { generateJWT } from '../lib/jwt.js';
import { sanitizeEmail, sanitizeName, isValidEmail, validatePassword } from '../lib/sanitize.js';

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    const { email, password, name } = req.body;
    
    // Validações
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }
    
    const cleanEmail = sanitizeEmail(email);
    const cleanName = sanitizeName(name);
    
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }
    
    // Verificar se email já existe
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .single();
    
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    
    // Hash da senha
    const passwordHash = await hash(password, 10);
    
    // Criar usuário
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: cleanEmail,
        name: cleanName,
        password_hash: passwordHash,
        is_active: true,
      })
      .select()
      .single();
    
    if (userError) {
      console.error('User creation error:', userError);
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
    
    // Atribuir roles padrão: VISITANTE (todos têm) + INSCRITO (usuários registrados)
    const { data: roles } = await supabaseAdmin
      .from('roles')
      .select('id, name')
      .in('name', ['VISITANTE', 'INSCRITO']);
    
    if (roles && roles.length > 0) {
      const userRoles = roles.map(role => ({
        user_id: user.id,
        role_id: role.id,
      }));
      
      await supabaseAdmin
        .from('user_roles')
        .insert(userRoles);
      
      console.log(`✅ Roles atribuídas: ${roles.map(r => r.name).join(', ')}`);
    } else {
      console.warn('⚠️ Roles VISITANTE e/ou INSCRITO não encontradas no banco de dados');
    }
    
    // Buscar usuário completo com roles e permissões
    const { data: fullUser, error: fetchError } = await supabaseAdmin
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
      .eq('id', user.id)
      .single();
    
    if (fetchError || !fullUser) {
      console.error('Error fetching user:', fetchError);
      return res.status(500).json({ error: 'Erro ao buscar usuário criado' });
    }
    
    // Formatar roles
    fullUser.roles = fullUser.user_roles?.map(ur => ur.roles) || [];
    
    // Extrair permissões únicas combinando TODAS as roles (OR lógico)
    // Se qualquer role tiver uma permissão, o usuário tem essa permissão
    const permissionsSet = new Set();
    fullUser.roles.forEach(role => {
      role.role_permissions?.forEach(rp => {
        permissionsSet.add(rp.permissions.code); // Apenas o código
      });
      delete role.role_permissions; // Limpar
    });
    
    fullUser.permissions = Array.from(permissionsSet); // Array de strings (códigos)
    delete fullUser.user_roles;
    delete fullUser.password_hash;
    
    // Gerar JWT
    const token = generateJWT(user.id);
    
    return res.status(201).json({
      user: fullUser,
      token,
    });
    
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
