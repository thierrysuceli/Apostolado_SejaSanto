-- undefined (undefined)

-- Capítulo 1
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 1, 13);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 1, 'O Ancião à Senhora eleita e a seus filhos que eu amo na verdade — e não somente eu, mas também todos os que têm conhecido a verdade —'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 2, 'por causa da verdade que permanece em nós e que será connosco eternamente.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 3, 'Connosco serão a graça, a misericórdia, a paz, da parte de Deus Pai, e da de Jesus Cristo, Filho do Pai, em verdade e em caridade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 4, 'Muito me alegrei por ter encontrado alguns de teus filhos que seguem o caminho da verdade, segundo o mandamento que recebemos do Pai.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 5, 'E agora rogo-te, Senhora, não como se te escrevesse um novo mandamento, mas o que tivemos desde o principio, que nos amemos uns aos outros.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 6, 'A caridade consiste em que andemos segundo os seus mandamentos. Este é o mandamento, segundo o qual deveis caminhar, como ouvistes desde o princípio.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 7, 'Porque muitos sedutores se têm levantado no mundo, que não confessam que Jesus Cristo tenha vindo em carne: eis o sedutor e o Anticristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 8, 'Estai alerta sobre vós, para que não percais o fruto de vossos trabalhos, mas recebais uma plena recompensa.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 9, 'Todo o que se aparta e não permanece na doutrina de Cristo, não tem Deus; o que permanece na doutrina, este tem o Pai e o Filho.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 10, 'Se alguém vem a vós e não traz esta doutrina, não o recebais em vossa casa, nem o saudeis, (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 11, 'porque, quem o saúda, participa (em certo modo) das suas obras más.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 12, 'Embora eu tivesse muitas coisas a escrever-vos, não quis fazê-lo por papel e tinta, porque espero ir ter convosco e falar-vos de viva voz, para que a nossa alegria seja perfeita.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 13, 'Saúdam-te os filhos de tua irmã Eleita.');

