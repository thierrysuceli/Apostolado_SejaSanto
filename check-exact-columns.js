/**
 * Verificar EXATAMENTE qual é a coluna de user_id em cada tabela
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getTableColumns(tableName) {
  console.log(`\n📋 ${tableName}:`);
  
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);
  
  if (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    return [];
  }
  
  if (data && data.length > 0) {
    const cols = Object.keys(data[0]);
    console.log(`   Colunas: ${cols.join(', ')}`);
    return cols;
  } else {
    console.log('   ⚠️  Tabela vazia');
    return [];
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  VERIFICANDO COLUNAS DE TODAS AS TABELAS');
  console.log('═══════════════════════════════════════════════════════════');
  
  await getTableColumns('user_bible_progress');
  await getTableColumns('user_course_progress');
  await getTableColumns('user_post_progress');
  await getTableColumns('comments');
  await getTableColumns('bible_verse_comments');
  await getTableColumns('posts');
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
}

main();
