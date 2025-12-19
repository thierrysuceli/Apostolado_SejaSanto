import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.error('Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('📋 Lendo migration 013_add_article_comments.sql...');
    const migrationPath = join(__dirname, 'supabase', 'migrations', '013_add_article_comments.sql');
    const sql = readFileSync(migrationPath, 'utf8');
    
    console.log('\n🚀 Executando migration...\n');
    
    // Dividir SQL em statements individuais
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      // Pular comentários de bloco
      if (statement.startsWith('/*') || statement.startsWith('--')) continue;
      
      console.log(`📝 Executando: ${statement.substring(0, 60)}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: statement + ';' 
      });
      
      if (error) {
        // Se RPC não existir, usar método alternativo
        if (error.code === 'PGRST202' || error.message.includes('exec_sql')) {
          console.log('\n⚠️ A função exec_sql não existe no Supabase.');
          console.log('📋 Você precisa executar este SQL manualmente no Supabase Dashboard:\n');
          console.log('--------------------------------------------------');
          console.log(sql);
          console.log('--------------------------------------------------\n');
          console.log('🌐 Acesse: https://supabase.com/dashboard/project/[seu-projeto]/sql-editor');
          console.log('');
          process.exit(1);
        }
        
        throw error;
      }
      
      console.log('   ✅ OK');
    }
    
    console.log('\n✅ Migration executada com sucesso!');
    console.log('🎉 Comentários em artigos agora estão disponíveis!');
    
  } catch (error) {
    console.error('\n❌ Erro ao executar migration:', error.message);
    if (error.details) console.error('Detalhes:', error.details);
    if (error.hint) console.error('Dica:', error.hint);
    process.exit(1);
  }
}

runMigration();
