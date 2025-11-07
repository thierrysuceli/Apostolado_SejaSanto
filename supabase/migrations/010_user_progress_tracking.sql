-- Migration 010: User Progress Tracking System
-- Tabelas para rastrear progresso de cursos e artigos sem bombardear o DB
-- Apenas 1 registro por user+course/post, sempre sobrescreve o anterior

-- ==============================================
-- TABELA: user_course_progress
-- ==============================================
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  progress_seconds INTEGER DEFAULT 0,
  last_position TEXT, -- JSON string com info adicional (ex: módulo, tópico)
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para garantir apenas 1 registro por user+course
  UNIQUE(user_id, course_id)
);

-- ==============================================
-- TABELA: user_post_progress
-- ==============================================
CREATE TABLE IF NOT EXISTS user_post_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  scroll_position INTEGER DEFAULT 0, -- Posição do scroll em pixels
  scroll_percentage FLOAT DEFAULT 0, -- Percentual lido (0-100)
  completed BOOLEAN DEFAULT FALSE,
  reading_time_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para garantir apenas 1 registro por user+post
  UNIQUE(user_id, post_id)
);

-- ==============================================
-- INDEXES para performance
-- ==============================================

-- Indexes para user_course_progress
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user 
  ON user_course_progress(user_id);
  
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course 
  ON user_course_progress(course_id);
  
CREATE INDEX IF NOT EXISTS idx_user_course_progress_updated 
  ON user_course_progress(updated_at DESC);

-- Indexes para user_post_progress
CREATE INDEX IF NOT EXISTS idx_user_post_progress_user 
  ON user_post_progress(user_id);
  
CREATE INDEX IF NOT EXISTS idx_user_post_progress_post 
  ON user_post_progress(post_id);
  
CREATE INDEX IF NOT EXISTS idx_user_post_progress_updated 
  ON user_post_progress(updated_at DESC);

-- ==============================================
-- RLS POLICIES
-- ==============================================

-- Habilitar RLS
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_post_progress ENABLE ROW LEVEL SECURITY;

-- Policies para user_course_progress
-- Usuários podem ver e editar apenas seu próprio progresso
CREATE POLICY "Users can view own course progress"
  ON user_course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course progress"
  ON user_course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress"
  ON user_course_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own course progress"
  ON user_course_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Policies para user_post_progress
-- Usuários podem ver e editar apenas seu próprio progresso
CREATE POLICY "Users can view own post progress"
  ON user_post_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own post progress"
  ON user_post_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own post progress"
  ON user_post_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own post progress"
  ON user_post_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================
-- TRIGGERS para auto-update do updated_at
-- ==============================================

-- Trigger para user_course_progress
CREATE OR REPLACE FUNCTION update_user_course_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_course_progress_updated_at
  BEFORE UPDATE ON user_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_course_progress_updated_at();

-- Trigger para user_post_progress
CREATE OR REPLACE FUNCTION update_user_post_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_post_progress_updated_at
  BEFORE UPDATE ON user_post_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_post_progress_updated_at();

-- ==============================================
-- COMENTÁRIOS
-- ==============================================

COMMENT ON TABLE user_course_progress IS 'Rastreia progresso do usuário em cursos. Apenas 1 registro por user+course, sempre sobrescreve.';
COMMENT ON TABLE user_post_progress IS 'Rastreia leitura de artigos. Apenas 1 registro por user+post, sempre sobrescreve.';
COMMENT ON COLUMN user_course_progress.progress_seconds IS 'Tempo total assistido em segundos';
COMMENT ON COLUMN user_course_progress.last_position IS 'JSON com info da última posição (módulo, topic_id, etc)';
COMMENT ON COLUMN user_post_progress.scroll_position IS 'Posição do scroll em pixels';
COMMENT ON COLUMN user_post_progress.scroll_percentage IS 'Percentual lido de 0 a 100';
COMMENT ON COLUMN user_post_progress.reading_time_seconds IS 'Tempo total de leitura em segundos';
