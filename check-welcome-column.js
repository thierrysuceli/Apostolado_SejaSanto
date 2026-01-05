import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yxqhsdvkzhgcnpvxnwxg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cWhzZHZremhnY25wdnhud3hnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDg2MTYyMCwiZXhwIjoyMDQwNDM3NjIwfQ.FqLBvJaG9OplqhqGWl6-XFseLnPPF4Qq8K0YbnlgBwo'
);

async function checkColumn() {
  console.log('\n🔍 Verificando coluna welcome_message...\n');

  // Buscar uma inscrição qualquer
  const { data, error } = await supabase
    .from('central_registrations')
    .select('id, title, welcome_message')
    .limit(1)
    .single();

  if (error) {
    console.log('❌ Erro (coluna pode não existir ainda):', error.message);
    console.log('\n💡 Execute no SQL Editor do Supabase:');
    console.log('ALTER TABLE central_registrations ADD COLUMN IF NOT EXISTS welcome_message TEXT;');
  } else {
    console.log('✅ Coluna existe!');
    console.log('Inscrição:', data);
  }
}

checkColumn().catch(console.error);
