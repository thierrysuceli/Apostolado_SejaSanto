/**
 * Script para combinar todos os arquivos SQL da Bíblia em um único arquivo
 * para facilitar a importação no Supabase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INSERTS_DIR = path.join(__dirname, '..', 'supabase', 'migrations', 'biblia-inserts');
const OUTPUT_FILE = path.join(__dirname, '..', 'supabase', 'migrations', 'biblia-inserts', '011_biblia_COMBINED_ALL.sql');

console.log('📦 Combinando todos os arquivos SQL da Bíblia...\n');

// Lista de arquivos na ordem correta
const files = [
  '011_biblia_01_books.sql',
  ...fs.readdirSync(INSERTS_DIR)
    .filter(f => f.startsWith('011_biblia_02_chapters_'))
    .sort(),
  ...fs.readdirSync(INSERTS_DIR)
    .filter(f => f.startsWith('011_biblia_03_verses_'))
    .sort(),
  '011_biblia_04_reset_sequences.sql'
];

let combinedContent = `-- ============================================
-- BÍBLIA AVE MARIA - ARQUIVO COMBINADO
-- ============================================
-- Este arquivo contém todos os INSERTs da Bíblia
-- Total: 73 livros, 1.334 capítulos, 35.450 versículos
-- 
-- Gerado automaticamente por: scripts/combine-biblia-sql.js
-- Data: ${new Date().toISOString()}
-- ============================================

`;

let totalLines = 0;

files.forEach((filename, index) => {
  const filePath = path.join(INSERTS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${filename}`);
    return;
  }
  
  console.log(`📄 ${index + 1}/${files.length} Adicionando: ${filename}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').length;
  totalLines += lines;
  
  combinedContent += `\n-- ============================================\n`;
  combinedContent += `-- ${filename}\n`;
  combinedContent += `-- ============================================\n\n`;
  combinedContent += content;
  combinedContent += '\n\n';
});

// Escrever arquivo combinado
fs.writeFileSync(OUTPUT_FILE, combinedContent, 'utf8');

console.log('\n' + '='.repeat(60));
console.log('✅ ARQUIVO COMBINADO CRIADO COM SUCESSO!');
console.log('='.repeat(60));
console.log(`📁 Arquivo: ${OUTPUT_FILE}`);
console.log(`📊 Total de linhas: ${totalLines.toLocaleString()}`);
console.log(`📦 Arquivos combinados: ${files.length}`);
console.log(`💾 Tamanho: ${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2)} MB`);
console.log('\n📋 Próximo passo:');
console.log('Execute este arquivo único no Supabase SQL Editor:');
console.log('supabase/migrations/biblia-inserts/011_biblia_COMBINED_ALL.sql');
console.log('\n⚠️  ATENÇÃO: Este arquivo pode ser muito grande para o SQL Editor.');
console.log('Se der erro, use o script de importação automática:');
console.log('node scripts/import-biblia-to-supabase.js');
