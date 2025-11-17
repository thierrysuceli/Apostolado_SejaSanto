-- undefined (undefined)

-- Capítulo 1
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 1, 13);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 1, 'O Ancião ao caríssimo Gaio, a quem eu amo na verdade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 2, 'Caríssimo, desejo que prosperes em tudo e tenhas saúde, como a tem ditosamente a tua alma.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 4, 'Eu não tenho maior alegria do que ouvir dizer que os meus filhos andam no caminho da verdade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 5, 'Caríssimo, tu procedes fielmente (como bom cristão), em tudo o que fazes com os irmãos, e particularmente com os estrangeiros,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 6, 'os quais deram testemunho da tua caridade diante da Igreja; farás bem em prover às suas viagens de um modo digno de Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 7, 'De facto, foi pelo Nome (do Senhor) que eles partiram, não recebendo nada dos gentios.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 8, 'Nós, pois, devemos receber estes tais, para cooperarmos com eles na (propagação da) verdade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 9, 'Escrevi uma palavra à Igreja, porém Diótrefes, que gosta de ter a primazia entre eles, não nos recebe;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 10, 'por isso, se eu lá for, recordar-lhe-ei as obras que ele faz, pairando com palavras más contra nós; como se isto não Ihe bastasse, não só recusa hospedagem aos irmãos, mas proíbe (recebê-los) aqueles que os recebem, e lança-os fora da Igreja.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 11, 'Caríssimo, não imites o mal, mas o bem. Quem faz o bem, é de Deus; quem faz o mal, não viu a Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 12, 'De Demétrío todos dão (bom) testemunho, e a mesma verdade lho dá. Nós lho damos também; e tu sabes que o nosso testemunho é verdadeiro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 13, 'Eu tinha mais coisas a escrever-te, porém não quero fazê-lo por meio de tinta e pena,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 14, 'porque espero ver-te, era breve, e falaremos de viva voz. A paz seja contigo. Os amigos saúdam-te. Tu saúda (também) os amigos, cada um em particular.');

