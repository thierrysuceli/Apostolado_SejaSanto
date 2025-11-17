// ===================================================== 
// Executar Migrations Usando Supabase Client JS
// =====================================================

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('📖 Executando migrations da Bíblia...\n');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Erro: Variáveis não encontradas!');
    process.exit(1);
  }
  
  // Criar client com service role
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });
  
  console.log(`✅ Cliente Supabase criado!\n`);
  
  // Obter lista de arquivos
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations', 'bible-data');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  const total = files.length;
  let current = 0;
  let success = 0;
  let errors = [];
  
  for (const file of files) {
    current++;
    const progress = Math.round((current / total) * 100);
    
    console.log(`[${current}/${total}] (${progress}%) ${file}`);
    
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      // Executar SQL via RPC (precisa ter função no Supabase)
      const { data, error } = await supabase.rpc('exec_raw_sql', { sql_query: sql });
      
      if (error) throw error;
      
      console.log(`  ✅ Sucesso!\n`);
      success++;
    } catch (error) {
      console.error(`  ❌ Erro: ${error.message}\n`);
      errors.push({ file, error: error.message });
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n=================================================');
  console.log(`🎉 ${success}/${total} migrations executadas!`);
  if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} falharam - execute manualmente via Dashboard`);
  }
  console.log('=================================================\n');
}

main().catch(console.error);
