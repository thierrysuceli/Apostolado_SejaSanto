// =====================================================
// Script para executar migrations da Bíblia via Node.js
// =====================================================

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('📖 Executando migrations da Bíblia no Supabase...\n');
  
  // Extrair project ref do URL
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  
  if (!supabaseUrl || !dbPassword) {
    console.error('❌ Erro: VITE_SUPABASE_URL ou SUPABASE_DB_PASSWORD não encontrados no .env.local!');
    process.exit(1);
  }
  
  const projectRef = supabaseUrl.match(/https:\/\/([a-z]+)\.supabase\.co/)?.[1];
  
  if (!projectRef) {
    console.error('❌ Erro: Não foi possível extrair project ref do VITE_SUPABASE_URL');
    process.exit(1);
  }
  
  
  console.log(`🔗 Conectando ao projeto: ${projectRef}\n`);
  
  // Configurar cliente PostgreSQL
  const client = new Client({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: dbPassword,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados!\n');
    
    // Obter lista de arquivos de migration ordenados
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations', 'bible-data');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    const total = files.length;
    let current = 0;
    const errors = [];
    
    for (const file of files) {
      current++;
      const progress = Math.round((current / total) * 100);
      
      console.log(`[${current}/${total}] (${progress}%) Executando: ${file}`);
      
      try {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        await client.query(sql);
        console.log('  ✅ Sucesso!\n');
        
      } catch (error) {
        console.error(`  ❌ Erro ao executar ${file}`);
        console.error(`  Detalhes: ${error.message}\n`);
        errors.push(file);
      }
      
      // Pequeno delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('='.repeat(50));
    if (errors.length === 0) {
      console.log(`🎉 Todas as ${total} migrations foram executadas com sucesso!`);
    } else {
      console.log(`⚠️  ${errors.length} migrations falharam:`);
      errors.forEach(f => console.log(`   - ${f}`));
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
