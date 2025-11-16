#!/usr/bin/env node
/**
 * Script para aplicar migrations do Supabase
 * Lê credenciais do .env.local
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas!');
  console.error('   Certifique-se de ter VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Aplicando: ${fileName}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Executa a migration usando rpc (raw SQL)
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: sql 
    }).catch(async (err) => {
      // Fallback: tentar via REST API diretamente
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ sql_query: sql })
      });
      
      if (!response.ok) {
        // Tenta executar comando por comando
        const commands = sql
          .split(';')
          .map(cmd => cmd.trim())
          .filter(cmd => cmd && !cmd.startsWith('--'));
        
        for (const command of commands) {
          if (command) {
            await supabase.rpc('exec_sql', { sql_query: command + ';' });
          }
        }
      }
    });
    
    if (error) {
      console.error(`   ❌ Erro ao aplicar ${fileName}:`, error.message);
      return false;
    }
    
    console.log(`   ✅ ${fileName} aplicado com sucesso!`);
    return true;
  } catch (error) {
    console.error(`   ❌ Erro ao ler/aplicar ${fileName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando aplicação de migrations...\n');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);
  
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  
  // Migrations específicas para aplicar
  const migrations = [
    '015_articles_and_news.sql',
    '016_articles_news_rls.sql'
  ];
  
  let successCount = 0;
  let failCount = 0;
  
  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${migration} não encontrado, pulando...`);
      continue;
    }
    
    const success = await runMigration(filePath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Migrations aplicadas com sucesso: ${successCount}`);
  console.log(`❌ Migrations com erro: ${failCount}`);
  console.log('='.repeat(50) + '\n');
  
  if (failCount > 0) {
    console.log('⚠️  Algumas migrations falharam. Verifique os erros acima.');
    process.exit(1);
  }
  
  console.log('🎉 Todas as migrations foram aplicadas com sucesso!');
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
