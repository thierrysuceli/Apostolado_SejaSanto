# Instalação da Bíblia Ave Maria no Supabase

## 📋 Arquivos Gerados

Este diretório contém os arquivos SQL para popular o banco de dados com a Bíblia completa (Ave Maria em português).

**Total de dados:**
- 73 livros (46 do Antigo Testamento + 27 do Novo Testamento)
- 1.334 capítulos
- 35.450 versículos

## 🚀 Como Instalar

### 1. Executar o Schema (apenas uma vez)

Primeiro, execute a migration do schema na raiz:

```sql
-- Arquivo: supabase/migrations/011_biblia_schema.sql
```

Este arquivo cria as tabelas:
- `bible_books` - Livros da Bíblia
- `bible_chapters` - Capítulos
- `bible_verses` - Versículos
- `bible_notes` - Notas administrativas (já existente)

### 2. Inserir os Livros

Execute o arquivo de livros:

```sql
-- Arquivo: 011_biblia_01_books.sql
```

✅ Este arquivo insere os 73 livros da Bíblia

### 3. Inserir os Capítulos

Execute os arquivos de capítulos na ordem:

```sql
-- Arquivos: 011_biblia_02_chapters_01.sql
-- Arquivos: 011_biblia_02_chapters_02.sql
```

✅ Total: 2 arquivos com 1.334 capítulos

### 4. Inserir os Versículos

Execute os arquivos de versículos na ordem (de 001 a 036):

```sql
-- Arquivos: 011_biblia_03_verses_001.sql até 011_biblia_03_verses_036.sql
```

⚠️ **IMPORTANTE**: São 36 arquivos! Cada arquivo contém aproximadamente 1.000 versículos.

**Dica para executar todos de uma vez (SQL Editor do Supabase):**

Você pode concatenar todos os arquivos em um único comando se preferir:

```bash
# No terminal (PowerShell):
cd supabase/migrations/biblia-inserts
Get-Content 011_biblia_03_verses_*.sql | Set-Content combined_verses.sql
```

Depois execute o arquivo `combined_verses.sql` no Supabase SQL Editor.

### 5. Resetar Sequences

Por último, execute o arquivo de reset:

```sql
-- Arquivo: 011_biblia_04_reset_sequences.sql
```

✅ Este arquivo ajusta os contadores de IDs para os valores corretos

## ⚡ Execução Rápida (Recomendada)

### Opção A: SQL Editor do Supabase (Interface Web)

1. Acesse: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Abra cada arquivo e clique em "Run"
3. Execute na ordem:
   - `011_biblia_schema.sql` (na raiz migrations)
   - `011_biblia_01_books.sql`
   - `011_biblia_02_chapters_*.sql` (2 arquivos)
   - `011_biblia_03_verses_*.sql` (36 arquivos)
   - `011_biblia_04_reset_sequences.sql`

### Opção B: CLI do Supabase (Mais Rápido)

Se você tem o Supabase CLI instalado:

```bash
# Executar schema
supabase db push --db-url "your-connection-string" --file supabase/migrations/011_biblia_schema.sql

# Executar inserts
cd supabase/migrations/biblia-inserts
for file in *.sql; do
  echo "Executando $file..."
  supabase db execute --db-url "your-connection-string" < "$file"
done
```

### Opção C: psql (PostgreSQL Client)

Se você tem acesso direto ao PostgreSQL:

```bash
# Conectar ao banco
psql "your-connection-string"

# Dentro do psql:
\i supabase/migrations/011_biblia_schema.sql
\i supabase/migrations/biblia-inserts/011_biblia_01_books.sql
\i supabase/migrations/biblia-inserts/011_biblia_02_chapters_01.sql
\i supabase/migrations/biblia-inserts/011_biblia_02_chapters_02.sql
# ... continuar com todos os verses_*.sql
\i supabase/migrations/biblia-inserts/011_biblia_04_reset_sequences.sql
```

## 🔍 Verificação

Após a instalação, verifique se tudo foi inserido corretamente:

```sql
-- Contar livros (deve retornar 73)
SELECT COUNT(*) FROM bible_books;

-- Contar capítulos (deve retornar 1334)
SELECT COUNT(*) FROM bible_chapters;

-- Contar versículos (deve retornar 35450)
SELECT COUNT(*) FROM bible_verses;

-- Ver um versículo de exemplo (João 3:16)
SELECT bv.verse_number, bv.text 
FROM bible_verses bv
JOIN bible_chapters bc ON bv.chapter_id = bc.id
JOIN bible_books bb ON bc.book_id = bb.id
WHERE bb.abbrev = 'jo' AND bc.chapter_number = 3 AND bv.verse_number = 16;
```

## 📚 Estrutura das Tabelas

### bible_books
```sql
id               SERIAL PRIMARY KEY
abbrev           VARCHAR(10)     -- 'gn', 'ex', 'mt', 'jo', etc.
name             TEXT            -- 'Gênesis', 'Êxodo', 'Mateus', 'João', etc.
testament        VARCHAR(20)     -- 'Antigo Testamento' ou 'Novo Testamento'
book_order       INTEGER         -- Ordem do livro (1-73)
total_chapters   INTEGER         -- Total de capítulos
```

### bible_chapters
```sql
id               SERIAL PRIMARY KEY
book_id          INTEGER         -- FK para bible_books
chapter_number   INTEGER         -- Número do capítulo (1, 2, 3, ...)
total_verses     INTEGER         -- Total de versículos neste capítulo
```

### bible_verses
```sql
id               SERIAL PRIMARY KEY
chapter_id       INTEGER         -- FK para bible_chapters
verse_number     INTEGER         -- Número do versículo (1, 2, 3, ...)
text             TEXT            -- Texto do versículo
```

## 🔐 Permissões (RLS)

As tabelas têm Row Level Security (RLS) habilitado:

- **Leitura**: Público (todos podem ler)
- **Escrita**: Ninguém (dados são somente leitura)

Para notas bíblicas (`bible_notes`):
- **Leitura**: Público
- **Escrita/Edição/Deleção**: Apenas administradores

## 🐛 Problemas Comuns

### Erro: "Arquivo muito grande"
- **Solução**: Divida os arquivos ou use CLI/psql ao invés da interface web

### Erro: "Out of memory"
- **Solução**: Execute os arquivos de versículos em lotes menores (5-10 por vez)

### Erro: "Duplicate key"
- **Solução**: Limpe as tabelas antes de reinserir:
  ```sql
  TRUNCATE bible_verses, bible_chapters, bible_books RESTART IDENTITY CASCADE;
  ```

## 📖 Fonte dos Dados

- **Bíblia**: Ave Maria (versão católica em português)
- **Formato Original**: JSON
- **Repositório**: https://github.com/fidalgobr/bibliaAveMariaJSON
- **Processado por**: `scripts/process-biblia.js`

## ✅ Pronto!

Após seguir todos os passos, sua API estará funcionando com a Bíblia completa armazenada no banco de dados! 🎉

**Endpoints disponíveis:**
- `GET /api/public-data?type=bible-books` - Lista todos os livros
- `GET /api/public-data?type=bible-chapters&book_id={id}` - Capítulos de um livro
- `GET /api/public-data?type=bible-verses&book_abbrev={abbrev}&chapter_number={num}` - Versículos de um capítulo
