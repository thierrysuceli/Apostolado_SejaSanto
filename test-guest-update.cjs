require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testGuestUpdate() {
  console.log('\n🔍 Testando UPDATE de allow_guest_registration...\n');

  // Buscar a inscrição
  const { data: reg, error: getError } = await supabase
    .from('central_registrations')
    .select('id, title, allow_guest_registration')
    .is('group_id', null)
    .single();

  if (getError) {
    console.error('❌ Erro ao buscar:', getError);
    return;
  }

  console.log('📋 Inscrição atual:');
  console.log(`   ID: ${reg.id}`);
  console.log(`   Título: ${reg.title}`);
  console.log(`   allow_guest_registration: ${reg.allow_guest_registration}`);
  console.log('');

  // Tentar atualizar
  console.log('🔄 Atualizando para TRUE...\n');
  const { data: updated, error: updateError } = await supabase
    .from('central_registrations')
    .update({ allow_guest_registration: true })
    .eq('id', reg.id)
    .select()
    .single();

  if (updateError) {
    console.error('❌ ERRO ao atualizar:', updateError);
    return;
  }

  console.log('✅ Atualizado com sucesso!');
  console.log(`   allow_guest_registration agora é: ${updated.allow_guest_registration}`);
}

testGuestUpdate().catch(console.error);
