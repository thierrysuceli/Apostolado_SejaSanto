-- =====================================================
-- MIGRATION CONSOLIDADA: Articles and News System
-- Execute este arquivo completo no Supabase SQL Editor
-- Data: 15/11/2025
-- =====================================================

-- =====================================================
-- PARTE 1: TABELAS E ESTRUTURAS
-- =====================================================

-- TABELA: editorial_columns (Colunas Editoriais)
CREATE TABLE IF NOT EXISTS editorial_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#FDB913',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_editorial_columns_slug ON editorial_columns(slug);
CREATE INDEX IF NOT EXISTS idx_editorial_columns_order ON editorial_columns(order_index);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_editorial_columns_updated_at ON editorial_columns;
CREATE TRIGGER update_editorial_columns_updated_at
  BEFORE UPDATE ON editorial_columns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- TABELA: articles
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  editorial_column_id UUID REFERENCES editorial_columns(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views_count INTEGER DEFAULT 0,
  
  CONSTRAINT status_valid CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_column ON articles(editorial_column_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = true;

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- TABELA: article_tags
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (article_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_article_tags_article ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_role ON article_tags(role_id);

-- TABELA: news_tags
CREATE TABLE IF NOT EXISTS news_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_news_tags_slug ON news_tags(slug);

-- TABELA: news
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views_count INTEGER DEFAULT 0,
  
  CONSTRAINT status_valid CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured) WHERE is_featured = true;

DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- TABELA: news_tag_assignments
CREATE TABLE IF NOT EXISTS news_tag_assignments (
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES news_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (news_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_news_tag_assignments_news ON news_tag_assignments(news_id);
CREATE INDEX IF NOT EXISTS idx_news_tag_assignments_tag ON news_tag_assignments(tag_id);

-- TABELA: news_visibility
CREATE TABLE IF NOT EXISTS news_visibility (
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (news_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_news_visibility_news ON news_visibility(news_id);
CREATE INDEX IF NOT EXISTS idx_news_visibility_role ON news_visibility(role_id);

-- TABELA: user_article_history
CREATE TABLE IF NOT EXISTS user_article_history (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_user_article_history_user ON user_article_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_article_history_article ON user_article_history(article_id);
CREATE INDEX IF NOT EXISTS idx_user_article_history_read_at ON user_article_history(read_at DESC);

-- TABELA: user_news_history
CREATE TABLE IF NOT EXISTS user_news_history (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (user_id, news_id)
);

CREATE INDEX IF NOT EXISTS idx_user_news_history_user ON user_news_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_news_history_news ON user_news_history(news_id);
CREATE INDEX IF NOT EXISTS idx_user_news_history_read_at ON user_news_history(read_at DESC);

-- =====================================================
-- PARTE 2: SEED DATA
-- =====================================================

-- Colunas Editoriais Iniciais
INSERT INTO editorial_columns (name, slug, description, color, order_index)
VALUES 
  ('Fé Carmelita', 'fe-carmelita', 'Artigos sobre a espiritualidade carmelita', '#8B4513', 1),
  ('Franciscanos em Ação', 'franciscanos-em-acao', 'Testemunhos e histórias franciscanas', '#6B8E23', 2),
  ('Liturgia e Tradição', 'liturgia-e-tradicao', 'Aprofundamento litúrgico e tradicional', '#9370DB', 3),
  ('Vida dos Santos', 'vida-dos-santos', 'Biografias e ensinamentos dos santos', '#FFD700', 4)
ON CONFLICT (slug) DO NOTHING;

-- Tags de Notícias Iniciais
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
-- PARTE 3: ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE editorial_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_article_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_news_history ENABLE ROW LEVEL SECURITY;

-- POLICIES: editorial_columns
DROP POLICY IF EXISTS "editorial_columns_read_all" ON editorial_columns;
CREATE POLICY "editorial_columns_read_all" 
  ON editorial_columns FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "editorial_columns_admin_manage" ON editorial_columns;
CREATE POLICY "editorial_columns_admin_manage" 
  ON editorial_columns FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- POLICIES: articles
DROP POLICY IF EXISTS "articles_read_published" ON articles;
CREATE POLICY "articles_read_published" 
  ON articles FOR SELECT 
  USING (
    status = 'published' 
    AND (
      NOT EXISTS (SELECT 1 FROM article_tags WHERE article_id = id)
      OR EXISTS (
        SELECT 1 FROM article_tags at
        JOIN user_roles ur ON at.role_id = ur.role_id
        WHERE at.article_id = id AND ur.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "articles_admin_all" ON articles;
CREATE POLICY "articles_admin_all" 
  ON articles FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- POLICIES: article_tags
DROP POLICY IF EXISTS "article_tags_read_all" ON article_tags;
CREATE POLICY "article_tags_read_all" 
  ON article_tags FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "article_tags_admin_manage" ON article_tags;
CREATE POLICY "article_tags_admin_manage" 
  ON article_tags FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- POLICIES: news_tags
DROP POLICY IF EXISTS "news_tags_read_all" ON news_tags;
CREATE POLICY "news_tags_read_all" 
  ON news_tags FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "news_tags_admin_manage" ON news_tags;
CREATE POLICY "news_tags_admin_manage" 
  ON news_tags FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- POLICIES: news
DROP POLICY IF EXISTS "news_read_published" ON news;
CREATE POLICY "news_read_published" 
  ON news FOR SELECT 
  USING (
    status = 'published' 
    AND (
      NOT EXISTS (SELECT 1 FROM news_visibility WHERE news_id = id)
      OR EXISTS (
        SELECT 1 FROM news_visibility nv
        JOIN user_roles ur ON nv.role_id = ur.role_id
        WHERE nv.news_id = id AND ur.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "news_admin_all" ON news;
CREATE POLICY "news_admin_all" 
  ON news FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- POLICIES: news_tag_assignments
DROP POLICY IF EXISTS "news_tag_assignments_read_all" ON news_tag_assignments;
CREATE POLICY "news_tag_assignments_read_all" 
  ON news_tag_assignments FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "news_tag_assignments_admin_manage" ON news_tag_assignments;
CREATE POLICY "news_tag_assignments_admin_manage" 
  ON news_tag_assignments FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- POLICIES: news_visibility
DROP POLICY IF EXISTS "news_visibility_read_all" ON news_visibility;
CREATE POLICY "news_visibility_read_all" 
  ON news_visibility FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "news_visibility_admin_manage" ON news_visibility;
CREATE POLICY "news_visibility_admin_manage" 
  ON news_visibility FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- POLICIES: user_article_history
DROP POLICY IF EXISTS "user_article_history_read_own" ON user_article_history;
CREATE POLICY "user_article_history_read_own" 
  ON user_article_history FOR SELECT 
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_article_history_insert_own" ON user_article_history;
CREATE POLICY "user_article_history_insert_own" 
  ON user_article_history FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- POLICIES: user_news_history
DROP POLICY IF EXISTS "user_news_history_read_own" ON user_news_history;
CREATE POLICY "user_news_history_read_own" 
  ON user_news_history FOR SELECT 
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_news_history_insert_own" ON user_news_history;
CREATE POLICY "user_news_history_insert_own" 
  ON user_news_history FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

SELECT 'Migration concluída com sucesso! ✅' as status;
