#!/usr/bin/env node
/**
 * Script simplificado para aplicar SQL via Supabase REST API
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: Credenciais não encontradas no .env.local');
  process.exit(1);
}

async function executeSQLFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Executando: ${fileName}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Remove comentários e divide em statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`   📊 ${statements.length} statements encontrados`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Pula comentários de bloco
      if (statement.trim().startsWith('/*')) continue;
      
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ query: statement })
        });
        
        if (response.ok || response.status === 204) {
          successCount++;
          process.stdout.write('.');
        } else {
          errorCount++;
          const errorText = await response.text();
          console.log(`\n   ⚠️  Statement ${i + 1} falhou: ${errorText}`);
        }
      } catch (err) {
        errorCount++;
        console.log(`\n   ⚠️  Statement ${i + 1} erro: ${err.message}`);
      }
    }
    
    console.log(`\n   ✅ Sucesso: ${successCount} | ❌ Erros: ${errorCount}`);
    return errorCount === 0;
  } catch (error) {
    console.error(`   ❌ Erro ao processar ${fileName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Aplicando migrations de Artigos e Notícias...\n');
  
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  const migrations = [
    '015_articles_and_news.sql',
    '016_articles_news_rls.sql'
  ];
  
  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);
    if (fs.existsSync(filePath)) {
      await executeSQLFile(filePath);
    }
  }
  
  console.log('\n✅ Migrations processadas!');
}

main().catch(console.error);
