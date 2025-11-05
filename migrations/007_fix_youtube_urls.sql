-- Migration: Fix existing YouTube URLs to embed format
-- This script converts all YouTube URLs from watch?v= format to embed format

-- Convert youtube.com/watch?v= URLs
UPDATE topics
SET video_url = REPLACE(
  video_url,
  'youtube.com/watch?v=',
  'youtube.com/embed/'
)
WHERE video_url LIKE '%youtube.com/watch?v=%'
AND video_url NOT LIKE '%youtube.com/embed/%';

-- Convert youtu.be/ URLs
UPDATE topics
SET video_url = REPLACE(
  video_url,
  'youtu.be/',
  'youtube.com/embed/'
)
WHERE video_url LIKE '%youtu.be/%'
AND video_url NOT LIKE '%youtube.com/embed/%';

-- Remove query parameters after video ID in embed URLs
UPDATE topics
SET video_url = SUBSTRING(video_url FROM 1 FOR POSITION('&' IN video_url) - 1)
WHERE video_url LIKE '%youtube.com/embed/%&%';

-- Ensure all URLs use https
UPDATE topics
SET video_url = REPLACE(video_url, 'http://', 'https://')
WHERE video_url LIKE 'http://%youtube%';

-- Show results
SELECT 
  id,
  title,
  video_url,
  CASE 
    WHEN video_url LIKE '%youtube.com/embed/%' THEN '✅ OK'
    WHEN video_url LIKE '%youtube%' THEN '⚠️ Needs manual check'
    ELSE '➖ No video'
  END as status
FROM topics
WHERE video_url IS NOT NULL AND video_url != ''
ORDER BY status, id;
