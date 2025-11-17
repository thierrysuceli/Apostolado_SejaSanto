require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function insertBible() {
  try {
    console.log('📖 Carregando Bíblia Ave Maria...\n');
    
    // Carregar JSON
    const bibliaData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'bibliaAveMaria.json'), 'utf-8')
    );
    
    // Combinar AT + NT
    const bibliaJSON = [
      ...bibliaData.antigoTestamento.map(b => ({ ...b, testament: 'Antigo Testamento' })),
      ...bibliaData.novoTestamento.map(b => ({ ...b, testament: 'Novo Testamento' }))
    ];
    
    console.log(`✅ JSON carregado: ${bibliaJSON.length} livros\n`);
    
    // Mapa de abreviações
    const abbrevMap = {
      'Gênesis': 'Gn', 'Êxodo': 'Ex', 'Levítico': 'Lv', 'Números': 'Nm', 'Deuteronômio': 'Dt',
      'Josué': 'Js', 'Juízes': 'Jz', 'Rute': 'Rt', '1 Samuel': '1Sm', '2 Samuel': '2Sm',
      '1 Reis': '1Rs', '2 Reis': '2Rs', '1 Crônicas': '1Cr', '2 Crônicas': '2Cr',
      'Esdras': 'Esd', 'Neemias': 'Ne', 'Tobias': 'Tb', 'Judite': 'Jt', 'Ester': 'Est',
      'Jó': 'Jó', 'Salmos': 'Sl', 'Provérbios': 'Pr', 'Eclesiastes': 'Ecl', 'Cântico dos Cânticos': 'Ct',
      'Sabedoria': 'Sb', 'Eclesiástico': 'Eclo', 'Isaías': 'Is', 'Jeremias': 'Jr', 'Lamentações': 'Lm',
      'Baruc': 'Br', 'Ezequiel': 'Ez', 'Daniel': 'Dn', 'Oseias': 'Os', 'Joel': 'Jl',
      'Amós': 'Am', 'Abdias': 'Ab', 'Jonas': 'Jn', 'Miqueias': 'Mq', 'Naum': 'Na',
      'Habacuc': 'Hab', 'Sofonias': 'Sf', 'Ageu': 'Ag', 'Zacarias': 'Zc', 'Malaquias': 'Ml',
      '1 Macabeus': '1Mb', '2 Macabeus': '2Mb',
      'Mateus': 'Mt', 'Marcos': 'Mc', 'Lucas': 'Lc', 'João': 'Jo', 'Atos dos Apóstolos': 'At',
      'Romanos': 'Rm', '1 Coríntios': '1Cor', '2 Coríntios': '2Cor', 'Gálatas': 'Gl',
      'Efésios': 'Ef', 'Filipenses': 'Fl', 'Colossenses': 'Cl', '1 Tessalonicenses': '1Ts',
      '2 Tessalonicenses': '2Ts', '1 Timóteo': '1Tm', '2 Timóteo': '2Tm', 'Tito': 'Tt',
      'Filemon': 'Fm', 'Hebreus': 'Hb', 'Tiago': 'Tg', '1 Pedro': '1Pd', '2 Pedro': '2Pd',
      '1 João': '1Jo', '2 João': '2Jo', '3 João': '3Jo', 'Judas': 'Jd', 'Apocalipse': 'Ap'
    };
    
    // 1. LIMPAR DADOS ANTIGOS
    console.log('🗑️  Limpando dados antigos...');
    const { data: oldVerses } = await supabase.from('bible_verses').select('id').limit(1);
    if (oldVerses && oldVerses.length > 0) {
      await supabase.from('bible_verses').delete().gt('id', 0);
    }
    const { data: oldChapters } = await supabase.from('bible_chapters').select('id').limit(1);
    if (oldChapters && oldChapters.length > 0) {
      await supabase.from('bible_chapters').delete().gt('id', 0);
    }
    const { data: oldBooks } = await supabase.from('bible_books').select('id').limit(1);
    if (oldBooks && oldBooks.length > 0) {
      await supabase.from('bible_books').delete().gt('id', 0);
    }
    console.log('✅ Limpeza concluída!\n');
    
    // 2. INSERIR LIVROS
    console.log('📚 Inserindo livros...');
    const booksToInsert = bibliaJSON.map((livro, idx) => ({
      abbrev: abbrevMap[livro.nome] || livro.nome.substring(0, 3),
      name: livro.nome,
      testament: livro.testament,
      book_order: idx + 1,
      total_chapters: livro.capitulos.length
    }));
    
    const { data: insertedBooks, error: booksError } = await supabase
      .from('bible_books')
      .insert(booksToInsert)
      .select();
      
    if (booksError) throw new Error(`Erro inserindo livros: ${booksError.message}`);
    console.log(`✅ ${insertedBooks.length} livros inseridos!\n`);
    
    // 3. INSERIR CAPÍTULOS E VERSÍCULOS POR LIVRO
    let totalChapters = 0;
    let totalVerses = 0;
    
    for (let i = 0; i < bibliaJSON.length; i++) {
      const livro = bibliaJSON[i];
      const bookData = insertedBooks[i];
      
      console.log(`[${i + 1}/${bibliaJSON.length}] ${livro.nome} (${bookData.abbrev})...`);
      
      // Inserir todos os capítulos deste livro
      const chaptersToInsert = livro.capitulos.map(cap => ({
        book_id: bookData.id,
        chapter_number: cap.capitulo,
        total_verses: cap.versiculos.length
      }));
      
      const { data: insertedChapters, error: chapError } = await supabase
        .from('bible_chapters')
        .insert(chaptersToInsert)
        .select();
        
      if (chapError) {
        console.log(`  ❌ Erro inserindo capítulos: ${chapError.message}`);
        continue;
      }
      
      totalChapters += insertedChapters.length;
      
      // Inserir versículos capítulo por capítulo
      for (const cap of livro.capitulos) {
        const chapterData = insertedChapters.find(ch => ch.chapter_number === cap.capitulo);
        
        if (!chapterData) {
          console.log(`  ⚠️  Capítulo ${cap.capitulo} não encontrado`);
          continue;
        }
        
        // Versículos em lotes de 500
        const versesToInsert = cap.versiculos.map(v => ({
          chapter_id: chapterData.id,
          verse_number: v.versiculo,
          text: v.texto
        }));
        
        // Inserir em lotes
        for (let j = 0; j < versesToInsert.length; j += 500) {
          const batch = versesToInsert.slice(j, j + 500);
          const { error: verseError } = await supabase
            .from('bible_verses')
            .insert(batch);
            
          if (verseError) {
            console.log(`  ❌ Erro inserindo versículos: ${verseError.message}`);
            break;
          }
        }
        
        totalVerses += versesToInsert.length;
      }
      
      console.log(`  ✅ ${insertedChapters.length} caps, ${livro.capitulos.reduce((acc, c) => acc + c.versiculos.length, 0)} vv`);
    }
    
    console.log('\n=================================================');
    console.log('🎉 Migração concluída!');
    console.log(`📊 Total: ${insertedBooks.length} livros, ${totalChapters} capítulos, ${totalVerses} versículos`);
    console.log('=================================================\n');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

insertBible();
