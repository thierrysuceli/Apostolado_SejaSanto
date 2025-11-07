-- ============================================
-- MIGRATION 011: Bible Schema
-- ============================================
-- Cria estrutura para armazenar a Bíblia completa (Ave Maria)
-- com suporte a notas administrativas

-- Tabela de Livros da Bíblia
CREATE TABLE bible_books (
  id SERIAL PRIMARY KEY,
  abbrev VARCHAR(20) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  testament VARCHAR(20) NOT NULL, -- 'Antigo Testamento' ou 'Novo Testamento'
  book_order INTEGER NOT NULL,
  total_chapters INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT testament_valid CHECK (testament IN ('Antigo Testamento', 'Novo Testamento'))
);

CREATE INDEX idx_bible_books_testament ON bible_books(testament);
CREATE INDEX idx_bible_books_order ON bible_books(book_order);

-- Tabela de Capítulos
CREATE TABLE bible_chapters (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  total_verses INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_book_chapter UNIQUE(book_id, chapter_number)
);

CREATE INDEX idx_bible_chapters_book ON bible_chapters(book_id);

-- Tabela de Versículos
CREATE TABLE bible_verses (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES bible_chapters(id) ON DELETE CASCADE,
  verse_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_chapter_verse UNIQUE(chapter_id, verse_number)
);

CREATE INDEX idx_bible_verses_chapter ON bible_verses(chapter_id);

-- Nota: A tabela bible_notes JÁ EXISTE na migration 009
-- Não precisamos recriá-la aqui, apenas garantir compatibilidade

-- RLS Policies para Bible (leitura pública)
ALTER TABLE bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;

-- Todos podem ler a Bíblia
CREATE POLICY "bible_books_public_read" ON bible_books FOR SELECT USING (true);
CREATE POLICY "bible_chapters_public_read" ON bible_chapters FOR SELECT USING (true);
CREATE POLICY "bible_verses_public_read" ON bible_verses FOR SELECT USING (true);
