import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createRPCFunction() {
  console.log('\n🔧 Criando RPC Function upsert_bible_progress\n');
  
  const sql = fs.readFileSync('create-bible-rpc.sql', 'utf8');
  
  // Supabase SDK não suporta SQL direto, vamos testar se a função já existe
  const userId = '51f07a81-41b5-457e-b65f-0a18f8e9e0b9'; // admin
  
  console.log('🧪 Testando se RPC existe...\n');
  
  const { data, error } = await supabase.rpc('upsert_bible_progress', {
    p_user_id: userId,
    p_book_abbrev: 'jo',
    p_chapter: 3,
    p_verse: 16
  });
  
  if (error) {
    if (error.code === 'PGRST202') {
      console.log('❌ RPC não existe ainda');
      console.log('⚠️  Você precisa executar create-bible-rpc.sql no Supabase SQL Editor');
      console.log('');
      console.log('Instruções:');
      console.log('1. Abra https://supabase.com/dashboard/project/aywgkvyabjcnnmiwihim/sql/new');
      console.log('2. Cole o conteúdo de create-bible-rpc.sql');
      console.log('3. Execute (Run)');
      console.log('');
      process.exit(1);
    } else {
      console.log('❌ Erro:', error.message);
      process.exit(1);
    }
  }
  
  console.log('✅ RPC existe e funciona!');
  console.log('Resultado:', data);
}

createRPCFunction();
