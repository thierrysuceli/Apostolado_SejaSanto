-- =====================================================
-- FIX FINAL: Corrigir FK de bible_verse_comments
-- =====================================================

-- Dropar FK que aponta para auth.users
ALTER TABLE bible_verse_comments 
  DROP CONSTRAINT IF EXISTS bible_verse_comments_user_id_fkey CASCADE;

-- Recriar FK apontando para public.users
ALTER TABLE bible_verse_comments
  ADD CONSTRAINT bible_verse_comments_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- Desabilitar RLS
ALTER TABLE bible_verse_comments DISABLE ROW LEVEL SECURITY;

-- Verificar bible_notes (já deve estar correto)
ALTER TABLE bible_notes DISABLE ROW LEVEL SECURITY;
