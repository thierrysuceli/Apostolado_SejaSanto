-- =====================================================
-- Migration 019: Adicionar tabela 'novenas' ao sistema de conteúdo
-- Data: 20/01/2026
-- Descrição: Cria tabela de novenas (similar a articles)
-- =====================================================

-- =====================================================
-- TABELA: novenas (similar a articles)
-- =====================================================
CREATE TABLE IF NOT EXISTS novenas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- HTML do Quill Editor
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  editorial_column_id UUID REFERENCES editorial_columns(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft', -- draft, published, archived
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views_count INTEGER DEFAULT 0,
  
  CONSTRAINT status_valid CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_novenas_slug ON novenas(slug);
CREATE INDEX idx_novenas_author ON novenas(author_id);
CREATE INDEX idx_novenas_column ON novenas(editorial_column_id);
CREATE INDEX idx_novenas_status ON novenas(status);
CREATE INDEX idx_novenas_published_at ON novenas(published_at DESC);
CREATE INDEX idx_novenas_featured ON novenas(is_featured) WHERE is_featured = true;

CREATE TRIGGER update_novenas_updated_at
  BEFORE UPDATE ON novenas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABELA: novena_tags (Visibilidade de Novenas)
-- =====================================================
CREATE TABLE IF NOT EXISTS novena_tags (
  novena_id UUID REFERENCES novenas(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (novena_id, role_id)
);

CREATE INDEX idx_novena_tags_novena ON novena_tags(novena_id);
CREATE INDEX idx_novena_tags_role ON novena_tags(role_id);

-- =====================================================
-- TABELA: user_novena_history (Histórico de Leitura)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_novena_history (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  novena_id UUID REFERENCES novenas(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (user_id, novena_id)
);

CREATE INDEX idx_user_novena_history_user ON user_novena_history(user_id);
CREATE INDEX idx_user_novena_history_novena ON user_novena_history(novena_id);
CREATE INDEX idx_user_novena_history_read_at ON user_novena_history(read_at DESC);
