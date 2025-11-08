import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBibleProgressTable() {
  console.log('\n🧪 TESTE: Estrutura da tabela user_bible_progress\n');
  
  // Ver se tabela existe e sua estrutura
  const { data: existing, error: err1 } = await supabase
    .from('user_bible_progress')
    .select('*')
    .limit(1);
  
  if (err1) {
    console.log('❌ ERRO ao acessar tabela:', err1.message);
    console.log('Código:', err1.code);
    return;
  }
  
  if (existing && existing.length > 0) {
    console.log('✅ Tabela existe!');
    console.log('📊 Colunas:', Object.keys(existing[0]));
    console.log('\nExemplo de registro:');
    console.log(existing[0]);
  } else {
    console.log('⚠️ Tabela vazia, mas existe');
  }
  
  // Pegar um usuário para testar
  const { data: users } = await supabase
    .from('users')
    .select('id, email')
    .limit(1);
  
  if (!users || users.length === 0) {
    console.log('❌ Nenhum usuário encontrado!');
    return;
  }
  
  const userId = users[0].id;
  console.log(`\n👤 Testando com user: ${users[0].email}`);
  console.log(`📖 Livro: João (abbrev: jo)`);
  console.log(`📄 Capítulo: 3`);
  console.log(`📍 Versículo: 16`);
  
  // Tentar inserir progresso
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
    console.log('\n❌ ERRO ao salvar progresso:');
    console.log('Mensagem:', error.message);
    console.log('Código:', error.code);
    console.log('Detalhes:', error.details);
    console.log('Hint:', error.hint);
  } else {
    console.log('\n✅ PROGRESSO SALVO COM SUCESSO!');
    console.log('ID:', data.id);
    console.log('User ID:', data.user_id);
    console.log('Livro:', data.book_abbrev);
    console.log('Capítulo:', data.chapter);
    console.log('Versículo:', data.verse);
    console.log('Data:', data.last_read_at);
  }
}

testBibleProgressTable();
