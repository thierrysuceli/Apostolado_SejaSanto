/**
 * Verificar estrutura REAL das tabelas de progresso
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure(tableName) {
  console.log(`\n📋 Estrutura da tabela: ${tableName}\n`);
  
  // Inserir dummy data e ver o erro
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('❌ Erro:', error.message);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('📊 Colunas encontradas:');
    Object.keys(data[0]).forEach(col => {
      console.log(`   - ${col}: ${typeof data[0][col]}`);
    });
  } else {
    console.log('⚠️  Tabela vazia, tentando INSERT para descobrir colunas...');
    
    // Tentar insert vazio para ver quais colunas são obrigatórias
    const { error: insertError } = await supabase
      .from(tableName)
      .insert({});
    
    if (insertError) {
      console.log('💡 Erro revela colunas:', insertError.message);
    }
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('        VERIFICANDO ESTRUTURA DAS TABELAS');
  console.log('═══════════════════════════════════════════════════════════');
  
  await checkTableStructure('user_bible_progress');
  await checkTableStructure('user_course_progress');
  await checkTableStructure('user_post_progress');
  await checkTableStructure('comments');
  await checkTableStructure('posts');
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
}

main();
