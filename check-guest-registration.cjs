require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkGuestRegistration() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  VERIFICAR: allow_guest_registration');
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. Verificar estrutura da tabela
  console.log('1️⃣ Verificando estrutura da tabela central_registrations...\n');

  // 2. Buscar todas as inscrições
  console.log('2️⃣ Buscando todas as inscrições...\n');
  const { data: registrations, error: regError } = await supabase
    .from('central_registrations')
    .select('id, title, allow_guest_registration')
    .is('group_id', null);

  if (regError) {
    console.error('❌ Erro ao buscar inscrições:', regError);
    return;
  }

  if (!registrations || registrations.length === 0) {
    console.log('⚠️ Nenhuma inscrição encontrada\n');
    return;
  }

  console.log(`✅ ${registrations.length} inscrição(ões) encontrada(s):\n`);
  registrations.forEach((reg, index) => {
    console.log(`${index + 1}. ID: ${reg.id}`);
    console.log(`   Título: ${reg.title}`);
    console.log(`   allow_guest_registration: ${reg.allow_guest_registration !== undefined ? reg.allow_guest_registration : 'COLUNA NÃO EXISTE'}`);
    console.log('');
  });

  // 3. Verificar se a coluna existe mesmo
  console.log('3️⃣ Testando se a coluna allow_guest_registration existe...\n');
  const testId = registrations[0].id;
  const { data: test, error: testError } = await supabase
    .from('central_registrations')
    .update({ allow_guest_registration: true })
    .eq('id', testId)
    .select()
    .single();

  if (testError) {
    console.error('❌ ERRO: Coluna allow_guest_registration NÃO EXISTE no banco!');
    console.error('Detalhes:', testError.message);
    console.log('\n🔧 SOLUÇÃO: Execute a migration 018 no Supabase SQL Editor:\n');
    console.log('ALTER TABLE central_registrations ADD COLUMN allow_guest_registration BOOLEAN DEFAULT FALSE;');
    console.log('ALTER TABLE central_registration_participants ADD COLUMN guest_name TEXT;\n');
  } else {
    console.log('✅ Coluna existe e foi atualizada com sucesso!');
    console.log('Valor após update:', test.allow_guest_registration);
  }
}

checkGuestRegistration().catch(console.error);
