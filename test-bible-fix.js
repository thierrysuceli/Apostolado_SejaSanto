import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBibleProgressCorrect() {
  console.log('\n🧪 TESTE: Salvar progresso da Bíblia (CORRETO)\n');
  
  // Pegar usuário do auth.users via admin API
  const { data: authData } = await supabase.auth.admin.listUsers();
  
  if (!authData || authData.users.length === 0) {
    console.log('❌ Nenhum usuário no auth.users!');
    
    // Tentar pegar de public.users
    const { data: publicUsers } = await supabase
      .from('users')
      .select('id, email')
      .limit(1);
    
    if (publicUsers && publicUsers.length > 0) {
      const userId = publicUsers[0].id;
      console.log(`\n👤 Usando user de public.users: ${publicUsers[0].email}`);
      console.log(`ID: ${userId}`);
      
      await tryInsert(userId, publicUsers[0].email);
    }
    return;
  }
  
  const authUser = authData.users[0];
  console.log(`👤 User do auth.users: ${authUser.email}`);
  console.log(`ID: ${authUser.id}`);
  
  await tryInsert(authUser.id, authUser.email);
}

async function tryInsert(userId, email) {
  console.log(`\n📖 Tentando salvar progresso:`);
  console.log(`  Livro: João (jo)`);
  console.log(`  Capítulo: 3`);
  console.log(`  Versículo: 16`);
  
  const { data, error } = await supabase
    .from('user_bible_progress')
    .upsert({
      user_id: userId,
      book_abbrev: 'jo',
      chapter: 3,
      verse: 16,
      last_read_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,book_abbrev'
    })
    .select()
    .single();
  
  if (error) {
    console.log('\n❌ ERRO:');
    console.log('Mensagem:', error.message);
    console.log('Código:', error.code);
    console.log('Detalhes:', error.details);
    
    // Tentar ver a constraint
    console.log('\n🔍 Verificando FK da tabela...');
    const { data: constraints } = await supabase
      .rpc('get_table_constraints', { table_name: 'user_bible_progress' })
      .catch(() => ({ data: null }));
    
    if (constraints) {
      console.log('Constraints:', constraints);
    }
  } else {
    console.log('\n✅✅✅ PROGRESSO SALVO COM SUCESSO! ✅✅✅');
    console.log('ID:', data.id);
    console.log('User ID:', data.user_id);
    console.log('Livro:', data.book_abbrev);
    console.log('Capítulo:', data.chapter);
    console.log('Versículo:', data.verse);
  }
}

testBibleProgressCorrect();
