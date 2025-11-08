-- Investigation and Fix: User sync issue
-- User ID: 51f07a81-41b5-457e-b65f-0a18f8e9e0b9 not present in users table

-- 1. Check if user exists in auth.users
DO $$
DECLARE
  auth_user_exists boolean;
  app_user_exists boolean;
BEGIN
  -- Check auth.users
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE id = '51f07a81-41b5-457e-b65f-0a18f8e9e0b9'
  ) INTO auth_user_exists;
  
  -- Check users
  SELECT EXISTS(
    SELECT 1 FROM users WHERE id = '51f07a81-41b5-457e-b65f-0a18f8e9e0b9'
  ) INTO app_user_exists;
  
  RAISE NOTICE 'User in auth.users: %', auth_user_exists;
  RAISE NOTICE 'User in users table: %', app_user_exists;
END $$;

-- 2. Sync ALL users from auth.users to users table
-- This ensures no user is left behind
INSERT INTO users (id, email, name, avatar_url, created_at, is_active)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1)) as name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url,
  au.created_at,
  TRUE as is_active
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- 3. Verify the sync worked
DO $$
DECLARE
  synced_count integer;
BEGIN
  SELECT COUNT(*) 
  FROM auth.users au 
  WHERE EXISTS(SELECT 1 FROM users u WHERE u.id = au.id)
  INTO synced_count;
  
  RAISE NOTICE 'Total users synced: %', synced_count;
END $$;

-- 4. Fix bible_verse_comments JOIN issue
-- The error says: "Could not find a relationship between 'bible_verse_comments' and 'user_id'"
-- This is because the foreign key is named 'user_id' but Supabase expects standard naming

-- Check current foreign key constraint
DO $$
DECLARE
  fk_name text;
BEGIN
  SELECT conname INTO fk_name
  FROM pg_constraint
  WHERE conrelid = 'bible_verse_comments'::regclass
    AND contype = 'f'
    AND confrelid = 'users'::regclass;
  
  RAISE NOTICE 'Current FK constraint name: %', fk_name;
END $$;

-- Drop and recreate with standard naming if needed
ALTER TABLE IF EXISTS bible_verse_comments 
  DROP CONSTRAINT IF EXISTS bible_verse_comments_user_id_fkey;

ALTER TABLE bible_verse_comments
  ADD CONSTRAINT bible_verse_comments_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

-- 5. Verify all FK constraints are properly named
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('user_bible_progress', 'user_course_progress', 'bible_verse_comments')
  AND ccu.table_name = 'users'
ORDER BY tc.table_name;
