-- undefined (undefined)

-- Capítulo 1
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 1, 22);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 1, 'Havia na terra de Hus um homem, chamado Job. Este homem era sincero, recto, temia a Deus e fugia do mal.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 2, 'Nasceram-lhe sete filhos e três filhas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 3, 'Possuía sete mil ovelhas, três mil camelos, quinhentas juntas de bois, quinhentas jumentas e um grande número de servos. Este homem era o maior entre todos os Orientais.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 4, 'Seus filhos iam e banqueteavam-se em suas casas, cada um em seu dia, e mandavam convidar suas três irmãs para irem comer e beber com eles.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 5, 'Tendo decorrido o turno dos dias de banquete, Job mandava chamar seus filhos, purificava-os e, levantando-se de madrugada, oferecia holocausto por cada um deles, porque dizia: Talvez meus filhos tenham pecado, ofendido a Deus nos seus corações. Assim fazia Job de cada vez.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 6, 'Porém um certo dia, tendo-se os filhos de Deus (isto é, os anjos) apresentado diante do Senhor, encontrou-se também Satanás entre eles.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 7, 'O Senhor disse-lhe: Donde vens tu? Ele respondeu: Venho de dar uma volta pela terra e de passear por ela.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 8, 'O Senhor disse-lhe: Porventura consideraste o meu servo Job? Não há semelhante a ele na terra: homem sincero e recto, teme a Deus e foge do mal?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 9, 'Satanás, respondeu: Porventura Job teme (ou serve) debalde a Deus?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 10, 'Não o cercaste de um valado protetor, a ele, à sua casa e a todos os seus bens? Não abençoaste as obras de suas mãos, e os seus bens não se têm multiplicado sobre a terra?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 11, 'Mas estende tu um pouco a tua mão, toca em tudo o que ele possui, e verás se ele te não amaldiçoa na tua face.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 12, 'Disse, pois, o Senhor a Satanás: Pois bem, tudo o que ele tem está em teu poder; sòmente não estendas a tua mão contra ele. Satanás saiu da presença do Senhor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 13, 'Um dia, enquanto os filhos e as filhas de Job estavam comendo e bebendo vinho em casa do seu irmão primogênito,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 14, 'foi ter com Job um mensageiro, que lhe disse: Os bois lavravam, e as jumentas pastavam junto deles;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 15, 'de repente acometeram-nos os Sabeus, que levaram tudo e passaram à espada os criados; só eu escapei para te trazer a nova.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 16, 'Estando ainda este a falar, veio outro e disse: O fogo de Deus caiu do céu, e, ferindo as ovelhas e os pastores, consumiu-os; escapei eu só para te trazer a nova.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 17, 'Ainda este falava, quando chegou outro, que disse: Os Caldeus dividiram-se em três esquadrões, lançaram-se sobre os camelos e levaram-nos, e passaram à espada os criados; só eu escapei para te trazer a nova.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 18, 'Ainda este estava falando, quando entrou outro, que disse: Estando teus filhos e filhas comendo e, bebendo vinho em casa de seu irmão mais velho,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 19, 'de repente levantou-se um vento muito forte da banda do deserto, que abalou os quatro cantos da casa, a qual, caindo, esmagou os teus filhos, que morreram; só escapei eu para te trazer a nova.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 20, 'Então levantou-se Job, rasgou as suas vestes e rapou a cabeça; depois prostrou-se por terra, adorou (o Senhor)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 21, 'e disse: Nu saí do ventre de minha mãe, e nu tornarei para lá (para o seio da terra); o Senhor o deu, o Senhor o tirou, como foi do agrado do Senhor, assim sucedeu; bendito seja o nome do Senhor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 22, 'Em todas estas coisas Job não pecou com os seus lábios, nem disse coisa alguma insensata contra Deus.');

-- Capítulo 2
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 2, 13);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 1, 'Ora sucedeu que, em certo dia, tendo comparecido os filhos de Deus diante do Senhor, foi também Satanás entre eles, e pôs-se na sua presença.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 2, 'O Senhor disse a Satanás: Donde vens tu? Ele respondeu: De dar uma volta pela terra e de passear por ela.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 3, 'O Senhor disse a Satanás: Não consideraste o meu servo Job? Não há outro semelhante a ele na terra: homem sincero e recto, teme a Deus e foge do mal. Ainda conserva a sua perfeição, apesar de me haveres incitado contra ele, para o afligir em vão. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 4, 'Satanás respondeu: Pele por pele! O homem dará tudo o que possui pela sua vida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 5, 'Mas (experimenta), estende a tua mão, toca-lhe nos ossos e na carne, e então verás se ele te não amaldiçoa cara a cara.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 6, 'Disse o Senhor a Satanás: Eis que ele está na tua mão; conserva, porém, a sua vida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 7, 'Satanás, tendo saído da presença do Senhor, feriu Job com uma chaga horrível, desde a planta do pé até ao alto da cabeça.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 8, 'E Job, sentado sobre a cinza, raspava a podridão com um pedaço de telha.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 9, 'Sua mulher disse-lhe: Ainda perseveras na tua integridade? Maldiz a Deus e morre.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 10, 'Job respondeu-lhe: Falaste como uma mulher insensata; se nós recebemos os bens da mão de Deus por que não havemos de receber também os males? Em todas estas coisas Job não pecou com os seus lábios.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 11, 'Ora os três amigos de Job, tendo ouvido todo o mal que lhe havia sucedido, foram (ter com ele), cada um do seu lugar: Elifaz de Teman, Baldad de Suhé, e Sofar de Naama. Tinham combinado irem juntos visitá-lo e consolá-lo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 12, 'Tendo, de longe, levantado os olhos, não o conheceram; então, erguendo a voz, choraram e, rasgadas as suas vestes, lançaram pó ao ar sobre as suas cabeças.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 13, 'Sentaram-se com ele por terra durante sete dias e sete noites, e nenhum lhe dizia palavra, porque viam quão veemente era a sua dor.');

-- Capítulo 3
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 3, 25);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 1, 'Depois disto Job abriu a sua boca e amaldiçoou o dia do seu nascimento.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 2, 'Falou assim:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 3, 'Pereça o dia em que nasci, e a noite em que se disse: Foi concebido um homem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 4, 'Converta-se aquele dia em trevas. Deus não cuide dele do alto do céu, nem seja (esse dia) iluminado pela luz.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 5, 'Escureçam-no as trevas e a sombra da morte, cerque-o uma negra escuridão, e seja envolte em amargura.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 6, 'Que as trevas se apoderem daquela noite, não seja ela contada entre os dias do ano, nem seja numerada entre os meses.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 7, 'Seja solitária aquela noite, não se ouça nela grito algum de alegria!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 8, 'Amaldiçoem-na aqueles que amaldiçoam o dia, os que sabem evocar Leviathan.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 9, 'Escureçam-se as estrelas do seu crepúsculo (matutino), espere a luz, mas não a veja, nem veja o abrir das pálpebras da aurora, (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 10, 'porque não fechou o ventre que me trouxe, nem apartou de meus olhos os males.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 11, 'Por que não morri eu dentro do ventre materno? por que não pereci logo que saí dele?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 12, 'Por que fui recebido sobre dois joelhos? por que me amamentaram dois seios?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 13, 'Agora, dormindo, estaria em silêncio, e descansaria no meu sono,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 14, 'juntamente com os reis e com os árbitros da terra, que fabricam para si mausoléus;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 15, 'com os príncipes que possuem oiro, e que enchem as suas casas de prata.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 16, 'Ou, então, como um aborto escondido, eu não existiria, como os que, depois de concebidos, não viram a luz.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 17, 'Ali (no sepulcro) os impios cessam de tumultos, ali repousam os cansados de forças.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 18, 'Ali estão em paz todos os cativos, sem ouvir a voz do (cruel) comitre.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 19, 'O pequeno e o grande ali estão, e o escravo está livre do seu senhor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 20, 'Por que foi concedida a luz aos infelizes, a vida aos que estão em amargura de ânimo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 21, 'os quais esperam a morte que não vem, que a buscam mais ardentemente que um tesouro,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 22, 'e ficam transportados de alegria quando encontram o sepulcro?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 23, '(Por que foi dada a vida) a um homem (conto eu) que não sabe o caminho, e a quem Deus cercou completamente?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 25, 'O mal que eu temo, acontece-me, o que receio, cai sobre mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 26, 'Não tenho paz nem sossego, não tenho repouso, mas apenas perturbação.');

-- Capítulo 4
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 4, 21);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 1, 'Então, tomando a palavra Elifaz de Teman, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 2, 'Se começarmos a falar-e, talvez tu o leves a mal;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 3, 'mas, quem poderá conter a palavra concebida? Eis que ensinaste a muitos, deste vigor a mãos cansadas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 4, 'As tuas palavras firmaram os que vacilavam, fortaleceste os joelhos trêmulos;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 5, 'porém, agora que veio sobre ti (a desgraça), desfaleceste; feriu-te, e tu te perturbaste.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 6, 'A tua piedade não é a tua esperança? A perfeição dos teus caminhos não é a tua segurança?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 7, 'Lembra-te: que inocente pereceu jamais? ou quando foram os justos destruídos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 8, 'Quanto a mim, tenho visto que os que praticam a iniquidade, os que semeiam dores, as segam.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 9, 'Perecem, a um sopro de Deus, são consumidos por um sopro da sua ira.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 10, '(Assim é abafado) o rugido do leão, o grito da leoa; (assim) os dentes dos cachorros dos leões são despedaçados. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 11, 'O leão morre por falta de presa, e os cachorros dos leões são dispersos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 12, 'A mim foi dita uma palavra em segredo, os meus ouvidos, como às furtadelas, perceberam o seu débil som. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 13, 'No horror de uma visão noturna, quando o sono costuma apoderar-se dos homens,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 14, 'o medo e o tremor me assaltaram, e todos os meus ossos estremeceram.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 15, 'Ao passar diante de mim um espirito, os meus cabelos se arripiaram.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 16, 'Parou alguém diante (de mim), cujo rosto eu não conhecia, um espectro diante dos meus olhos, e ouvi uma voz como de branda viração (que dista):'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 17, 'Porventura o homem, em confronto com Deus, será tido por justo? ou será puro diante do seu Criador?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 18, 'Ainda os mesmos que o servem, não são estáveis, e (até) nos seus anjos encontrou defeito.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 19, 'Quanto mais aqueles que habitam casas de barro, os quais têm a terra por fundamento, serão consumidos como pela traça?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 20, 'De manhã até à tarde são destroçados, sem que ninguém dê couta, para sempre.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 21, 'A corda da sua tenda (vida) é cortada, perecem, morrem, mas não em sabedoria (isto é como insensatos).');

-- Capítulo 5
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 5, 27);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 1, 'Chama, pois, (algum defensor), se é que há alguém que te responda. Para qual dos santos te voltaras?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 2, 'Verdadeiramente a ira mata o insensato, e a inveja mata o louco.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 3, 'Eu vi o (pecador) insensato com profundas raízes, mas, sùbitamente, foi destruída a sua morada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 4, 'Longe estão os seus filhos da salvação (ou felicidade), são pisados à porta (da cidade), e não há quem os livre.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 5, 'A sua messe devora-a o faminto, salta sobre os espinhos para a arrebatar, e os sequiosos bebem as suas riquezas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 6, 'A desgraça não nasce do pó, e a dor não brota da terra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 7, 'O homem nasceu para sofrer, como os filhos da chama (faúlhas) paravoar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 8, 'Por mim, rogarei ao Senhor, dirigirei a minha oração a Deus,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 9, 'que faz coisas grandes e impenetráveis maravilhas incontáveis,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 10, 'que derrama a chuva sobre a face da terra, e tudo rega com as águas;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 11, 'que exalta os humildes, e aos tristes alenta com prosperidades;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 12, 'que dissipa os pensamentos dos malignos, para que as suas mãos não possam acabar o que tinham começado;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 13, 'que apanha os astutos na sua própria astúcia, e que dissipa o desígnio dos maus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 14, 'De dia se encontram em trevas, e ao meio-dia andam às apalpadelas como de noite.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 15, 'Ele salva o desvalido da espada da sua boca, e o pobre da mão do (homem) poderoso.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 16, 'Volta a esperança ao indigente, e a iniquidade fecha a sua boca.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 17, 'Bem-aventurado o homem a quem Deus corrige. Não desprezes, pois, a correção do Omnipotente,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 18, 'porque ele fere e sara; dá o golpe e as suas mãos curam.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 19, 'Seis vezes te livrará da angústia, e à sétima o mal não te tocará.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 20, 'No tempo da fome ele te salvará da morte, e no tempo da guerra do poder da espada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 21, 'Estarás a coberto do açoute da (má) língua, e não temerás a calamidade quando chegar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 22, 'Da desolação e da fome te rirás, e não temerás as feras da terra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 23, 'Até farás aliança com as pedras dos campos, e as feras da terra te serão pacificas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 24, 'Verás reinar a paz na tua casa, e, visitando as tuas terras, nada te verás faltar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 25, 'Verás também multiplicar-se a tua descendência, crescer a tua posteridade como a erva dos campos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 26, 'Entrarás, na maturidade, no sepulcro, como um feixe de trigo colhido a seu tempo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 27, 'Olha que assim é isto que nós observámos; escuta-o e tira dele proveito.');

-- Capítulo 6
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 6, 30);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 1, 'Job, porém, respondendo, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 2, 'Oh! Se os meus queixumes se pudessem pesar, se a calamidade que padeço se pesasse com eles numa balança,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 3, 'esta apareceria mais pesada que a areia do mar: por isso as minhas palavras são desvairadas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 4, 'As setas do Senhor estão cravadas em mim, e o veneno delas devora o meu espirito; os terrores do Senhor combatem contra mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 5, 'Porventura orneja o asno montez, quando tem erva? ou muge o boi, quando tem diante a manjedoura bem cheia?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 6, 'ou pode comer-se uma coisa insípida, não temperada de sal? ou pode alguém gostar daquilo que mata quem o come?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 7, 'As coisas, que antes a minha alma não queria tocar, agora pela aflição são o meu sustento.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 8, 'Quem dera que se cumprisse a minha petição, e que Deus me concedesse o que espero!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 9, 'E que o que começou (a ferir-me), esse mesmo me fizesse em pó, que estendesse a mão, e me cortasse a vida!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 10, 'Teria ao menos uma consolação, exultaria no meio dos tormentos: não ter transgredido os mandamentos do Santo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 11, 'Pois, que fortaleza é a minha para poder sofrer? ou qual o meu fim para me portar com paciência? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 12, 'A minha fortaleza não é como a das pedras, nem a minha carne é de bronze.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 13, 'Bem vedes que eu não encontro socorro em mim, e que até os meus mais íntimos me abandonaram.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 14, 'Aquele que não tem compaixão do seu amigo, abandona o temor do Senhor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 15, 'Meus irmãos enganaram-me como a torrente, que ràpidamente se escoa.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 16, '(As águas) que antes se perturbavam com os gelos, e sobre que se acumulava a neve,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 17, 'Começam a dissipar-se, logo que vier calor, desaparecem do seu lugar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 18, 'Por diversas veredas se perdem, evaporam-se e extinguem-se.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 19, 'Contavam com elas as caravanas de Tema, esperavam nelas os caminhos de Saba.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 20, 'Frustraram-se as suas esperanças, quando chegaram às suas margens, ficaram confundidos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 21, '(Tais sois vós que) vieste agora: à vista dos meus males, tendes medo (e fugis de mim).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 22, 'Porventura disse-vos eu: Socorrei-me, dai-me dos vossos bens,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 23, 'livrai-me da mão do inimigo e tirai-me do poder dos poderosos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 24, 'Ensinai-me, e eu me calarei, fazei-me ver em que caí.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 25, 'Por que contradissestes vós as palavras de verdade (que eu disse)? Mas, de que me podeis censurar?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 26, 'Quereis censurar palavras (minhas)? Mas, as palavras desesperadas, leva-as o vento.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 27, 'Arremeteis contra um órfão, e esforçais-vos por fazer tropeçar o vosso amigo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 28, 'Peço-vos que vos volteis de novo para mim, e vede se eu minto diante de vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 29, 'Respondei, vos peço, sem contenda, e, dizendo o que é justo, julgai.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 30, 'Não encontrareis iniquidade na minha língua, nem na minha boca soará estultícia alguma.');

-- Capítulo 7
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 7, 21);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 1, 'A vida do homem sobre a terra é uma milícia; os seus dias são como os dias dum mercenário.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 2, 'Assim como um escravo (fatigado) suspira pela sombra, e o mercenário espera o seu salário,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 3, 'assim também eu tive meses vazios (de consolação), e contei noites trabalhosas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 4, 'Se durmo, digo: Quando me levantarei eu? (Depois de levantado) espero a tarde, e sacio-me de dores até à noite.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 5, 'A minha carne está coberta de podridão e de imundície do pó, a minha pele está enrugada e supura.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 6, 'Os meus dias correm mais rápidos que o cortar da teia pelo tecelão, consomem-se sem esperança (de voltar).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 7, 'Lembra-te que a minha vida é um sopro e que os meus olhos não tornarão a ver a felicidade (perdida). (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 8, 'Não me verá mais o olhar humano; os teus olhos procurar-me-ão, mas eu não subsistirei.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 9, 'Assim como a nuvem se dissipa e passa, assim aquele que descer ao sepulcro, não subirá,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 10, 'Nem voltará mais a sua casa, nem o lugar onde estava o conhecerá jamais.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 11, 'E por isso eu não reprimirei a minha língua, falarei na angústia do meu espírito, lamentar-me-ei na amargura da minha alma.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 12, '(Direi ao Senhor): Porventura sou eu o mar ou um monstro marinho, para me teres encerrado como num cárcere? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 13, 'Se eu digo: "Consolar-me-á o meu leito, a minha cama (onde repousarei) aliviará o meu sofrer."'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 14, 'tu me aterras com sonhos, e me horrorizas com horríveis visões.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 15, 'Por isso a minha alma prefere a estrangulação, os meus ossos preferem a morte.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 16, 'Perdi as esperanças, não viverei mais; tem piedade de mim, porque os meus dias são nada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 17, 'Que coisa é o homem para tanto te importares com ele, para se ocupar dele o leu coração,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 18, 'para o visitares todas as manhãs, e o pores à prova todos os instantes?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 19, 'Até quando não cessarás de olhar para mim, sem permitir que eu (respire ou) engula a minha saliva?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 20, 'Se pequei, que te farei eu ó guarda dos homens (para te aplacar)? porque me puseste contrário a ti, e me tornei pesado a mim mesmo?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 7), 21, 'Porque não me tiras o meu pecado, e porque não apagas a minha iniquidade? Eis que vou agora dormir no pó, e, se tu me buscares pela manhã, já não existirei.');

-- Capítulo 8
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 8, 22);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 1, 'Mas Baldad de Suhé tomou a palavra e disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 2, 'Até quando dirás tu semelhantes coisas, e as palavras da tua boca serão um vento impetuoso?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 3, 'Porventura Deus perverte os seus juízos, ou o Omnipotente subverte a justiça?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 4, 'Se teus filhos pecaram contra ele, abandonou-os ao poder da própria iniquidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 5, 'Contudo, se tu recorreres prontamente a Deus, e, humilde, rogares ao Omnipotente,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 6, 'se caminhares com pureza e retidão, logo despertará para te acudir, e fará prosperar a morada da tua justiça,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 7, 'de tal sorte que os teus primeiros bens parecerão pequenos, de tão grandes que hão-de ser os últimos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 8, 'Interroga, pois, as gerações passadas, examina com cuidado as memórias de nossos pais.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 9, '- Com efeito, nós somos de ontem, e somos uns ignorantes, porquanto os nossos dias sobre a terra passam como a sombra. -'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 10, 'Eles te instruirão, te falarão, e do seu coração tirarão as suas sentenças:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 11, 'Porventura um papiro pode crescer fora do paul? Pode crescer um junco sem água? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 12, 'Quando está ainda verde, sem que mão alguma lhe toque, seca antes que as outras ervas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 13, 'Assim é a sorte de todos os que se esquecem de Deus, assim perecerá a esperança do ímpio.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 14, 'Será despedaçada a sua esperança, a sua confiança será como a teia de aranha.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 15, 'Ele se apoia sobre a sua casa, que se não segura, apega-se a ela, que não tem consistência.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 16, '(O ímpio é como) uma planta que se mostra fresca antes de vir o sol; quando ele nasce, brotará o seu rebento (da terra).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 17, 'As suas raízes se multiplicarão entre um montão de pedras, e ficará entre penhascos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 18, 'Se alguém a arrancar do seu lugar, este a desconhecerá e dirá: Não te conheço.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 19, 'Eis onde termina o seu destino; outros, igualmente, brotarão da terra, em seu lugar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 20, 'Deus não rejeita o homem sincero, nem dá a mão aos malvados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 21, 'Um dia encherá a tua boca de riso, e os teus lábios de júbilo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 8), 22, 'Os que te aborrecem, serão cobertos de confusão; e a casa dos impios não subsistirá.');

-- Capítulo 9
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 9, 35);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 1, 'Respondendo Job, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 2, 'Eu sei verdadeiramente que é assim, que o homem comparado com Deus não é justo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 3, 'quisesse disputar com Deus, não lhe poderia responder por mil coisas uma só.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 4, 'Deus é sábio de coração, e forte em poder; quem lhe resistiu e ficou em paz?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 5, 'Ele transporta os montes, sem que eles o saibam, revolve-os na sua ira.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 6, 'Ele sacode a terra do seu lugar, e as suas colunas são abaladas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 7, 'Ele manda ao sol, e o sol não nasce; põe um selo nas estrelas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 8, 'Ele formou, sozinho, a extensão dos céus, e caminha sobre as ondas do mar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 9, 'Ele criou a Ursa, o Orião e as Pléiades, e os astros (que estão) no fundo do austro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 10, 'Ele faz coisas grandes e incompreensíveis, prodígios que não têm número.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 11, 'Se ele vem a mim, eu não o verei, se se retira não o perceberei.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 12, 'Se levar uma presa, quem se lhe oporá? Quem lhe pode dizer: Por que fazes isto?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 13, 'Deus. ninguém pode resistir à sua ira, e sob ele curvam-se os auxiliares de Rabab.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 14, 'Quem sou eu, pois, para lhe responder, e para lhe falar com as minhas próprias palavras?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 15, 'Ainda que eu tivesse alguma razão, não responderia, mas imploraria a clemência do meu juiz.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 16, 'E ainda que tivesse ouvido ás minhas súplicas, não acreditaria que tivesse feito caso da minha voz,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 17, 'ele que me desfaz como num redemoinho, e multiplica as minhas feridas, mesmo sem (manifestar o) motivo;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 18, 'que não deixa que o meu espírito repouse, e me enche de amarguras.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 19, 'Se se busca fortaleza, ele é robustíssimo; se equidade de juízo, ninguém ousa dar testemunho em meu favor. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 20, 'Se eu pretender justificar-me, a minha boca me condenará (de presunçoso); se me mostrar inocente, ele me convencerá de culpado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 21, 'Ainda que eu seja inocente, a minha alma o ignorará, e me será (sempre) fastidiosa a minha vida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 22, 'Uma só coisa disse: (Deus) aflige o inocente como ímpio.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 23, 'Se ele fere, mate por uma vez, e não se ria das penas dos inocentes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 24, 'A terra foi entregue nas mãos do ímpio, e ele cobre com um véu os olhos dos seus juízes; se não é Deus (que o permite), quem é pois?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 25, 'Os dias da minha vida são mais velozes do que um correio; fogem sem terem visto a felicidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 26, 'Passam como navios que levam fruta, como a águia que voa para a presa.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 27, 'Se eu disser: "vou esquecer meus lamentos, mudar em alegre o meu ar triste",'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 28, 'temo por todas as minhas obras, sabendo que não perdoas ao culpado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 29, 'Sou com certeza tido como culpado; para que, pois, fatigar-me em vão?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 30, 'Ainda que me lavasse com água de neve, e as minhas mãos brilhassem como as mais limpas,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 31, 'contudo me submergirias na imundície. e os meus próprios vestidos teriam horror de mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 32, 'Porque eu não terei de responder a um homem semelhante a mim, nem contestar com ele como um meu igual.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 33, 'Não há quem possa ser árbitro entre ambos, nem meter a sua mão (como mediador) entre os dois.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 34, 'Retire ele a sua vara de mim, e não me amedronte o seu terror;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 9), 35, '(então) falarei, e não o temerei porque no temor em que estou, não posso responder.');

-- Capítulo 10
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 10, 22);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 1, 'A minha alma tem tédio da vida; darei livre curso aos meus lamentos, falarei na amargura do meu coração.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 2, 'Direi a Deus: Não me condenes; mostra-me por que me julgas assim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 3, 'Porventura parece-te bem oprimires-me rejeitares-me a mim, que sou obra das tuas mãos, e favoreceres o desígnio dos impios?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 4, 'Porventura tens tu olhos de carne, ou vês as coisas como as vê o homem?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 5, 'Porventura os teus dias são como os dias do homem, ou os teus anos são como os anos do homem,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 6, 'para te informares da minha iniquidade, averiguares o meu pecado,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 7, 'sabendo tu que eu não cometi impiedade alguma, e não havendo ninguém que possa arrancar-me da tua mão?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 8, 'As tuas mãos fizeram-me e modelaram-me e assim de repente me vais destruir?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 9, 'Lembra-te que me formaste como barro; ir-me-ás reduzir novamente ao pó?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 10, 'Porventura não me mugiste como leite, e coagulaste como queijo? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 11, 'De pele e de carne me vestiste; de ossos e de nervos me organizaste.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 12, 'Concede-me, com a vida, a misericórdia, a tua providência guardou o meu espírito,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 13, 'Porém, ainda que escoadas estas coisas em teu coração, eu sei todavia que te lembras de tudo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 14, 'Se eu peco, tu me observas, e não deixarás sem castigo a minha culpa.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 15, 'Se for mau, desgraçado de mim? Mas, se for justo, não levantarei cabeça, farto como estou de confusão e de miséria.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 16, 'Se me levanto, tu me apanharás como a um leão, e me tornarás a atormentar dum modo terrível.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 17, 'Tu renovas contra mim os teus testemunhos, e multiplicas contra mim a tua ira, tropas frescas se levantara contra mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 18, 'Por que me tiraste tu do ventre de minha mãe? Teria perecido, sem que nenhum olho (moral) me visse.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 19, 'Teria sido como se não existisse, trasladado do ventre materno para a sepultura.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 20, 'Porventura o pequeno número dos meus dias não se acabará em breve? Deixa-me, pois, que eu chore um pouco a minha dor,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 21, 'antes que vá para não mais tornar (a esta vida terrena), para aquela terra tenebrosa e coberta de escuridão da morte;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 10), 22, 'terra de miséria e de trevas, onde habita a sombra da morte, e onde não há nenhuma ordem, mas um sempiterno horror.');

-- Capítulo 11
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 11, 20);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 1, 'Então respondendo Sofar de Naama, disse: (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 2, 'Porventura o que fala muito, não terá também de ouvir? Ou bastará a um homem ser grande falador para se justificar? A tua tagarelice calará os homens?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 3, 'Depois de zombares dos outros, ninguém te há-de confundir?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 4, 'Tu disseste (a Deus): "O que penso é verdadeiro, e eu estou limpo na tua presença."'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 5, 'Oxalá que Deus falasse contigo, e abrisse contigo os teus lábios,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 6, 'para te descobrir os segredos da sua sabedoria, e a multiplicidade da sua lei, com o que conhecerias que te castigue muito menos do que merece a tua maldade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 7, 'Porventura alcançarás os caminhos de Deus, e conhecerás perfeitamente o Omnipotente?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 8, 'Ele é mais alto do que o céu; que farás tu? Mais profundo do que o inferno; como conhecerás ?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 9, 'A sua medida é mais comprida que a terra, e mais larga que o mar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 10, 'Se ele acontecer, aprisionar e citar em juízo (o culpado), quem poderá impedi-lo?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 11, 'Porque ele conhece os perversos, vê a iniquidade, sem que ela dê conta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 12, 'Á vista disto, mesmo um néscio entenderia, e um jumento andaria na razão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 13, 'Se voltares o teu coração para Deus, se ergueres a ele os teus braços,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 14, 'Se lançares fora de ti a iniquidade, que está em tuas mãos, se a injustiça não tiver aceitação na tua casa,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 15, 'então poderás levantar o teu rosto sem mácula, serás estável (na virtude) e não temerás.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 16, 'Então te esquecerás dos teus sofrimentos, lembrar-te-ás deles como de águas que passaram.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 17, 'E se levantará para ti o futuro, brilhante como o meio-dia, as trevas se mudarão em aurora.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 18, 'Terás confiança pela esperança (da vida eterna), que te será proposta, e, deitado, dormirás tranquilo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 19, 'Repousarás, e não haverá quem te amedronte, e muitos suplicarão a tua face.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 11), 20, 'Mas os olhos dos impios se consumirão; não lhes ficará refúgio (que os livre do castigo merecido), e a sua esperança será o último suspiro.');

-- Capítulo 12
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 12, 26);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 1, 'Mas Job, respondendo, disse:1'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 2, 'Em verdade, só vós sois homens (sábios), e convosco morrerá a sabedoria!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 3, 'Eu também tenho entendimento como vós, e não vos sou inferior; pois quem ignora isso que vós sabeis? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 4, 'Sou objecto de riso dos meus amigos, eu que invocava Deus e a quem Deus respondia; objecto de riso o justo, o inocente!...'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 5, 'Desprezo ao desgraçado! Assim pensa o que é ditoso. Desprezo aquele cujos pés vacilam.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 6, 'As casas dos ladrões estão na abundância, seguros estão os que atrevidamente provocam a Deus e que não têm outro deus senão o seu braço.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 7, 'Pergunta, porém, aos animais, e eles te ensinarão, às aves do céu, e elas te indicarão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 8, 'Fala com a terra, e ela te responderá, e os peixes do mar te instruirão. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 9, 'Quem ignora que a mão de Deus fez todas as coisas,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 10, 'que ele tem na sua mão a alma de todo o vivente, e o sopro da vida de toda a carne humana.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 11, 'Porventura o ouvido não distingue as palavras, como o paladar distingue o sabor dos alimentos ?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 12, 'A sabedoria acha-se nos velhos, e a prudência na vida dilatada. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 13, 'A sabedoria e a fortaleza estão em Deus; ele possui o conselho e a inteligência.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 14, 'Se ele destruir, ninguém há que edifique, se aprisionar um homem, ninguém há que o solte.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 15, 'Se retiver as águas, tudo secará, e, se as soltar, submergirão a terra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 16, 'Nele residem a fortaleza e a sabedoria; ele conhece o enganador e o que é enganado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 17, 'Ele conduz os conselheiros a um fim insensato, e conduz os juízes à estupidez. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 18, 'Ele desata o cinturão dos reis, e cinge os seus rins com uma corda.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 19, 'Deixa ir os sacerdotes sem glória, e abate os poderosos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 20, 'Troca as palavras dos homens mais hábeis, e tira o conselho aos velhos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 21, 'Faz cair o desprezo sobre os príncipes, e afrouxa a cintura dos fortes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 22, 'Tira das trevas as coisas mais ocultas, e traz à luz a (própria) sombra da morte.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 23, 'Multiplica as nações e as destrói, e, depois de destruídas, as restitui ao seu primeiro estado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 24, 'Ele muda o coração dos príncipes do povo da terra, transvia-os em desertos sem caminhos;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 25, 'Job faz uma longa enumeração dos males que, por permissão de Deus, sobrevêm a toda a classe de pessoas e de povos, para mostrar não tanto o seu poder como a independência em que está a sua ação dos méritos dessas pessoas e povos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 12), 26, 'andam às apalpadelas nas trevas, longe da luz; fá-los andar errantes como ébrios.');

-- Capítulo 13
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 13, 28);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 1, 'Eis que os meus olhos viram todas estas coisas, e o meu ouvido as ouviu, e as compreendi todas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 2, 'Aquilo que vós sabeis também eu o sei, não vos sou inferior.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 3, 'Contudo, falarei ao Omnipotente, e com Deus desejo conversar,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 4, 'pois vós sois forjadores de mentiras, sois médicos que nada curais.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 5, 'E oxalá que vós vos calásseis, para poderdes passar por sábios.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 6, 'Ouvi, pois, a minha refutação, e atendei ao juízo dos meus lábios.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 7, 'Porventura necessita Deus dás vossas mentiras, para que em sua defesa faleis com fraude?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 8, 'Porventura quereis fazer, em favor de Deus, acepção de pessoas, quereis ser advogados da sua causa?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 9, 'Seria do vosso agrado que ele vos examinasse ? Enganá-lo-eis como se engana um homem?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 10, 'Ele mesmo vos condenará, se secretamente fazeis acepção de pessoas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 11, 'Sim, a sua majestade vos perturbará, e o seu terror cairá sobre vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 12, 'Os vossos argumentos são razões de pó, as vossas defesas são de barro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 13, 'Calai-vos por um pouco, deixai-me falar, e venha sobre mim o que vier.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 14, 'Por que lacero eu as minhas carnes com os meus dentes, e por que trago eu a minha vida nas minhas mãos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 15, 'Ainda que ele me mate, nele esperarei; mas defenderei na sua presença o meu proceder.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 16, 'E ele será o meu Salvador, porque nenhum ímpio ousará aparecer diante dos seus olhos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 17, 'Ouvi as minhas palavras, dai ouvidos ao meu discorrer.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 18, 'Se eu for julgado, sei que ei-de ser encontrado justo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 19, 'Quem há que queira entrar comigo em juízo? Venha : por que me consumo eu em silêncio? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 20, 'Duas coisas sòmente te peço (ó Senhor) que me faças, e então não me esconderei da tua face:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 21, 'Afasta de mim a tua mão, e não me consterne o teu terror.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 22, 'Chama por mim, e eu te responderei; ou então falarei eu, e tu responde-me.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 23, 'Quantas iniquidades e pecados tenho eu? Mostra-me as minhas maldades e delitos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 24, 'Por que escondes tu de mim o teu rosto, e por que me consideras teu inimigo?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 25, 'Contra uma folha que é arrebatada ao vento, queres mostrar o teu poder, perseguir uma palha seca?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 26, 'Com efeito, escreves contra mim amarguras, e queres-me consumir pelos pecados de minha mocidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 27, 'Tu puseste os meus pés no cepo, observaste todas as minhas veredas (ou ações), consideraste os vestígios de meus pés,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 13), 28, 'sendo certo que eu sou consumido como podridão, como um vestido que é comido pela traça.');

-- Capítulo 14
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 14, 22);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 1, 'O homem, nascido da mulher, vive pouco tempo e é cheio de muitas misérias.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 2, 'Como uma flor nasce e (logo) é cortada, e foge como a sombra, e jamais permanece num mesmo estado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 3, 'E tu dignas-te abrir os teus olhos sobre tal ser, e chamá-lo a juízo contigo?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 4, 'Quem pode fazer sair o puro do impuro? Ninguém.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 5, 'Os dias do homem são breves, em teu poder está o número dos seus meses; tu lhe fixaste os limites, que não podem ser ultrapassados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 6, 'Retira-te um pouco dele (deixa de o afligir) para que descanse, até que chegue o seu dia desejado como o dum jornaleiro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 7, 'Um a árvore tem esperança (de reviver); se for cortada, torna a reverdecer, e brotam os seus ramos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 8, 'Se a sua raiz envelhecer na terra, e morrer o seu tronco no pó,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 9, 'sentindo água reverdecerá, e fará copa, como no princípio quando foi plantada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 10, 'Porém o homem, quando morrer fica prostrado; quando expirar, dize-me, que é dele?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 11, 'Esgotam-se as águas dum lago, escoa-se e extingue-se:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 12, 'assim o homem, quando dormir, não mais se levantará; até que o céu seja consumido, não despertará, nem se levantará do seu sono.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 13, 'Quem me dera que tu me encobrisses no sepulcro, e me escondesses nele até ter passado o teu furor, e me assinalasses o tempo em que te houvesses de lembrar de mim,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 14, 'Pensas porventura que um homem já morto tornará a viver? Todos os dias da minha milicia esperaria, até que chegasse a hora do levantamento (ou renovação, gloriosa).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 15, 'Então me chamarias e eu te responderia, e estenderias a tua dextra para a obra das tuas mãos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 16, 'Em verdade tu contaste todos os meus passos, mas perdoa os meus pecados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 17, 'Tu selaste como num saco os meus delitos, mas curaste a minha iniquidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 18, 'Um monte desmorona-se e desfaz-se, e um rochedo é trasladado do seu lugar. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 19, 'As águas escavam as pedras, e a terra pouco a pouco se consome com as inundações: assim mesmo, pois, acabarás com o homem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 20, 'Tu o abates, e ele se vai, tu o desfiguras e afastas para longe.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 21, 'Estejam os seus filhos exaltados, ou estejam abatidos, ele não o saberá.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 14), 22, 'A sua carne, apenas padecerá as suas dores, e ã sua alma apenas chorará sobre si mesma.');

-- Capítulo 15
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 15, 35);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 1, 'Então, respondendo Elifaz de Teman, disse:1'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 2, 'Porventura o sábio responderá com palavras no ar, e encherá de vento o seu peito (como tu acarbas de fazer)?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 3, 'Porventura defende-se com palavras inúteis e com razões inconsistentes?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 4, 'Quanto é em ti, desterras o temor (de Deus), destróis a piedade de Deus devida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 5, 'A tua iniquidade ensinou a tua língua, e tu imitas a linguagem dos blasfemadores.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 6, 'Não eu, mas a tua própria boca te condena, os teus lábios depõem contra ti.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 7, 'Porventura és tu o primeiro homem que nasceu, e foste tu formado antes dos outeiros?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 8, 'Porventura entraste tu no conselho de Deus, e tomaste posse de toda a sabedoria?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 9, 'Que sabes tu do que nós ignoramos? Que entendes tu que nós não saibamos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 10, 'Também há entre nós velhos e anciãos, muito mais avançados em idade que teu pai.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 11, 'Tens em pouca conta as consolações divinas e as doces palavras que te dirigimos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 12, 'Por que te ensoberbece o teu coração, que significara estes olhares violentos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 13, 'Por que se incha o teu espírito contra Deus, para proferires com a tua boca tão estranhas palavras ?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 14, 'Que é o homem, para ser imaculado (aos olhos de Deus), e para parecer justo, tendo nascido duma mulher?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 15, 'Se nem os seus mesmos santos gozam da sua confiança, se nem os céus são puros na sua presença,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 16, 'quanto mais o homem, ser abominável e corrompido, que bebe a iniquidade como a água?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 17, 'Eu to mostrarei, ouve-me; eu te contarei o que tenho visto,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 18, 'o que os sábios dizem, eles que não ocultam (os ensinamentos) de seus pais,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 19, '- aos quais sòmente foi dada esta terra, sem que passasse nenhum estranho por meio deles. -'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 20, 'Em todos os seus dias o ímpio é atormentado, e o número dos anos do opressor é reduzido. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 21, 'Um estrondo de terror está sempre em seus ouvidos, e, mesmo quando há paz, receia o assalto do devastador'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 22, 'Não crê que se possa voltar das trevas à luz, vendo a espada de todos os lados,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 23, 'Anda errante à busca de pão; julga que o dia das trevas está preparado, a seu lado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 24, 'tribulação o aterra, e a angústia o cerca, como a um rei que se prepara para a batalha,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 25, 'porque estendeu a sua mão contra Deus, e se fez forte contra o Omnipotente. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 26, 'Correu contra ele, de cabeça altiva, e armou-se duma soberba inflexível.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 27, 'A gordura cobriu o seu rosto, e a enxúndia pende-lhe das ilhargas. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 28, 'Habitará em cidades assoladas, e em casas desertas, que estão reduzidas a moutões de ruínas. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 29, 'Não se enriquecerá, nem os seus bens persistirão, nem lançarão as suas raízes por terra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 30, 'Não sairá das trevas; uma chama secará os seus ramos, e ele será arrebatado pelo sopro da boca (de Deus).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 31, 'Não se fie na mentira, pois será enlaçado nela; a mentira será a sua recompensa.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 32, 'Antes dos seus dias se completarem, perecerá, e as suas mãos se secarão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 33, 'O seu cacho será cortado, como o da vinha, ao nascer, e, como a oliveira, deixará cair a sua flor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 34, 'Porque a família do ímpio será estéril, e o fogo devorará as casas dos que se deixam subornar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 15), 35, 'Ele concebeu o mal e deu à luz a desventura, e o seu coração prepara enganos.');

-- Capítulo 16
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 16, 23);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 1, 'Job, respondendo, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 2, 'Tenho ouvido muitas vezes esses discursos; todos vós sois uns consoladores aflitivos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 3, 'Quando terão fim esses discursos de vento? Que coisa te constrange a falar assim?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 4, 'Eli também podia falar como vós, se vós estivésseis no meu lugar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 5, 'Eu também vos consolaria com lindas frases e (compassivo) moveria a minha cabeça sobre vós;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 6, 'eu vos fortaleceria com as minhas palavras, e moveria os meus lábios, como compadecendo-me de vós.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 7, 'Mas que farei? Se eu falar, nem por isso se aplacará a minha dor; se me calar, nem por isso ela se afastará de mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 8, 'Mas agora a minha dor me oprime, e todos os meus membros estão reduzidos a nada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 9, 'As minhas rugas dão testemunho contra mim, um falso raciocinador levanta-se diante da minha face para me contradizer.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 10, 'Juntou o seu furor contra mim, com olhos terríveis me olhou o meu inimigo, e, ameaçando-me, rangeu os seus dentes contra mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 11, '(Os meus amigos) abrem as suas bocas contra mim, e, ultrajando-me, ferem a minha face, todos se lançam, juntamente, contra mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 12, 'Deus encerrou-me debaixo do poder do injusto, entregou-me nas mãos dos ímpios.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 13, 'Eu estava em paz, ele arruinou-me, pegou-me pela nuca e despedaçou-me, pôs-me como alvo (dos seus tiros).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 14, 'Cercou-me com suas lanças, atravessou-me os rins, não me perdoou, e espalhou pela terra as minhas entranhas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 15, 'Despedaçou-me com feridas sobre feridas, lançou-se a mim como um gigante.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 16, 'Levo um cilício cosido sobre a minha pele, e cobri de cinza a minha carne.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 17, 'O meu rosto inchou à força de chorar, e as minhas pálpebras escureceram-se.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 18, 'Sofri isto sem que houvesse maldade nas minhas mãos. quando eu oferecia a Deus orações puras.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 19, 'Ó terra, não cubras o meu sangue, nem o meu clamor ache em ti lugar no qual seja sufocado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 20, 'A minha testemunha está no céu, e está nas alturas o meu defensor. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 21, 'Os meus amigos escarnecem-me, mas os meus olhos recorrem a Deus, desfeitos em lágrimas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 22, 'Oxalá se fizesse o juízo entre Deus e o homem, (tão publicamente) como se faz o de um filho do homem com o seu semelhante!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 16), 23, 'Vê, pois, que os meus breves anos passam, e que eu caminho por uma vereda, pela qual não voltarei.');

-- Capítulo 17
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 17, 16);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 1, 'O sopro da minha vida vai-se consumindo, os meus dias se extinguem e só me resta o sepulcro'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 2, 'Cercam-me escarnecedores, os meus olhos têm de ver os seus escárnios.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 3, 'Livra-me, Senhor, e põe-me junto de ti, e (então) combata contra mim a mão de quem quer que for.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 4, 'Tu afastaste da inteligência o seu coração, por isso não serão exaltados. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 5, 'Há quem prometa a presa aos companheiros, quando os olhos de seus filhos desfalecem. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 6, 'Ele me reduziu a ser objecto de riso do povo, sou um (homem) a quem se cospe no rosto.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 7, 'Os meus olhos escureceram-se de amargura, todos os meus membros são como uma sombra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 8, 'Os justos pasmam disto (que me acontece), e o inocente se levanta contra o ímpio. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 9, 'Mas o justo persistirá no seu caminho, e aquele que tem as mãos puras crescerá em fortaleza.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 10, 'Voltai, enfim, vós todos, vinde; não acharei entre vós nenhum sapiente? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 11, 'Os meus dias passaram, os meus projetos ruíram, os projetos queridos do meu coração.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 12, 'Tornam a noite em dia; em face das trevas (dizem que) a luz está próxima.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 13, 'Ainda que eu espere com paciência, o sepulcro será a minha casa, e tenho preparado o meu leito nas trevas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 14, 'Eu disse à podridão: Tu és meu pai! E aos vermes: Vós sois minha mãe e minha irmã.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 15, 'Onde está, pois, agora a minha esperança? E a minha felicidade, quem a pode ver?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 17), 16, 'Todas as minhas coisas descerão ao mais profundo do sepulcro; e julgas tu que eu, ao menos neste lugar, terei descanso?');

-- Capítulo 18
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 18, 20);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 1, 'Respondendo, Baldad de Suhé disse: (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 2, 'Até quando dirás palavras vãs? Reflete primeiro, e depois falaremos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 3, 'Por que nos consideras como animais, e nos tornas por estúpidos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 4, 'Ó tu, que no teu furor te despedaças, porventura, por causa de ti, será despovoada a terra, e serão transferidos os rochedos do seu lugar?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 5, 'Sim, é certo que a luz (ou prosperidade) do ímpio se apagará, e que não resplandecerá a chama do seu fogo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 6, 'A luz se obscurecerá na sua casa, e a lâmpada (ou glória), que está sobre ele, se apagará.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 7, 'Os seus passos firmes serão cortados, e o seu próprio conselho o precipitará.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 8, 'Prendem-se os seus pés na rede, anda entre as suas malhas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 9, 'O seu pé ficará preso pelo laço, ficará fortemente apertado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 10, 'Está-lhe escondido debaixo da terra o laço, e ao longo da vereda a armadilha,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 11, 'De todas as partes o amedrontarão temores, e lhe enredarão os pés.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 13, 'A pele do seu corpo será devorada; o primogênito da morte devorará os seus membros.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 14, 'Será arrancado da sua tenda onde se julgava seguro, e a morte, como um rei, o calcará.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 15, 'Outros - não mais ele - habitarão na sua casa, e sobre a sua lenda se espalhará enxofre.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 16, 'Por baixo as suas raízes secarão, e por cima serão cortados os seus ramos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 17, 'Á sua memória perecerá da terra, e não será celebrado o seu nome na região.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 18, 'Será arrojado da luz para as trevas, será desterrado do mundo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 19, 'Não terá nem descendência nem família no seu povo, nem relíquia alguma no seu pais.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 20, 'Os últimos pasmarão do seu dia (de ruína), e os primeiros serão invadidos pelo horror.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 18), 21, 'Tais serão as moradas do ímpio, tal é o lugar daquele que não conhece (nem teme) a Deus.');

-- Capítulo 19
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 19, 29);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 1, 'Job, respondendo, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 2, 'Até quando afligireis a minha alma, e me atormentareis com os vossos discursos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 3, 'Eis que já por dez vezes me injuriais, e não vos envergonhais de me oprimir.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 4, 'Ainda que eu tenha errado, o meu erro ficará comigo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 5, 'Porém vós levantais-vos contra mim, aduzindo como prova os meus tormentos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 6, 'Entendei sequer agora que foi Deus que me oprimiu, e que me envolveu nas suas redes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 7, 'Eis que eu clamo padecendo violência, e ninguém me ouve, levanto a minha voz, e não há quem me faça justiça.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 8, '(O Senhor) por todas as partes fechou o meu caminho, e não posso passar; pôs trevas no meu caminho.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 9, 'Despojou-me da minha glória, tirou-me a coroa da cabeça.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 10, 'Demoliu-me por todos os lados, e pereço; desenraizou a minha esperança como (quem desenraíza) uma árvore.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 11, 'O seu furor acendeu-se contra mim, tratou-me como seu inimigo'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 12, 'De tropel vieram as suas milicias, entrincheiraram-se no meu caminho, e cercaram a minha casa.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 13, 'Pôs longe de mim os meus irmãos, e os meus conhecidos como estranhos se apartaram de mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 14, 'Os meus vizinhos abandonaram-me, os meus íntimos esqueceram-se de mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 15, 'Os que moravam em minha casa, (mesmo) as minhas servas, olharam-me como um estranho, sou como um desconhecido, a seus olhos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 16, 'Chamo o meu servo, e ele não me responde, vejo-me obrigado a suplicar-lhe com a minha boca.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 17, 'Minha mulher em horror do meu hálito, e peço graça aos filhos das minhas entranhas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 18, 'Até os loucos me desprezam; quando me levanto, riem-se de mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 19, 'Os que, noutro tempo, eram meus confidentes, têm horror de mim e aqueles a quem eu mais amava, voltam-se contra mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 20, 'A’ minha pele, consumidas as carnes, pegaram-se os meus ossos, e só me restam os lábios ao redor dos meus dentes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 21, 'Compadecei-vos de mim, compadecei-vos de mim, ao menos vós, que sois meus amigos, porque a mão do Senhor me feriu.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 22, 'Por que me perseguis vós como Deus, e vos fartais das minhas carnes? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 23, 'Quem me dera que as minhas palavras fossem escritas! Quem me dera que se imprimissem num livro'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 24, 'com um ponteiro de ferro, sobre uma lâmina de chumbo, ou que, com cinzel, se gravassem na pedra!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 25, 'Porque eu sei que o meu Redentor vive, e que surgirá finalmente na terra. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 26, 'Então, revestido da minha pele, na minha própria carne verei o meu Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 27, 'Eu mesmo o verei, os meus olhos o hão-de contemplar, e não os de outro: as minhas entranhas se consomem nesta espectativa.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 28, 'Por que dizeis, pois agora: Perscrutemo-lo, e acharemos nele razão de o condenar?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 19), 29, 'Fugi da espada (de Deus), porque a espada é vingadora das iniquidades, e sabei que há uma justiça.');

-- Capítulo 20
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 20, 29);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 1, 'Sofar de Naama, tomando a palavra, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 2, 'Por isso os meus pensamentos me sugerem uma resposta, e estou impaciente por falar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 3, 'Ouvi recriminações injuriosas, mas tenho no meu espirito com que replicar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 4, 'Não sabes que, desde o principio, desde que o homem foi posto sobre a terra,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 5, 'é breve a glória dos ímpios, e a alegria do ímpio dura um momento?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 6, 'Se a sua soberba subir até ao céu, e a sua cabeça tocar nas nuvens,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 7, 'por fim perecerá como o esterco; aqueles que o tinham visto dirão: Onde está ele?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 8, 'Como um sonho, ele voa, e não será achado, desaparecerá como uma visão noturna.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 9, 'Os olhos, que o tinham visto, não o verão mais, nem o verá mais a sua morada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 10, 'Os seus filhos indemnizarão os pobres, e as suas mãos restituirão as suas rapinas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 11, 'Os seus ossos estavam cheios das suas iniquidades ocultas, as quais com ele dormirão no pó.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 12, 'Se o mal foi doce na sua boca, se o escondeu debaixo de sua língua, (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 13, 'se o reteve, sem o deixar, e o gostou no seu paladar,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 14, 'este alimento se transformará nas suas entranhas, se converterá interiormente em fel de áspides.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 15, 'Vomitará as riquezas, que devorou, e Deus lhas fará sair das entranhas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 16, 'Chupou veneno de áspides, a língua da víbora o matará.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 17, 'Jamais veja ele as correntes de um rio, as torrentes de mel e de leite.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 18, 'Restituirá o seu ganho sem o poder tragar, do fruto do seu comércio não gozará.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 19, 'Porque oprimiu e despojou os pobres, roubou casas, que não edificou.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 20, 'O seu apetite foi insaciável; e quando tiver o que cobiçava, não o poderá gozar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 21, 'Nada escapava á sua voracidade, e por isso não durará a sua felicidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 22, 'No cúmulo da abundância, tudo lhe é pouco, e desventuras de toda a sorte desabam sobre ele.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 23, 'Eis com que encherá o seu ventre: (Deus) enviará contra ele a ira do seu furor, e fará chover sobre ele os seus castigos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 24, 'Se escapar (por um lado) às armas de ferro, cairá (por outro) no arco de bronze.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 25, 'A espada é tirada e sai da bainha, rutila e trespassa-o cruelmente; irão e virão sobre ele os terrores.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 26, 'Todas as trevas lhe estão reservadas, devorá-lo-á um fogo, que o homem não acendeu, e consumirá o que restar da sua lenda.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 27, 'Os céus revelarão a sua iniquidade, e a terra se levantará contra ele.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 28, 'Desaparecerá de sua casa toda a sua abundância, desaparecerá no dia do furor de Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 20), 29, 'Esta é a sorte reservada por Deus ao homem ímpio, esta é a herança que Deus lhe destina.');

-- Capítulo 21
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 21, 34);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 1, 'Job, respondendo, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 2, 'Ouvi, vos peço, as minhas palavras, dai-me, ao menos, esta consolação.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 3, 'Sofrei que eu fale, e depois, se vos parecer, zombai das minhas palavras.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 4, 'Porventura é com algum homem a minha disputa? Como não hei-de impacientar-me?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 5, 'Olhai para mim, e pasmai, e ponde a mão sobre a vossa boca;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 6, 'e eu mesmo, quando me recordo, me assombro, e estremece toda a minha carne.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 7, 'Por que razão vivem os impios e envelhecem, aumentando á sua força?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 8, 'Seus filhos conservam-se diante deles, uma multidão de parentes e de netos está na sua presença.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 9, 'As suas casas estão seguras e em paz, a vara de Deus não os fere.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 10, 'Os seus louros são sempre fecundos, as suas vacas dão à luz e não se lhes malogram as suas crias.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 11, 'Os seus filhos saem (de casa) como manadas, os seus pequenos saltam e brincam.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 12, 'Cantam ao som do tímpano e da citara, e alegram-se ao som da flauta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 13, 'Passam os seus dias em delicias, e num momento descem a o sepulcro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 14, 'Estes são os que disseram a Deus: Retira-te de nós, pois não queremos saber nada dos teus caminhos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 15, 'Quem é o Omnipotente para que o sirvamos? Que nos aproveita que lhe façamos orações?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 16, 'Mas, porque não estão na sua mão os seus bens, longe esteja de mim o modo de pensar dos impios.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 17, 'Quantas vezes se apagará a lucerna dos impios, lhes sobrevirá uma inundação (de males), e (Deus) na sua ira lhes repartirá as dores?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 18, 'Serão como as palhas ao soprar do vento, e como a cinza espalhada, pelo redemoinho.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 19, '(Vós dizeis que) Deus reservará para os filhos a pena (merecida pelos pecados) do pai. Mas que Deus lhe dê o pago a ele, que ele próprio o tenha; (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 20, 'que os seus olhos vejam a própria ruína, e ele beba do furor do Omnipotente.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 21, 'Pois, que se lhe dá a ele do que será feito da sua casa depois da sua morte, depois de serem cortados os seus dias?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 22, 'Porventura poderá alguém ensinar alguma coisa a Deus, que julga os seres mais elevados?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 23, 'Um morre em plena prosperidade, tranqüilo e feliz,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 24, 'com os flancos cobertos de gordura, e a medula dos ossos suculenta;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 25, 'outro, porém, morre na amargura da sua alma, sem nenhuns bens.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 26, 'E todavia ambos dormirão igualmente no pó, e os vermes cobrem os dois.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 27, 'Eu conheço bem os vossos pensamentos, e os vossos injustos juízos contra mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 28, 'Vós dizeis: Onde está a casa deste (Job, que era como um) príncipe? Onde estão as tendas dos ímpios?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 29, 'Perguntai a qualquer dos viandantes; não podeis desconhecer a resposta que darão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 30, 'No dia da desgraça, o mau é poupado, no dia da cólera escapa ao castigo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 31, 'Quem reprova diante dele o seu proceder? Quem lhe dará o pago do mal que fez?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 32, 'É levado (honorificamente) ao sepulcro, e no seu túmulo há paz.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 33, 'São-lhe leves os torrões do vale; arrasta atrás de si todos os homens, e diante de si uma inumerável multidão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 21), 34, 'Como pois me consolais em vão, tendo-se visto que as vossas respostas se opõem à verdade?');

-- Capítulo 22
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 22, 30);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 1, 'Elifaz de Teman, tomando a palavra, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 2, 'Porventura pode o homem ser útil a Deus? Só a ele aproveita a sua sensatez.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 3, 'De que serve a Deus que tu sejas justo? Que lhe acrescentas, se for imaculado o teu proceder?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 4, 'É porventura pela tua piedade que ele te castiga, ou que entra contigo em juízo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 5, 'e não antes por causa da tua grande malícia, e das tuas inumeráveis maldades?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 6, 'Porque tu sem causa tiraste os penhores a teus irmãos, e aos nus despojaste dos seus vestidos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 7, 'Negaste água ao fatigado, e negaste pão ao faminto.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 8, 'A terra é daquele que tem a mão forte, e quem se faz temer apossa-se dela.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 9, 'Despediste as viúvas (com as mãos) vazias, e quebraste os braços dos órfãos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 10, 'Por isso estás cercado de laços, e um súbito temor te perturba,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 11, 'no meio das trevas, sem (nada) ver, oprimido pela impetuosa inundação das águas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 12, 'Não ponderas tu que Deus é mais alto que o céu? Vê a fronte das estrelas, em que altura está! (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 13, 'E dizes: "Que sabe Deus? Pode ele julgar por entre trevas?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 14, 'As nuvens o cobrem dum véu, e ele não vê; passeia pela abóbada celeste."'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 15, 'Porventura queres tu seguir o caminho antigo, que foi seguido pelos homens iníquos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 16, 'Eles foram arrebatados (pela morte) antes do seu tempo, quando um rio destruiu os seus fundamentos;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 17, 'eles diziam a Deus: "Retira-te de nós; que nos pode fazer o Omnipotente?"'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 18, 'Mas era ele que havia cumulado de bens as suas casas. Esteja longe de mim o conselho dos ímpios.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 19, 'Os justos verão (a sua ruína) e alegrar-se-ão, e o inocente escarnecerá deles (e da sua falsa doutrina):'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 20, 'Porventura não foi lançada por terra a sua soberba, e o fogo não devorou as suas relíquias?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 21, 'Submete-te, pois, a Deus, e lerás paz, e assim colherás ótimos frutos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 22, 'Recebe lições da sua boca, e grava as palavras no teu coração.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 23, 'Se voltares para o Omnipotente, de novo serás levantado, se afastares de tua casa a iniquidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 24, 'Se lançares ao pó os lingotes de ouro, e o ouro de Ofir aos seixos da torrente,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 25, 'o Omnipotente será o teu ouro, será para ti prata brilhante.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 26, 'Então porás tuas delícias no Omnipotente, e levantarás o teu rosto para Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 27, 'Tu lhe rogarás, e ele te ouvirá, e cumprirás os teus votos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 28, 'Formarás os teus projetos, que terão feliz êxito, e a luz brilhará em teus caminhos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 29, 'Porque quem se humilha, será glorificado, e quem (arrependido) tiver abaixado os olhos, será salvo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 22), 30, 'O inocente será salvo, e será salvo pela pureza das suas mãos.');

-- Capítulo 23
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 23, 17);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 1, 'Respondendo Job, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 2, 'Sim, hoje são cheias de amargura as minhas palavras, mas a violência da minha chaga é mais grave que os meus gemidos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 3, 'Quem me dera saber encontrar Deus, e chegar até ao seu trono!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 4, 'Exporia ante ele a minha causa, e encheria a minha boca de argumentos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 5, 'Saberia o que ele me responderia, ouviria o que ele tivesse para me dizer.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 6, 'Não quero que com muita fortaleza contenda comigo, nem que me oprima com o peso da sua grandeza.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 7, 'Proponha contra mim a equidade, e a minha causa obtenha a vitória.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 8, 'Se eu for ao Oriente, não aparece; se ao Ocidente, não o encontrarei. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 9, 'Se o busco ao norte, não o acho, se, ao sul, não o descubro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 10, 'Mas ele conhece o meu caminho; se me provar, sairei puro como o ouro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 11, 'O meu pé seguiu as suas pisadas, eu guardei o seu caminho, e não me desviei dele.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 12, 'Não me apartei dos preceitos de seus lábios, escondi no meu seio as palavras da sua boca,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 13, 'Porém, quando decide uma coisa, ninguém pode frustrar os seus desígnios; e a sua vontade realiza o que quer.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 14, 'Assim cumprirá em mim a sua vontade, e ainda tem à mão outros muitos projetos semelhantes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 15, 'Por isso eu estou turbado na sua presença, e, quando o considero, sou agitado de temor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 16, 'Deus tirou a coragem ao meu coração, e o Omnipotente me aterrou.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 23), 17, 'Realmente não são as trevas que me fazem perecer, nem a escuridão (das tribulações) de que está coberto o meu rosto.');

-- Capítulo 24
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 24, 25);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 1, 'Por que não reserva o Omnipotente para si os seus tempos, e os seus fiéis não veem os dias dele? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 2, 'Uns invadem terrenos alheios, roubam rebanhos e os apascentam.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 3, 'Levam o jumento dos órfãos, e tomam em penhor o boi da viúva.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 4, 'Põem os pobres fora do caminho, e obrigam a esconder-se os humildes camponeses.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 5, 'Outros (bons, mas pobres) como asnos monteses do deserto, saem do seu trabalho, madrugando à busca do seu pão e do pão de seus filhos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 6, 'Ceifando (esfomeados) o campo que não é seu, e vindimam a vasilha do ímpio.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 7, 'Passam a noite nus, por falta de roupa, não têm com que se cobrir durante o frio.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 8, 'São banhados pelas chuvas dos montes, e, não tendo com que se cobrir, rufugiam-se sob os rochedos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 9, 'Fizeram violência (os ímpios) roubando os órfãos, e despojaram os pobres.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 10, 'Estes andam nus, por falta de roupa; levam feixes de espigas (dos senhores), e têm fome,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 11, 'moem as zeitonas e pisam as uvas e têm sede.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 12, 'Da cidade sobem os gemidos dos moribundos, a alma dos feridos clama vingança, e Deus não escuta as suas súplicas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 13, '(Os impios) foram rebeldes à luz, não conheceram os caminhos (de Deus) não andaram pelas suas veredas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 14, 'O homicida levanta-se ao amanhecer, mata o mendigo e o pobre, ronda de noite como ladrão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 15, 'O olho do adúltero observa o escurecer e diz: Ninguém me verá, — e oculta com um véu o seu rosto.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 16, 'Arrombam nas trevas as casas, de dia conservam-se escondidos, não conhecem a luz (mas odeiam-na).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 17, 'Se a aurora aparece de súbito, é para eles como uma sombra de morte; são-lhes familiares os terrores da noite.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 18, '(O ímpio) corre veloz sobre a superfície das águas; maldita seja a sua herança sobre a terra, e não ande pelo caminho das vinhas _(nem goze os seus frutos).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 19, 'Passe das águas da neve para um excessivo, calor, e o seu pecado vá (com ele) até aos infernos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 20, 'A misericórdia se esqueça dele; os vermes sejam a sua delicia; não haja dele memória, mas seja feito em pedaços como árvore que dão dá fruto.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 21, 'Com efeito devorou (ou roubou) a estéril que não dá filhos, e não fez bem à viúva.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 22, 'Destroçou os valentes com a sua fortaleza, mas, quando estiver em pé, não terá segura a sua vida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 23, 'Deus deu-lhe tempo de penitência, e ele abusa disto para se ensoberbecer, mas os olhos de Deus estão fixos nos seus caminhos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 24, 'Elevar-se-ão por um pouco de tempo, mas não subsistirão, e serão humilhados e arrebatados como todos os outros, e como cabeças de espigas serão cortados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 24), 25, 'Se isto não é assim, quem me poderá convencer de mentira, e acusar as minhas palavras diante de Deus?');

-- Capítulo 25
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 25, 6);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 25), 1, 'Então, respondendo Baldad Suita, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 25), 2, 'O poder e o terror estão naquele que mantém a concórdia (e a harmonia) nos seus altos (céus).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 25), 3, 'Porventura têm número as suas (celestiais) milicias? E sobre quem é que não se levanta a sua luz?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 25), 4, 'Porventura pode justificar-se o homem, comparado com Deus, ou aparecer puro o que nasceu da mulher?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 25), 5, 'Eis que a mesma lua não tem resplendor, e as mesmas estrelas não são puras na sua presença;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 25), 6, 'quanto menos o homem, que é podridão, e o filho do homem, que é um verme!');

-- Capítulo 26
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 26, 14);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 1, 'Job respondeu assim:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 2, 'Que auxílio deste a um fraco! Como sustentaste o braço do que não tem força!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 3, 'Que bem aconselhaste um ignorante! Que sabedoria demonstraste!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 4, 'A quem quiseste tu ensinar? Que espírito falou pela tua boca?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 5, 'Até os mortos tremem debaixo da terra, os mares e os que neles moram.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 6, 'Aberto está o inferno diante dele (Deus), e o abismo da perdição não tem nenhum véu.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 7, 'Ele é que estende o setentrião sobre o vácuo, e o que suspende a terra sobre o nada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 8, 'Ele é o que prende as águas nas suas nuvens, e as nuvens não se rasgam com o seu peso.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 9, 'Ele esconde a vista do seu trono, espalhando sobre ele as suas nuvens.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 10, 'Pôs em roda limites às águas, até aos confins entre a luz e as trevas. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 11, 'As colunas do céu estremecem, aterram-se às suas ameaças.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 12, 'Com a sua fortaleza levanta os mares, com a sua sabedoria doma o monstro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 13, 'O seu espirito adornou os céus, e a sua mão produziu a cobra tortuosa.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 26), 14, 'Eis que tudo isto não é senão uma (pequena) parte das suas obras, e, se apenas temos ouvido um leve sussurro da sua palavra, quem poderá compreender o trovão da sua grandeza?');

-- Capítulo 27
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 27, 23);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 1, 'Em seguida Job, continuando a sua parábola, acrescentou:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 2, 'Por Deus (o qual parece) que abandonou a minha causa (ao juízo dos homens), pelo Omnipotente, que submergiu a minha alma na amargura,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 3, '(juro que) enquanto em mim houver alento, enquanto Deus me conservar a respiração,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 4, 'os meus lábios não dirão uada de injusto, nem a minha língua proferirá mentira.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 5, 'Longe de mim o eu ter-vos por justos; enquanto eu viver, defenderei a minha inocência,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 6, 'não abandonarei a justificação que comecei a fazer, porque o meu coração nada me reprova em toda a minha vida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 7, 'Seja tido como culpado o meu inimigo, e o meu adversário seja como o iníquo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 8, 'Qual é a esperança do ímpio, quando Deus lhe arrancar a vida?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 9, 'Porventura ouvirá Deus o seu clamor, quando lhe sobrevier a tribulação?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 10, 'Poderá ele deleitar-se no Omnipotente, e invocar a Deus em todo o tempo?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 11, 'Eu vos ensinarei, com o auxilio de Deus, o que faz o Omnipotente, não vo-lo esconderei.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 12, 'Mas todos vós já o sabeis; porque proferia inútilmente palavras vãs?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 13, 'Esta é a sorte do homem ímpio diante de Deus, esta a herança que os violentos receberão da Omnipotente.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 14, 'Se os teus filhos se multiplicarem, serão para a espada, e os seus netos não serão fartos de pão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 15, 'Os que ficarem da sua linhagem serão sepultados na sua ruína, e as suas viúvas não chorarão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 16, 'Se ele amontoar prata como terra, e se juntar vestidos como pó,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 17, 'ele sim os juntará, mas o justo se vestirá com eles,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 18, 'Fabricou como a traça a sua casa, e como o guarda fez a sua choupana. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 19, 'O rico deita-se: é pela última vez; abre os olhos, e já não existe.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 20, 'O terror o surpreenderá como uma inundação, de noite o arrastará a tempestade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 21, 'Um vento abrasador o tirará e levará, e como fim redemoinho o arrebatará do seu lugar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 22, 'Deus mandará sobre ele (estas coisas), e não o poupará, e ele se esforçará por fugir da sua mão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 27), 23, 'Quem vir o seu lugar, baterá palmas (contra ele) e assobiará sobre ele (escarnecendo).');

-- Capítulo 28
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 28, 28);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 1, 'A prata tem um lugar donde se extrai, o ouro um lugar próprio, onde se acrisola.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 2, 'O ferro tira-se da terra, e a pedra, derretida no fogo, torna-se em metal.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 3, '(O homem) põe um fim às trevas, e ele mesmo investiga o fim de todas as coisas, (mesmo) a pedra escondida na escuridão e na sombra da morte.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 4, 'Longe dos povoados abre galerias, ignoradas dos pés dos que passam; suspenso, (em cordas, o mineiro) oscila, longe dos homens (no fundo da mina).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 5, 'Um a terra, que produz o pão, por baixo está como fogo;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 6, 'as suas pedras contêm safiras, e os seus torrões partículas de ouro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 7, 'A águia não conhece esses caminhos, e olho do abutre não os viu;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 8, 'as feras não os trilharam, nem o leão passou por lá.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 9, 'Estende a sua mão contra os rochedos, remexe os montes desde as suas raízes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 10, 'Cortando os penhascos, abre galerias, e os seus olhos vêem aí tudo o que há de precioso.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 11, 'Investiga também a profundidade dos rios, e põe a descoberto o que estava escondido.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 12, 'Mas a sabedoria, onde se encontra ela? Qual é o lugar da inteligência?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 13, 'O homem não conhece o seu caminho, nem ela se encontra na terra dos mortais.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 14, 'O abismo diz: Ela não está em mim; e o mar publica: Ela não está comigo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 15, 'Não é dada pelo mais puro ouro, nem é comprada a peso de prata.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 16, 'Não se põe na balança com o ouro de Ofir, nem com o precioso berilo nem com a safira.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 17, 'Não se lhe iguala o ouro nem o vidro (fino), e não é dada em troca por vasos de ouro;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 18, 'O coral e o cristal não se comparam com ela; a sabedoria vale mais que as pérolas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 19, 'Não se lhe iguala o topázio da Etiópia, nem é comparada com o ouro mais puro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 20, 'Donde vem, pois, a sabedoria, e onde é que se encontra a inteligência?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 21, 'Está escondida aos olhos de todos os viventes, até às aves do céu está oculta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 22, 'O inferno e a morte dizem: Aos nossos ouvidos chegou a sua fama.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 23, 'Deus conhece o caminho para a encontrar, ele sabe onde se encontra,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 24, 'porque ele vê até aos confins do mundo, e vê tudo o que há debaixo do céu.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 25, 'Quando deu o seu peso aos ventos, e regulou as águas com medida,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 26, 'quando prescreveu uma lei às chuvas e traçou um caminho aos relâmpagos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 27, 'então ele a viu e a mediu, e a estabeleceu e a perscrutou.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 28), 28, 'E disse ao homem: O temor do Senhor é a (verdadeira) sabedoria; o apartar-se do mal é a inteligência.');

-- Capítulo 29
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 29, 25);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 1, 'Job, continuando a sua parábola, acrescentou:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 2, 'Quem me dera ser como fui nos meses antigos, como nos dias em que Deus me guardava,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 3, 'quando a sua lâmpada luzia sobre a minha cabeça, e quando eu, guiado pela sua luz, caminhava (seguro) entre as trevas!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 4, 'Como fui nos dias do meu outono, quando Deus protegia a minha casa,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 5, 'quando o Omnipotente estava comigo, e meus filhos em volta de mim;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 6, 'quando eu (por assim dizer) lavava os meus pés em leite, e quando a pedra derramava para mim arrolos de azeite;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 7, 'quando eu saia até à porta da cidade, e me sentava numa cadeira na praça pública!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 8, 'Viam-me (nessa altura) os jovens e retiravam-se (reverentes); os velhos, levantando-se, punham-se de pé.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 9, 'Os príncipes cessavam de falar, e punham a mão sobre a sua boca.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 10, 'Os grandes continham a sua voz, e a sua língua ficava pegada ao paladar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 11, 'O ouvido que me escutava, chamava-me bem-aventurado, e os olhos que me viam, davam (bom) testemunho de mim,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 12, 'porque eu livrava o aflito suplicante, e o órfão, que não tinha quem o socorresse,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 13, 'A bênção do que estava a perecer vinha sobre mim, e eu consolava o coração da viúva.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 14, 'Revesti-me de justiça, e a equidade serviu-me como de vestido e de diadema.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 15, 'Fui o olho do cego, e o pé do coxo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 16, 'Eu era o pai dos pobres, e as causas (dos pobres) de que eu não tinha conhecimento, informava-me delas com toda a diligência.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 17, 'Eu quebrava as maxilas do iníquo, e tirava-lhe a presa dentre os dentes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 18, 'Eu dizia: Morrerei no meu ninho, e multiplicarei os dias como a areia.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 19, 'A minha raiz estende-se ao longo das águas, e o orvalho descansa sobre os meus ramos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 20, 'A minha glória sempre se renovará, e o meu arco fortificar-se-á na minha mão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 21, 'Os que me ouviam esperavam a minha opinião, e em silêncio estavam atentos ao meu conselho.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 22, 'Não ousavam juntar nada ás minhas palavras, e as minhas razões caíam sobre eles como orvalho.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 23, 'Esperavam-me como a chuva, e abriam a sua boca como (faz a terra seca) às águas da primavera.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 24, 'Se alguma vez lhes sorria, não o acreditavam, e a luz do meu rosto não caia por terra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 29), 25, 'Quando ia ter com eles, sentava-me no primeiro lugar, como um rei no meio do seu exército, como um consolador dos aflitos.');

-- Capítulo 30
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 30, 31);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 1, 'Porém, agora zombam de mim os mais novos que eu, cujos pais noutro tempo não dignaria eu pôr com os cães do meu rebanho!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 2, 'De que me serviria a força dos seus braços? Não têm vigor algum.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 3, 'Mirrados pela pobreza e pela fome, roem o deserto, terra, de há muito, árida e desolada;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 4, 'apanham ervas e cascas de árvores, alimentam-se de raízes de giesta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 5, 'Escorraçados do meio da sociedade, perseguidos com gritos como ladrões,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 6, 'habitam em horríveis desfiladeiros, nas cavernas da terra, ou nos penhascos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 7, 'rugindo entre os silvados e reunindo-se debaixo dos espinheiros.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 8, 'Filhos de ignóbeis e desprezíveis, são mais pisados que a terra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 9, 'Agora cheguei a ser o assunto das cantigas, o objecto dos escárnios destes tais.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 10, 'Eles abominam-me, fogem para longe de mim, e não receiam cuspir-me no rosto.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 11, 'Perdido todo o respeito, me insultam, não se refreiam na minha presença.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 12, 'A meu lado se levanta a gentalha, e procura caminhos para me perder.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 13, 'Destroem as minhas veredas, preparam a minha ruína, e ninguém os contém.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 14, 'Como por uma larga brecha, irrompem sobre mim, surgem do meio das ruínas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 15, 'Assaltam-me terrores, a minha prosperidade passou como vento, a minha felicidade passou como nuvem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 16, 'E agora dentro de mim mesmo se murcha a minha alma, e os dias de aflição apoderam-se de mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 17, 'De noite os meus ossos são traspassados de dores, os (males) que me devoram, não dormem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 18, 'Pela sua violência, a minha veste é deformada; aperta-me como a gola da minha túnica.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 19, 'Atirou-me ao lodo, e sou semelhante ao pó e à cinza.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 20, 'Clamo a ti, e não me ouves, ponho-me diante de ti, e não olhas para mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 21, 'Trocaste-te em severo para comigo, e cora a dureza da tua mão me combates.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 22, 'Elevas-me, e, pondo-me sobre o vento, fazes-me debater no meio da tormenta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 23, 'Sei que me entregarás à morte, onde há casa estabelecida para todo o vivente.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 24, 'Porventura o que vai perecer não estende as mãos, e, na sua infelicidade, não lança um grito?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 25, 'Eu chorava outrora com aquele que estava aflito, e a minha alma compadecia-se do pobre.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 26, 'Esperava bens, e vieram-me males; esperava a luz, e saíram-me trevas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 27, 'As minhas entranhas estão-se abrasando sem descanso algum; os dias da aflição surpreenderam-me.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 28, 'Caminho triste, sem conforto, ponho-me a gritar no meio da multidão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 29, 'Sou (como) irmão dos chacais e companheiro dos avestruzes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 30, 'A minha pele está denegrida e vai caindo, e os meus ossos secaram-se pelo ardor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 30), 31, 'A minha citara trocou-se em pranto, e a minha lira em lamentos.');

-- Capítulo 31
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 31, 40);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 1, 'Fiz pacto com os meus olhos de não olhar (cobiçosamente) para uma virgem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 2, 'Porque (doutra sorte), que comunicação teria comigo Deus lá de cima, ou que parte me daria o Omnipotente da sua celestial herança?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 3, 'Porventura não está estabelecida a perdição para o malvado, e a desventura para os que praticam a injustiça?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 4, 'Porventura não considera ele os meus caminhos, e não conta todos os meus passos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 5, 'Se caminhei na falsidade, se o meu pé se apressou para o engano,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 6, 'pese-me Deus em sua balança justa, e conhecerá a minha integridade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 7, 'Se os meus pés se desviaram do (bom) caminho, se o meu coração seguiu os meus olhos, se às minhas mãos se pegou qualquer mácula,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 8, 'semeie eu, e outro o coma. e sejam as minhas plantações arrancadas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 9, 'Se o meu coração foi seduzido por uma mulher, e se andei a vigiar (para cometer adultério) à porta do meu amigo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 10, 'seja minha mulher desonrada por outro, seja entregue à paixão de outros.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 11, 'Porque este é um pecado vergonhoso, uma grave maldade,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 12, 'é um fogo que consome até ao extermínio, e que destruiria todo o bem que juntei.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 13, 'Se eu desprezei as razões do meu servo ou da minha serva, quando eles disputavam contra mim,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 14, 'que será de mim quando Deus se levantar para me julgar? Quando me interrogar, que lhe responderei?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 15, 'Porventura o que me formou no ventre materno não o criou também a ele, e não foi o mesmo Deus que nos formou no ventre materno?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 16, 'Porventura neguei aos pobres o que pediam, e deixei desfalecer os olhos da viúva,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 17, 'ou comi sózinho o meu bocado de pão, e o órfão não comeu dele?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 18, 'Com efeito, desde a minha infância cresceu comigo a comiseração, e do ventre de minha mãe saiu comigo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 19, 'Se desprezei o que perecia, porque não tinha de que vestir-se, e o pobre que não tinha com que cobrir-se,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 20, 'se os seus membros me não abençoaram, ele (o pobre) não se aqueceu com a lã das minhas ovelhas;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 21, 'se levantei a minha mão contra o órfão, ainda quando me via superior, (administrando justiça) à porta (da cidade),'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 22, 'caia o meu ombro da sua juntura, e quebre-se o meu braço com os seus ossos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 23, 'Porque eu sempre temi a mão de Deus, e nunca pude suportar o peso da sua majestade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 24, 'Não julguei que o ouro era a minha força, não disse ao ouro mais puro: tu és a minha confiança;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 25, 'não me alegrei com as minhas grandes riquezas, com os grandes bens que juntei pela minha mão;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 26, 'Se via o sol quando brilhava, e a lua quando caminhava na sua claridade (considerando-os como deuses),'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 27, 'porventura o meu coração sentiu algum oculto contentamento, e beijei a minha mão com a minha boca (em sinal de adoração)?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 28, 'Isso seria uma grandíssima iniquidade, seria renunciar ao Deus altíssimo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 29, 'Acaso me alegrei com a ruína daquele que odiava, e exultei com o mal que lhe sobreveio?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 30, '(Não, não foi assim), pois, não permiti que a minha língua pecasse, demandando com imprecações a sua morte.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 31, 'Acaso as pessoas da minha casa não diziam: Quem há que se não tenha saciado (com o pão) da sua mesa?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 32, 'O peregrino não passava a noite fora, a minha porta estava sempre aberta ao viandante.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 33, 'Nunca encobri, como homem, o meu pecado, ocultando no meu coração a minha iniquidade,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 34, 'por temor da grande assembleia, ou com receio do desprezo dos meus parentes, a ponto de me conservar em silêncio, sem sair da minha porta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 35, 'Quem me dera um que (desapaixonadamente) me ouvisse! Eis a minha assinatura: que o Omnipotente me responda! Que o meu adversário escreva também o seu libelo de acusação!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 36, 'Levá-lo-ei sobre os meus ombros, e cingirei a minha fronte com ele, como com um diadema!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 37, 'Cada um dos meus passos contarei (a Deus, meu juiz), e apresentar-me-ia a ele, (sem receio) como um príncipe.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 38, '(Finalmente) se a terra que eu possuo clama contra mim. e se os seus sulcos choram com ela,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 39, 'se comi seus frutos sem pagamento, se afligi o coração dos que a cultivaram,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 31), 40, 'ela me produza abrolhos em lugar de trigo, e espinhos em lugar de cevada. (Findaram as palavras de Job).');

-- Capítulo 32
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 32, 14);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 1, 'Por fim estes três homens cessaram de responder a Job, porque se tinha por justo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 2, 'Então Eliú, filho de Baraquel de Buz, da família de Ram, encheu-se de indignação, e irritou-se contra Job, porque este dizia que era justo diante de Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 3, 'Irritou-se também contra os seus amigos, por não terem achado resposta conveniente para lhe dar, e por, apesar disso, o haverem condenado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 4, 'Eliú havia esperado calado, enquanto eles falavam com Job, porquanto eram mais velhos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 5, 'Mas, quando viu que os três não lhe puderam responder, indignou-se fortemente.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 6, 'Então, tomando a palavra Eliú, filho de Baraquel de Buz, disse: Sou novo ainda, e vós já velhos; portanto, abaixando a minha cabeça, não me atrevi a expor-vos o meu parecer.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 7, 'Eu esperava que falasse (com argumentos sólidos) a idade mais madura, e que os muitos anos ensinassem a sabedoria,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 8, 'Sentido deste versículo: Deus deu aos homens uma alma racional capaz de compreender a verdade, mas a verdadeira sabedoria provém de uma inspiração particular do mesmo Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 9, 'Mas, pelo que vejo, é o espirito de Deus nos homens, é a inspiração do Omnipotente que dá a inteligência.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 10, 'Não são sábios os de muita idade, nem os anciãos os que julgam o que é justo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 11, 'Portanto falarei: Ouvi-me, eu vos mostrarei também o meu pensamento.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 12, 'Falarei, e respirarei um pouco; abrirei os meus lábios, e responderei.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 13, 'Não farei aceitação de pessoa, não adularei seja quem for.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 32), 14, 'Não sei usar circunlóquios, e por um pouco me suportará o meu Criador.');

-- Capítulo 33
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 33, 33);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 1, 'Ouve, pois, Job, as minhas palavras, escuta todos os meus discursos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 2, 'Eis que abri a minha boca, fale a minha língua sob o meu palato.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 3, 'O meu coração dará palavras sapientes, os meus lábios proferirão palavras claras.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 4, 'O espirito de Deus me fez, e o sopro do Omnipotente me deu a vida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 5, 'Se podes, responde-me, ergue-te e aguenta-te contra mim.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 6, 'Deus me fez a mim, como a ti, do mesmo barro também eu fui formado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 7, 'Pelo que nada há de maravilhoso em mim que te espante, e o meu peso não te esmagará.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 8, 'Ora disseste aos meus ouvidos, e ouvi o som destas tuas palavras:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 9, '"Eu estou limpo e sem pecado; estou sem mácula, em mim não há iniquidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 10, 'Deus achou queixas contra mim, por isso me considerou como seu inimigo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 11, 'Pôs os meus pés no cepo, observou todas as minhas veredas."'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 12, 'Nisto pois (ó Job) mostraste que não és justo, porque Deus é maior do que o homem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 13, 'Por que te queixas dele, pelo facto de não dar razão de tudo o que faz?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 14, 'Deus fala de um modo, fala de outro, mas o homem não o entende.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 15, 'Em sonho, em visão noturna, quando o sono cai sobre os homens, quando estão dormindo no seu leito,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 16, 'então (Deus) abre os ouvidos dos homens, e, com as suas censuras os aterra,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 17, 'para os apartar do mal, para os livrar da soberba,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 18, 'para salvar a sua alma da corrupção, e a sua vida de um fim desastrado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 19, '(Deus) corrige também o homem, por meio das dores no seu leito, quando faz que todos os seus ossos se mirrem,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 20, 'Neste estado se lhe torna aborrecido o pão, e o manjar que noutro tempo a sua alma apetecia.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 21, 'Vai-se consumindo a sua carne, e os ossos, que tinham estado cobertos, se descobrem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 22, 'A sua alma aproximou-se do sepulcro, a sua vida dos horrores da morte.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 23, 'Se houver algum anjo, um entre milhares, que fale a seu favor, que instrua o homem no seu dever,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 24, 'Se compadeça dele e diga: "Livra-o, para que não desça à corrupção; encontrei o resgate (da sua vida)",'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 25, '- a sua carne reverdecerá mais que na juventude, voltará aos dias da adolescência.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 26, 'Ele suplicará a Deus, e Deus se aplacará, mostrar-lhe-à com júbilo a sua face, e dará ao homem o seu direito.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 27, 'Ele se voltará para os (outros) homens e dirá; Pequei, violei a justiça, e não fui castigado como merecia.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 28, 'Deus livrou a minha alma de cair na morte, e a minha vida volta a ver a luz.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 29, 'Ora Deus faz todas estas coisas, duas ou três vezes, em cada homem,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 30, 'para retirar a sua alma da corrupção, e para a esclarecer com a luz dos viventes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 31, 'Atende, Job, e ouve-me; cala-te, enquanto eu falo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 32, 'Se contudo tens alguma coisa a dizer, responde-me, fala, porque eu quero dar-te razão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 33), 33, 'Mas, se nada tens (que responder), ouve-me; cala-te, e eu te ensinarei a sabedoria.');

-- Capítulo 34
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 34, 37);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 1, 'Continuando, pois, Eliú o seu discurso, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 2, 'Ouvi, sábios, as minhas palavras, eruditos, prestai-me atenção,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 3, 'porque o ouvido julga as palavras, assim como o paladar distingue os manjares pelo gosto.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 4, 'Examinemos entre nós a causa, e vejamos de comum acordo o que seja melhor.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 5, 'Job disse: Eu sou justo, e Deus recusa-me justiço, (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 6, 'Padeço, contra o meu direito, atroz é a minha chaga, sem eu ter pecado algum.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 7, 'Que homem há (pois) semelhante a Job, que bebe o escárnio como água,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 8, 'que anda com os que cometem a iniquidade, que caminha com os homens impios?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 9, 'Porque ele disse: Não aproveita ao homem estar de bem com Deus. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 10, 'Vós, pois, ó homens sensatos, ouvi-me: Longe de Deus a iniquidade! Longe do Omnipotente a injustiça!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 11, 'Em verdade ele dá ao homem segundo as suas obras, recompensa cada um segundo o seu proceder.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 12, 'De certo Deus não condena sem razão, nem o Omnipotente atropela a justiça.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 13, 'Quem lhe deu a terra para ele a governar? Quem fez o mundo inteiro?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 14, 'Se ele (Deus) chamasse a si o seu espírito, se retraísse o seu sopro e o seu alento;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 15, 'toda a carne perecera num instante, e o homem voltaria ao pó.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 16, 'Portanto, se tens entendimento, ouve isto, escuta o som das minhas palavras.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 17, 'Acaso poderia governar, aquele que não ama a justiça? Como condenas tu, pois, afoutamente aquele que é sumamente justo?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 19, 'Não faz aceitação da pessoa dos poderosos, não antepõe o rico ao pobre, porque todos são obra das suas mãos. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 20, 'Eles morrerão de improviso, desaparecerão; no meio da noite os povos se sublevarão, e derrubarão o tirano sem esforço.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 20, 'Deus não teme os grandes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 21, 'Com efeito os olhos de Deus estão Sobre os caminhos dos homens, ele considera todos os seus passos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 22, 'Não há trevas, e não há sombra de morte, onde possam esconder-se os que praticam a iniquidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 23, '(Deus) não precisa de olhar um homem duas vezes, para o citar a comparecer no seu tribunal.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 24, 'Abate os poderosos, sem andar em averiguações, e põe outros em seu lugar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 25, 'Conhecedor das suas obras, derruba-os numa noite, e eles ficam aniquilados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 26, 'Fere-os como ímpios, à vista de todos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 27, 'porque se apartaram dele, não quiseram conhecer os seus caminhos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 28, 'de sorte que fizeram com que chegasse até ele o clamor do oprimido, e lhe fizeram ouvir a voz dos pobres.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 29, 'Se ele se cala, quem há que o condene? Se esconde o seu rosto, quem o poderá contemplar, quer se trate das nações, quer de um particular?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 30, 'Ele não deixa que o impio reine, que o povo fique sujeito a tropeçar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 31, 'E, já que falei de Deus, também te não estorvarei a ti de falar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 32, 'Se eu errei, corrigi-me, se falei com iniquidade, não direi mais nada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 33, 'Porventura pedir-te-á Deus conta do que eu falei, que te desagradou? mas tu foste o primeiro a falar, e não eu; e, se sabes coisa melhor, dize-a.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 34, 'Falem-me homens atilados, assim conto o homem sábio que me escuta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 35, 'Job falou nèsciamente, as sua palavras não foram acertadas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 36, 'Oxalá que seja provado Job até ao fim, pelas suas respostas de homem iníquo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 34), 37, 'porque ao seu pecado junta a revolta; bate palmas contra nós, e multiplica queixas contra Deus.');

-- Capítulo 35
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 35, 16);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 1, 'Eliú, falando de novo, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 2, 'Parece-te porventura justo o teu pensamento, quando disseste: Eu tenho razão contra Deus?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 3, 'Ou quando disseste: de que me serve a minha inocência, que vantagem tirei de não pecar?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 4, 'Eu, portanto, responderei aos teus discursos e aos teus amigos contigo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 5, 'Levanta os olhos ao céu e vê, contempla como o firmamento é mais alto que tu.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 6, 'Se pecares, que dano farás tu a Deus? Se as tuas iniquidades se multiplicarem, que prejuízo lhe causarás?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 7, 'Se obrares com justiça, que proveito lhe darás ou que receberá ele da tua mão?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 8, 'A tua impiedade só poderá fazer mal a um homem, que é teu semelhante; a tua justiça só poderá ser útil ao afilho do homem.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 9, 'Eles (os oprimidos) clamam por causa da gravidade da opressão, e lamentam-se por causa da violência do braço dos tiranos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 10, 'Mas nenhum disse: Onde está o Deus que me criou, que inspira cânticos de júbilo em plena noite;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 11, 'que nos instrui mais que aos animais da terra, e nos ilustra mais que às aves do céu?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 12, 'Clamam então, e Deus não os ouve por causa da soberba dos maus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 13, 'Deus não ouve gritos vãos o Omnipotente não os atende.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 14, 'Ainda quando tenhas dito: "(Deus") não atende", — a (tua) causa está já diante dele, espera o seu julgamento.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 15, 'Mas, agora, porque a sua cólera ainda se não manifestou, há motivo para dizer que ele não faz caso do crime?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 35), 16, 'Logo Job em vão abriu a sua boca, insensatamente multiplicou palavras.');

-- Capítulo 36
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 36, 33);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 1, 'Eliú, continuando, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 2, 'Suporta-me um pouco, e eu me explicarei contigo, porque ainda tenho que falar em defesa de Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 3, 'Tornarei a pegar no discurso desde o principio, e provarei que o meu criador é justo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 4, 'Verdadeiramente os meus discursos são sem mentira; far-te-ei ver que a (minha) doutrina é sólida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 5, 'Deus é poderoso, mas não desdenhoso, é poderoso pela sua ciência,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 6, 'Não deixa florescer os ímpios, e faz justiça aos pobres.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 7, 'Não tirará (nunca) os seus olhos dos justos, e, ao fim, os colocará, com os reis, sobre o trono, numa glória eterna.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 8, 'E, se estiverem em cadeias, atados com os laços da pobreza,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 9, 'ele lhes fará ver as suas obras, as suas maldades, cometidas por orgulho.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 10, 'Abrir-lhes-ã os ouvidos à correção e lhes falará para que se convertam da sua iniquidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 11, 'Se ouvirem e obedecerem, acabarão os seus dias na felicidade, os seus anos em delícias.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 12, 'Porém, se não ouvirem, serão passados à espada, e perecerão na sua cegueira.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 13, 'Os corações impios entregam-se à cólera, não clamam a Deus, quando se vêem aprisionados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 14, 'Morrerão em plena juventude, e a sua vida acabará como a dos dissolutos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 15, 'Pelo contrário Deus livra o pobre, pela sua angústia, e abre-lhe o ouvido com a tribulação,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 16, 'Ele te salvará (ó Job) do abismo estreito da angústia e te porá ao largo, em plena liberdade, (se te converteres), e tu repousarás à tua mesa cheia de gordas viandas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 17, 'Mas se seguires as vias do impio, suportarás a sentença e o castigo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 18, 'Não te leve, pois, a ira, ao arrebatamento, nem te faça desanimar a grandeza da expiação.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 19, 'Poderá tirar-te da angústia o teu clamor, e todos os teus vigorosos esforços?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 20, 'Não suspires pela noite (da morte), na qual entram os povos, um após outro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 21, 'Guarda-te de declinares para a iniquidade, ainda que a abraçasses, levado pela miséria.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 22, 'Olha como Deus é excelso na sua fortaleza. Quem, como ele, é terrível?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 23, 'Quem lhe prescreveu normas de conduta? Ou quem poderá dizer-lhe: Tu fizeste mal?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 24, 'Lembra-te que deves celebrar a sua obra, a qual tantos homens cantaram.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 25, 'Todos os homens o vêem, mas cada um o vê de longe.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 26, 'Com efeito, Deus é grande e ultrapassa toda a nossa ciência, o número dos seus anos é incalculável.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 27, 'Ele atrai as gotas de água, e derrama-as em (forma de) chuva, na cerração.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 28, 'Caem dás nuvens, abundantemente sobre os homens.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 29, 'Quem compreende a extensão das nuvens, os fragores do pavilhão (do Altíssimo)?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 30, 'Ele estende em volta de si a sua luz desde o alto, e cobre as extremidades do mar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 31, 'Por meio destas coisas exerce os seus juízos sobre os povos, e alimenta abundantemente os mortais (fecundando a terra),'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 32, 'Nas suas mãos esconde a luz, e manda-lhe que torne de novo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 36), 33, 'Faz conhecer a quem ama, que ele é possessão sua, e que pode subir até ela. (ver nota)');

-- Capítulo 37
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 37, 24);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 1, 'Por isto se espantou o meu coração, e (como que) se moveu do seu lugar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 2, 'Ouvi, ouvi a sua voz terrível, o som que sai da sua boca.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 3, 'Ele o espalha na imensidão dos céus, e a sua luz chega às extremidades da terra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 4, 'Depois (do relâmpago) ruge o trovão, ribomba com a sua voz majestosa; nada pode deter os raios, quando for ouvida a sua voz.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 5, 'Deus troveja maravilhosamente com a sua voz, ele faz coisas grandes e impenetráveis.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 6, 'Ele manda à neve que caia sobre a terra, e às chuvas copiosas, que sejam fortes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 7, 'Ele põe um selo sobre a mão de todos os homens, para que cada um conheça as suas obras.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 8, 'A fera mete-se no seu esconderijo, e fica na sua cova.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 9, 'Do austro sai a tempestade, e o frio do setentrião.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 10, 'O gelo forma-se ao sopro de Deus, e depois derramam-se as águas em abundância.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 11, 'Carrega de vapores as nuvens, e as nuvens (com relâmpagos) espalham a sua luz,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 12, 'em todas as direções, girando por onde quer que as conduz a vontade daquele que as governa, executando tudo quanto ele lhes manda sobre a face de toda a terra,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 13, 'quer para castigo do mundo, quer para seu beneficio.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 14, 'Ouve, Job, estas coisas: pára e considera as maravilhas de Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 15, 'Sabes tu porventura como ele as opera, como faz brilhar o relâmpago nas suas nuvens?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 16, 'Porventura conheces como se equilibram no ar as nuvens, e os prodígios daquele que tudo sabe?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 17, 'Como é que as tuas vestes se aquecem, quando o vento do meio-dia sopra sobre a terra?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 18, 'Formaste tu porventura juntamente com ele os céus, que são tão sólidos como um espelho de bronze!'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 19, '(Se é assim) mostra-nos o que lhe poderemos dizer, porque nós, envolvidos em trevas, não sabemos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 20, 'Quem lhe referirá o que eu digo? Se um homem se atrever a falar, ficará oprimido.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 21, 'Agora (os homens) não vêem a luz, (porque) o ar repentinamente se condensa em nuvens; mas (daqui a um instante, já poderão ver, porque) um vento que passa as dissipará.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 22, 'Do setentrião vem áureo resplendor, e Deus veste-se de terrível majestade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 23, 'Não podemos alcançar o Omnipotente: ele é grande em fortaleza, em equidade, em sua justiça, não responde a ninguém.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 37), 24, 'Por isso os homens o temerão! Ele não olha para os que se julgam sábios.');

-- Capítulo 38
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 38, 41);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 1, 'Então o Senhor falou a Job, do meio dum redemoinho, dizendo:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 2, 'Quem é este que obscurece assim a Providência, com discursos insipientes?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 3, 'Cinge os teus rins como um homem; interrogar-te-ei, e responder-me-ás.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 4, 'Onde estavas tu, quando eu lançava os fundamentos da terra? Di-lo, se o sabes.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 5, 'Sabes quem fixou as medidas para ela? Quem estendeu sobre ela a régua?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 6, 'Sobre que foram firmadas as suas bases, ou quem assentou a sua pedra angular,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 7, 'quando os astros da manhã, em coro, me louvavam, e quando todos os filhos de Deus (os anjos) aplaudiam jubilosos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 8, 'Quem pôs diques ao mar, quando ele irrompia do seio materno,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 9, 'quando eu punha as nuvens por sua vestidura, e o envolvia em neblinas espessas, como em faixas,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 10, 'quando lhe marquei limites, pondo-lhe portas e ferrolhos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 11, 'e lhe disse: Até aqui chegarás, mas daqui não passarás: aqui quebrarás a soberba das tuas ondas?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 12, 'Porventura tu, depois do teu nascimento, deste lei à luz da manhã? Acaso marcaste à aurora o seu lugar,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 13, 'para que ocupe os extremos da terra e sacuda dela os malfeitores?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 14, 'Ela (a terra) se transforma como a argila sob o selo, e se mostra como coberta com um vestido. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 15, 'É tirada aos ímpios a sua luz (que é a noite) e quebra-se o seu braço altivo (erguido para o crime).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 16, 'Porventura entraste tu até ao fundo do mar, e andaste passeando no mais profundo do abismo?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 17, 'Porventura foram-te abertas as portas da morte, viste essas portas tenebrosas?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 18, 'Consideraste toda a extensão da terra? Declara-me, se sabes, todas estas coisas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 19, 'Qual o caminho para as moradas da luz, e qual é o lugar das trevas?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 20, 'Saberás levá-las aos seus lugares, reconhecer as veredas da sua casa?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 21, 'Deves saber, com certeza, porque então já eras nascido, tão grande é o número dos teus dias...'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 22, 'Entraste porventura nos depósitos da neve, ou viste os depósitos da saraiva,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 23, 'que eu preparei para o tempo da angústia, para o dia da guerra e da batalha?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 24, 'Por que caminho se difunde a luz, e se espalha o vento (quente) do oriente sobro a terra?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 25, 'Quem abriu caminho á inundação, e rasgou estradas aos fogos tonitruantes,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 26, 'para fazer chover sobre uma terra sem habitantes, sobre um deserto, onde nenhum homem mora,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 27, 'para alagar uma terra árida e desolada, e fazer germinar a erva verde?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 28, 'A chuva tem pai? Quem produziu as gotas do orvalho?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 29, 'De que seio saiu a geada, e quem gerou o gelo do céu?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 30, 'As águas endurecem-se como pedra, e a superfície do abismo (do mar) torna-se sólida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 31, 'E’s tu porventura que fazes aparecer as constelações, a seu tempo, e girar a Ursa com os seus filhos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 32, 'Conheces, acaso, as leis do céu, regulas a sua influência sobre a terra?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 33, 'Podes levantar a tua voz até às nuvens, e fazer vir sobre ti um dilúvio de água?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 34, 'Porventura mandarás os relâmpagos, e eles irão, dizendo-te: Aqui estamos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 35, 'Porventura mandarás os relâmpagos, e eles irão, dizendo-te: Aqui estamos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 36, 'Quem pus sabedoria nas nuvens, e inteligência nos meteoros? (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 37, 'Quem pode contar exatamente as nuvens e inclinar as urnas do céu,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 38, 'para o pó se tornar em massa, e os torrões (com a água) aderirem uns aos outros?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 39, 'Porventura caçarás tu presa para a leoa, e saciarás a fome dos seus cachorros,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 40, 'quando estes estão deitados nos seus covis, ou à espreita nas suas brenhas?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 38), 41, 'Quem prepara ao corvo o seu sustento, quando os seus filhinhos gritam para Deus, indo dum lado para o outro (do ninho) por não terem que comer?');

-- Capítulo 39
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 39, 35);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 1, 'Porventura conheces o tempo em que as cabras montesas dão à luz nos rechedos, ou observaste o parto das corsas?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 2, 'Contaste os meses da sua gravidez, e sabes o tempo do seu parto?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 3, 'Encurvam-se para darem à luz a sua cria, e (assim) se livram das suas dores.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 4, 'Tornam-se vigorosos os seus filhos, crescem nos campos, saem, e não voltam para junto delas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 5, 'Quem pôs o asno montês em liberdade, e quem soltou as suas prisões?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 6, 'Dei-lhe uma casa no deserto, lugar onde albergar-se em terra estéril.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 7, 'Ele despreza o tumulto da cidade, e não ouve os gritos de um patrão duro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 8, 'Vagueia pelos montes onde pasta, anda buscando tudo o que está verde.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 9, 'Porventura quererá o búfalo servir-te, ou ficará ele no teu estábulo?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 10, 'Acaso prendê-lo-ás ao teu arado para lavrar, ou será ele que atrás de ti quebra os torrões dos teus vales?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 11, 'Porventura terás confiança na sua grande força, e lhe deixarás o cuidado da tua lavoura ?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 12, 'Porventura fiarás dele que te torne o que semeaste, e que te encha a tua eira?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 13, 'A pena da avestruz é semelhante às penas da cegonha e do falcão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 14, 'Ele abandona por terra os seus ovos, deixa-os aquecer sobre a areia,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 15, 'não pensando que algum pé lhos pisará, ou que algum animal do campo lhos quebrará.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 16, 'É cruel com seus filhos, como se não foram seus, e não se inquieta com que seja (possa ser) vã a sua fadiga.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 17, 'Deus negou-lhe a sabedoria, não lhe deu inteligência.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 18, 'Mas, quando chega a ocasião, levanta ao alto o voo, e faz zombaria do cavalo e do cavaleiro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 19, 'És tu que dás fortaleza ao cavalo, que circundas o seu pescoço de crina flutuante?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 20, 'E’s tu que o ensinas a saltar como o gafanhoto? o fogoso respirar das suas ventas faz terror,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 21, 'Escava a terra com o seu casco, salta com brio, corre ao encontro dos (inimigos) armados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 22, 'Ri-se do medo, nada o aterra, não retrocede diante da espada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 23, 'Sobre ele fará ruido á aljava, cintilará a lança e o escudo;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 24, 'espumando e relinchando (como que) devora a terra, e não faz caso do som da trombeta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 25, 'Ouvindo o clarim, (como que) diz: Avancemos! Fareja de longe a batalha, a exortação dos capitães e o alarido do exército.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 26, 'Acaso o açor levanta o voo pela tua sabedoria, estendendo as suas asas para o meio-dia?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 27, 'Porventura ao teu mandado se remontará a águia, e porá o seu ninho em lugares altos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 28, 'Mora nos rochedos, aí passa a noite, nos penhasco escarpados, no alto das rochas inacessíveis.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 29, 'Dali espreita a sua presa; os seus olhos descobrem muito ao longe.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 30, 'Os seus filhinhos chupam o sangue, e ela, onde houver carne morta, logo se encontra.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 31, 'O Senhor, dirigindo-se a Job, acrescentou:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 32, 'Porventura o censor do Omnipotente quer disputar com ele? Que aquele, que censura a Deus, responda.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 33, 'Job, porém, respondendo ao Senhor, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 34, 'Eu, desprezível como sou, que coisa posso responder? Ponho a minha mão sobre a minha boca.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 39), 35, 'Uma coisa disse - oxalá não tivesse dito! - e uma outra também, às quais nada mais acrescentarei.');

-- Capítulo 40
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 40, 28);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 1, 'Respondendo o Senhor a Job, do meio do remoinho, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 2, 'Cinge os teus rins como homem; eu te interrogarei, e me responderás.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 3, 'Porventura queres reduzir a nada a minha justiça, e condenar-me a mim, para te justificares a ti?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 4, 'Se tu tens um braço (forte) como Deus, e trovejas com voz semelhante,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 5, 'reveste-te de grandeza e majestade, cobre-te de esplendor e de glória.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 6, 'Lança, em torrentes, a tua ira, e humilha os arrogantes com um só olhar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 7, 'Com um só olhar humilha os soberbos, aniquila os ímpios no seu lugar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 8, 'Sepulta-os todos juntos no pó, mergulha em trevas a sua face.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 9, 'Então eu próprio confessarei que a tua dextra poderá salvar-te.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 10, 'Considera o Beemot, criado por mim, como tu, ele come feno como o boi.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 11, 'A sua fortaleza está nos seus lombos, e o seu vigor nos músculos dos seus flancos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 12, 'Levanta a sua cauda como cedro, os nervos dos seus músculos estão entrelaçados uns nos outros.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 13, 'Os seus ossos são como canas de bronze, a sua estrutura é de barras de ferro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 14, 'É obra-prima de Deus; aquele que o fez, dotou-o de uma espada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 15, 'Os montes produzem-lhe ervas; e todos os animais do campo vêm retouçar ali (junto dele).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 16, 'Dorme à sombra dos lotos, no retiro dos canaviais dos pântanos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 17, 'Os lotos o cobrem com a sua sombra, os salgueiros da torrente o circundam,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 18, 'Se o rio crescer, ele não se espanta; ainda que um Jordão lhe chegue à garganta, fica tranquilo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 19, 'Quem poderá apanhá-lo de frente, e atravessar-lhe as narinas com laços?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 20, 'Porventura poderás tirar com anzol o Leviatan, e ligar a sua língua com uma corda?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 21, 'Porventura porás uma argola nos teus narizes, ou furarás a sua queixada com um anel?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 22, 'Porventura multiplicará os rogos diante de ti, ou te dirá palavras ternas?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 23, 'Porventura fará ele concerto contigo, e recebê-lo-ás tu por escravo para sempre?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 24, 'Porventura brincarás com ele como com um pássaro ou o atarás para divertir teus filhos?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 25, 'Colhê-lo-ão os pescadores em suas redes, dividi-lo-ão os negociantes?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 26, 'Crivarás de dardos a sua pele, espetarás o arpão na sua cabeça?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 27, 'Põe a tua mão sobre ele: ficarás escarmentado, não tornarás a fazê-lo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 40), 28, 'Eis que (quem quiser capturar tal monstro) se enganará nas suas esperanças; a vista (do monstro) bastará para o aterrar.');

-- Capítulo 41
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 41, 25);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 1, 'Ninguém se atreve a provocá-lo, nem sequer pode estar firme, diante dele.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 2, 'Quem me deu a mim alguma coisa antes, para que eu tenha de retribuir-lhe? Tudo o que há debaixo do céu, é meu.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 3, 'Não calarei (a glória de) seus membros, direi o seu vigor incomparável.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 4, 'Quem, jamais, ergueu os bordos de sua couraça, ou explorou a dupla fila dos seus dentes?'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 5, 'Quem abriu as portas da sua boca? Em volta dos seus dentes está o terror.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 6, 'O seu dorso é uma armação de escudos, apinhoado de escamas que se apertam.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 7, 'Uma está unida à outra, de sorte que nem o vento passa por entre elas:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 8, 'uma adere à outra, tão perfeitamente, que, de maneira nenhuma, se separarão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 9, 'O seu espirrar é flamejante os seus olhos como pálpebras da aurora.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 10, 'Da sua boca saem chamas, saltam centelhas de fogo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 11, 'Das suas narinas sai fumo, como duma panela que ferve entre chamas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 12, 'O seu hálito faz incendiar os carvões, da sua boca sai uma chama.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 13, 'No seu pescoço está a força, e diante dele salta o terror.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 14, 'Os membros do seu corpo estão bem unidos entre si; cairão raios sobre ele, e não o farão mover para outro lugar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 15, 'O seu coração é duro como pedra, sólido como a mó inferior dum moinho.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 16, 'Quando se levanta (sobre as águas) temem os mais fortes, o terror os faz desfalecer.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 17, 'Se alguém o assalta, a espada (que o toca) não resiste, nem a lança, nem o dardo, nem a flecha,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 18, 'pois o ferro é para ele como palha, e o bronze como um pau podre.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 19, 'Não o fará fugir o frecheiro, as pedras da funda se tornarão para ele em palhas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 20, 'Reputará o martelo como palheira, e rir-se-á do brandir da lança,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 21, 'O seu ventre é guarnecido como que de bocados ponteagudos de telha, é como uma grade que passa sobre o lodo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 22, 'Fará ferver o abismo como uma panela, e o torna como um vaso de perfumes em ebulição.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 23, 'Deixa atrás de si uma esteira branca, faz parecer que o abismo (das águas que ele atravessa) tem cabelos brancos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 24, 'Não há poder sobre a terra que se compare, pois foi feito para não ter medo de nada.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 41), 25, 'Olha sobranceiramente tudo o que é elevado, ele é o rei dos mais altivos animais.');

-- Capítulo 42
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 42, 16);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 1, 'Respondendo Job ao Senhor, disse:'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 2, 'Sei que podes tudo, e que nenhum projeto é, para ti, demasiado difícil.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 3, 'Quem é este que, falto de ciência, encobre o conselho (de Deus)? (Confesso que) falei nèsciamente, sobre coisas que me ultrapassam e que eu ignoro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 4, '"Ouve, e eu falarei, interrogar-te-ei, e responder-me-às."'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 5, 'Os meus ouvidos haviam escutado falar de ti, mas agora os meus próprios olhos te vêem. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 6, 'Por isso acuso-me a mim mesmo, e faço penitência no pó e na cinza.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 7, 'O Senhor, depois que falou naquela sorte de Job, disse a Elifaz de Teman: O meu furor se acendeu contra ti e contra os teus dois amigos, porque vós não falastes de mim, retamente, como falou o meu servo Job.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 8, 'Tomai, pois, sete touros e sete carneiros, e ide ao meu servo Job. Oferecei um holocausto por vós; o meu servo Job orará por vós. Admitirei propicio a sua intercessão para que se vos não impute esta estulticia, porque vós não falastes de mim o que era recto, como o meu servo Job.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 9, 'Foram pois, Elifaz de Teman, Baldad de Subé, e Sofar de Naama, e fizeram como o Senhor lhes tinha dito, e o Senhor atendeu a Job.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 10, 'O Senhor também se deixou mover à vista da penitência de Job, quando orava pelos seus amigos, e deu-lhe o duplo de tudo o que ele antes possuía,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 11, 'Foram ter com ele todos os seus irmãos, todas as suas irmãs e todos os que antes o tinham conhecido, comeram com ele em sua casa. Moveram sobre ele a cabeça (em sinal de terna compaixão) e consolaram-no de todas as tribulações que o Senhor lhe tinha enviado. Cada um deles deu-lhe uma peça de prata e um anel de ouro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 12, 'E o Senhor abençoou Job no seu último estado muito mais do que no primeiro. Job chegou a ter catorze mil ovelhas, seis mil camelos, mil juntas de bois e mil jumentas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 13, 'Teve também sete filhos e três filhas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 14, 'À primeira pôs o nome de Jemima, à segunda o de Ketsia, e à terceira Kereu-Happouk.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 15, 'Não houve em toda a terra mulheres tão formosas como as filhas de Job, e seu pai deu-lhes herança entre seus irmãos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 42), 16, 'Depois disto viveu Job cento e quarenta anos, e viu seus filhos e os filhos de seus filhos até à quarta geração. Depois morreu, velho e saciado de dias.');

