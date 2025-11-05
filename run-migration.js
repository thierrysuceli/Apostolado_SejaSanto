import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.error('Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('📋 Lendo migration...');
    const migrationPath = join(__dirname, 'supabase', 'migrations', '002_add_duration_to_topics.sql');
    const sql = readFileSync(migrationPath, 'utf8');
    
    console.log('🚀 Executando migration...');
    console.log(sql);
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Se a função RPC não existir, vamos tentar via REST API diretamente
      console.log('⚠️ Tentando método alternativo...');
      
      // Adicionar coluna via cliente Supabase
      const alterQuery = `ALTER TABLE topics ADD COLUMN IF NOT EXISTS duration TEXT`;
      
      // Como não temos acesso direto ao SQL, vou instruir o usuário
      console.log('\n📝 Execute este SQL manualmente no Supabase Dashboard:');
      console.log('--------------------------------------------------');
      console.log(sql);
      console.log('--------------------------------------------------\n');
      console.log('🌐 Acesse: https://supabase.com/dashboard/project/[seu-projeto]/editor');
      console.log('');
      console.log('Ou execute via psql:');
      console.log(`psql "${supabaseUrl.replace('https://', 'postgresql://postgres:[password]@')}" -c "ALTER TABLE topics ADD COLUMN IF NOT EXISTS duration TEXT;"`);
      
      return;
    }
    
    console.log('✅ Migration executada com sucesso!');
    console.log(data);
    
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    process.exit(1);
  }
}

runMigration();
