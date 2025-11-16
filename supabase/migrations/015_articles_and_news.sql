-- =====================================================
-- MIGRATION: Split Posts into Articles and News
-- Data: 15/11/2025
-- Descrição: Cria tabelas para artigos e notícias separadamente
-- =====================================================

-- =====================================================
-- TABELA: editorial_columns (Colunas Editoriais)
-- =====================================================
CREATE TABLE IF NOT EXISTS editorial_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- Ex: "Fé Carmelita", "Franciscanos em Ação"
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#FDB913', -- Cor para UI
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX idx_editorial_columns_slug ON editorial_columns(slug);
CREATE INDEX idx_editorial_columns_order ON editorial_columns(order_index);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_editorial_columns_updated_at
  BEFORE UPDATE ON editorial_columns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABELA: articles (Artigos - herda propriedades de posts)
-- =====================================================
CREATE TABLE IF NOT EXISTS articles (
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

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_column ON articles(editorial_column_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_featured ON articles(is_featured) WHERE is_featured = true;

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABELA: article_tags (Visibilidade de Artigos)
-- =====================================================
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (article_id, role_id)
);

CREATE INDEX idx_article_tags_article ON article_tags(article_id);
CREATE INDEX idx_article_tags_role ON article_tags(role_id);

-- =====================================================
-- TABELA: news_tags (Tags para Notícias)
-- =====================================================
CREATE TABLE IF NOT EXISTS news_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX idx_news_tags_slug ON news_tags(slug);

-- =====================================================
-- TABELA: news (Notícias)
-- =====================================================
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- HTML do Quill Editor
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft', -- draft, published, archived
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views_count INTEGER DEFAULT 0,
  
  CONSTRAINT status_valid CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_author ON news(author_id);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_featured ON news(is_featured) WHERE is_featured = true;

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABELA: news_tag_assignments (Relacionamento Notícia-Tag)
-- =====================================================
CREATE TABLE IF NOT EXISTS news_tag_assignments (
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES news_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (news_id, tag_id)
);

CREATE INDEX idx_news_tag_assignments_news ON news_tag_assignments(news_id);
CREATE INDEX idx_news_tag_assignments_tag ON news_tag_assignments(tag_id);

-- =====================================================
-- TABELA: news_visibility (Visibilidade de Notícias)
-- =====================================================
CREATE TABLE IF NOT EXISTS news_visibility (
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (news_id, role_id)
);

CREATE INDEX idx_news_visibility_news ON news_visibility(news_id);
CREATE INDEX idx_news_visibility_role ON news_visibility(role_id);

-- =====================================================
-- TABELA: user_article_history (Histórico de Leitura de Artigos)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_article_history (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (user_id, article_id)
);

CREATE INDEX idx_user_article_history_user ON user_article_history(user_id);
CREATE INDEX idx_user_article_history_article ON user_article_history(article_id);
CREATE INDEX idx_user_article_history_read_at ON user_article_history(read_at DESC);

-- =====================================================
-- TABELA: user_news_history (Histórico de Leitura de Notícias)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_news_history (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (user_id, news_id)
);

CREATE INDEX idx_user_news_history_user ON user_news_history(user_id);
CREATE INDEX idx_user_news_history_news ON user_news_history(news_id);
CREATE INDEX idx_user_news_history_read_at ON user_news_history(read_at DESC);

-- =====================================================
-- SEED DATA: Colunas Editoriais Iniciais
-- =====================================================
INSERT INTO editorial_columns (name, slug, description, color, order_index)
VALUES 
  ('Fé Carmelita', 'fe-carmelita', 'Artigos sobre a espiritualidade carmelita', '#8B4513', 1),
  ('Franciscanos em Ação', 'franciscanos-em-acao', 'Testemunhos e histórias franciscanas', '#6B8E23', 2),
  ('Liturgia e Tradição', 'liturgia-e-tradicao', 'Aprofundamento litúrgico e tradicional', '#9370DB', 3),
  ('Vida dos Santos', 'vida-dos-santos', 'Biografias e ensinamentos dos santos', '#FFD700', 4)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA: Tags de Notícias Iniciais
-- =====================================================
INSERT INTO news_tags (name, slug, color)
VALUES 
  ('Vaticano', 'vaticano', '#FFD700'),
  ('Brasil', 'brasil', '#009B3A'),
  ('Igreja no Mundo', 'igreja-no-mundo', '#4169E1'),
  ('Papa Francisco', 'papa-francisco', '#FFFFFF'),
  ('Eventos', 'eventos', '#FF6347'),
  ('Comunidade', 'comunidade', '#20B2AA')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================
-- Esta migration cria:
-- 1. Sistema de colunas editoriais para artigos
-- 2. Tabela de artigos com coluna editorial
-- 3. Tabela de notícias com sistema de tags próprio
-- 4. Histórico de leitura para ambos (artigos e notícias)
-- 5. Sistema de visibilidade baseado em roles para ambos
