-- undefined (undefined)

-- Capítulo 1
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 1, 16);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 1, 'Paulo, servo de Deus e apóstolo de Jesus Cristo, segundo a fé dos escolhidos de Deus e o conhecimento da verdade, que é segundo a piedade,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 2, 'na esperança da vida eterna, que Deus, que não mente, prometeu antes do começo dos séculos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 3, 'e manifestou a seu tempo a sua palavra por meio da pregação que me foi confiada, por ordem de Deus nosso Salvador,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 4, 'a Tito, meu verdadeiro filho segundo a fé que nos é comum, graça e paz da parte de Deus Pai e de Jesus Cristo, nosso Salvador.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 5, 'Deixei-te em Creta para que regules o que falta e estabeleças presbíteros nas cidades, segundo as prescrições que te dei.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 6, '(É necessário que o presbítero) seja irrepreensível, casado uma só vez, que tenha filhos fiéis, que não possam ser acusados de dissolução e que não sejam desobedientes. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 7, 'Porque é preciso que o bispo seja sem crime, como despenseiro de Deus; que não seja soberbo, nem iracundo, nem dado ao vinho, nem violento, nem ávido de sórdidos lucros, (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 8, 'mas hospitaleiro, amigo do bem, ponderado, justo, santo, continente,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 9, 'que dê ensino seguro, conforme a doutrina, para que possa exortar segundo a sã doutrina e refutar os que a contradizem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 10, 'Porque há ainda muitos desobedientes, vãos faladores e sedutores, principalmente entre os da circuncisão, (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 11, 'aos quais é necessário fechar a boca, a eles que transtornam casas inteiras, ensinando o que não convém, por amor de um vil interesse.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 12, 'Um deles, seu próprio profeta disse: Os Cretenses são sempre mentirosos, más bestas, ventres preguiçosos. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 13, 'Este testemunho é verdadeiro. Portanto repreende-os asperamente, para que sejam sãos na fé,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 14, 'não dêem ouvidos a fábulas judaicas nem a mandamentos de homens que se afastam da verdade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 15, 'Para os puros todas as coisas são puras; para os impuros e infiéis nada é puro, mas estão contaminados o seu espírito e sua consciência.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 16, 'Confessam que conhecem a Deus, mas negam-no com as obras, sendo abomináveis, rebeldes e incapazes de toda a obra boa.');

-- Capítulo 2
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 2, 15);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 1, 'Tu, porém, ensina o que está conforme com a sã doutrina;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 2, '(ensina) aos velhos que sejam sóbrios, honestos, prudentes, sãos na fé, na caridade, na paciência;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 3, 'igualmente às mulheres idosas que tenham um proceder próprio de pessoas santas, que não sejam caluniadoras, não dadas ao vinho, que ensinem o bem,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 4, 'que ensinem as mulheres jovens a amar seus maridos e seus filhos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 5, 'a ser prudentes, castas, cuidadosas da casa, boas, sujeitas a seus maridos, para que se não diga mal da palavra de Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 6, 'Exorta também os jovens a que sejam regrados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 7, 'Faze-te a ti mesmo um modelo de boas obras em tudo: na pureza da doutrina, na dignidade,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 8, 'na palavra sã, irrepreensível, para que os nossos adversários sejam confundidos, não tendo mal algum a dizer de nós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 9, '(Exorta) os servos a que sejam submissos em tudo a seus senhores, agradando-lhes, não os contradizendo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 10, 'não os defraudando, mas mostrando em tudo inteira fidelidade, para que em tudo honrem a doutrina de Deus nosso Salvador.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 11, 'Porquanto a graça de Deus, fonte de salvação para todos os homens, manifestou-se,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 12, 'ensinando-nos que, renunciando à impiedade e aos desejos do século, vivamos neste século sóbria, justa e piamente,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 13, 'aguardando a esperança bem-aventurada e a vinda gloriosa do nosso grande Deus e Salvador, Jesus Cristo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 14, 'que se deu a si mesmo por nós, a fim de nos resgatar de toda a iniquidade e purificar para si um povo que seja seu, zeloso pelas boas obras.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 15, 'Ensina estas coisas, exorta e repreende com toda a autoridade. Ninguém te despreze.');

-- Capítulo 3
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 3, 15);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 1, 'Adverte-os que sejam sujeitos aos magistrados e às autoridades, que lhes obedeçam, que estejam prontos para toda a boa obra;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 2, 'que não digam mal de ninguém, nem sejam questionadores, mas modestos, mostrando toda a mansidão para com todos os homens.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 3, 'Também nós outrora éramos insensatos, rebeldes, desgarrados, escravos de paixões e prazeres, vivendo na malícia e na inveja, dignos de ódio e odiando os outros.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 4, 'Mas, quando se manifestou a bondade de Deus, nosso Salvador, e o seu amor pelos homens,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 5, 'não pelas obras de justiça que tivéssemos feito, mas por sua misericórdia, salvou-nos mediante o batismo de regeneração e de renovação do Espírito Santo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 6, 'que ele difundiu sobre nós abundantemente por Jesus Cristo, nosso Salvador,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 7, 'a fim de que, justificados pela sua graça, sejamos herdeiros da vida eterna, segundo a esperança (que temos de a possuir um dia)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 8, 'Esta é uma verdade infalível e quero que a afirmes, para que procurem ser os primeiros nas boas obras aqueles que crêem em Deus. Estas coisas são boas e úteis aos homens.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 9, 'Foge, porém, de questões loucas, de genealogias, de disputas e de contestações sobre a lei, porque são inúteis e vãs.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 10, 'Foge do herético, depois da primeira e segunda correção,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 11, 'sabendo que um tal homem está pervertido e peca, como quem é condenado pelo seu próprio juízo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 12, 'Quando eu te enviar Ártemas ou Tíquico, apressa-te a vir ter comigo a Nicópoiis, porque determinei passar ali o inverno.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 13, 'Provê com cuidado à viagem Zenas, doutor da lei, e de Apolo, procurando que nada lhes falte.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 14, 'E aprendam também os nossos a serem os primeiros em boas obras para o que for necessário, a fim de que não sejam infrutuosos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 15, 'Todos os que estão comigo te saúdam. Saúda os que nos amam na fé. A graça seja com todos vós!');

