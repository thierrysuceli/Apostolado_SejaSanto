// =====================================================
// Consolidar Migrations em Chunks Executáveis
// =====================================================

const fs = require('fs');
const path = require('path');

console.log('📦 Consolidando migrations em chunks...\n');

const migrationsDir = path.join(__dirname, 'supabase', 'migrations', 'bible-data');
const outputDir = path.join(__dirname, 'bible-consolidated');

// Criar diretório de saída
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Obter todos os arquivos SQL ordenados
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`📝 Total de arquivos: ${files.length}\n`);

// Consolidar em chunks de 10 livros cada
const CHUNK_SIZE = 10;
let chunks = [];
let currentChunk = [];
let chunkContent = '';

files.forEach((file, index) => {
  const filePath = path.join(migrationsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  currentChunk.push(file);
  chunkContent += `-- ========================================\n`;
  chunkContent += `-- ${file}\n`;
  chunkContent += `-- ========================================\n\n`;
  chunkContent += content + '\n\n';
  
  // A cada CHUNK_SIZE arquivos ou no último arquivo
  if (currentChunk.length === CHUNK_SIZE || index === files.length - 1) {
    const chunkNumber = chunks.length + 1;
    const chunkFileName = `chunk_${String(chunkNumber).padStart(2, '0')}.sql`;
    const chunkPath = path.join(outputDir, chunkFileName);
    
    fs.writeFileSync(chunkPath, chunkContent, 'utf8');
    
    console.log(`✅ ${chunkFileName} criado (${currentChunk.length} arquivos)`);
    
    chunks.push({ number: chunkNumber, files: [...currentChunk] });
    currentChunk = [];
    chunkContent = '';
  }
});

// Criar arquivo README com instruções
const readme = `# 📖 Migrations da Bíblia - Consolidadas

## ✅ ${chunks.length} Chunks Criados

${chunks.map(c => `### Chunk ${c.number}
- Arquivo: \`chunk_${String(c.number).padStart(2, '0')}.sql\`
- Contém: ${c.files.length} migrations
`).join('\n')}

## 🎯 Como Executar

1. Acesse: https://supabase.com/dashboard/project/aywgkvyabjcnnmiwihim/sql
2. Para cada chunk (\`chunk_01.sql\`, \`chunk_02.sql\`, etc.):
   - Abra o arquivo
   - Copie TODO o conteúdo
   - Cole no SQL Editor
   - Clique em **Run** (F5)
3. Aguarde cada chunk completar antes de executar o próximo

## ⏱️ Tempo Estimado

- Por chunk: ~30-60 segundos
- Total: ~${Math.ceil(chunks.length * 0.75)} minutos

## ✅ Verificação

Após executar todos os chunks:

\`\`\`sql
SELECT COUNT(*) AS total_livros FROM bible_books;       -- Deve retornar 73
SELECT COUNT(*) AS total_capitulos FROM bible_chapters; -- Deve retornar ~1.189
SELECT COUNT(*) AS total_versiculos FROM bible_verses;  -- Deve retornar ~31.102
\`\`\`
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readme, 'utf8');

console.log(`\n🎉 Consolidação completa!`);
console.log(`📁 Arquivos salvos em: ${outputDir}`);
console.log(`\n📋 Próximo passo: Leia o README.md e execute os ${chunks.length} chunks no Supabase Dashboard`);
