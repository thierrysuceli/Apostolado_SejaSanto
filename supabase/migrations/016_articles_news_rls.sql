-- =====================================================
-- MIGRATION: RLS Policies for Articles and News
-- Data: 15/11/2025
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

-- =====================================================
-- POLICIES: editorial_columns
-- =====================================================
-- Everyone can read editorial columns
CREATE POLICY "editorial_columns_read_all" 
  ON editorial_columns FOR SELECT 
  USING (true);

-- Only admins can manage editorial columns
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

-- =====================================================
-- POLICIES: articles
-- =====================================================
-- Read published articles
CREATE POLICY "articles_read_published" 
  ON articles FOR SELECT 
  USING (
    status = 'published' 
    AND (
      -- No tags (public) OR user has required role
      NOT EXISTS (SELECT 1 FROM article_tags WHERE article_id = id)
      OR EXISTS (
        SELECT 1 FROM article_tags at
        JOIN user_roles ur ON at.role_id = ur.role_id
        WHERE at.article_id = id AND ur.user_id = auth.uid()
      )
    )
  );

-- Admins can see all articles
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

-- =====================================================
-- POLICIES: article_tags
-- =====================================================
CREATE POLICY "article_tags_read_all" 
  ON article_tags FOR SELECT 
  USING (true);

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

-- =====================================================
-- POLICIES: news_tags
-- =====================================================
CREATE POLICY "news_tags_read_all" 
  ON news_tags FOR SELECT 
  USING (true);

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

-- =====================================================
-- POLICIES: news
-- =====================================================
-- Read published news
CREATE POLICY "news_read_published" 
  ON news FOR SELECT 
  USING (
    status = 'published' 
    AND (
      -- No visibility restrictions (public) OR user has required role
      NOT EXISTS (SELECT 1 FROM news_visibility WHERE news_id = id)
      OR EXISTS (
        SELECT 1 FROM news_visibility nv
        JOIN user_roles ur ON nv.role_id = ur.role_id
        WHERE nv.news_id = id AND ur.user_id = auth.uid()
      )
    )
  );

-- Admins can see all news
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

-- =====================================================
-- POLICIES: news_tag_assignments
-- =====================================================
CREATE POLICY "news_tag_assignments_read_all" 
  ON news_tag_assignments FOR SELECT 
  USING (true);

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

-- =====================================================
-- POLICIES: news_visibility
-- =====================================================
CREATE POLICY "news_visibility_read_all" 
  ON news_visibility FOR SELECT 
  USING (true);

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

-- =====================================================
-- POLICIES: user_article_history
-- =====================================================
-- Users can read their own history
CREATE POLICY "user_article_history_read_own" 
  ON user_article_history FOR SELECT 
  USING (user_id = auth.uid());

-- Users can insert their own history
CREATE POLICY "user_article_history_insert_own" 
  ON user_article_history FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- POLICIES: user_news_history
-- =====================================================
-- Users can read their own history
CREATE POLICY "user_news_history_read_own" 
  ON user_news_history FOR SELECT 
  USING (user_id = auth.uid());

-- Users can insert their own history
CREATE POLICY "user_news_history_insert_own" 
  ON user_news_history FOR INSERT 
  WITH CHECK (user_id = auth.uid());
