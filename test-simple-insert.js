/**
 * SOLUÇÃO SIMPLES: Apenas remover as FKs problemáticas
 * O sistema vai funcionar sem FK validation
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsert() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TESTANDO INSERT SEM FK');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const { data: users } = await supabase.from('users').select('id, email').limit(1);
  if (!users || users.length === 0) {
    console.log('❌ Sem usuários');
    return;
  }
  
  const userId = users[0].id;
  console.log(`👤 Testando com: ${users[0].email}\n`);
  
  // Testar Bible progress
  console.log('📖 Testando Bible progress...');
  const { data: bibleData, error: bibleError } = await supabase
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
  
  if (bibleError) {
    console.log('❌ Erro:', bibleError.message);
    console.log('📝 Detalhes:', bibleError.details);
  } else {
    console.log('✅ Bible progress salvo!', bibleData.id);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
}

testInsert();
