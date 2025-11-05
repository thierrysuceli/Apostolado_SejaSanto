// Script para adicionar curso de teste
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔗 Conectando ao Supabase:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedTestCourse() {
  try {
    console.log('📚 Criando curso de teste...\n');

    // 1. Buscar o ID do admin
    const { data: admin } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@apostolado.com')
      .single();

    if (!admin) {
      console.error('❌ Admin não encontrado');
      return;
    }

    console.log('✅ Admin encontrado:', admin.id);

    // 2. Criar o curso
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: 'Introdução à Fé Católica',
        slug: 'introducao-fe-catolica',
        description: 'Um curso completo sobre os fundamentos da fé católica, explorando a Bíblia, a Tradição e o Magistério da Igreja.',
        cover_image_url: '/Apostolado_PNG.png',
        status: 'published'
      })
      .select()
      .single();

    if (courseError) {
      console.error('❌ Erro ao criar curso:', courseError);
      return;
    }

    console.log('✅ Curso criado:', course.id, '-', course.title);

    // 2.1. Buscar role INSCRITO e atribuir ao curso
    const { data: inscritoRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'INSCRITO')
      .single();

    if (inscritoRole) {
      await supabase
        .from('course_tags')
        .insert({
          course_id: course.id,
          role_id: inscritoRole.id
        });
      console.log('✅ Curso visível para INSCRITO');
    }

    // 3. Criar módulos
    const modules = [
      {
        course_id: course.id,
        title: 'Fundamentos da Fé',
        description: 'Aprenda os pilares fundamentais da fé católica',
        order_index: 1
      },
      {
        course_id: course.id,
        title: 'A Sagrada Escritura',
        description: 'Explore a Palavra de Deus e sua interpretação',
        order_index: 2
      },
      {
        course_id: course.id,
        title: 'Os Sacramentos',
        description: 'Conheça os sete sacramentos da Igreja',
        order_index: 3
      }
    ];

    const { data: createdModules, error: modulesError } = await supabase
      .from('modules')
      .insert(modules)
      .select();

    if (modulesError) {
      console.error('❌ Erro ao criar módulos:', modulesError);
      return;
    }

    console.log(`✅ ${createdModules.length} módulos criados`);

    // 4. Criar tópicos para cada módulo
    for (const module of createdModules) {
      const topics = [
        {
          module_id: module.id,
          course_id: course.id,
          title: `Aula 1 - ${module.title}`,
          content_before: `<h2>Bem-vindo à ${module.title}!</h2><p>Nesta aula, vamos explorar conceitos fundamentais sobre ${module.title}.</p>`,
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          content_after: `<h3>Conclusão</h3><p>Continue seus estudos no próximo tópico!</p>`,
          order_index: 1
        },
        {
          module_id: module.id,
          course_id: course.id,
          title: `Aula 2 - ${module.title}`,
          content_before: `<h2>Aprofundando em ${module.title}</h2><p>Vamos aprofundar nosso conhecimento.</p>`,
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          content_after: `<h3>Resumo</h3><p>Parabéns por completar esta aula!</p>`,
          order_index: 2
        }
      ];

      const { error: topicsError } = await supabase
        .from('topics')
        .insert(topics);

      if (topicsError) {
        console.error('❌ Erro ao criar tópicos:', topicsError);
      } else {
        console.log(`   ✅ 2 tópicos criados para módulo: ${module.title}`);
      }
    }

    // 5. Criar um post de teste
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        title: 'Bem-vindo ao Apostolado Seja Santo',
        slug: 'bem-vindo-apostolado',
        content: '<h2>Olá!</h2><p>Este é o primeiro post do nosso apostolado. Explore nossos cursos e conteúdos de formação católica.</p><p>Que Deus te abençoe!</p>',
        excerpt: 'Uma mensagem de boas-vindas ao nosso apostolado de formação católica.',
        cover_image_url: '/Apostolado_PNG.png',
        status: 'published',
        author_id: admin.id,
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (postError) {
      console.error('❌ Erro ao criar post:', postError);
    } else {
      console.log('✅ Post criado:', post.id, '-', post.title);
      
      // Atribuir post para role INSCRITO
      if (inscritoRole) {
        await supabase
          .from('post_tags')
          .insert({
            post_id: post.id,
            role_id: inscritoRole.id
          });
        console.log('✅ Post visível para INSCRITO');
      }
    }

    // 6. Criar um evento de teste
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        title: 'Encontro de Formação Católica',
        description: 'Um encontro especial para aprofundar nossa fé e conhecimento da doutrina católica.',
        start_date: '2025-11-15T19:00:00',
        end_date: '2025-11-15T21:00:00',
        location: 'Salão Paroquial',
        status: 'published'
      })
      .select()
      .single();

    if (eventError) {
      console.error('❌ Erro ao criar evento:', eventError);
    } else {
      console.log('✅ Evento criado:', event.id, '-', event.title);
    }

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📋 Resumo:');
    console.log('   - 1 curso criado');
    console.log('   - 3 módulos criados');
    console.log('   - 6 tópicos criados');
    console.log('   - 1 post criado');
    console.log('   - 1 evento criado\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

seedTestCourse();
