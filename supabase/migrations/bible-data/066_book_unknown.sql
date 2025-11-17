-- undefined (undefined)

-- Capítulo 1
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 1, 25);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 1, 'Paulo, prisioneiro de Jesus Cristo, e o irmão Timóteo, ao amado Filémon, nosso cooperador,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 2, 'e a Ápia, nossa irmã, e a Arquipo, nosso companheiro de armas, e à igreja que se reúne em tua casa:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 3, 'graça a vós e paz da parte de Deus nosso Pai e do Senhor Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 4, 'Dou graças ao meu Deus, sempre que faço memória de ti nas minhas orações,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 5, 'por saber da tua caridade e da fé que manifestas para com o Senhor Jesus e para com todos os santos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 6, 'Possa a generosidade da tua fé tornar-se eficaz pelo conhecimento de todas as obras boas que se fazem entre nós por amor de Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 7, 'De facto, tive grande alegria e consolação pela tua caridade, porquanto os corações dos santos foram confortados por ti, irmão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 8, 'Pelo que, ainda que eu tenha muita liberdade em Jesus Cristo para te mandar o que convém,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 9, 'prefiro pedir-te por caridade (não te mando). Eu, Paulo, o velho Paulo, e atualmente até prisioneiro de Jesus Cristo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 10, 'venho rogar-te por meu filho Onésimo, que gerei nas prisões (convertendo-o a Cristo),'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 11, 'o qual outrora te foi inútil, mas agora é muito útil para ti e para mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 12, 'De novo to mando, a ele, que é como o meu próprio coração.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 13, 'Eu queria demorá-lo comigo, para que me servisse, em teu lugar, nestas cadeias, que eu suporto pelo Evangelho,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 14, 'mas, sem o teu consentimento, nada quis fazer, para que o teu benefício não fosse como que forçado, mas voluntário.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 15, 'Porque talvez ele (por permissão de Deus) se apartou de ti por algum tempo, para que tu (pela sua conversão a Cristo) o recobrasses para sempre,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 16, 'não já como um escravo, mas, muito mais que um escravo, como um irmão caríssimo. Ele fez tudo por mim, quanto mais não fará por ti, não só segundo a carne, mas também segundo o Senhor!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 17, 'Portanto, se me tens por íntimo, recebe-o como a mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 18, 'Se algum dano te fez ou te deve alguma coisa, passa isso para a minha conta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 19, 'Eu, Paulo, escrevi por meu próprio punho: eu pagarei. Não te quero lembrar que és meu devedor, e que me deves a tua própria pessoa (porque te converti, pondo-te no caminho da salvação).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 20, 'Sim, irmão. Obtenha eu de ti esta satisfação no Senhor. Recreia o meu coração em Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 21, 'Escrevi-te estas coisas, contando com a tua docilidade, sabendo que farás ainda mais do que peço.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 22, 'A o mesmo tempo prepara-me pousada, pois pelas vossas orações, serei dado a vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 23, 'Epafras, que está preso comigo por Jesus Cristo, saúda-te,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 24, 'e igualmente Marcos, Aristarco, Demas e Lucas, meus colaboradores.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 25, 'A graça de Nosso Senhor Jesus Cristo seja com o vosso espírito.');

