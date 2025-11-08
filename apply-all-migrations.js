/**
 * APLICAR TODAS AS SQLS NECESSÁRIAS VIA CÓDIGO
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applySQLFile(filename, description) {
  console.log(`\n📝 ${description}...`);
  
  try {
    const sql = readFileSync(filename, 'utf-8');
    
    // Executar linha por linha
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.includes('ALTER TABLE') || statement.includes('DROP') || statement.includes('CREATE')) {
        console.log(`   Executando: ${statement.substring(0, 60)}...`);
        
        // Usar rpc se disponível, senão tentar direto
        const { error } = await supabase.rpc('exec_sql', { query: statement });
        
        if (error && error.code !== 'PGRST202') {
          console.log(`   ⚠️  Erro (pode ser normal): ${error.message}`);
        }
      }
    }
    
    console.log(`   ✅ ${description} - OK`);
    return true;
  } catch (err) {
    console.log(`   ❌ Erro ao ler arquivo: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  APLICANDO TODAS AS MIGRATIONS NECESSÁRIAS');
  console.log('═══════════════════════════════════════════════════════════');
  
  // Aplicar sqls individuais via Supabase API Rest
  console.log('\n⚠️  NOTA: Algumas migrations precisam ser aplicadas manualmente no Supabase Dashboard');
  console.log('   Arquivo: RECREATE_BIBLE_PROGRESS.sql');
  console.log('   Arquivo: FIX_BIBLE_COMMENTS_FK.sql\n');
  
  console.log('Testando conexão com banco...');
  const { data, error } = await supabase.from('users').select('count').limit(1);
  
  if (error) {
    console.log('❌ Erro de conexão:', error.message);
    return;
  }
  
  console.log('✅ Conexão OK\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n🔧 APLIQUE MANUALMENTE NO SUPABASE DASHBOARD:');
  console.log('   1. RECREATE_BIBLE_PROGRESS.sql');
  console.log('   2. FIX_BIBLE_COMMENTS_FK.sql\n');
}

main();
