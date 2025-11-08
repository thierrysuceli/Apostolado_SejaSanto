import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkEventsTable() {
  // Ver estrutura da tabela
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .limit(1);
  
  console.log('📊 Estrutura da tabela events:');
  if (data && data.length > 0) {
    console.log('Colunas:', Object.keys(data[0]));
    console.log('\nExemplo de registro:');
    console.log(data[0]);
  } else {
    console.log('❌ Nenhum evento encontrado ou erro:', error);
  }
}

checkEventsTable();
