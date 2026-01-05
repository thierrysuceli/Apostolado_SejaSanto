import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yxqhsdvkzhgcnpvxnwxg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cWhzZHZremhnY25wdnhud3hnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDg2MTYyMCwiZXhwIjoyMDQwNDM3NjIwfQ.FqLBvJaG9OplqhqGWl6-XFseLnPPF4Qq8K0YbnlgBwo'
);

async function checkTable() {
  console.log('\n=== VERIFICANDO TABELAS DE PARTICIPAÇÃO ===\n');

  // Verificar se existe outra tabela de participação
  console.log('🔍 Buscando em central_registration_participants:');
  const { data: centralParts, error: centralError } = await supabase
    .from('central_registration_participants')
    .select('*')
    .limit(5);
  console.log({ count: centralParts?.length, data: centralParts, error: centralError });

  console.log('\n🔍 Buscando em group_participants:');
  const { data: groupParts, error: groupError } = await supabase
    .from('group_participants')
    .select('*')
    .limit(5);
  console.log({ count: groupParts?.length, data: groupParts, error: groupError });

  console.log('\n🔍 Buscando VOCÊ especificamente em group_participants:');
  const { data: yourParts, error: yourError } = await supabase
    .from('group_participants')
    .select('*')
    .eq('group_id', '2244df3a-f1c4-4c4c-a548-b8a1599e1d16');
  console.log({ count: yourParts?.length, data: yourParts, error: yourError });

  console.log('\n✅ Checagem completa!');
}

checkTable().catch(console.error);
