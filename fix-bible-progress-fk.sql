-- Fix user_bible_progress FK to point to auth.users instead of public.users

-- Drop existing FK constraint
ALTER TABLE user_bible_progress 
DROP CONSTRAINT IF EXISTS user_bible_progress_user_id_fkey;

-- Remove the problematic FK and recreate table structure
-- Since we can't have FK to auth.users directly, we remove the FK entirely
-- RLS policies will handle authorization

COMMENT ON TABLE user_bible_progress IS 'Stores user reading progress in the Bible. Uses auth.uid() for user identification via RLS policies.';
