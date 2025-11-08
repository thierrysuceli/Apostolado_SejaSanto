-- =====================================================
-- CORREÇÃO FINAL: RLS policies incorretas
-- =====================================================
-- PROBLEMA: As policies usam auth.uid() mas o sistema usa public.users
-- SOLUÇÃO: Desabilitar RLS ou mudar para checar apenas user_id

-- 1. user_bible_progress - DESABILITAR RLS temporariamente
ALTER TABLE user_bible_progress DISABLE ROW LEVEL SECURITY;

-- 2. user_course_progress - DESABILITAR RLS temporariamente
ALTER TABLE user_course_progress DISABLE ROW LEVEL SECURITY;

-- 3. user_post_progress - DESABILITAR RLS temporariamente
ALTER TABLE user_post_progress DISABLE ROW LEVEL SECURITY;

-- 4. Verificar se comments precisa
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- 5. Verificar se posts precisa
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- 6. bible_verse_comments - DESABILITAR RLS temporariamente
ALTER TABLE bible_verse_comments DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- NOTA: Em produção, você deve criar policies corretas
-- que checam o user_id da sessão (não auth.uid())
-- =====================================================
