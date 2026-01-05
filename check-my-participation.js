import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yxqhsdvkzhgcnpvxnwxg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cWhzZHZremhnY25wdnhud3hnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDg2MTYyMCwiZXhwIjoyMDQwNDM3NjIwfQ.FqLBvJaG9OplqhqGWl6-XFseLnPPF4Qq8K0YbnlgBwo'
);

async function checkParticipation() {
  console.log('\n=== VERIFICANDO PARTICIPAÇÃO DO USUÁRIO ===\n');

  // Buscar TODAS as participações
  const { data: allParticipations, error: allError } = await supabase
    .from('central_registration_participants')
    .select('*');

  console.log('📊 TODAS AS PARTICIPAÇÕES:', {
    count: allParticipations?.length || 0,
    participations: allParticipations
  });

  // Buscar inscrição específica
  const registrationId = '2244df3a-f1c4-4c4c-a548-b8a1599e1d16';
  
  console.log('\n🔍 Buscando participações para inscrição:', registrationId);
  
  const { data: regParticipations, error: regError } = await supabase
    .from('central_registration_participants')
    .select('*')
    .eq('registration_id', registrationId);

  console.log('Participações nesta inscrição:', {
    count: regParticipations?.length || 0,
    participations: regParticipations
  });

  // Buscar usuário logado (assumindo que é você)
  console.log('\n👤 Buscando usuários...');
  
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, name')
    .limit(10);

  console.log('Usuários:', users);

  console.log('\n✅ Verificação completa!');
}

checkParticipation().catch(console.error);
