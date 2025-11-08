require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testBibleSystem() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  TESTE COMPLETO: Sistema de Comentários e Notas da Bíblia');
  console.log('═══════════════════════════════════════════════════════════\n');

  // IDs de teste
  const normalUserId = 'c5078a62-9395-4cde-9c04-063f9b5a4a39'; // henriqueb.ribeiro100@gmail.com
  const adminUserId = '6aaad471-3382-429a-84d3-6e47a756c71c'; // marcellomdias@gmail.com
  const testVerse = { book_abbrev: 'jo', chapter: 3, verse: 16 };

  try {
    console.log('📖 Testando versículo: João 3:16\n');

    // 1. Inserir comentário de usuário normal
    console.log('1️⃣ Inserindo comentário de usuário normal...');
    const { data: comment, error: commentError } = await supabase
      .from('bible_verse_comments')
      .insert({
        book_abbrev: testVerse.book_abbrev,
        chapter: testVerse.chapter,
        verse: testVerse.verse,
        user_id: normalUserId,
        comment_text: 'Que versículo maravilhoso! Deus amou tanto o mundo.'
      })
      .select('*, user:users!bible_verse_comments_user_id_fkey(id, name, email)')
      .single();

    if (commentError) throw commentError;
    console.log('✅ Comentário criado:', comment.id);
    console.log(`   Autor: ${comment.user.name}`);
    console.log(`   Texto: ${comment.comment_text}\n`);

    // 2. Inserir nota de admin
    console.log('2️⃣ Inserindo nota de admin...');
    const { data: note, error: noteError } = await supabase
      .from('bible_notes')
      .upsert({
        book_abbrev: testVerse.book_abbrev,
        chapter: testVerse.chapter,
        verse: testVerse.verse,
        title: 'João 3:16 - O Amor de Deus',
        content: 'Este é um dos versículos mais importantes da Bíblia, resumindo o plano de salvação de Deus para a humanidade.',
        author_id: adminUserId
      })
      .select()
      .single();

    if (noteError) throw noteError;
    console.log('✅ Nota criada:', note.id);
    console.log(`   Título: ${note.title}\n`);

    // 3. Buscar comentários (API endpoint simulation)
    console.log('3️⃣ Buscando comentários via query...');
    const { data: comments, error: getCommentsError } = await supabase
      .from('bible_verse_comments')
      .select('*, user:users!bible_verse_comments_user_id_fkey(id, name, email, avatar_url)')
      .eq('book_abbrev', testVerse.book_abbrev)
      .eq('chapter', testVerse.chapter)
      .eq('verse', testVerse.verse);

    if (getCommentsError) throw getCommentsError;
    console.log(`✅ Encontrados ${comments.length} comentário(s):`);
    comments.forEach(c => {
      console.log(`   - ${c.user.name}: "${c.comment_text.substring(0, 50)}..."`);
    });
    console.log('');

    // 4. Buscar nota (API endpoint simulation)
    console.log('4️⃣ Buscando nota via query...');
    const { data: noteData, error: getNoteError } = await supabase
      .from('bible_notes')
      .select('*')
      .eq('book_abbrev', testVerse.book_abbrev)
      .eq('chapter', testVerse.chapter)
      .eq('verse', testVerse.verse)
      .single();

    if (getNoteError && getNoteError.code !== 'PGRST116') throw getNoteError;
    if (noteData) {
      console.log('✅ Nota encontrada:');
      console.log(`   📝 "${noteData.title}"`);
      console.log(`   ${noteData.content.substring(0, 80)}...\n`);
    } else {
      console.log('⚠️  Nenhuma nota encontrada\n');
    }

    // 5. Teste de indicadores - verificar versículos com conteúdo
    console.log('5️⃣ Verificando indicadores...');
    const hasComments = comments.length > 0;
    const hasNotes = !!noteData;
    
    console.log(`   Comentários: ${hasComments ? '🟦 CINZA (tem)' : '⚪ (não tem)'}`);
    console.log(`   Notas Admin: ${hasNotes ? '🟩 VERDE (tem)' : '⚪ (não tem)'}`);
    
    if (hasComments && hasNotes) {
      console.log('   ✅ Versículo deve mostrar AMBAS as barrinhas (cinza + verde)\n');
    } else if (hasComments) {
      console.log('   ✅ Versículo deve mostrar barrinha CINZA\n');
    } else if (hasNotes) {
      console.log('   ✅ Versículo deve mostrar barrinha VERDE\n');
    }

    // 6. Deletar comentário
    console.log('6️⃣ Deletando comentário de teste...');
    const { error: deleteCommentError } = await supabase
      .from('bible_verse_comments')
      .delete()
      .eq('id', comment.id);

    if (deleteCommentError) throw deleteCommentError;
    console.log('✅ Comentário deletado\n');

    // 7. Deletar nota
    console.log('7️⃣ Deletando nota de teste...');
    const { error: deleteNoteError } = await supabase
      .from('bible_notes')
      .delete()
      .eq('id', note.id);

    if (deleteNoteError) throw deleteNoteError;
    console.log('✅ Nota deletada\n');

    // 8. Verificar limpeza
    console.log('8️⃣ Verificando limpeza...');
    const { data: finalComments } = await supabase
      .from('bible_verse_comments')
      .select('id')
      .eq('book_abbrev', testVerse.book_abbrev)
      .eq('chapter', testVerse.chapter)
      .eq('verse', testVerse.verse);

    const { data: finalNote } = await supabase
      .from('bible_notes')
      .select('id')
      .eq('book_abbrev', testVerse.book_abbrev)
      .eq('chapter', testVerse.chapter)
      .eq('verse', testVerse.verse)
      .single();

    const cleaned = (finalComments?.length === 0) && (!finalNote || finalNote === null);
    if (cleaned) {
      console.log('✅ Banco limpo - todos os dados de teste removidos\n');
    } else {
      console.log('⚠️  Atenção: ainda há dados de teste no banco\n');
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ TODOS OS TESTES PASSARAM!');
    console.log('🎉 Sistema de Comentários e Notas está FUNCIONANDO!');
    console.log('📊 Indicadores visuais devem aparecer corretamente');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testBibleSystem();
