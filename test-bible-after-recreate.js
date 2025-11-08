/**
 * Testar após aplicar RECREATE_BIBLE_PROGRESS.sql
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBibleProgressFinal() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TESTE FINAL - Bible Progress após RECREATE');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const { data: users } = await supabase.from('users').select('id, email').limit(1);
  if (!users || users.length === 0) {
    console.log('❌ Sem usuários');
    return;
  }
  
  const userId = users[0].id;
  console.log(`👤 Testando com: ${users[0].email}\n`);
  
  // 1. INSERT simples
  console.log('1️⃣ Testando INSERT...');
  const { data: inserted, error: insertError } = await supabase
    .from('user_bible_progress')
    .insert({
      user_id: userId,
      book_abbrev: 'jo',
      chapter: 3,
      verse: 16
    })
    .select()
    .single();
  
  if (insertError) {
    console.log('❌ INSERT falhou:', insertError.message);
    return;
  }
  
  console.log('✅ INSERT OK!', inserted.id, '\n');
  
  // 2. UPSERT (atualizar)
  console.log('2️⃣ Testando UPSERT...');
  const { data: upserted, error: upsertError } = await supabase
    .from('user_bible_progress')
    .upsert({
      user_id: userId,
      book_abbrev: 'jo',
      chapter: 4,
      verse: 1
    }, {
      onConflict: 'user_id,book_abbrev'
    })
    .select()
    .single();
  
  if (upsertError) {
    console.log('❌ UPSERT falhou:', upsertError.message);
    return;
  }
  
  console.log('✅ UPSERT OK! Capítulo atualizado para:', upserted.chapter, '\n');
  
  // 3. SELECT
  console.log('3️⃣ Testando SELECT...');
  const { data: selected, error: selectError } = await supabase
    .from('user_bible_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('book_abbrev', 'jo')
    .single();
  
  if (selectError) {
    console.log('❌ SELECT falhou:', selectError.message);
    return;
  }
  
  console.log('✅ SELECT OK!');
  console.log('   Livro:', selected.book_abbrev);
  console.log('   Capítulo:', selected.chapter);
  console.log('   Versículo:', selected.verse);
  console.log('   Última leitura:', selected.last_read_at, '\n');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ TODOS OS TESTES PASSARAM!');
  console.log('🎉 Bible Progress está funcionando 100%!');
  console.log('═══════════════════════════════════════════════════════════\n');
}

testBibleProgressFinal();
