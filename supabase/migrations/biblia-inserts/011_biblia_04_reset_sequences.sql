-- Reset sequences para IDs corretos
SELECT setval('bible_books_id_seq', (SELECT MAX(id) FROM bible_books));
SELECT setval('bible_chapters_id_seq', (SELECT MAX(id) FROM bible_chapters));
SELECT setval('bible_verses_id_seq', (SELECT MAX(id) FROM bible_verses));
