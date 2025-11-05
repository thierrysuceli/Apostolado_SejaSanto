-- Update YouTube URL constraint to accept more formats
ALTER TABLE topics
DROP CONSTRAINT IF EXISTS video_url_youtube;

ALTER TABLE topics
ADD CONSTRAINT video_url_youtube CHECK (
  video_url IS NULL OR 
  video_url ~* '^(https?://)?(www\.)?(youtube\.com/(watch\?v=|embed/)|youtu\.be/)[a-zA-Z0-9_-]{11}$'
);
