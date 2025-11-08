-- RPC Function para fazer UPSERT de progresso da Bíblia
-- Contorna o problema da FK user_bible_progress_user_id_fkey

CREATE OR REPLACE FUNCTION upsert_bible_progress(
  p_user_id UUID,
  p_book_abbrev VARCHAR,
  p_chapter INT,
  p_verse INT
)
RETURNS TABLE (
  id INT,
  user_id UUID,
  book_abbrev VARCHAR,
  chapter INT,
  verse INT,
  last_read_at TIMESTAMP
) AS $$
BEGIN
  -- Deletar registro existente
  DELETE FROM user_bible_progress 
  WHERE user_bible_progress.user_id = p_user_id 
    AND user_bible_progress.book_abbrev = p_book_abbrev;
  
  -- Inserir novo registro
  RETURN QUERY
  INSERT INTO user_bible_progress (user_id, book_abbrev, chapter, verse, last_read_at)
  VALUES (p_user_id, p_book_abbrev, p_chapter, p_verse, NOW())
  RETURNING 
    user_bible_progress.id,
    user_bible_progress.user_id,
    user_bible_progress.book_abbrev,
    user_bible_progress.chapter,
    user_bible_progress.verse,
    user_bible_progress.last_read_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute para authenticated users
GRANT EXECUTE ON FUNCTION upsert_bible_progress(UUID, VARCHAR, INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_bible_progress(UUID, VARCHAR, INT, INT) TO service_role;
