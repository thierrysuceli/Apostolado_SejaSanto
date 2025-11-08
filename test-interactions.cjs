// Test script para testar votação e inscrições via API
require('dotenv').config();

const API_URL = 'http://localhost:5173';
const TEST_USER_ID = '682d9aee-e01d-4cc8-b1ad-9bc5c1b2aa0c'; // Administrador

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

async function testVotePoll() {
  console.log('\n=== TESTE: Votar em Enquete ===\n');
  
  try {
    // 1. Buscar enquetes disponíveis
    console.log('1. Buscando grupos com enquetes...');
    const {ok: groupsOk, data: groupsData} = await fetchJSON(`${API_URL}/api/central/groups-consolidated`);
    
    if (!groupsOk || !groupsData.groups || groupsData.groups.length === 0) {
      console.log('❌ Nenhum grupo encontrado');
      return;
    }
    
    // Encontrar primeira enquete
    let testPoll = null;
    let testGroup = null;
    
    for (const group of groupsData.groups) {
      if (group.polls && group.polls.length > 0) {
        testPoll = group.polls[0];
        testGroup = group;
        break;
      }
    }
    
    if (!testPoll) {
      console.log('❌ Nenhuma enquete encontrada nos grupos');
      return;
    }
    
    console.log(`✓ Enquete encontrada: "${testPoll.question}" (ID: ${testPoll.id})`);
    console.log(`  Grupo: ${testGroup.name}`);
    console.log(`  Opções:`, testPoll.options.map(o => o.text));
    console.log(`  Já votou: ${testPoll.user_voted}`);
    console.log(`  Total votos: ${testPoll.total_votes}`);
    
    // 2. Testar votação
    if (!testPoll.user_voted) {
      console.log('\n2. Testando votação...');
      const firstOptionId = testPoll.options[0].id;
      
      const {ok: voteOk, data: voteData} = await fetchJSON(`${API_URL}/api/central/polls/${testPoll.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          option_ids: [firstOptionId]
        })
      });
      
      if (voteOk) {
        console.log(`✓ Voto registrado com sucesso!`);
        console.log(`  Opção votada: ${testPoll.options[0].text}`);
        console.log(`  Resposta:`, voteData);
      } else {
        console.log(`❌ Erro ao votar:`, voteData);
      }
    } else {
      console.log('\n⚠️  Usuário já votou nesta enquete');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de votação:', error.message);
  }
}

async function testSubscribeRegistration() {
  console.log('\n=== TESTE: Inscrever em Registro ===\n');
  
  try {
    // 1. Buscar registrations disponíveis
    console.log('1. Buscando grupos com inscrições...');
    const {ok: groupsOk, data: groupsData} = await fetchJSON(`${API_URL}/api/central/groups-consolidated`);
    
    if (!groupsOk || !groupsData.groups || groupsData.groups.length === 0) {
      console.log('❌ Nenhum grupo encontrado');
      return;
    }
    
    // Encontrar primeira registration
    let testReg = null;
    let testGroup = null;
    
    for (const group of groupsData.groups) {
      if (group.registrations && group.registrations.length > 0) {
        testReg = group.registrations[0];
        testGroup = group;
        break;
      }
    }
    
    if (!testReg) {
      console.log('❌ Nenhuma inscrição encontrada nos grupos');
      return;
    }
    
    console.log(`✓ Inscrição encontrada: "${testReg.title}" (ID: ${testReg.id})`);
    console.log(`  Grupo: ${testGroup.name}`);
    console.log(`  Está aberta: ${testReg.is_open}`);
    console.log(`  Está cheia: ${testReg.is_full}`);
    console.log(`  Já inscrito: ${testReg.user_subscribed}`);
    console.log(`  Participantes: ${testReg.approved_count}${testReg.max_participants ? `/${testReg.max_participants}` : ''}`);
    
    // 2. Testar inscrição
    if (!testReg.user_subscribed && testReg.is_open && !testReg.is_full) {
      console.log('\n2. Testando inscrição...');
      
      const {ok: subscribeOk, data: subscribeData} = await fetchJSON(`${API_URL}/api/central/registrations/${testReg.id}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (subscribeOk) {
        console.log(`✓ Inscrição realizada com sucesso!`);
        console.log(`  Resposta:`, subscribeData);
      } else {
        console.log(`❌ Erro ao se inscrever:`, subscribeData);
      }
    } else {
      if (testReg.user_subscribed) {
        console.log('\n⚠️  Usuário já inscrito');
      } else if (!testReg.is_open) {
        console.log('\n⚠️  Inscrições encerradas');
      } else if (testReg.is_full) {
        console.log('\n⚠️  Vagas esgotadas');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de inscrição:', error.message);
  }
}

async function testRecentActivities() {
  console.log('\n=== TESTE: Buscar Atividades Recentes ===\n');
  
  try {
    const {ok: groupsOk, data: groupsData} = await fetchJSON(`${API_URL}/api/central/groups-consolidated`);
    
    if (!groupsOk) {
      console.log('❌ Erro ao buscar grupos');
      return;
    }
    
    console.log(`✓ Total de grupos: ${groupsData.groups?.length || 0}`);
    
    let totalPosts = 0;
    let totalPolls = 0;
    let totalRegs = 0;
    
    groupsData.groups?.forEach(group => {
      totalPosts += group.posts?.length || 0;
      totalPolls += group.polls?.length || 0;
      totalRegs += group.registrations?.length || 0;
      
      console.log(`\n📁 ${group.emoji} ${group.name}`);
      console.log(`   Posts: ${group.posts?.length || 0}`);
      console.log(`   Enquetes: ${group.polls?.length || 0}`);
      console.log(`   Inscrições: ${group.registrations?.length || 0}`);
    });
    
    console.log(`\n📊 RESUMO:`);
    console.log(`   Total Posts: ${totalPosts}`);
    console.log(`   Total Enquetes: ${totalPolls}`);
    console.log(`   Total Inscrições: ${totalRegs}`);
    console.log(`   Total Atividades: ${totalPosts + totalPolls + totalRegs}`);
    
  } catch (error) {
    console.error('❌ Erro ao buscar atividades:', error.message);
  }
}

// Executar testes
(async () => {
  console.log('🧪 INICIANDO TESTES DE INTERAÇÕES\n');
  console.log(`API URL: ${API_URL}`);
  console.log(`User ID: ${TEST_USER_ID}\n`);
  
  await testRecentActivities();
  await testVotePoll();
  await testSubscribeRegistration();
  
  console.log('\n✅ TESTES CONCLUÍDOS\n');
})();
