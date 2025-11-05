-- Migration: Add thematic tags system
-- Created: 2025-11-03

-- Create tags table (different from roles)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6b7280',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction tables for content tags
CREATE TABLE IF NOT EXISTS course_content_tags (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);

CREATE TABLE IF NOT EXISTS post_content_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS event_content_tags (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, tag_id)
);

-- Insert default thematic tags
INSERT INTO tags (name, slug, description, color) VALUES
  ('Mariologia', 'mariologia', 'Estudos sobre Nossa Senhora', '#3b82f6'),
  ('Matrimônio', 'matrimonio', 'Sacramento do Matrimônio', '#ec4899'),
  ('Eucaristia', 'eucaristia', 'Sacramento da Eucaristia', '#f59e0b'),
  ('Oração', 'oracao', 'Vida de Oração', '#8b5cf6'),
  ('Santos', 'santos', 'Vida dos Santos', '#10b981'),
  ('Bíblia', 'biblia', 'Sagradas Escrituras', '#ef4444'),
  ('Catequese', 'catequese', 'Formação Catequética', '#6366f1'),
  ('Doutrina', 'doutrina', 'Doutrina da Igreja', '#14b8a6')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_content_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies (read-only for users, admin can manage)
CREATE POLICY "Anyone can view tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Admins can insert tags" ON tags FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'ADMIN');
CREATE POLICY "Admins can update tags" ON tags FOR UPDATE USING (auth.jwt()->>'role' = 'ADMIN');
CREATE POLICY "Admins can delete tags" ON tags FOR DELETE USING (auth.jwt()->>'role' = 'ADMIN');

CREATE POLICY "Anyone can view course content tags" ON course_content_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage course content tags" ON course_content_tags FOR ALL USING (auth.jwt()->>'role' = 'ADMIN');

CREATE POLICY "Anyone can view post content tags" ON post_content_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage post content tags" ON post_content_tags FOR ALL USING (auth.jwt()->>'role' = 'ADMIN');

CREATE POLICY "Anyone can view event content tags" ON event_content_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage event content tags" ON event_content_tags FOR ALL USING (auth.jwt()->>'role' = 'ADMIN');
