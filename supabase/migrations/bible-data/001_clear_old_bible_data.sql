-- Limpar dados antigos da Bíblia
DELETE FROM bible_verses;
DELETE FROM bible_chapters;
DELETE FROM bible_books;

-- Reset sequences
ALTER SEQUENCE bible_books_id_seq RESTART WITH 1;
ALTER SEQUENCE bible_chapters_id_seq RESTART WITH 1;
ALTER SEQUENCE bible_verses_id_seq RESTART WITH 1;
