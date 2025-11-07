-- Migration 012: Bible Verse Comments System
-- Sistema de comentários por versículo da Bíblia

-- Tabela de comentários de versículos
CREATE TABLE IF NOT EXISTS bible_verse_comments (
  id SERIAL PRIMARY KEY,
  book_abbrev VARCHAR(20) NOT NULL,
  chapter INT NOT NULL,
  verse INT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_bible_verse_comments_verse ON bible_verse_comments(book_abbrev, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_bible_verse_comments_user ON bible_verse_comments(user_id);

-- RLS Policies
ALTER TABLE bible_verse_comments ENABLE ROW LEVEL SECURITY;

-- Everyone can read comments
DROP POLICY IF EXISTS "Anyone can view bible verse comments" ON bible_verse_comments;
CREATE POLICY "Anyone can view bible verse comments"
  ON bible_verse_comments FOR SELECT
  USING (true);

-- Logged users can create comments
DROP POLICY IF EXISTS "Logged users can create bible verse comments" ON bible_verse_comments;
CREATE POLICY "Logged users can create bible verse comments"
  ON bible_verse_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
DROP POLICY IF EXISTS "Users can update own bible verse comments" ON bible_verse_comments;
CREATE POLICY "Users can update own bible verse comments"
  ON bible_verse_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments OR admins can delete any
DROP POLICY IF EXISTS "Users can delete own comments or admins delete any" ON bible_verse_comments;
CREATE POLICY "Users can delete own comments or admins delete any"
  ON bible_verse_comments FOR DELETE
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'admin'
    )
  );

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_bible_verse_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_bible_verse_comments_updated_at ON bible_verse_comments;
CREATE TRIGGER trigger_update_bible_verse_comments_updated_at
  BEFORE UPDATE ON bible_verse_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_bible_verse_comments_updated_at();

-- Tabela de histórico de leitura da Bíblia
CREATE TABLE IF NOT EXISTS user_bible_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_abbrev VARCHAR(20) NOT NULL,
  chapter INT NOT NULL,
  verse INT DEFAULT 1,
  last_read_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, book_abbrev)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_bible_progress_user ON user_bible_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bible_progress_last_read ON user_bible_progress(last_read_at DESC);

-- RLS
ALTER TABLE user_bible_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bible progress" ON user_bible_progress;
CREATE POLICY "Users can view own bible progress"
  ON user_bible_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bible progress" ON user_bible_progress;
CREATE POLICY "Users can insert own bible progress"
  ON user_bible_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bible progress" ON user_bible_progress;
CREATE POLICY "Users can update own bible progress"
  ON user_bible_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bible progress" ON user_bible_progress;
CREATE POLICY "Users can delete own bible progress"
  ON user_bible_progress FOR DELETE
  USING (auth.uid() = user_id);
