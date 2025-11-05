-- Migration: Clean HTML tags from video_url field
-- This fixes the constraint violation issue where HTML was saved instead of URLs

-- Step 1: Show affected rows before cleanup
SELECT 
  id,
  title,
  video_url,
  LENGTH(video_url) as url_length,
  CASE 
    WHEN video_url LIKE '%<%' THEN '⚠️ Contains HTML'
    WHEN video_url LIKE '%youtube.com/embed/%' THEN '✅ OK'
    WHEN video_url LIKE '%youtube%' THEN '⚠️ Needs conversion'
    ELSE '➖ No video'
  END as status
FROM topics
WHERE video_url IS NOT NULL AND video_url != ''
ORDER BY status DESC, id;

-- Step 2: Remove HTML tags from video_url
UPDATE topics
SET video_url = REGEXP_REPLACE(video_url, '<[^>]*>', '', 'g')
WHERE video_url LIKE '%<%';

-- Step 3: Remove any remaining HTML entities
UPDATE topics
SET video_url = REGEXP_REPLACE(video_url, '&[a-z]+;', '', 'gi')
WHERE video_url LIKE '%&%' AND video_url NOT LIKE '%youtube.com/watch?v=%';

-- Step 4: Trim whitespace
UPDATE topics
SET video_url = TRIM(video_url)
WHERE video_url != TRIM(video_url);

-- Step 5: Convert youtube.com/watch?v= to embed format
UPDATE topics
SET video_url = REPLACE(
  video_url,
  'youtube.com/watch?v=',
  'youtube.com/embed/'
)
WHERE video_url LIKE '%youtube.com/watch?v=%'
AND video_url NOT LIKE '%youtube.com/embed/%';

-- Step 6: Convert youtu.be/ to embed format
UPDATE topics
SET video_url = REPLACE(
  video_url,
  'youtu.be/',
  'youtube.com/embed/'
)
WHERE video_url LIKE '%youtu.be/%'
AND video_url NOT LIKE '%youtube.com/embed/%';

-- Step 7: Remove query parameters from embed URLs (keep only video ID)
UPDATE topics
SET video_url = SUBSTRING(video_url FROM 1 FOR POSITION('&' IN video_url) - 1)
WHERE video_url LIKE '%youtube.com/embed/%&%';

-- Step 8: Ensure HTTPS
UPDATE topics
SET video_url = REPLACE(video_url, 'http://', 'https://')
WHERE video_url LIKE 'http://%youtube%';

-- Step 9: Set to NULL if empty after cleanup
UPDATE topics
SET video_url = NULL
WHERE video_url = '' OR LENGTH(TRIM(video_url)) = 0;

-- Step 10: Verify results
SELECT 
  COUNT(*) as total_topics,
  COUNT(video_url) as topics_with_video,
  COUNT(CASE WHEN video_url LIKE '%youtube.com/embed/%' THEN 1 END) as valid_embed_urls,
  COUNT(CASE WHEN video_url LIKE '%<%' THEN 1 END) as still_has_html,
  COUNT(CASE WHEN video_url LIKE '%youtube%' AND video_url NOT LIKE '%youtube.com/embed/%' THEN 1 END) as needs_manual_fix
FROM topics;

-- Step 11: Show remaining issues (if any)
SELECT 
  id,
  title,
  video_url,
  '⚠️ Manual fix needed' as note
FROM topics
WHERE video_url IS NOT NULL 
  AND video_url != ''
  AND (
    video_url LIKE '%<%' OR
    (video_url LIKE '%youtube%' AND video_url NOT LIKE '%youtube.com/embed/%')
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Video URL cleanup completed!';
  RAISE NOTICE 'Check the verification queries above for results.';
END $$;
