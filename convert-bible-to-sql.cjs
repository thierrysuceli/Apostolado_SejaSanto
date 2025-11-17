// =====================================================
// Script para converter biblia.json em migrations SQL
// =====================================================

const fs = require('fs');
const path = require('path');

// Mapeamento de abreviações para nomes completos
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

const OLD_TESTAMENT_BOOKS = ['Gn', 'Ex', 'Lv', 'Nm', 'Dt', 'Js', 'Ju', 'Rt', '1Sm', '2Sm', '1Rs', '2Rs', '1Pa', '2Pa', 'Esd', 'Ne', 'Tob', 'Jdi', 'Est', 'Job', 'Ps', 'Pv', 'Ees', 'Cc', 'Sa', 'Eus', 'Is', 'Je', 'Lm', 'Ba', 'Ez', 'Dn', 'Os', 'Jl', 'Am', 'Ab', 'Jn', 'Mic', 'Na', 'Hc', 'So', 'Ag', 'Zc', 'Ml', '1Ma', '2Ma'];

function escapeSingleQuotes(str) {
  if (!str) return '';
  return str.toString().replace(/'/g, "''");
}

async function main() {
  console.log('📖 Iniciando conversão da Bíblia...');
  
  // Ler JSON
  const bibliaJSON = JSON.parse(fs.readFileSync('biblia.json', 'utf8'));
  const listaLivrosJSON = JSON.parse(fs.readFileSync('listalivros.json', 'utf8'));
  
  console.log(`✅ JSON carregado: ${bibliaJSON.length} livros encontrados`);
  
  // Criar diretório para migrations
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations', 'bible-data');
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  // 1. Limpar dados antigos
  const clearSQL = `-- Limpar dados antigos da Bíblia
DELETE FROM bible_verses;
DELETE FROM bible_chapters;
DELETE FROM bible_books;

-- Reset sequences
ALTER SEQUENCE bible_books_id_seq RESTART WITH 1;
ALTER SEQUENCE bible_chapters_id_seq RESTART WITH 1;
ALTER SEQUENCE bible_verses_id_seq RESTART WITH 1;
`;
  
  fs.writeFileSync(
    path.join(migrationsDir, '001_clear_old_bible_data.sql'),
    clearSQL,
    'utf8'
  );
  
  console.log('✅ Migration 001: Limpeza criada');
  
  // 2. Inserir livros
  let booksSQL = `-- Inserir todos os livros da Bíblia\n\n`;
  
  bibliaJSON.forEach((livro, idx) => {
    const abbrev = livro.abreviacao;
    const name = BOOK_NAMES[abbrev] || abbrev;
    const testament = OLD_TESTAMENT_BOOKS.includes(abbrev) ? 'Antigo Testamento' : 'Novo Testamento';
    const totalChapters = livro.capitulos.length;
    const bookOrder = idx + 1;
    
    booksSQL += `INSERT INTO bible_books (abbrev, name, testament, book_order, total_chapters) VALUES ('${abbrev}', '${escapeSingleQuotes(name)}', '${testament}', ${bookOrder}, ${totalChapters});\n`;
  });
  
  fs.writeFileSync(
    path.join(migrationsDir, '002_insert_books.sql'),
    booksSQL,
    'utf8'
  );
  
  console.log('✅ Migration 002: Livros criada');
  
  // 3. Inserir capítulos e versículos por livro (dividido)
  let migrationNumber = 3;
  
  for (const livro of bibliaJSON) {
    const abbrev = livro.abreviacao;
    const name = BOOK_NAMES[abbrev] || abbrev;
    
    let livroSQL = `-- ${name} (${abbrev})\n\n`;
    
    // Inserir capítulos
    for (const capitulo of livro.capitulos) {
      const chapterNum = capitulo.capitulo;
      const totalVerses = capitulo.versiculos.length;
      
      livroSQL += `-- Capítulo ${chapterNum}\n`;
      livroSQL += `INSERT INTO bible_chapters (book_id, chapter_number, total_verses)\n`;
      livroSQL += `VALUES ((SELECT id FROM bible_books WHERE abbrev = '${abbrev}'), ${chapterNum}, ${totalVerses});\n\n`;
      
      // Inserir versículos
      livroSQL += `INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES\n`;
      
      const verses = capitulo.versiculos.map(v => {
        const text = escapeSingleQuotes(v.texto);
        return `((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = '${abbrev}') AND chapter_number = ${chapterNum}), ${v.numero}, '${text}')`;
      });
      
      livroSQL += verses.join(',\n') + ';\n\n';
    }
    
    const fileName = `${String(migrationNumber).padStart(3, '0')}_book_${(abbrev || 'unknown').toLowerCase()}.sql`;
    fs.writeFileSync(
      path.join(migrationsDir, fileName),
      livroSQL,
      'utf8'
    );
    
    console.log(`✅ Migration ${migrationNumber}: ${name} criada (${livro.capitulos.length} capítulos)`);
    migrationNumber++;
  }
  
  console.log(`\n🎉 Conversão completa! ${migrationNumber - 1} migrations criadas em:`);
  console.log(`   ${migrationsDir}`);
  console.log(`\n📋 Próximos passos:`);
  console.log(`   1. Execute: cd supabase/migrations/bible-data`);
  console.log(`   2. Para cada arquivo .sql, execute:`);
  console.log(`      npx supabase db push --db-url "postgresql://postgres:[senha]@[host]:5432/postgres" --file <arquivo.sql>`);
}

main().catch(console.error);
