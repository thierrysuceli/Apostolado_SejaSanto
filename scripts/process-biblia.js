/**
 * Script para processar bibliaAveMaria.json e gerar arquivos SQL
 * para inserção no banco de dados Supabase
 * 
 * Uso:
 * 1. Baixar bibliaAveMaria.json de https://github.com/fidalgobr/bibliaAveMariaJSON
 * 2. Colocar na raiz do projeto
 * 3. node scripts/process-biblia.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho dos arquivos
const BIBLIA_JSON_PATH = path.join(__dirname, '..', 'bibliaAveMaria.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'supabase', 'migrations', 'biblia-inserts');

// Tamanho máximo de cada arquivo SQL (em linhas)
const MAX_LINES_PER_FILE = 1000;

// Criar diretório de saída se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Ler o JSON da Bíblia
console.log('📖 Lendo arquivo bibliaAveMaria.json...');

let bibliaData;
try {
  const jsonContent = fs.readFileSync(BIBLIA_JSON_PATH, 'utf8');
  bibliaData = JSON.parse(jsonContent);
} catch (error) {
  console.error('❌ Erro ao ler o arquivo JSON:', error.message);
  console.log('\n💡 Instruções:');
  console.log('1. Baixe o arquivo de: https://raw.githubusercontent.com/fidalgobr/bibliaAveMariaJSON/main/bibliaAveMaria.json');
  console.log('2. Salve como "bibliaAveMaria.json" na raiz do projeto');
  console.log('3. Execute novamente: node scripts/process-biblia.js');
  process.exit(1);
}

console.log('✅ JSON carregado com sucesso!');

// Processar estrutura: { antigoTestamento: [...], novoTestamento: [...] }
const antigoTestamento = bibliaData.antigoTestamento || [];
const novoTestamento = bibliaData.novoTestamento || [];
const totalLivros = antigoTestamento.length + novoTestamento.length;

console.log(`📚 Antigo Testamento: ${antigoTestamento.length} livros`);
console.log(`📚 Novo Testamento: ${novoTestamento.length} livros`);
console.log(`📚 Total: ${totalLivros} livros\n`);

// Arrays para armazenar os INSERTs
const bookInserts = [];
const chapterInserts = [];
const verseInserts = [];

let bookId = 1;
let chapterId = 1;
let verseId = 1;

// Função para gerar abreviação do livro
function generateAbbrev(nome) {
  const abbrevMap = {
    'Gênesis': 'gn', 'Êxodo': 'ex', 'Levítico': 'lv', 'Números': 'nm', 'Deuteronômio': 'dt',
    'Josué': 'js', 'Juízes': 'jz', 'Rute': 'rt', 'I Samuel': '1sm', 'II Samuel': '2sm',
    'I Reis': '1rs', 'II Reis': '2rs', 'I Crônicas': '1cr', 'II Crônicas': '2cr',
    'Esdras': 'esd', 'Neemias': 'ne', 'Tobias': 'tb', 'Judite': 'jt', 'Ester': 'et',
    'Jó': 'job', 'Salmos': 'sl', 'Provérbios': 'pv', 'Eclesiastes': 'ec',
    'Cântico dos Cânticos': 'ct', 'Sabedoria': 'sb', 'Eclesiástico': 'eclo',
    'Isaías': 'is', 'Jeremias': 'jr', 'Lamentações': 'lm', 'Baruc': 'br',
    'Ezequiel': 'ez', 'Daniel': 'dn', 'Oséias': 'os', 'Joel': 'jl', 'Amós': 'am',
    'Abdias': 'ob', 'Jonas': 'jn', 'Miquéias': 'mq', 'Naum': 'na', 'Habacuc': 'hc',
    'Sofonias': 'sf', 'Ageu': 'ag', 'Zacarias': 'zc', 'Malaquias': 'ml',
    'I Macabeus': '1mc', 'II Macabeus': '2mc',
    'Mateus': 'mt', 'Marcos': 'mc', 'Lucas': 'lc', 'João': 'jo', 'Atos': 'at',
    'Romanos': 'rm', 'I Coríntios': '1co', 'II Coríntios': '2co', 'Gálatas': 'gl',
    'Efésios': 'ef', 'Filipenses': 'fl', 'Colossenses': 'cl', 'I Tessalonicenses': '1ts',
    'II Tessalonicenses': '2ts', 'I Timóteo': '1tm', 'II Timóteo': '2tm', 'Tito': 'tt',
    'Filemon': 'fm', 'Hebreus': 'hb', 'Tiago': 'tg', 'I Pedro': '1pe', 'II Pedro': '2pe',
    'I João': '1jo', 'II João': '2jo', 'III João': '3jo', 'Judas': 'jd', 'Apocalipse': 'ap'
  };
  return abbrevMap[nome] || nome.toLowerCase().replace(/\s+/g, '');
}

// Processar Antigo Testamento
console.log('📖 Processando Antigo Testamento...');
antigoTestamento.forEach((livro, index) => {
  processBook(livro, 'Antigo Testamento', index + 1);
});

// Processar Novo Testamento
console.log('\n📖 Processando Novo Testamento...');
novoTestamento.forEach((livro, index) => {
  processBook(livro, 'Novo Testamento', antigoTestamento.length + index + 1);
});

// Função para processar um livro
function processBook(livro, testament, bookOrder) {
  const bookName = livro.nome || `Livro ${bookId}`;
  const bookAbbrev = generateAbbrev(bookName);
  const chapters = livro.capitulos || [];
  
  console.log(`  📕 ${bookName} (${bookAbbrev}) - ${chapters.length} capítulos`);
  
  // INSERT do livro
  bookInserts.push(
    `INSERT INTO bible_books (id, abbrev, name, testament, book_order, total_chapters) VALUES ` +
    `(${bookId}, '${bookAbbrev}', '${escapeSql(bookName)}', '${testament}', ${bookOrder}, ${chapters.length});`
  );
  
  // Processar capítulos
  chapters.forEach((capitulo, capIndex) => {
    const verses = capitulo.versiculos || [];
    
    // INSERT do capítulo
    chapterInserts.push(
      `INSERT INTO bible_chapters (id, book_id, chapter_number, total_verses) VALUES ` +
      `(${chapterId}, ${bookId}, ${capIndex + 1}, ${verses.length});`
    );
    
    // Processar versículos
    verses.forEach((versiculoObj, verseIndex) => {
      const verseText = typeof versiculoObj === 'string' ? versiculoObj : versiculoObj.texto || '';
      const verseNumber = versiculoObj.versiculo || (verseIndex + 1);
      
      verseInserts.push(
        `INSERT INTO bible_verses (id, chapter_id, verse_number, text) VALUES ` +
        `(${verseId}, ${chapterId}, ${verseNumber}, '${escapeSql(verseText)}');`
      );
      
      verseId++;
    });
    
    chapterId++;
  });
  
  bookId++;
}

// Função para escapar SQL
function escapeSql(text) {
  if (!text) return '';
  return text.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

// Função para dividir arrays em chunks
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Dividir INSERTs em arquivos
console.log('\n📝 Gerando arquivos SQL...\n');

// 1. Livros (pequeno, um único arquivo)
const booksFile = path.join(OUTPUT_DIR, '011_biblia_01_books.sql');
const booksContent = `-- Bible Books\n-- Total: ${bookInserts.length} livros\n\n` + 
                     bookInserts.join('\n') + '\n';
fs.writeFileSync(booksFile, booksContent);
console.log(`✅ ${booksFile} (${bookInserts.length} livros)`);

// 2. Capítulos (dividir se necessário)
const chapterChunks = chunkArray(chapterInserts, MAX_LINES_PER_FILE);
chapterChunks.forEach((chunk, index) => {
  const chapterFile = path.join(OUTPUT_DIR, `011_biblia_02_chapters_${String(index + 1).padStart(2, '0')}.sql`);
  const chapterContent = `-- Bible Chapters (Parte ${index + 1}/${chapterChunks.length})\n\n` + 
                         chunk.join('\n') + '\n';
  fs.writeFileSync(chapterFile, chapterContent);
  console.log(`✅ ${chapterFile} (${chunk.length} capítulos)`);
});

// 3. Versículos (dividir em múltiplos arquivos)
const verseChunks = chunkArray(verseInserts, MAX_LINES_PER_FILE);
verseChunks.forEach((chunk, index) => {
  const verseFile = path.join(OUTPUT_DIR, `011_biblia_03_verses_${String(index + 1).padStart(3, '0')}.sql`);
  const verseContent = `-- Bible Verses (Parte ${index + 1}/${verseChunks.length})\n\n` + 
                       chunk.join('\n') + '\n';
  fs.writeFileSync(verseFile, verseContent);
  console.log(`✅ ${verseFile} (${chunk.length} versículos)`);
});

// 4. Criar arquivo de reset de sequences
const resetFile = path.join(OUTPUT_DIR, '011_biblia_04_reset_sequences.sql');
const resetContent = `-- Reset sequences para IDs corretos
SELECT setval('bible_books_id_seq', (SELECT MAX(id) FROM bible_books));
SELECT setval('bible_chapters_id_seq', (SELECT MAX(id) FROM bible_chapters));
SELECT setval('bible_verses_id_seq', (SELECT MAX(id) FROM bible_verses));
`;
fs.writeFileSync(resetFile, resetContent);
console.log(`✅ ${resetFile}`);

// Resumo final
console.log('\n' + '='.repeat(60));
console.log('✅ PROCESSAMENTO CONCLUÍDO!');
console.log('='.repeat(60));
console.log(`📚 Livros: ${bookInserts.length}`);
console.log(`📖 Capítulos: ${chapterInserts.length}`);
console.log(`📝 Versículos: ${verseInserts.length}`);
console.log(`📁 Arquivos gerados: ${1 + chapterChunks.length + verseChunks.length + 1}`);
console.log('\n📋 Próximos passos:');
console.log('1. Execute a migration 011_biblia_schema.sql no Supabase');
console.log('2. Execute os arquivos em supabase/migrations/biblia-inserts/ na ordem:');
console.log('   - 011_biblia_01_books.sql');
console.log('   - 011_biblia_02_chapters_*.sql');
console.log('   - 011_biblia_03_verses_*.sql');
console.log('   - 011_biblia_04_reset_sequences.sql');
console.log('\n💡 Dica: Use o SQL Editor do Supabase para executar cada arquivo');
