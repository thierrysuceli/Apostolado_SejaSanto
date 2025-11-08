import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

async function testBibleProgressDirect() {
  console.log('\n🧪 TESTE: Insert direto na tabela (SERVICE_ROLE bypassing RLS)\n');
  
  const userId = '51f07a81-41b5-457e-b65f-0a18f8e9e0b9'; // admin@apostolado.com
  
  console.log(`👤 User ID: ${userId}`);
  console.log(`📖 Livro: João (jo)`);
  console.log(`📄 Capítulo: 3`);
  console.log(`📍 Versículo: 16\n`);
  
  // Verificar se user existe
  const { data: userCheck } = await supabase
    .from('users')
    .select('id, email')
    .eq('id', userId)
    .single();
  
  console.log('✅ User existe:', userCheck);
  
  // Tentar insert
  const { data, error } = await supabase
    .from('user_bible_progress')
    .insert({
      user_id: userId,
      book_abbrev: 'jo',
      chapter: 3,
      verse: 16,
      last_read_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.log('\n❌ ERRO AO INSERIR:');
    console.log('Mensagem:', error.message);
    console.log('Código:', error.code);
    console.log('Detalhes:', error.details);
    console.log('Hint:', error.hint);
  } else {
    console.log('\n✅✅✅ INSERT FUNCIONOU! ✅✅✅');
    console.log(data);
  }
}

testBibleProgressDirect();
