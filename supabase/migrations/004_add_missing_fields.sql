-- =====================================================
-- MIGRATION: Adicionar campos faltantes
-- =====================================================

-- 1. Adicionar category aos cursos
ALTER TABLE courses ADD COLUMN IF NOT EXISTS category TEXT;

-- 2. Adicionar category aos posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT;

-- 3. Adicionar is_featured aos posts (para destacar)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 4. Adicionar max_participants aos eventos
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS current_participants INTEGER DEFAULT 0;

-- 5. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_is_featured ON posts(is_featured);

-- 6. Atualizar o curso de teste com categoria
UPDATE courses 
SET category = 'Teologia' 
WHERE slug = 'introducao-fe-catolica' AND category IS NULL;

-- 7. Atualizar o post de teste com categoria
UPDATE posts 
SET category = 'Avisos' 
WHERE slug = 'bem-vindo-apostolado' AND category IS NULL;

COMMIT;
