/**
 * Verificar onde o usuário realmente está
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findUser() {
  const userId = '93eddd53-9f02-4e30-ab51-396abbd229a7';
  
  console.log('\n🔍 Procurando usuário:', userId, '\n');
  
  // Verificar em public.users
  const { data: publicUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  console.log('👥 public.users:', publicUser ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
  if (publicUser) {
    console.log('   Email:', publicUser.email);
    console.log('   Nome:', publicUser.name);
  }
  
  // Verificar em auth.users
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const authUser = authUsers.users.find(u => u.id === userId);
  
  console.log('🔐 auth.users:', authUser ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
  if (authUser) {
    console.log('   Email:', authUser.email);
  }
  
  // Listar TODOS os usuários de public.users
  console.log('\n📋 TODOS os usuários em public.users:\n');
  const { data: allUsers } = await supabase.from('users').select('id, email, name');
  allUsers?.forEach((u, i) => {
    console.log(`${i+1}. ${u.email} (${u.id})`);
  });
  
  // Verificar schema da FK
  console.log('\n🔍 Verificando para qual tabela a FK aponta...\n');
  
  const { data: tableInfo } = await supabase
    .from('user_bible_progress')
    .select('*')
    .limit(0);
  
  console.log('📊 Colunas da tabela user_bible_progress:', Object.keys(tableInfo || {}));
}

findUser();
