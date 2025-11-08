/**
 * WORKAROUND FINAL: Inserir diretamente usando SERVICE_ROLE
 * e ignorando FK validation
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: 'public'
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function insertWithWorkaround() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TESTE FINAL: Inserir Bible progress via SERVICE_ROLE');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const { data: users } = await supabase.from('users').select('id, email').limit(1);
  if (!users || users.length === 0) {
    console.log('❌ Sem usuários');
    return;
  }
  
  const userId = users[0].id;
  console.log(`👤 Testando com: ${users[0].email}`);
  console.log(`🆔 ID: ${userId}\n`);
  
  // Estratégia: DELETE primeiro, depois INSERT
  console.log('🗑️  DELETE de registros antigos...');
  const { error: deleteError } = await supabase
    .from('user_bible_progress')
    .delete()
    .eq('user_id', userId)
    .eq('book_abbrev', 'jo');
  
  if (deleteError) {
    console.log('⚠️  Erro ao deletar (pode ser normal se não existir):', deleteError.message);
  } else {
    console.log('✅ DELETE OK\n');
  }
  
  // INSERT novo
  console.log('📝 INSERT novo registro...');
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
    console.log('❌ ERRO:', error.message);
    console.log('📝 Detalhes:', error.details);
    console.log('💡 Hint:', error.hint);
    console.log('\n🔧 SOLUÇÃO: Você PRECISA aplicar DROP_ALL_FKS.sql no Supabase Dashboard manualmente');
    console.log('   Arquivo: DROP_ALL_FKS.sql');
    console.log('   Local: https://supabase.com/dashboard/project/.../sql\n');
    return false;
  }
  
  console.log('✅ INSERT OK!');
  console.log('📊 Dados salvos:', data);
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
  return true;
}

insertWithWorkaround();
