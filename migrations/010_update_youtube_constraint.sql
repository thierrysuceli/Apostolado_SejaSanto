-- Migration: Update video_url constraint to accept embed format
-- This fixes the constraint that only accepted watch?v= and youtu.be/ formats

-- Step 1: Drop old constraint
ALTER TABLE topics
DROP CONSTRAINT IF EXISTS video_url_youtube;

-- Step 2: Add new constraint that accepts embed format
ALTER TABLE topics
ADD CONSTRAINT video_url_youtube CHECK (
  video_url IS NULL OR
  video_url = '' OR
  video_url ~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$'
);

-- Validation: Show which URLs would fail the new constraint
SELECT 
  id,
  title,
  video_url,
  CASE 
    WHEN video_url IS NULL OR video_url = '' THEN '➖ Empty (OK)'
    WHEN video_url ~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$' THEN '✅ Valid'
    ELSE '❌ Invalid - needs fixing'
  END as status
FROM topics
WHERE video_url IS NOT NULL
ORDER BY status DESC;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Constraint updated to accept youtube.com/embed/ format';
  RAISE NOTICE 'Run 009_clean_video_urls.sql if you see any invalid URLs above';
END $$;
