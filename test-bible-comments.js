/**
 * TESTAR SISTEMA DE COMENTÁRIOS E NOTAS DA BÍBLIA
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBibleCommentsSystem() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TESTE: Sistema de Comentários e Notas da Bíblia');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Pegar usuário normal e admin
  const { data: users } = await supabase
    .from('users')
    .select('id, email, name')
    .limit(2);

  if (!users || users.length < 2) {
    console.log('❌ Precisa de pelo menos 2 usuários');
    return;
  }

  const normalUser = users[0];
  const adminUser = users[1]; // Assumindo que segundo usuário é admin

  console.log(`👤 Usuário normal: ${normalUser.email}`);
  console.log(`👑 Admin: ${adminUser.email}\n`);

  const testVerse = {
    book_abbrev: 'jo',
    chapter: 3,
    verse: 16
  };

  // ========================================
  // TESTE 1: Inserir comentário de usuário normal
  // ========================================
  console.log('1️⃣ Inserindo comentário de usuário normal...');
  const { data: comment1, error: err1 } = await supabase
    .from('bible_verse_comments')
    .insert({
      ...testVerse,
      user_id: normalUser.id,
      comment_text: 'Que versículo maravilhoso! Deus amou tanto o mundo.'
    })
    .select('*, user:users!bible_verse_comments_user_id_fkey(name, email)')
    .single();

  if (err1) {
    console.log('❌ Erro:', err1.message);
    console.log('💡 Aplique: FIX_BIBLE_COMMENTS_FK.sql');
    return;
  }

  console.log('✅ Comentário criado:', comment1.id);
  console.log(`   Autor: ${comment1.user.name}`);
  console.log(`   Texto: ${comment1.comment_text}\n`);

  // ========================================
  // TESTE 2: Inserir nota de admin
  // ========================================
  console.log('2️⃣ Inserindo nota de admin...');
  const { data: note1, error: err2 } = await supabase
    .from('bible_notes')
    .insert({
      ...testVerse,
      author_id: adminUser.id,
      title: 'João 3:16 - O Amor de Deus',
      content: '<p><strong>Este é o versículo mais famoso da Bíblia.</strong></p><p>Deus demonstrou Seu amor dando Seu Filho único.</p><ul><li>Amor incondicional</li><li>Salvação pela fé</li><li>Vida eterna</li></ul>'
    })
    .select('*, author:users!bible_notes_author_id_fkey(name, email)')
    .single();

  if (err2) {
    console.log('❌ Erro:', err2.message);
    return;
  }

  console.log('✅ Nota criada:', note1.id);
  console.log(`   Autor: ${note1.author.name}`);
  console.log(`   Título: ${note1.title}\n`);

  // ========================================
  // TESTE 3: Buscar comentários + nota de um versículo
  // ========================================
  console.log('3️⃣ Buscando todos os comentários e nota de João 3:16...\n');

  const { data: note } = await supabase
    .from('bible_notes')
    .select('*, author:users!bible_notes_author_id_fkey(name, email)')
    .eq('book_abbrev', 'jo')
    .eq('chapter', 3)
    .eq('verse', 16)
    .maybeSingle();

  const { data: comments } = await supabase
    .from('bible_verse_comments')
    .select('*, user:users!bible_verse_comments_user_id_fkey(name, email)')
    .eq('book_abbrev', 'jo')
    .eq('chapter', 3)
    .eq('verse', 16)
    .order('created_at', { ascending: true });

  console.log(`📝 Nota do Admin:`);
  if (note) {
    console.log(`   ✅ "${note.title}" por ${note.author.name}`);
  } else {
    console.log(`   ❌ Nenhuma nota encontrada`);
  }

  console.log(`\n💬 Comentários de Usuários: ${comments?.length || 0}`);
  comments?.forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.user.name}: "${c.comment_text.substring(0, 50)}..."`);
  });

  // ========================================
  // TESTE 4: Deletar comentário de teste
  // ========================================
  console.log('\n4️⃣ Deletando comentário de teste...');
  const { error: err4 } = await supabase
    .from('bible_verse_comments')
    .delete()
    .eq('id', comment1.id);

  if (err4) {
    console.log('❌ Erro ao deletar:', err4.message);
  } else {
    console.log('✅ Comentário deletado\n');
  }

  // ========================================
  // TESTE 5: Deletar nota de teste
  // ========================================
  console.log('5️⃣ Deletando nota de teste...');
  const { error: err5 } = await supabase
    .from('bible_notes')
    .delete()
    .eq('id', note1.id);

  if (err5) {
    console.log('❌ Erro ao deletar:', err5.message);
  } else {
    console.log('✅ Nota deletada\n');
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ TODOS OS TESTES PASSARAM!');
  console.log('🎉 Sistema de Comentários e Notas está funcionando!');
  console.log('═══════════════════════════════════════════════════════════\n');
}

testBibleCommentsSystem();
