/**
 * Script para importar todos os dados da Bíblia diretamente no Supabase
 * usando a API do Supabase (mais rápido que SQL Editor)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURAÇÃO - PREENCHA COM SUAS CREDENCIAIS
// ============================================
const SUPABASE_URL = process.env.SUPABASE_URL || 'SUA_URL_AQUI';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'SUA_SERVICE_KEY_AQUI';

if (SUPABASE_URL === 'SUA_URL_AQUI' || SUPABASE_SERVICE_KEY === 'SUA_SERVICE_KEY_AQUI') {
  console.error('❌ ERRO: Configure as variáveis de ambiente ou edite o script!');
  console.log('\nOpção 1 - Variáveis de ambiente:');
  console.log('$env:SUPABASE_URL="https://seu-projeto.supabase.co"');
  console.log('$env:SUPABASE_SERVICE_KEY="sua-service-key"');
  console.log('node scripts/import-biblia-to-supabase.js\n');
  console.log('Opção 2 - Edite o script e coloque suas credenciais diretamente.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Ler o JSON da Bíblia
const BIBLIA_JSON_PATH = path.join(__dirname, '..', 'bibliaAveMaria.json');

console.log('📖 Carregando bibliaAveMaria.json...\n');

let bibliaData;
try {
  const jsonContent = fs.readFileSync(BIBLIA_JSON_PATH, 'utf8');
  bibliaData = JSON.parse(jsonContent);
} catch (error) {
  console.error('❌ Erro ao ler o arquivo JSON:', error.message);
  process.exit(1);
}

const antigoTestamento = bibliaData.antigoTestamento || [];
const novoTestamento = bibliaData.novoTestamento || [];

console.log(`📚 Antigo Testamento: ${antigoTestamento.length} livros`);
console.log(`📚 Novo Testamento: ${novoTestamento.length} livros\n`);

// Função para gerar abreviação
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

// Função principal de importação
async function importBible() {
  try {
    console.log('🗑️  Limpando dados antigos (se existirem)...');
    await supabase.from('bible_verses').delete().neq('id', 0);
    await supabase.from('bible_chapters').delete().neq('id', 0);
    await supabase.from('bible_books').delete().neq('id', 0);
    console.log('✅ Dados antigos removidos\n');

    let bookId = 1;
    let totalChapters = 0;
    let totalVerses = 0;

    // Processar todos os livros
    const allBooks = [
      ...antigoTestamento.map((l, i) => ({ ...l, testament: 'Antigo Testamento', order: i + 1 })),
      ...novoTestamento.map((l, i) => ({ ...l, testament: 'Novo Testamento', order: antigoTestamento.length + i + 1 }))
    ];

    console.log('📕 Inserindo livros...');
    for (const livro of allBooks) {
      const bookName = livro.nome;
      const bookAbbrev = generateAbbrev(bookName);
      const chapters = livro.capitulos || [];

      // Inserir livro
      const { data: book, error: bookError } = await supabase
        .from('bible_books')
        .insert({
          id: bookId,
          abbrev: bookAbbrev,
          name: bookName,
          testament: livro.testament,
          book_order: livro.order,
          total_chapters: chapters.length
        })
        .select()
        .single();

      if (bookError) throw bookError;
      console.log(`  ✓ ${bookName} (${bookAbbrev})`);

      // Inserir capítulos e versículos
      for (let capIndex = 0; capIndex < chapters.length; capIndex++) {
        const verses = chapters[capIndex].versiculos || [];
        const chapterId = totalChapters + capIndex + 1;

        // Inserir capítulo
        const { error: chapterError } = await supabase
          .from('bible_chapters')
          .insert({
            id: chapterId,
            book_id: bookId,
            chapter_number: capIndex + 1,
            total_verses: verses.length
          });

        if (chapterError) throw chapterError;

        // Inserir versículos em lote (1000 por vez para não estourar memória)
        const versesToInsert = verses.map((v, vIndex) => ({
          id: totalVerses + vIndex + 1,
          chapter_id: chapterId,
          verse_number: v.versiculo || (vIndex + 1),
          text: v.texto || ''
        }));

        // Dividir em chunks de 1000
        const chunkSize = 1000;
        for (let i = 0; i < versesToInsert.length; i += chunkSize) {
          const chunk = versesToInsert.slice(i, i + chunkSize);
          const { error: verseError } = await supabase
            .from('bible_verses')
            .insert(chunk);
          
          if (verseError) throw verseError;
        }

        totalVerses += verses.length;
      }

      totalChapters += chapters.length;
      bookId++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(60));
    console.log(`📚 Livros importados: ${allBooks.length}`);
    console.log(`📖 Capítulos importados: ${totalChapters}`);
    console.log(`📝 Versículos importados: ${totalVerses}`);
    console.log('\n🎉 A Bíblia completa foi importada para o Supabase!');

  } catch (error) {
    console.error('\n❌ ERRO durante a importação:', error);
    console.error('Detalhes:', error.message);
    process.exit(1);
  }
}

// Executar
importBible();
