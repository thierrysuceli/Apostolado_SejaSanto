// =====================================================
// INSERIR BÍBLIA DIRETAMENTE VIA SUPABASE CLIENT
// =====================================================

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function main() {
  console.log('📖 Carregando Bíblia e inserindo no Supabase...\n');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Erro: Variáveis não encontradas!');
    process.exit(1);
  }
  
  // Criar client com service role
  const supabase = createClient(supabaseUrl, serviceKey);
  
  // Carregar JSONs
  // Carregar JSON
const bibliaData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'bibliaAveMaria.json'), 'utf-8')
);

// Combinar AT + NT em array único
const bibliaJSON = [
  ...bibliaData.antigoTestamento.map(b => ({ ...b, testament: 'Antigo Testamento' })),
  ...bibliaData.novoTestamento.map(b => ({ ...b, testament: 'Novo Testamento' }))
];

console.log(`\n✅ JSON carregado: ${bibliaJSON.length} livros\n`);
  
  console.log(`✅ JSON carregado: ${bibliaJSON.length} livros\n`);
  
  // Mapeamento de nomes
  const BOOK_NAMES = {
    'Gn': 'Gênesis', 'Ex': 'Êxodo', 'Lv': 'Levítico', 'Nm': 'Números', 'Dt': 'Deuteronômio',
    'Js': 'Josué', 'Ju': 'Juízes', 'Rt': 'Rute', '1Sm': '1 Samuel', '2Sm': '2 Samuel',
    '1Rs': '1 Reis', '2Rs': '2 Reis', '1Pa': '1 Paralipômenos', '2Pa': '2 Paralipômenos',
    'Esd': 'Esdras', 'Ne': 'Neemias', 'Tob': 'Tobias', 'Jdi': 'Judite', 'Est': 'Ester',
    'Job': 'Jó', 'Ps': 'Salmos', 'Pv': 'Provérbios', 'Ees': 'Eclesiastes', 'Cc': 'Cântico dos Cânticos',
    'Sa': 'Sabedoria', 'Eus': 'Eclesiástico', 'Is': 'Isaías', 'Je': 'Jeremias', 'Lm': 'Lamentações',
    'Ba': 'Baruc', 'Ez': 'Ezequiel', 'Dn': 'Daniel', 'Os': 'Oséias', 'Jl': 'Joel',
    'Am': 'Amós', 'Ab': 'Abdias', 'Jn': 'Jonas', 'Mic': 'Miquéias', 'Na': 'Naum',
    'Hc': 'Habacuc', 'So': 'Sofonias', 'Ag': 'Ageu', 'Zc': 'Zacarias', 'Ml': 'Malaquias',
    '1Ma': '1 Macabeus', '2Ma': '2 Macabeus',
    'Mt': 'Mateus', 'Mc': 'Marcos', 'Lc': 'Lucas', 'Jo': 'João', 'Act': 'Atos dos Apóstolos',
    'Rm': 'Romanos', '1Co': '1 Coríntios', '2Co': '2 Coríntios', 'Gl': 'Gálatas', 'Ef': 'Efésios',
    'Fp': 'Filipenses', 'Cl': 'Colossenses', '1Ts': '1 Tessalonicenses', '2Ts': '2 Tessalonicenses',
    '1Tm': '1 Timóteo', '2Tm': '2 Timóteo', 'Tt': 'Tito', 'Fm': 'Filêmon',
    'Hb': 'Hebreus', 'Tg': 'Tiago', '1Pe': '1 Pedro', '2Pe': '2 Pedro',
    '1Jo': '1 João', '2Jo': '2 João', '3Jo': '3 João', 'Jda': 'Judas', 'Ap': 'Apocalipse'
  };
  
  const OLD_TESTAMENT = ['Gn', 'Ex', 'Lv', 'Nm', 'Dt', 'Js', 'Ju', 'Rt', '1Sm', '2Sm', '1Rs', '2Rs', '1Pa', '2Pa', 'Esd', 'Ne', 'Tob', 'Jdi', 'Est', 'Job', 'Ps', 'Pv', 'Ees', 'Cc', 'Sa', 'Eus', 'Is', 'Je', 'Lm', 'Ba', 'Ez', 'Dn', 'Os', 'Jl', 'Am', 'Ab', 'Jn', 'Mic', 'Na', 'Hc', 'So', 'Ag', 'Zc', 'Ml', '1Ma', '2Ma'];
  
  // 1. LIMPAR DADOS ANTIGOS
  console.log('🗑️  Limpando dados antigos...');
  await supabase.from('bible_verses').delete().neq('id', 0);
  await supabase.from('bible_chapters').delete().neq('id', 0);
  await supabase.from('bible_books').delete().neq('id', 0);
  console.log('✅ Limpeza concluída!\n');
  
  // 2. INSERIR LIVROS
  console.log('📚 Inserindo livros...');
  const booksToInsert = bibliaJSON
    .filter(livro => livro.nome) // Filtrar apenas livros com nome
    .map((livro, idx) => {
      // Gerar abreviação a partir do nome
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
      
      return {
        abbrev: abbrevMap[livro.nome] || livro.nome.substring(0, 3),
        name: livro.nome,
        testament: livro.testament,
        book_order: idx + 1,
        total_chapters: livro.capitulos.length
      };
    });
  
  const { error: booksError } = await supabase.from('bible_books').insert(booksToInsert);
  if (booksError) throw new Error(`Erro inserindo livros: ${booksError.message}`);
  console.log(`✅ ${booksToInsert.length} livros inseridos!\n`);
  
  // 3. BUSCAR IDS DOS LIVROS
  const { data: books } = await supabase.from('bible_books').select('id, abbrev');
  const bookIdMap = {};
  books.forEach(b => bookIdMap[b.abbrev] = b.id);
  
  // 4. INSERIR CAPÍTULOS E VERSÍCULOS POR LIVRO
  let totalChapters = 0;
  let totalVerses = 0;
  
  for (let i = 0; i < bibliaJSON.length; i++) {
    const livro = bibliaJSON[i];
    const abbrev = livro.abreviacao;
    const bookId = bookIdMap[abbrev];
    const bookName = BOOK_NAMES[abbrev] || abbrev;
    
    console.log(`[${i + 1}/${bibliaJSON.length}] Processando: ${bookName} (${abbrev})...`);
    
    // Inserir capítulos deste livro
    const chaptersToInsert = livro.capitulos.map(cap => ({
      book_id: bookId,
      chapter_number: cap.capitulo,
      total_verses: cap.versiculos.length
    }));
    
    const { error: chapError } = await supabase.from('bible_chapters').insert(chaptersToInsert);
    if (chapError) {
      console.error(`  ❌ Erro inserindo capítulos: ${chapError.message}`);
      continue;
    }
    
    totalChapters += chaptersToInsert.length;
    
    // Buscar IDs dos capítulos
    const { data: chapters } = await supabase
      .from('bible_chapters')
      .select('id, chapter_number')
      .eq('book_id', bookId);
    
    const chapterIdMap = {};
    chapters.forEach(c => chapterIdMap[c.chapter_number] = c.id);
    
    // Inserir versículos em lotes de 500
    let allVerses = [];
    livro.capitulos.forEach(cap => {
      const chapterId = chapterIdMap[cap.capitulo];
      cap.versiculos.forEach(v => {
        allVerses.push({
          chapter_id: chapterId,
          verse_number: v.numero,
          text: v.texto
        });
      });
    });
    
    // Inserir em lotes
    const BATCH_SIZE = 500;
    for (let j = 0; j < allVerses.length; j += BATCH_SIZE) {
      const batch = allVerses.slice(j, j + BATCH_SIZE);
      const { error: verseError } = await supabase.from('bible_verses').insert(batch);
      if (verseError) {
        console.error(`  ❌ Erro inserindo versículos (lote ${Math.floor(j / BATCH_SIZE) + 1}): ${verseError.message}`);
      }
    }
    
    totalVerses += allVerses.length;
    console.log(`  ✅ ${livro.capitulos.length} caps, ${allVerses.length} versículos\n`);
  }
  
  console.log('\n=================================================');
  console.log('🎉 Migração concluída!');
  console.log(`📊 Total: ${bibliaJSON.length} livros, ${totalChapters} capítulos, ${totalVerses} versículos`);
  console.log('=================================================\n');
}

main().catch(console.error);
