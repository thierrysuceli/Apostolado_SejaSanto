import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsersTable() {
  console.log('🔍 Verificando tabelas de usuários...\n');
  
  // Tentar auth.users
  const { data: authUsers, error: err1 } = await supabase.auth.admin.listUsers();
  
  if (!err1 && authUsers) {
    console.log('✅ Tabela auth.users existe!');
    console.log(`Total usuários: ${authUsers.users.length}`);
    if (authUsers.users.length > 0) {
      console.log('Exemplo:', authUsers.users[0].id, '-', authUsers.users[0].email);
    }
  }
  
  // Tentar public.users
  const { data: publicUsers, error: err2 } = await supabase
    .from('users')
    .select('id, email')
    .limit(1);
  
  if (err2) {
    console.log('\n❌ Tabela public.users NÃO existe ou está vazia');
    console.log('Erro:', err2.message);
  } else {
    console.log('\n✅ Tabela public.users existe!');
    if (publicUsers && publicUsers.length > 0) {
      console.log('Exemplo:', publicUsers[0].id, '-', publicUsers[0].email);
    }
  }
}

checkUsersTable();
