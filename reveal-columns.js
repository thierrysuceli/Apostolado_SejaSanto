/**
 * Descobrir colunas fazendo INSERT vazio
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function revealColumns(tableName) {
  console.log(`\n🔍 ${tableName}:`);
  
  // Tentar INSERT vazio para ver erro que revela colunas
  const { error } = await supabase
    .from(tableName)
    .insert({});
  
  if (error) {
    console.log(`   ${error.message}`);
    
    // Extrair nomes de colunas da mensagem de erro
    const match = error.message.match(/column "(\w+)"/g);
    if (match) {
      const cols = match.map(m => m.replace(/column "|"/g, ''));
      console.log(`   📊 Colunas obrigatórias: ${cols.join(', ')}`);
    }
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  
  await revealColumns('user_bible_progress');
  await revealColumns('user_post_progress');
  await revealColumns('comments');
  await revealColumns('bible_verse_comments');
  await revealColumns('posts');
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
}

main();
