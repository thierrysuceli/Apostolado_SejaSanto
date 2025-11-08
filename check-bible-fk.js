/**
 * Verificar problema da FK user_bible_progress_user_id_fkey
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkForeignKey() {
  console.log('\n🔍 Verificando FK da tabela user_bible_progress...\n');
  
  // Buscar detalhes da FK
  const { data: fkInfo, error: fkError } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'user_bible_progress'
        AND tc.constraint_name = 'user_bible_progress_user_id_fkey'
    `
  });
  
  if (fkError) {
    console.log('❌ Erro ao buscar FK:', fkError.message);
    console.log('\n📋 Tentando query direta...\n');
    
    // Verificar usuários
    const { data: users } = await supabase.from('users').select('id, email').limit(1);
    console.log('👥 Usuário de teste:', users?.[0]?.email);
    console.log('🆔 ID:', users?.[0]?.id);
    
    // Tentar inserir direto
    console.log('\n🧪 Tentando INSERT direto...\n');
    const { data, error } = await supabase
      .from('user_bible_progress')
      .insert({
        user_id: users[0].id,
        book_abbrev: 'jo',
        chapter: 3,
        verse: 16,
        last_read_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.log('❌ Erro:', error.message);
      console.log('📝 Detalhes:', error.details);
      console.log('💡 Hint:', error.hint);
    } else {
      console.log('✅ INSERT funcionou!', data);
    }
    
    return;
  }
  
  console.log('📋 FK encontrada:', fkInfo);
}

checkForeignKey();
