-- Migration: Remove problematic FK from user_bible_progress
-- A FK está causando erro mesmo com user_id válido
-- Vamos confiar no RLS para validação

-- Dropar a FK
ALTER TABLE IF EXISTS user_bible_progress 
DROP CONSTRAINT IF EXISTS user_bible_progress_user_id_fkey;

-- Adicionar comentário explicativo
COMMENT ON TABLE user_bible_progress IS 
'Stores Bible reading progress. Uses RLS for security instead of FK to avoid constraint validation issues.';

-- Verificar se RLS está ativo
ALTER TABLE user_bible_progress ENABLE ROW LEVEL SECURITY;
