// Script para criar usuário admin
import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔗 Conectando ao Supabase:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createAdmin() {
  try {
    console.log('🔧 Criando novo usuário admin...\n');

    // 1. Hash da senha
    const passwordHash = await hash('Admin@2025', 10);
    console.log('✅ Senha hash gerado');

    // 2. Verificar se já existe
    const { data: existing } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', 'admin@apostolado.com')
      .single();

    if (existing) {
      console.log('⚠️  Usuário admin@apostolado.com já existe!');
      console.log('🔄 Atualizando senha...');
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('email', 'admin@apostolado.com');

      if (updateError) {
        console.error('❌ Erro ao atualizar senha:', updateError);
        return;
      }

      console.log('✅ Senha atualizada com sucesso!');
      console.log('\n📧 Email: admin@apostolado.com');
      console.log('🔑 Nova Senha: Admin@2025\n');
      return;
    }

    // 3. Criar usuário
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name: 'Administrador',
        email: 'admin@apostolado.com',
        password_hash: passwordHash,
        is_active: true
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Erro ao criar usuário:', userError);
      return;
    }

    console.log('✅ Usuário criado:', user.id);

    // 4. Buscar role ADMIN
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'ADMIN')
      .single();

    if (roleError) {
      console.error('❌ Erro ao buscar role ADMIN:', roleError);
      return;
    }

    console.log('✅ Role ADMIN encontrada:', adminRole.id);

    // 5. Atribuir role ao usuário
    const { error: userRoleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role_id: adminRole.id
      });

    if (userRoleError) {
      console.error('❌ Erro ao atribuir role:', userRoleError);
      return;
    }

    console.log('✅ Role ADMIN atribuída ao usuário!');
    console.log('\n🎉 Admin criado com sucesso!\n');
    console.log('📧 Email: admin@apostolado.com');
    console.log('🔑 Senha: Admin@2025\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

createAdmin();
