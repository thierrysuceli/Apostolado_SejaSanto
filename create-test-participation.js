import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yxqhsdvkzhgcnpvxnwxg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cWhzZHZremhnY25wdnhud3hnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDg2MTYyMCwiZXhwIjoyMDQwNDM3NjIwfQ.FqLBvJaG9OplqhqGWl6-XFseLnPPF4Qq8K0YbnlgBwo'
);

async function createTestParticipation() {
  console.log('\n=== CRIANDO PARTICIPAÇÃO DE TESTE ===\n');

  // Buscar seu usuário (admin)
  const { data: users } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('email', 'thierry.scl@gmail.com')
    .single();

  if (!users) {
    console.log('❌ Usuário não encontrado! Listando todos:');
    const { data: allUsers } = await supabase.from('users').select('id, email, name').limit(5);
    console.log(allUsers);
    return;
  }

  console.log('✅ Usuário encontrado:', users);

  const registrationId = '2244df3a-f1c4-4c4c-a548-b8a1599e1d16';

  // Criar participação pendente
  const { data: participation, error } = await supabase
    .from('central_registration_participants')
    .insert({
      registration_id: registrationId,
      user_id: users.id,
      status: 'pending',
      form_responses: { test: 'sim' }
    })
    .select()
    .single();

  if (error) {
    console.log('❌ Erro ao criar participação:', error);
    return;
  }

  console.log('\n🎉 PARTICIPAÇÃO CRIADA COM SUCESSO:', participation);
  console.log('\n✅ Agora recarregue a página e veja o botão mudar!');
}

createTestParticipation().catch(console.error);
