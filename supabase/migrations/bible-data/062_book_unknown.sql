-- undefined (undefined)

-- Capítulo 1
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 1, 12);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 1, 'Paulo, Silvano e Timóteo, à Igreja dos Tessalonicenses, em Deus nosso Pai e no Senhor Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 2, 'Graça e paz vos sejam dadas, da parte de Deus, nosso Pai, e da do Senhor Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 3, 'Nós devemos, irmãos, dar sempre graças a Deus por vós, como é justo, porque a vossa fé vai em grande aumento e abunda em cada um de vós a caridade mútua.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 4, 'Também nós mesmos nos gloriamos de vós na igrejas de Deus, pela vossa paciência e fé, no meio de todas as perseguições e tribulações que sofreis.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 5, 'Elas são prova do justo juízo de Deus, (que deste modo vos purifica) para que sejais tidos por dignos do reino de Deus, pelo qual padeceis. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 6, 'Com efeito, é justo diante de Deus dar tribulação aqueles que vos atribulam,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 7, 'e a vós, que sois atribulados, (dar) descanso (eterno) connosco, quando aparecer o Senhor Jesus (descendo) do céu com os anjos (mensageiros) do seu poder,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 8, 'em uma chama de fogo, para tomar vingança daqueles que (por sua culpa) não conhecem a Deus e não obedecem ao Evangelho de Nosso Senhor Jesus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 9, 'Esses tais serão punidos com a perdição eterna, longe da face do Senhor e da glória do seu poder,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 10, 'quando ele vier naquele dia, para ser glorificado nos seus santos, e para se fazer admirável em todos os que creram, porque vós crestes no testemunho que demos diante de vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 11, 'Por isso oramos incessantemente por vós, para que o nosso Deus vos faça dignos da vossa vocação (isto é, do estado a que vos chamou), que realize com o seu poder todo o desejo de fazer bem e a atividade da vossa fé,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 12, 'a fim de que o nome de Nosso Senhor Jesus Cristo seja glorificado em vós, e vós nele, pela graça do nosso Deus e do Senhor Jesus Cristo.');

-- Capítulo 2
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 2, 17);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 1, 'Rogamo-vos, irmãos, pela vinda de Nosso Senhor Jesus Cristo e pela nossa reunião com ele,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 2, 'que não deixeis facilmente perturbar o vosso espírito nem alarmar por qualquer pretensa revelação, ou palavra, ou por qualquer carta atribuída a nós, como se o dia do Senhor estivesse perto.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 3, 'Ninguém de modo algum vos engane, porque isto não se dará sem que antes venha a apostasia (quase geral dos fiéis), e sem que tenha aparecido o homem do pecado, o filho da perdição,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 4, 'o qual se oporá (a Deus) e se elevará sobre tudo o que se chama Deus ou que é adorado, de sorte que se sentará no templo de Deus, apresentando-se como se fosse Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 5, 'Não vos lembrais que eu vos dizia estas coisas, quando ainda estava convosco ?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 6, 'E vós agora sabeis o que é que o retém, até que chegue o tempo de se manifestar. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 7, 'Com efeito, o mistério da iniquidade (posto que ainda não tenha aparecido o Anticristo) já se opera, somente falta que aquele, que agora o retém, desapareça.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 8, 'E então se manifestará esse iníquo (a quem o Senhor Jesus destruirá com o sopro da sua boca e aniquilará com o resplendor da sua vinda).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 9, 'A vinda deste iníquo será acompanhada, por obra de Satanás, de toda a espécie de milagres, sinais e prodígios mentirosos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 10, 'de todas as seduções da iniquidade para aqueles que se perdem, porque (por sua culpa) não abraçaram o amor da verdade, que os salvaria. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 11, 'Por isso Deus lhes envia um poder de sedução, de tal modo que creiam na mentira,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 12, 'para que sejam condenados todos os que não deram crédito à verdade, mas puserem a sua complacência no mal.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 13, 'Mas nós devemos sempre dar graças a Deus por vós, ó irmãos queridos do Senhor, porque Deus vos escolheu como primícias para a salvação, pela santificação do Espírito e pela verdadeira fé,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 14, 'à qual vos chamou por meio do nosso Evangelho, para vos fazer alcançar a glória de Nosso Senhor Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 15, 'Permanecei, pois, constantes, irmãos, e conservai as tradições, que aprendestes, ou por nossas palavras ou por nossa carta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 16, 'E o mesmo Nosso Senhor Jesus Cristo, e Deus e Pai nosso, o qual nos amou e nos deu uma consolação eterna e uma boa esperança pela graça,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 17, 'console os vossos corações e os confirme em toda a boa obra e palavra.');

-- Capítulo 3
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 3, 18);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 1, 'Quanto ao mais, irmãos, orai por nós para que a palavra do Senhor se propague e seja glorificada, como é entre vós,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 2, 'e para que sejamos livres dos homens importunos e maus, porque a fé não é de todos (porque nem todos querem ouvir ou pôr em prática o Evangelho). (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 3, 'Mas Deus é fiel: ele vos confirmará e guardará do (espírito) maligno.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 4, 'Confiamos no Senhor, quanto a vós, que fazeis e continuareis a fazer o que vos mandamos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 5, 'O Senhor, pois, dirija os vossos corações no amor de Deus e na paciência de Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 6, 'Nós vos ordenamos, irmãos, em nome de Nosso Senhor Jesus Cristo, que vos aparteis de todo o irmão que viver na preguiça, e não segundo a doutrina que foi recebida de nós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 7, 'Em realidade, vós mesmos sabeis como deveis imitar-nos, pois que não vivemos preguiçosos entre vós,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 8, 'nem comemos de graça o pão de ninguém, mas com trabalho e fadiga, trabalhando de noite e de dia, para não sermos pesados a nenhum de vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 9, 'Não porque não tivéssemos direito a isso, mas para vos dar em nós mesmos um modelo a imitar,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 10, 'Desta sorte, quando ainda estávamos convosco, vos declarávamos que, se alguém não quer trabalhar, também não coma.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 11, 'Ouvimos dizer que alguns entre vós são preguiçosos, nada fazendo, mas ocupando-se em coisas vãs;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 12, 'a estes, pois, que assim procedem, ordenamos e rogamos no Senhor Jesus Cristo que, trabalhando pacificamente, comam o pão assim ganhado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 13, 'E vós, irmãos, não vos canseis nunca de fazer bem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 14, 'Se algum não obedece ao que ordenamos pela nossa carta, notai-o e não tenhais comércio com ele, a fim de que se envergonhe;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 15, 'não o considereis todavia como um inimigo, mas adverti-o (caridosamente) como irmão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 16, 'O mesmo Senhor de paz vos dê a paz, sempre e por todas as formas. O Senhor seja com todos vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 17, 'A saudação é de minha própria mão, de mim Paulo. É esta a minha assinatura em todas as minhas cartas. É assim que eu escrevo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 18, 'A graça de Nosso Senhor Jesus Cristo seja com todos vós.');

