// Teste real das APIs problemáticas
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltam variáveis de ambiente!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTopicWithCourse() {
  console.log('\n🧪 TESTE 1: Buscar tópico com JOIN de curso\n');
  
  // Pegar qualquer tópico
  const { data: topics } = await supabase
    .from('topics')
    .select('id')
    .limit(1);
  
  if (!topics || topics.length === 0) {
    console.log('❌ Nenhum tópico encontrado!');
    return;
  }
  
  const topicId = topics[0].id;
  console.log(`📝 Testando com topic ID: ${topicId}`);
  
  // Buscar SEM JOIN (como estava antes)
  const { data: topicSemJoin, error: err1 } = await supabase
    .from('topics')
    .select('*')
    .eq('id', topicId)
    .single();
  
  console.log('\n❌ SEM JOIN (ERRADO):');
  console.log('Tem modules?', !!topicSemJoin?.modules);
  console.log('Tem courses?', !!topicSemJoin?.courses);
  
  // Buscar COM JOIN (como corrigi)
  const { data: topicComJoin, error: err2 } = await supabase
    .from('topics')
    .select(`
      *,
      modules!inner(
        id,
        title,
        course_id,
        courses!inner(
          id,
          title,
          description,
          cover_image_url
        )
      )
    `)
    .eq('id', topicId)
    .single();
  
  console.log('\n✅ COM JOIN (CORRETO):');
  console.log('Tem modules?', !!topicComJoin?.modules);
  console.log('Tem courses?', !!topicComJoin?.modules?.courses);
  console.log('Course ID:', topicComJoin?.modules?.courses?.id);
  console.log('Course title:', topicComJoin?.modules?.courses?.title);
  
  return topicComJoin;
}

async function testSaveCourseProgress(topicData) {
  console.log('\n\n🧪 TESTE 2: Salvar progresso do curso\n');
  
  if (!topicData?.modules?.courses?.id) {
    console.log('❌ Não tem dados do curso para testar!');
    return;
  }
  
  // Pegar um usuário qualquer
  const { data: users } = await supabase
    .from('users')
    .select('id, email')
    .limit(1);
  
  if (!users || users.length === 0) {
    console.log('❌ Nenhum usuário encontrado!');
    return;
  }
  
  const userId = users[0].id;
  console.log(`👤 Testando com user: ${users[0].email}`);
  console.log(`📚 Course ID: ${topicData.modules.courses.id}`);
  console.log(`📝 Topic ID: ${topicData.id}`);
  
  // Tentar salvar progresso
  const { data, error } = await supabase
    .from('user_course_progress')
    .upsert(
      {
        user_id: userId,
        course_id: topicData.modules.courses.id,
        topic_id: topicData.id,
        progress_seconds: 0,
        completed: false,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'user_id, course_id'
      }
    )
    .select()
    .single();
  
  if (error) {
    console.log('❌ ERRO ao salvar:', error.message);
    console.log('Código:', error.code);
    console.log('Detalhes:', error.details);
  } else {
    console.log('✅ PROGRESSO SALVO COM SUCESSO!');
    console.log('ID:', data.id);
    console.log('User ID:', data.user_id);
    console.log('Course ID:', data.course_id);
    console.log('Topic ID:', data.topic_id);
  }
}

async function testPublicEvents() {
  console.log('\n\n🧪 TESTE 3: Buscar eventos públicos para Recentes\n');
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(5);
  
  if (error) {
    console.log('❌ ERRO:', error.message);
  } else {
    console.log(`✅ Encontrados ${data.length} eventos`);
    if (data.length > 0) {
      console.log('Exemplo:', data[0].title, '-', data[0].date);
    } else {
      console.log('⚠️ Nenhum evento futuro cadastrado!');
    }
  }
}

async function runAllTests() {
  console.log('🚀 INICIANDO TESTES DAS APIs\n');
  console.log('='.repeat(60));
  
  try {
    const topicData = await testTopicWithCourse();
    await testSaveCourseProgress(topicData);
    await testPublicEvents();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TESTES CONCLUÍDOS!\n');
  } catch (err) {
    console.error('❌ ERRO GERAL:', err);
  }
}

runAllTests();
