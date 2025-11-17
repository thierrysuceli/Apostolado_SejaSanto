require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapa de abreviações baseado nos nomes EXATOS do biblia.json
const BOOK_ABBREVS = {
  // Antigo Testamento (46 livros)
  'Gênesis': 'Gn',
  'Êxodo': 'Ex',
  'Levítico': 'Lv',
  'Números': 'Nm',
  'Deuteronómio': 'Dt',
  'Livro de Josué': 'Js',
  'Livro dos Juízes': 'Jz',
  'Livro de Rute': 'Rt',
  'Livro Primeiro de Samuel': '1Sm',
  'Livro Segundo de Samuel': '2Sm',
  'Livro Primeiro dos Reis': '1Rs',
  'Livro Segundo dos Reis': '2Rs',
  'Livro Primeiro das Crónicas': '1Cr',
  'Livro Segundo das Crónicas': '2Cr',
  'Livro de Esdras': 'Esd',
  'Livro de Neemias': 'Ne',
  'Livro de Tobias': 'Tb',
  'Livro de Judit': 'Jt',
  'Livro de Ester': 'Est',
  'Livro Primeiro dos Macabeus': '1Mc',
  'Livro Segundo dos Macabeus': '2Mc',
  'Livro de Job (Jó)': 'Jó',
  'Salmos': 'Sl',
  'Livro dos Provérbios': 'Pr',
  'Livro do Eclesiaste': 'Ecl',
  'Cânticos dos Cânticos': 'Ct',
  'Livro da Sabedoria': 'Sb',
  'Eclesiástico': 'Eclo',
  'Profecia de Isaías': 'Is',
  'Profecia de Jeremias': 'Jr',
  'Trenos ou Lamentações de Jeremias': 'Lm',
  'Profecia de Baruch': 'Br',
  'Profecia de Ezequiel': 'Ez',
  'Profecia de Daniel': 'Dn',
  'Oseias': 'Os',
  'Profecia de Joel': 'Jl',
  'Profecia de Amós': 'Am',
  'Profecia de Abdias': 'Abd',
  'Profecia de Jonas': 'Jn',
  'Profecia de Miqueias': 'Mq',
  'Profecia de Naum': 'Na',
  'Profecia de Habucuc': 'Hab',
  'Profecia de Sofonias': 'Sf',
  'Profecia de Ageu': 'Ag',
  'Profecia de Zacarias': 'Zc',
  'Profecia de Malaquias': 'Ml',
  // Novo Testamento (27 livros)
  'Evangelho segundo S. Mateus': 'Mt',
  'Evangelho segundo S. Marcos': 'Mc',
  'Evangelho segundo S. Lucas': 'Lc',
  'Evangelho segundo S. João': 'Jo',
  'Atos dos Apóstolos': 'At',
  'Epístola aos Romanos': 'Rm',
  'Primeira Epístola aos Coríntios': '1Cor',
  'Segunda Epístola aos Coríntios': '2Cor',
  'Epístola aos Galatas': 'Gl',
  'Epístola aos Efésios': 'Ef',
  'Epístola aos Filipenses': 'Fp',
  'Epístola aos Colossenses': 'Cl',
  'Primeira Epístola aos Tessalonicenses': '1Ts',
  'Segunda Epístola aos Tessalonicenses': '2Ts',
  'Primeira Epístola a Timóteo': '1Tm',
  'Segunda Epístola a Timóteo': '2Tm',
  'Epístola a Títo': 'Tt',
  'Epístola a Filémon': 'Fm',
  'Epístola aos Hebreus': 'Hb',
  'Epístola de S. Tiago': 'Tg',
  'Primeira Epístola de S. Pedro': '1Pd',
  'Segunda Epístola de S. Pedro': '2Pd',
  'Primeira Epístola de S. João': '1Jo',
  'Segunda Epístolas de S. João': '2Jo',
  'Terceira Epístolas de S. João': '3Jo',
  'Epístola de S. Judas': 'Jd',
  'Apocalipse de S. João': 'Ap'
};

const OLD_TESTAMENT = ['Gn', 'Ex', 'Lv', 'Nm', 'Dt', 'Js', 'Jz', 'Rt', '1Sm', '2Sm', 
  '1Rs', '2Rs', '1Cr', '2Cr', 'Esd', 'Ne', 'Tb', 'Jt', 'Est', '1Mc', '2Mc', 'Jó', 
  'Sl', 'Pr', 'Ecl', 'Ct', 'Sb', 'Eclo', 'Is', 'Jr', 'Lm', 'Br', 'Ez', 'Dn', 'Os', 
  'Jl', 'Am', 'Abd', 'Jn', 'Mq', 'Na', 'Hab', 'Sf', 'Ag', 'Zc', 'Ml'];

async function insertBible() {
  try {
    console.log('📖 Inserindo Bíblia Pe. Matos Soares (1956)...\n');
    
    // Carregar JSON do GitHub
    const bibliaJSON = JSON.parse(fs.readFileSync('biblia.json', 'utf8'));
    console.log(`✅ ${bibliaJSON.length} livros carregados\n`);
    
    // 1. LIMPAR DADOS ANTIGOS
    console.log('🗑️ Limpando dados antigos...');
    await supabase.from('bible_verses').delete().gte('id', 0);
    await supabase.from('bible_chapters').delete().gte('id', 0);
    await supabase.from('bible_books').delete().gte('id', 0);
    console.log('✅ Dados antigos removidos\n');
    
    // Aguardar propagação
    console.log('⏳ Aguardando propagação (3s)...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Pronto!\n');
    
    // 2. INSERIR LIVROS
    console.log('📚 Inserindo livros...');
    const booksToInsert = bibliaJSON.map((livro, idx) => {
      const abbrev = BOOK_ABBREVS[livro.livro] || livro.livro.substring(0, 3);
      return {
        abbrev: abbrev,
        name: livro.livro,
        testament: OLD_TESTAMENT.includes(abbrev) ? 'Antigo Testamento' : 'Novo Testamento',
        book_order: idx + 1,
        total_chapters: livro.capitulos.length
      };
    });
    
    const { data: insertedBooks, error: booksError } = await supabase
      .from('bible_books')
      .insert(booksToInsert)
      .select();
      
    if (booksError) throw new Error(`Erro inserindo livros: ${booksError.message}`);
    console.log(`✅ ${insertedBooks.length} livros inseridos\n`);
    
    // 3. INSERIR CAPÍTULOS E VERSÍCULOS POR LIVRO
    let totalChapters = 0;
    let totalVerses = 0;
    
    for (let i = 0; i < bibliaJSON.length; i++) {
      const livro = bibliaJSON[i];
      const bookData = insertedBooks[i];
      
      console.log(`[${i + 1}/${bibliaJSON.length}] ${livro.livro} (${bookData.abbrev})...`);
      
      // Inserir capítulos deste livro
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
        console.log(`  ❌ Erro capítulos: ${chapError.message}`);
        continue;
      }
      
      totalChapters += insertedChapters.length;
      
      // Juntar TODOS os versículos deste livro, mesclando duplicatas
      const versesMapByChapter = new Map();
      
      for (const cap of livro.capitulos) {
        const chapterData = insertedChapters.find(ch => ch.chapter_number === cap.capitulo);
        if (!chapterData) continue;
        
        if (!versesMapByChapter.has(chapterData.id)) {
          versesMapByChapter.set(chapterData.id, new Map());
        }
        const versesMap = versesMapByChapter.get(chapterData.id);
        
        for (const v of cap.versiculos) {
          if (versesMap.has(v.numero)) {
            // Mesclar versículos duplicados
            const existing = versesMap.get(v.numero);
            versesMap.set(v.numero, existing + ' ' + v.texto);
          } else {
            versesMap.set(v.numero, v.texto);
          }
        }
      }
      
      // Converter Maps para array
      const allVerses = [];
      for (const [chapterId, versesMap] of versesMapByChapter.entries()) {
        for (const [verseNumber, text] of versesMap.entries()) {
          allVerses.push({
            chapter_id: chapterId,
            verse_number: verseNumber,
            text: text
          });
        }
      }
      
      // Inserir todos os versículos deste livro em lotes de 1000
      for (let j = 0; j < allVerses.length; j += 1000) {
        const batch = allVerses.slice(j, j + 1000);
        const { error: verseError } = await supabase
          .from('bible_verses')
          .insert(batch);
          
        if (verseError) {
          console.log(`  ❌ Erro versículos: ${verseError.message}`);
          break;
        }
      }
      
      totalVerses += allVerses.length;
      console.log(`  ✅ ${insertedChapters.length} caps, ${allVerses.length} vv`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 MIGRAÇÃO CONCLUÍDA!');
    console.log(`📊 ${insertedBooks.length} livros | ${totalChapters} capítulos | ${totalVerses} versículos`);
    console.log('='.repeat(50) + '\n');
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    process.exit(1);
  }
}

insertBible();
