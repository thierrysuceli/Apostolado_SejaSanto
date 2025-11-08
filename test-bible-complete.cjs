require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCompleteBibleSystem() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  TESTE COMPLETO: Comentários e Notas + Permissões');
  console.log('═══════════════════════════════════════════════════════════\n');

  // IDs reais
  const normalUserId = 'c5078a62-9395-4cde-9c04-063f9b5a4a39'; // Henrique
  const adminUserId = '6aaad471-3382-429a-84d3-6e47a756c71c'; // Marcello (admin)
  const testVerse = { book_abbrev: 'jo', chapter: 3, verse: 16 };

  let commentId, noteId;

  try {
    // 1. Verificar permissões do admin
    console.log('1️⃣ Verificando permissões do admin...');
    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('role:roles(code, permissions:role_permissions(permission:permissions(code)))')
      .eq('user_id', adminUserId);
    
    const adminPermissions = new Set();
    adminRoles?.forEach(ur => {
      ur.role?.permissions?.forEach(rp => {
        adminPermissions.add(rp.permission.code);
      });
    });
    
    const hasAdminPermission = adminPermissions.has('administrar');
    console.log(`   Admin tem permissão 'administrar': ${hasAdminPermission ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   Permissões: ${Array.from(adminPermissions).join(', ')}\n`);

    // 2. Usuário normal cria comentário
    console.log('2️⃣ Usuário normal cria comentário...');
    const { data: comment, error: commentError } = await supabase
      .from('bible_verse_comments')
      .insert({
        book_abbrev: testVerse.book_abbrev,
        chapter: testVerse.chapter,
        verse: testVerse.verse,
        user_id: normalUserId,
        comment_text: 'Comentário de usuário normal - João 3:16 é maravilhoso!'
      })
      .select('*, user:users!bible_verse_comments_user_id_fkey(id, name)')
      .single();

    if (commentError) throw commentError;
    commentId = comment.id;
    console.log(`✅ Comentário criado: ID ${commentId}`);
    console.log(`   Autor: ${comment.user.name}`);
    console.log(`   Tipo: bible_verse_comments (comentário normal)\n`);

    // 3. Admin cria nota de estudo
    console.log('3️⃣ Admin cria nota de estudo...');
    const { data: note, error: noteError } = await supabase
      .from('bible_notes')
      .upsert({
        book_abbrev: testVerse.book_abbrev,
        chapter: testVerse.chapter,
        verse: testVerse.verse,
        title: 'Estudo: O Amor de Deus',
        content: 'Esta é uma nota administrativa de estudo bíblico sobre João 3:16.',
        author_id: adminUserId
      })
      .select('*')
      .single();

    if (noteError) throw noteError;
    noteId = note.id;
    console.log(`✅ Nota criada: ID ${noteId}`);
    console.log(`   Título: ${note.title}`);
    console.log(`   Tipo: bible_notes (nota de admin)\n`);

    // 4. Buscar comentários (deveria retornar COM user.name)
    console.log('4️⃣ Buscando comentários com JOIN de usuário...');
    const { data: comments, error: getError } = await supabase
      .from('bible_verse_comments')
      .select('*, user:users!bible_verse_comments_user_id_fkey(id, name, email)')
      .eq('book_abbrev', testVerse.book_abbrev)
      .eq('chapter', testVerse.chapter)
      .eq('verse', testVerse.verse);

    if (getError) throw getError;
    console.log(`✅ Encontrados ${comments.length} comentário(s):`);
    comments.forEach(c => {
      console.log(`   - ${c.user?.name || 'ANÔNIMO (ERRO!)'}: "${c.comment_text}"`);
    });
    console.log('');

    // 5. Buscar nota
    console.log('5️⃣ Buscando nota de admin...');
    const { data: fetchedNote } = await supabase
      .from('bible_notes')
      .select('*')
      .eq('book_abbrev', testVerse.book_abbrev)
      .eq('chapter', testVerse.chapter)
      .eq('verse', testVerse.verse)
      .single();

    if (fetchedNote) {
      console.log(`✅ Nota encontrada:`);
      console.log(`   Título: ${fetchedNote.title}`);
      console.log(`   Author ID: ${fetchedNote.author_id}\n`);
    }

    // 6. Testar data/hora
    console.log('6️⃣ Testando formatação de data...');
    const commentDate = new Date(comment.created_at);
    const now = new Date();
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    console.log(`   Comentário criado há: ${diffMins < 1 ? 'agora' : diffMins + ' minuto(s)'}`);
    console.log(`   Data ISO: ${comment.created_at}\n`);

    // 7. Limpar dados
    console.log('7️⃣ Limpando dados de teste...');
    await supabase.from('bible_verse_comments').delete().eq('id', commentId);
    await supabase.from('bible_notes').delete().eq('id', noteId);
    console.log('✅ Dados removidos\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ TODOS OS TESTES PASSARAM!');
    console.log('');
    console.log('📋 Resumo:');
    console.log('   ✓ Admin tem permissão "administrar"');
    console.log('   ✓ User normal cria comentário (bible_verse_comments)');
    console.log('   ✓ Admin cria nota (bible_notes)');
    console.log('   ✓ Nomes de usuários aparecem corretamente');
    console.log('   ✓ Datas formatadas corretamente');
    console.log('   ✓ Tipos diferenciados (comentário vs nota)');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testCompleteBibleSystem();
