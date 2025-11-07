-- =====================================================
-- MIGRATION 009: Bible Notes (Notas Bíblicas)
-- =====================================================
-- Tabela para armazenar notas de admin sobre versículos

CREATE TABLE IF NOT EXISTS bible_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_abbrev TEXT NOT NULL, -- Abreviação do livro (ex: 'gn', 'ex', 'mt')
  chapter INT NOT NULL,
  verse INT NOT NULL,
  
  -- Conteúdo da nota
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML do Quill
  
  -- Author (só admin pode criar)
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garantir que não há notas duplicadas para o mesmo versículo
  UNIQUE(book_abbrev, chapter, verse)
);

-- Índices
CREATE INDEX idx_bible_notes_book ON bible_notes(book_abbrev);
CREATE INDEX idx_bible_notes_chapter ON bible_notes(chapter);
CREATE INDEX idx_bible_notes_verse ON bible_notes(verse);
CREATE INDEX idx_bible_notes_author ON bible_notes(author_id);
CREATE INDEX idx_bible_notes_location ON bible_notes(book_abbrev, chapter, verse);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_bible_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bible_notes_updated_at
BEFORE UPDATE ON bible_notes
FOR EACH ROW
EXECUTE FUNCTION update_bible_notes_updated_at();

-- RLS Policies
ALTER TABLE bible_notes ENABLE ROW LEVEL SECURITY;

-- Todos podem ler as notas
CREATE POLICY "bible_notes_select_all" 
  ON bible_notes 
  FOR SELECT 
  USING (true);

-- Apenas ADMIN pode criar notas
CREATE POLICY "bible_notes_insert_admin" 
  ON bible_notes 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- Apenas ADMIN pode atualizar notas
CREATE POLICY "bible_notes_update_admin" 
  ON bible_notes 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- Apenas ADMIN pode deletar notas
CREATE POLICY "bible_notes_delete_admin" 
  ON bible_notes 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- Comentários
COMMENT ON TABLE bible_notes IS 'Notas de estudo bíblico criadas por administradores';
COMMENT ON COLUMN bible_notes.book_abbrev IS 'Abreviação do livro bíblico';
COMMENT ON COLUMN bible_notes.chapter IS 'Número do capítulo';
COMMENT ON COLUMN bible_notes.verse IS 'Número do versículo';
