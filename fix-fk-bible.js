import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixBibleProgressFK() {
  console.log('\n🔧 Corrigindo FK da tabela user_bible_progress\n');
  
  const sql = `
    -- Drop existing FK constraint
    ALTER TABLE user_bible_progress 
    DROP CONSTRAINT IF EXISTS user_bible_progress_user_id_fkey;
  `;
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.log('❌ Erro:', error.message);
    
    // Tentar manualmente via query raw
    console.log('\n🔧 Tentando via query SQL direta...\n');
    
    try {
      // Usar a API do Supabase para executar SQL
      const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql_query: sql })
      });
      
      const result = await response.json();
      console.log('Resultado:', result);
    } catch (err) {
      console.log('❌ Erro na tentativa manual:', err.message);
    }
  } else {
    console.log('✅ FK removida com sucesso!');
  }
  
  // Agora testar insert
  console.log('\n🧪 Testando insert após correção...\n');
  
  const { data: users } = await supabase
    .from('users')
    .select('id, email')
    .limit(1);
  
  if (!users || users.length === 0) {
    console.log('❌ Nenhum usuário encontrado!');
    return;
  }
  
  const userId = users[0].id;
  console.log(`👤 User: ${users[0].email}`);
  
  const { data: progress, error: progressError } = await supabase
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
  
  if (progressError) {
    console.log('❌ ERRO ao salvar:', progressError.message);
  } else {
    console.log('✅ PROGRESSO SALVO!');
    console.log(progress);
  }
}

fixBibleProgressFK();
