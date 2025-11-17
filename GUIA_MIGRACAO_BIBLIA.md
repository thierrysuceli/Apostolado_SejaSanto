# 📖 Guia para Migrar Nova Bíblia (Matos Soares 1956)

## ✅ Status Atual
- **Fonte**: https://github.com/Dancrf/biblia-db (Padre Matos Soares 1956)
- **Migrations geradas**: 75 arquivos SQL em `supabase/migrations/bible-data/`
- **Estrutura**: Compatível com tabelas existentes (`bible_books`, `bible_chapters`, `bible_verses`)

## 📋 Migrations Criadas

1. `001_clear_old_bible_data.sql` - Limpa dados antigos
2. `002_insert_books.sql` - Insere 73 livros (AT + NT)
3. `003` até `075` - Um arquivo por livro com todos os capítulos e versículos

## 🔧 Métodos de Execução

### Opção 1: Via Supabase Dashboard (RECOMENDADO)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard/project/aywgkvyabjcnnmiwihim)
2. Vá em **SQL Editor**
3. Para cada arquivo em `supabase/migrations/bible-data/`:
   - Abra o arquivo
   - Copie todo o conteúdo SQL
   - Cole no SQL Editor
   - Clique em **Run**
   
⚠️ **IMPORTANTE**: Execute os arquivos NA ORDEM (001, 002, 003, ...)

### Opção 2: Via Supabase CLI

```bash
# 1. Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# 2. Login
supabase login

# 3. Link com o projeto
supabase link --project-ref aywgkvyabjcnnmiwihim

# 4. Executar migrations
cd supabase/migrations/bible-data
for /f %i in ('dir /b *.sql') do supabase db execute %i
```

### Opção 3: Via Script PowerShell

```powershell
# Executar o script fornecido
.\run-bible-migrations.ps1
```

⚠️ Requer `psql` (PostgreSQL client) instalado

## 📊 Dados da Nova Bíblia

- **Total de livros**: 73 (46 AT + 27 NT)
- **Total de capítulos**: ~1.189
- **Total de versículos**: ~31.102
- **Codificação**: UTF-8
- **Idioma**: Português (Brasil)
- **Tradução**: Padre Matos Soares (1956) - diretamente dos manuscritos originais

## 🗂️ Estrutura das Tabelas

```sql
bible_books (id, abbrev, name, testament, book_order, total_chapters)
bible_chapters (id, book_id, chapter_number, total_verses)
bible_verses (id, chapter_id, verse_number, text)
```

## ⚙️ O que as Migrations Fazem

1. **Limpeza**: Remove TODOS os dados antigos da bíblia
2. **Livros**: Insere metadados de todos os 73 livros
3. **Por Livro**: Para cada livro:
   - Insere todos os capítulos
   - Insere todos os versículos de cada capítulo

## 🎯 Após a Migração

1. Verificar se todos os dados foram importados:
   ```sql
   SELECT COUNT(*) FROM bible_books;    -- Deve retornar 73
   SELECT COUNT(*) FROM bible_chapters; -- Deve retornar ~1.189
   SELECT COUNT(*) FROM bible_verses;   -- Deve retornar ~31.102
   ```

2. Testar uma consulta:
   ```sql
   SELECT 
     b.name AS livro,
     c.chapter_number AS capitulo,
     v.verse_number AS versiculo,
     v.text
   FROM bible_verses v
   JOIN bible_chapters c ON v.chapter_id = c.id
   JOIN bible_books b ON c.book_id = b.id
   WHERE b.abbrev = 'Jo' AND c.chapter_number = 3 AND v.verse_number = 16;
   ```

3. Verificar no frontend se a leitura da bíblia está funcionando

## ⏱️ Tempo Estimado

- Via Dashboard: ~1-2 horas (manual, arquivo por arquivo)
- Via CLI: ~10-15 minutos (automatizado)
- Via Script: ~10-15 minutos (automatizado)

## 🚨 Atenção

- ⚠️ Esta operação **SUBSTITUI COMPLETAMENTE** a bíblia atual
- ⚠️ Não há backup automático - considere fazer backup manual antes
- ⚠️ Execute as migrations NA ORDEM para evitar erros de FK

## 🔄 Reverter (se necessário)

Para reverter, execute novamente as migrations antigas ou use:
```sql
DELETE FROM bible_verses;
DELETE FROM bible_chapters;
DELETE FROM bible_books;
```

## 📝 Logs

Durante a execução, acompanhe:
- Quantos livros foram inseridos
- Se houve algum erro de constraint
- Tempo total de execução
