-- Add duration column to topics table
ALTER TABLE topics
ADD COLUMN duration TEXT;

COMMENT ON COLUMN topics.duration IS 'Duração estimada da aula (ex: "15 min", "1h 30min")';
