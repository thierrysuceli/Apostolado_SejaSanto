// =====================================================
// Script Direto para Executar Migrations da Bíblia
// =====================================================

require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('📖 Executando migrations da Bíblia no Supabase...\n');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  
  if (!supabaseUrl || !dbPassword) {
    console.error('❌ Erro: Variáveis não encontradas no .env.local!');
    process.exit(1);
  }
  
  // Extrair project ref
  const projectRef = supabaseUrl.match(/https:\/\/([a-z]+)\.supabase\.co/)[1];
  
  console.log(`🔗 Conectando ao projeto: ${projectRef}\n`);
  
  // Configurar cliente PostgreSQL - conexão direta
  const client = new Client({
    host: `${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: dbPassword,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase!\n');
    
    // Obter lista de arquivos de migration ordenados
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations', 'bible-data');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    const total = files.length;
    let current = 0;
    let errors = [];
    
    for (const file of files) {
      current++;
      const progress = Math.round((current / total) * 100);
      
      console.log(`[${current}/${total}] (${progress}%) Executando: ${file}`);
      
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await client.query(sql);
        console.log(`  ✅ Sucesso!\n`);
      } catch (error) {
        console.error(`  ❌ Erro: ${error.message}\n`);
        errors.push({ file, error: error.message });
      }
    }
    
    console.log('\n=================================================');
    if (errors.length === 0) {
      console.log(`🎉 Todas as ${total} migrations foram executadas com sucesso!`);
    } else {
      console.log(`⚠️  ${errors.length} migrations falharam:`);
      errors.forEach(e => console.log(`   - ${e.file}: ${e.error}`));
    }
    console.log('=================================================\n');
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
