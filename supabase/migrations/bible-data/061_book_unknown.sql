-- undefined (undefined)

-- Capítulo 1
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 1, 10);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 1, 'Paulo, Silvano e Timóteo, à Igreja dos Tessalonicenses, que está em Deus Pai e no Senhor Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 2, 'Graça e paz vos sejam dadas. Damos sempre graças a Deus por todos vós, fazendo continuamente memória de vós nas nossas orações,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 3, 'lembrando-nos, diante de Deus, nosso Pai, da obra da vossa fé, do trabalho da vossa caridade e da constância da vossa esperança em Nosso Senhor Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 4, 'Com efeito sabemos, irmãos amados de Deus, que fostes escolhidos (para participar dos beneficias da Redenção),'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 5, 'porque o nosso Evangelho não vos foi pregado somente com palavras, mas também com poder, com o Espírito Santo e com perfeita segurança. Com efeito, sabeis quais nós fomos entre vós, por amor de vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 6, 'Por vossa parte, fizestes-vos imitadores nossos e do Senhor, recebendo a palavra no meio de muita tribulação, com a alegria do Espírito Santo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 7, 'de modo que vos tornastes modelo para todos os crentes da Macedônia e da Acaia.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 8, 'Por meio de vós se difundiu a palavra do Senhor, não só pela Macedônia e pela Acaia, mas também se propagou por toda a parte o renome da fé que tendes em Deus, de sorte que não sentimos necessidade de dizer sobre isso coisa alguma.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 9, 'De facto eles mesmos (os fiéis) publicam de nós qual foi a aceitação que tivemos entre vós, como vos convertestes dos ídolos a Deus, para servirdes ao Deus vivo e verdadeiro'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 10, 'e para esperardes do céu a seu Filho, a quem ele ressuscitou dos mortos, Jesus o qual nos livrou da ira que há-de vir (vingar o pecado).');

-- Capítulo 2
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 2, 20);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 1, 'Efetivamente sabeis, irmãos, que a nossa ida a vós não foi sem fruto,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 2, 'pois, tendo primeiro sofrido e tolerado afrontas, como sabeis, em Filipos, tivemos confiança em nosso Deus para vos pregar o Evangelho de Deus no meio de muitos obstáculos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 3, 'A nossa pregação não procedeu de erro, nem de malícia, nem de fraude,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 4, 'mas, como fomos aprovados por Deus, para que nos fosse confiado o Evangelho, assim falamos, não para agradar aos homens, mas a Deus, que sonda os nossos corações.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 5, 'Realmente a nossa linguagem nunca foi de adulação, como sabeis, nem um pretexto de avareza — Deus é testemunha —'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 6, 'nem buscamos glória dos homens, quer de vós, quer de outros.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 7, 'Podendo, como apóstolos de Cristo, ser-vos de algum peso, fizemo-nos pequenos entre vós. Como a mãe que cerca de ternos cuidados os seus filhos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 8, 'assim, amando-vos muito, ansiosamente desejávamos dar-vos não só o Evangelho de Deus, mas ainda a nossa própria vida, porquanto nos éreis muito queridos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 9, 'Certamente vos lembrais, irmãos, do nosso trabalho e fadiga: trabalhando de noite e de dia para não sermos pesados a nenhum de vós, pregamos entre vós o Evangelho de Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 10, 'Vós e Deus sois testemunhas de quão santa, justa e irrepreensivelmente procedemos convosco, que crestes,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 11, 'assim como sabeis de que maneira a cada um de vós, como um pai a seus filhos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 12, 'vos andávamos exortando, confortando e suplicando que andásseis de uma maneira digna de Deus, que vos chamou ao seu reino e à sua glória.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 13, 'Por isso, também nós damos sem cessar graças a Deus, porque, tendo vós recebido a palavra de Deus, que ouvistes de nós, a abraçastes, não como palavra dos homens, mas, segundo é, na verdade, como palavra de Deus, que opera em vós, que crestes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 14, 'Porque vós, irmãos, tornastes-vos imitadores das igrejas de Deus, que há pela Judeia, das igrejas de Jesus Cristo, porque vós também sofrestes, da parte dos da vossa própria nação, as mesmas coisas que elas igualmente sofreram dos Judeus,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 15, '(desses Judeus) que mataram o Senhor Jesus e os profetas, que nos têm perseguido a nós, não agradam a Deus e são inimigos de todos os homens,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 16, 'proibindo-nos de pregar aos gentios para que sejam salvos. Assim vão sempre enchendo a medida dos seus pecados. Mas a ira de Deus caiu sobre eles com todo o rigor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 17, 'Ora nós, irmãos, privados por um pouco de tempo de vós, quanto à vista, não quanto ao coração, ainda mais nos apressamos, com grande desejo, a tornar a ver a vossa face.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 18, 'Pelo que quisemos ir ter convosco, principalmente eu, Paulo, uma e outra vez, mas Satanás impediu-nos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 19, 'Pois, qual é a nossa esperança, a nossa alegria, coroa de glória? Porventura não o sois vós, diante do Senhor Jesus Cristo, na sua vinda?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 20, 'Sim, vós sois a nossa glória e a nossa alegria.');

-- Capítulo 3
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 3, 13);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 1, 'Pelo que, não podendo mais sofrer (a falta de noticias vossas), preferimos ficar sós em Atenas,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 2, 'e enviamos Timóteo, nosso irmão e ministro de Deus no Evangelho de Cristo, para vos fortalecer e confortar, na vossa fé,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 3, 'a fim de que ninguém seja abalado por estas tribulações, pois vós mesmos sabeis que para isto fomos destinados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 4, 'Pois, quando ainda estávamos convosco, vos predizíamos que havíamos de padecer tribulações, como com efeito aconteceu e vós o sabeis.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 5, 'Por isso, não podendo eu sofrer mais demora, enviei a buscar notícias da vossa fé, temendo que o tentador vos tenha tentado e que se torne inútil o nosso trabalho.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 6, 'Mas agora, voltando Timóteo a nós, depois de vos ter visitado, e trazendo-nos boas novas da vossa fé e caridade, da vossa sempre afetuosa lembrança de nós, do vosso desejo de nos tornar a ver, desejo igual ao nosso (de vos tornar a ver, a vós)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 7, 'com isto temos sido consolados a vosso respeito, pela vossa fé, no meio de toda a nossa angústia e tribulação,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 8, 'porque agora (podemos dizer que) vivem os, visto que vós estais firmes no Senhor. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 9, 'Que ação de graças podemos dar a Deus por vós, por toda a alegria que gozamos por vossa causa diante do nosso Deus?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 10, 'Pedimos-lhe de noite e de dia, com a maior instância, que cheguemos a ver a vossa face e que completemos o que falta à vossa fé.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 11, 'Que o mesmo Deus, Pai nosso, e Nosso Senhor Jesus Cristo, encaminhem os nossos passos para vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 12, 'Senhor vos faça crescer e abundar na caridade, uns para com os outros, e para com todos, assim como é a nossa para convosco.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 13, 'Que os vossos corações, livres de culpa, sejam confirmados na santidade diante de nosso Deus e Pai, por ocasião da vinda de Nosso Senhor Jesus Cristo, com todos os seus santos.');

-- Capítulo 4
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 4, 18);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 1, 'Quanto ao mais, irmãos, nós vos rogamos e suplicamos, no Senhor Jesus, que, como aprendestes de nós de que maneira deveis andar para agradar a Deus, consoante já procedeis, façais nisto novos progressos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 2, 'Com efeito, sabeis que preceitos vos dei, por parte do Senhor Jesus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 3, 'Porquanto esta é a vontade de Deus, que vos santifiqueis: que eviteis a impudicícia,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 4, 'que cada um de vós saiba possuir o seu corpo em santidade e honra,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 5, 'não nas paixões desregradas, como fazem os gentios, que não conhecem a Deus,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 6, 'e que ninguém oprima ou engane o seu irmão, nesta matéria, porque o Senhor é vingador de todas estas coisas, como já vos dissemos e atestamos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 7, 'Em verdade, Deus não nos chamou para a impureza, mas para a santidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 8, 'Aquele, pois, que despreza isto, não despreza um homem, mas Deus, que vos dá o seu Espírito Santo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 9, 'Pelo que diz respeito à caridade fraterna, não temos necessidade de vos escrever, porque vós mesmos aprendestes de Deus que vos deveis amar uns aos outros.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 10, 'E, de fato, assim o praticais com todos os irmãos em toda a Macedônia. Mas nós vos exortamos, irmãos, a avançar, cada vez mais (na prática desta virtude). (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 11, 'Procurai viver em paz, ocupar-vos dos vossos negócios e trabalhar com as vossas mãos, como vos ordenamos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 12, 'Assim tereis um proceder correto, aos olhos dos que estão fora (da Igreja), e não precisareis de ninguém. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 13, 'Mas não queremos, irmãos, que estejais na ignorância acerca dos mortos, para que não vos entristeçais como os outros, que não têm esperança.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 14, 'Pois, se cremos que Jesus morreu e ressuscitou, (cremos) também (que) Deus trará com ele aqueles que morreram em Jesus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 15, 'Dizemo-vos isto, segundo a palavra do Senhor: os que estamos vivos, os sobreviventes, quando da vinda do Senhor, não passaremos adiante daqueles que morreram. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 16, 'Porque o mesmo Senhor, ao sinal dado, à voz do Arcanjo, ao som da trombeta de Deus, descerá do céu: os que morreram em Cristo, ressuscitarão primeiro;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 17, 'depois, nós os que vivemos, os sobreviventes, seremos arrebatados juntamente com eles sobre as nuvens, ao encontro de Cristo, nos ares, e assim estaremos para sempre com o Senhor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 18, 'Portanto, consolai-vos uns aos outros com estas palavras.');

-- Capítulo 5
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 5, 28);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 1, 'Quanto, porém, ao tempo e ao momento (desta segunda vinda de Jesus Cristo) não tendes necessidade, irmãos, que vos escrevamos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 2, 'porque sabeis muito bem que o dia do Senhor virá como um ladrão durante a noite.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 3, 'Quando (os ímpios) disserem: "Paz e segurança" então lhes sobrevirá uma destruição repentina, como as dores a uma mulher grávida, e não escaparão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 4, 'Mas vós, irmãos, não estais nas trevas, de modo que aquele dia vos surpreenda como um ladrão,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 5, 'porque todos sois filhos da luz e filhos do dia. Não somos filhos da noite nem das trevas. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 6, 'Não durmamos, pois, como os outros, mas vigiemos e sejamos sóbrios.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 7, 'Os que dormem, dormem de noite; e os que se embriagam, embriagam-se de noite.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 8, 'Mas nós, que somos (filhos) do dia (isto é da luz da fé), sejamos sóbrios, estando revestidos da couraça da fé e da caridade, e (tendo) por elmo a esperança da salvação,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 9, 'pois Deus não nos destinou para a ira, mas para alcançar a salvação, por Nosso Senhor Jesus Cristo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 10, 'que morreu por nós, afim de que, ou vigiemos ou durmamos, vivamos juntamente com ele.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 11, 'Pelo que, consolai-vos mutuamente e edificai-vos uns aos outros, como já fazeis.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 12, 'Nós vos suplicamos, irmãos, que tenhais consideração com aqueles que trabalham entre vós, que vos governam no Senhor e vos admoestam.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 13, 'Tende com eles uma caridade particular, por causa das funções que desempenham. Vivei em paz entre vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 14, 'Pedimo-vos também, irmãos, que corrijais os que não observam a boa ordem, conforteis os pusilânimes, suporteis os fracos, sejais pacientes com todos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 15, 'Vede que nenhum retribua a outro mal por mal, mas procurai sempre fazer bem entre vós e para com todos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 16, 'Estai sempre alegres;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 17, 'orai sem cessar; (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 18, 'por tudo dai graças (a Deus), porque esta é a vontade de Deus, em Jesus Cristo, em relação a todos vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 19, 'Não extingais o Espírito (Santo); (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 20, 'não desprezeis as profecias;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 21, 'examinai tudo e abraçai o que for bom;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 22, 'guardai-vos de toda a espécie de mal.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 23, 'O Deus de paz, em pessoa, vos santifique em tudo, a fim de que todo o vosso ser, o espírito, a alma e o corpo, se conservem sem culpa para a vinda de Nosso Senhor Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 24, 'Fiel é aquele que vos chamou, o qual fará isso.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 25, 'Irmãos, orai por nós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 26, 'Saudai todos os irmãos com ósculo santo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 27, 'Eu vos conjuro pelo Senhor que esta carta seja lida a todos os irmãos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 28, 'A graça de Nosso Senhor Jesus Cristo seja convosco.');

