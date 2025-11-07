-- ============================================
-- MIGRATION 011: Bible Schema
-- ============================================
-- Cria estrutura para armazenar a Bíblia completa (Ave Maria)
-- com suporte a notas administrativas

-- Tabela de Livros da Bíblia
CREATE TABLE bible_books (
  id SERIAL PRIMARY KEY,
  abbrev VARCHAR(10) UNIQUE NOT NULL,
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

-- Tabela de Notas Administrativas (já existe, vamos garantir que está ok)
CREATE TABLE IF NOT EXISTS bible_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_abbrev VARCHAR(10) NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER,
  note_text TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bible_notes_book ON bible_notes(book_abbrev);
CREATE INDEX IF NOT EXISTS idx_bible_notes_chapter ON bible_notes(book_abbrev, chapter_number);
CREATE INDEX IF NOT EXISTS idx_bible_notes_verse ON bible_notes(book_abbrev, chapter_number, verse_number);

CREATE TRIGGER IF NOT EXISTS update_bible_notes_updated_at
  BEFORE UPDATE ON bible_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies para Bible (leitura pública)
ALTER TABLE bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_notes ENABLE ROW LEVEL SECURITY;

-- Todos podem ler a Bíblia
CREATE POLICY "bible_books_public_read" ON bible_books FOR SELECT USING (true);
CREATE POLICY "bible_chapters_public_read" ON bible_chapters FOR SELECT USING (true);
CREATE POLICY "bible_verses_public_read" ON bible_verses FOR SELECT USING (true);

-- Todos podem ler notas
CREATE POLICY "bible_notes_public_read" ON bible_notes FOR SELECT USING (true);

-- Apenas admins podem criar/editar/deletar notas
CREATE POLICY "bible_notes_admin_write" ON bible_notes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "bible_notes_admin_update" ON bible_notes FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "bible_notes_admin_delete" ON bible_notes FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
