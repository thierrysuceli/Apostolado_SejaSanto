// =====================================================
// Executar Migrations via Supabase REST API
// =====================================================

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function executeSql(sql, serviceKey, supabaseUrl) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    },
    body: JSON.stringify({ query: sql })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  
  return await response.json();
}

async function main() {
  console.log('📖 Executando migrations da Bíblia via Supabase API...\n');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Erro: Variáveis não encontradas!');
    process.exit(1);
  }
  
  console.log(`🔗 Conectando ao Supabase...\n`);
  
  // Obter lista de arquivos
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
    
    console.log(`[${current}/${total}] (${progress}%) ${file}`);
    
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      await executeSql(sql, serviceKey, supabaseUrl);
      console.log(`  ✅ Sucesso!\n`);
    } catch (error) {
      console.error(`  ❌ Erro: ${error.message}\n`);
      errors.push({ file, error: error.message });
    }
    
    // Delay para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n=================================================');
  if (errors.length === 0) {
    console.log(`🎉 Todas as ${total} migrations executadas!`);
  } else {
    console.log(`⚠️  ${errors.length} falharam:`);
    errors.forEach(e => console.log(`   - ${e.file}`));
  }
  console.log('=================================================\n');
}

main().catch(console.error);
