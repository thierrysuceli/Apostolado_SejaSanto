-- =====================================================
-- FIX DEFINITIVO: Dropar e recriar FK apontando para public.users
-- =====================================================

-- 1. Dropar FK que aponta para auth.users
ALTER TABLE user_bible_progress 
  DROP CONSTRAINT IF EXISTS user_bible_progress_user_id_fkey;

-- 2. Recriar FK apontando para public.users
ALTER TABLE user_bible_progress
  ADD CONSTRAINT user_bible_progress_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 3. Fazer o mesmo para user_course_progress
ALTER TABLE user_course_progress
  DROP CONSTRAINT IF EXISTS user_course_progress_user_id_fkey;

ALTER TABLE user_course_progress
  ADD CONSTRAINT user_course_progress_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 4. Fazer o mesmo para user_post_progress
ALTER TABLE user_post_progress
  DROP CONSTRAINT IF EXISTS user_post_progress_user_id_fkey;

ALTER TABLE user_post_progress
  ADD CONSTRAINT user_post_progress_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 5. Fazer o mesmo para comments
ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS comments_user_id_fkey;

ALTER TABLE comments
  ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 6. Fazer o mesmo para bible_verse_comments
ALTER TABLE bible_verse_comments
  DROP CONSTRAINT IF EXISTS bible_verse_comments_user_id_fkey;

ALTER TABLE bible_verse_comments
  ADD CONSTRAINT bible_verse_comments_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 7. Fazer o mesmo para posts (author_id)
ALTER TABLE posts
  DROP CONSTRAINT IF EXISTS posts_author_id_fkey;

ALTER TABLE posts
  ADD CONSTRAINT posts_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES public.users(id)
  ON DELETE SET NULL;
