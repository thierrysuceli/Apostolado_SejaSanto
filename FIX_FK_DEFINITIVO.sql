-- CORREÇÃO DEFINITIVA: FK apontando para tabela errada
-- A FK user_bible_progress_user_id_fkey está apontando para auth.users
-- Mas os usuários estão em public.users!

-- 1. Dropar FK atual (que aponta para auth.users)
ALTER TABLE user_bible_progress 
  DROP CONSTRAINT IF EXISTS user_bible_progress_user_id_fkey;

-- 2. Criar FK correta apontando para public.users
ALTER TABLE user_bible_progress
  ADD CONSTRAINT user_bible_progress_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 3. Verificar outras tabelas com o mesmo problema
ALTER TABLE user_course_progress
  DROP CONSTRAINT IF EXISTS user_course_progress_user_id_fkey;

ALTER TABLE user_course_progress
  ADD CONSTRAINT user_course_progress_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

ALTER TABLE user_post_progress
  DROP CONSTRAINT IF EXISTS user_post_progress_user_id_fkey;

ALTER TABLE user_post_progress
  ADD CONSTRAINT user_post_progress_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 4. Verificar comentários
ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS comments_user_id_fkey;

ALTER TABLE comments
  ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 5. Verificar posts
ALTER TABLE posts
  DROP CONSTRAINT IF EXISTS posts_author_id_fkey;

ALTER TABLE posts
  ADD CONSTRAINT posts_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES public.users(id)
  ON DELETE SET NULL;
