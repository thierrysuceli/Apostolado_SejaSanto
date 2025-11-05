// Script para aplicar migration
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function applyMigration() {
  try {
    console.log('📝 Verificando estrutura das tabelas...\n');

    // Verificar cursos
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);

    if (!coursesError && courses) {
      console.log('✅ Tabela courses acessível');
      console.log('   Colunas:', Object.keys(courses[0] || {}));
    }

    // Verificar posts  
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);

    if (!postsError && posts) {
      console.log('✅ Tabela posts acessível');
      console.log('   Colunas:', Object.keys(posts[0] || {}));
    }

    console.log('\n📝 Aplicando atualizações via SDK...\n');

    // Atualizar curso de teste com categoria
    const { data: updatedCourse, error: courseError } = await supabase
      .from('courses')
      .update({ 
        category: 'Teologia',
        cover_image_url: '/Apostolado_PNG.png'
      })
      .eq('slug', 'introducao-fe-catolica')
      .select();

    if (courseError) {
      console.log('⚠️  Erro ao atualizar curso:', courseError.message);
      console.log('   Detalhes:', courseError);
    } else {
      console.log('✅ Curso atualizado:', updatedCourse?.length, 'registro(s)');
    }

    // Atualizar post de teste com categoria
    const { data: updatedPost, error: postError } = await supabase
      .from('posts')
      .update({ 
        category: 'Avisos',
        cover_image_url: '/Apostolado_PNG.png'
      })
      .eq('slug', 'bem-vindo-apostolado')
      .select();

    if (postError) {
      console.log('⚠️  Erro ao atualizar post:', postError.message);
      console.log('   Detalhes:', postError);
    } else {
      console.log('✅ Post atualizado:', updatedPost?.length, 'registro(s)');
    }

    console.log('\n🎉 Atualização concluída!\n');
    console.log('ℹ️  Se as colunas category não existem, você precisa adicioná-las via Supabase Dashboard:');
    console.log('   1. Vá para https://supabase.com/dashboard');
    console.log('   2. Abra Table Editor');
    console.log('   3. Para tabela "courses": Adicione coluna "category" tipo TEXT');
    console.log('   4. Para tabela "posts": Adicione coluna "category" tipo TEXT\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

applyMigration();
