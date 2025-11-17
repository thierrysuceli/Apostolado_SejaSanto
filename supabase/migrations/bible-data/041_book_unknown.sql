-- undefined (undefined)

-- Capítulo 1
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 1, 16);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 1, 'Foi dirigida a palavra do Senhor a Jonas, filho de Amati, a qual dizia:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 2, 'Levanta-te, vai a Nínive, a grande cidade, e prega nela, porque a sua malícia subiu até à minha presença.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 3, 'Jonas, porém, pôs-se a caminho, resolvido a ir para Tarsis, para fugir da face do Senhor. Chegou a Jope, onde encontrou um navio que ia para Tarsis; pagou a sua passagem e entrou nele para ir com os outros passageiros a Tarsis, fugindo da face do Senhor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 4, 'Porém o Senhor enviou sobre o mar um vento furioso, levantou no mar uma tão grande tempestade, que estava o navio em perigo de se fazer em pedaços.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 5, 'Então os marinheiros temeram, clamando cada um ao seu deus, e alijaram ao mar toda a carga que traziam no navio para o aliviarem. Entretanto Jonas tinha descido ao porão do navio e lá dormia um profundo sono.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 6, 'Foi ter com ele o capitão e disse-lhe: Como é que estás aqui a dormir? Levanta-te, invoca o teu Deus, a ver se porventura se lembra de nós e nos livra da morte.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 7, 'Em seguida disseram uns para os outros: Vinde e deitemos sortes, para sabermos por que nos acontece este mal. Lançaram sortes, e caiu a sorte sobre Jonas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 8, 'Então disseram-lhe: Declara-nos qual é a causa deste perigo em que estamos. Qual a tua ocupação? Donde vens? Qual a tua terra? A que povo pertences?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 9, 'Jonas respondeu-lhes: Sou Hebreu e adoro o Senhor, Deus do céu, que fez o mar e a terra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 10, 'Então os homens ficaram possuídos de grande medo e disseram-lhe: Por que fizeste isto? Com efeito compreenderam que ele ia fugindo da face do Senhor, pois, lho havia declarado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 11, 'Disseram-lhe: Que te havemos de fazer, para que consigamos calar o mar? Porque o mar se elevava e embravecia cada vez mais.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 12, '(Jonas) respondeu-lhes: Pegai em mim e lançai-me ao mar, e o mar se calará, porque sei que por minha causa é que vos sobreveio esta grande tempestade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 13, 'Entretanto remavam os marinheiros para ver se conseguiam ganhar terra; mas não podiam, porque o mar cada vez mais se empolava e se embravecia contra eles.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 14, 'Então clamaram ao Senhor, dizendo: Senhor, que este homem não seja causa da nossa perdição; não faças cair sobre nós um sangue inocente, porque foste tu, Senhor, que isto fizeste como te aprouve.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 15, 'Depois pegaram em Jonas e lançaram-no ao mar; no mesmo ponto cessou a fúria do mar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 16, 'Então conceberam estes homens um grande temor ao Senhor, ofereceram-lhe um sacrifício e fizeram-lhe votos.');

-- Capítulo 2
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 2, 11);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 1, 'Ao mesmo tempo o Senhor fez que ali houvesse um grande peixe para engolir Jonas; e Jonas esteve no ventre do peixe três dias e três noites.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 2, 'Jonas fez oração ao Senhor seu Deus, do ventre do peixe.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 3, 'Disse: Clamei ao Senhor no meio da minha tribulação, e ele ouviu-me. Clamei do ventre do sepulcro, e tu ouviste a minha voz.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 4, 'Lançaste-me ao abismo, ao coração dos mares, e as correntes das águas me cercaram; todas as tuas vagas e todas as tuas ondas passaram por cima de mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 5, 'E eu já dizia: Fui rejeitado de diante dos teus olhos; acaso verei ainda novamente o teu santo templo?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 6, 'As águas me cercaram até ao pescoço, o abismo encerrou-me em si, as algas cercavam-me a cabeça.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 7, 'Desci até às raízes dos montes; os ferrolhos da terra encerraram-me para sempre; tu, contudo, Senhor Deus meu, retiraste a minha vida da cova.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 8, 'Quando em mim desfalecia a minha alma, lembrei-me do Senhor; a minha oração chegou a ti, subindo até ao teu santo templo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 9, 'Os que se entregam aos ídolos vãos, abandonam a misericórdia (daquele que os teria livrado).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 10, 'Eu, porém, te oferecerei sacrifícios com cânticos de louvor, cumprirei todos os votos que fiz. Do Senhor vem a salvação.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 11, 'Então o Senhor mandou ao peixe, e este vomitou e Jonas na praia.');

-- Capítulo 3
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 3, 10);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 1, 'Foi dirigida segunda vez a Jonas a palavra do Senhor, nestes termos:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 2, 'Levanta-te e vai a Nínive, a grande cidade, e faze nela a pregação que eu te ordenar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 3, 'Jonas levantou-se e foi a Nínive, segundo a ordem do Senhor. Ora Nínive era uma cidade grande, diante de Deus, que tinha três dias de caminho.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 4, 'Jonas começou a entrar na cidade, andando por ela um dia. Clamava assim: Daqui a quarenta dias será Nínive destruída.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 5, 'Os Nínivitas creram em Deus, ordenaram um jejum público e vestiram-se de saco, desde o maior ao menor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 6, 'Chegada esta nova ao rei de Nínive, ele levantou-se do seu trono, tirou o seu manto, cobriu-se de saco e sentou-se sobre a cinza.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 7, 'Depois fez-se clamar por seus príncipes: Os homens e os animais, os bois e as ovelhas não comam nada, não sejam levados a pastar, nem bebam água.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 8, 'Os homens e os animais cubram-se de saco e clamem ao Senhor com força; cada um se converta do seu mau caminho e da violência que há nas suas mãos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 9, 'Quem sabe se Deus se virá a arrepender, se aplacará o ardor da sua ira, de sorte que não pereçamos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 10, 'Deus viu as suas obras (de penitência), como se convertiam do seu mau caminho, e, arrependendo-se do mal que tinha resolvido fazer-lhes, não lho fez.');

-- Capítulo 4
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 4, 11);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 1, 'Jonas ficou muito aborrecido com isto e fortemente irritado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 2, 'Orou ao Senhor nestes termos: Ah! Senhor! Porventura não é isto o que eu dizia, quando ainda estava na minha terra? Por isso é que procurei fugir para Tarsis, porque sabia que és um Deus clemente e misericordioso, paciente e cheio de bondade, e que te arrependes do mal (ou castigo anunciado).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 3, 'Eu pois te rogo. Senhor, que tires agora a minha alma do meu corpo, porque é melhor para mim a morte que a vida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 4, 'O Senhor disse-lhe: Julgas que tens razão para te afligires assim?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 5, 'Jonas saiu da cidade e sentou-se ao oriente da mesma cidade; ali fez para si uma cabana, e debaixo dela repousava à sombra, para ver o que aconteceria na cidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 6, 'O Senhor Deus fez nascer um rícino que se levantou por cima da cabeça de Jonas, para fazer sombra: à sua cabeça e o livrar da sua má disposição; e Jonas, por aquele rícino ficou cheio de grande alegria.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 7, 'Ao outro dia, porém, ao romper da manhã, enviou Deus um bicho, que roeu as raízes ao rícino, e ele secou.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 8, 'Quando o sol apareceu, o Senhor mandou um vento quente do oriente, e deram os raios de sol na cabeça a Jonas, de forma que ele, desfalecido, desejou a morte e disse: Melhor é para mim morrer do que viver.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 9, 'Então o Senhor disse a Jonas: Julgas tu que tens razão para te enfadares por causa do rícino? Jonas respondeu-lhe: Tenho razão de me enfadar até ao ponto de desejar a morte. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 10, 'Disse pois o Senhor: Sentes pena dum rícino que te não custou trabalho algum, que não fizeste crescer, que nasceu numa noite e numa noite feneceu;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 11, 'e então não hei-de compadecer-me de Nínive, a grande cidade onde há mais de cento e vinte mil pessoas, que não sabem discernir entre a sua mão direita e a sua mão esquerda, e um grande número de animais?');

