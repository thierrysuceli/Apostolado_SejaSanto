#!/usr/bin/env node
/**
 * Aplica migrations via Supabase Client
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Credenciais Supabase não encontradas no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL(sql, description) {
  console.log(`\n📝 ${description}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`❌ Erro: ${error.message}`);
      return false;
    }
    
    console.log(`✅ Sucesso!`);
    return true;
  } catch (err) {
    console.error(`❌ Exceção: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Aplicando migrations manualmente...\n');
  console.log(`📍 URL: ${supabaseUrl}\n`);
  
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  
  // Ler os arquivos
  const migration1Path = path.join(migrationsDir, '015_articles_and_news.sql');
  const migration2Path = path.join(migrationsDir, '016_articles_news_rls.sql');
  
  if (!fs.existsSync(migration1Path) || !fs.existsSync(migration2Path)) {
    console.error('❌ Arquivos de migration não encontrados!');
    process.exit(1);
  }
  
  const sql1 = fs.readFileSync(migration1Path, 'utf8');
  const sql2 = fs.readFileSync(migration2Path, 'utf8');
  
  console.log('📋 Migrations carregadas. Aplicando...\n');
  console.log('⚠️  Se houver erros, copie o SQL dos arquivos e execute manualmente no Supabase Studio SQL Editor.\n');
  
  // Tentar executar
  await runSQL(sql1, 'Migration 015: Articles and News Tables');
  await runSQL(sql2, 'Migration 016: RLS Policies');
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Processo concluído!');
  console.log('='.repeat(60));
  console.log('\n💡 Dica: Se houver erros, acesse o Supabase Dashboard > SQL Editor');
  console.log('   e execute os arquivos manualmente:');
  console.log('   - supabase/migrations/015_articles_and_news.sql');
  console.log('   - supabase/migrations/016_articles_news_rls.sql\n');
}

main().catch(console.error);
