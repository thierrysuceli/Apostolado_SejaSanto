-- undefined (undefined)

-- Capítulo 1
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 1, 20);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 1, 'Paulo, Apóstolo de Jesus Cristo, por mandado de Deus, nosso Salvador, e de Jesus Cristo, nossa esperança,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 2, 'a Timóteo, amado filho na fé: graça, misericórdia e paz, da parte de Deus Pai e de Jesus Cristo Nosso Senhor,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 3, 'Recomendei-te que ficasses em Éfeso, quando parti para a Macedónia, para que admoestasses alguns, que não ensinassem doutrina diversa (da que tem sido ensinada por nós),'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 4, 'nem se ocupassem em fábulas e genealogias intermináveis, as quais servem mais para questões do que para favorecer o plano de Deus, que se funda na fé.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 5, 'O fim deste preceito é a caridade nascida de um coração puro, de uma boa consciência e de uma fé não fingida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 6, 'Apartando-se alguns destas coisas, entregaram-se a discursos vãos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 7, 'querendo ser doutores da lei, não sabendo nem o que dizem nem o que afirmam.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 8, 'Nós sabemos (também como eles) que a lei é boa, contanto que se use dela legitimamente,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 9, 'não ignorando que a lei não foi feita para o justo, mas para os injustos e desobedientes, para os ímpios e pecadores, para os sacrílegos e profanadores, para os parricidas e matricidas, para os homicidas,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 10, 'para os fornicadores, sodomitas, traficantes de homens, para os mentirosos e perjuros, e para tudo o que vai contra a sã doutrina. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 11, 'Assim ensina o Evangelho da glória de Deus bem-aventurado, o qual me foi confiado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 12, 'Dou graças aquele que me confortou, a Jesus Cristo Nosso Senhor, porque me julgou fiel, pondo-me no ministério,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 13, 'a mim que fui antes blasfemo, perseguidor e injuriador; alcancei, porém, a misericórdia de Deus, porque o fiz por ignorância, sendo ainda incrédulo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 14, 'A graça de Nosso Senhor superabundou com a fé e com a caridade, que há em Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 15, 'Palavra segura e digna de toda aceitação é esta: Jesus Cristo veio a este mundo salvar os pecadores, dos quais sou o primeiro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 16, 'Mas alcancei misericórdia, para que em mim, sendo o primeiro, mostrasse Jesus Cristo toda a sua longanimidade, para exemplo dos que hão-de crer nele para (alcançar) a vida eterna.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 17, 'Ao rei dos séculos imortal, invisível, ao Deus único, honra e glória pelos séculos dos séculos. Amém.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 18, 'Tal é a recomendação que te faço, meu filho Timóteo, segundo as profecias feitas precedentemente a teu respeito, a fim de que, segundo elas, combatas o bom combate,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 19, 'conservando a fé e a boa consciência. Por se terem afastado dela, alguns naufragaram na fé;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 1), 20, 'desse número são Himeneu e Alexandre, os quais entreguei a Satanás, para que aprendam a não blasfemar. (ver nota)');

-- Capítulo 2
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 2, 15);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 1, 'Recomendo-te, pois, antes de tudo, que se façam súplicas, orações, petições, acções de graças por todos os homens,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 2, 'pelos reis e por todos os que estão constituídos em autoridade, para que levemos uma vida sossegada e tranquila, em toda a piedade e dignidade. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 3, 'Em verdade, isto é bom e agradável diante de Deus nosso Salvador,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 4, 'o qual quer que todos os homens se salvem e cheguem ao conhecimento da verdade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 5, 'Com efeito, há um só Deus e um só mediador entre Deus e os homens, que é Jesus Cristo homem, (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 6, 'o qual se deu a si mesmo para redenção de todos: tal é o testemunho dado (por Deus) no tempo devido,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 7, 'para o qual fui constituído pregador e apóstolo (digo a verdade, não minto), doutor das gentes na fé e na verdade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 8, 'Quero, pois, que os homens orem em todo o lugar, levantando as mãos puras, sem ira e sem contenda.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 9, 'Do mesmo modo orem também as mulheres em traje honesto, ataviando-se com modéstia e sobriedade, e não com cabelos frisados, nem com ouro, pérolas ou vestidos custosos,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 10, 'mas sim com boas obras, como convém a mulheres que fazem profissão de piedade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 11, 'A mulher aprenda, em silêncio, com toda a sujeição.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 12, 'Não permito à mulher que ensine (em público), nem que tenha domínio sobre o homem (exercendo na Igreja uma autoridade sobre ele), mas esteja em silêncio,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 13, 'porque Adão foi formado primeiro, e depois Eva.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 14, 'E Adão não foi seduzido, mas a mulher (é que, sendo) seduzida, prevaricou.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 2), 15, 'Contudo, salvar-se-a pela (legitima) procriação dos filhos, se permanecer na fé, na caridade e na santidade, unidas à modéstia.');

-- Capítulo 3
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 3, 16);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 1, 'Esta palavra é certa: se alguém deseja o episcopado, deseja um nobre cargo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 2, 'É necessário pois que o bispo seja irrepreensível, casado uma só vez, sóbrio, prudente, de bom trato, hospitaleiro, capaz de ensinar,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 3, 'não dado ao vinho, nem desordeiro, mas moderado, não litigioso, desapegado do dinheiro,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 4, 'que saiba governar bem a sua casa, que mantenha seus filhos na submissão, com toda a honestidade'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 5, '— de facto, se algum não sabe governar a sua casa, como terá cuidado da Igreja de Deus? —'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 6, 'que não seja neófito, a fim de que, inchado de soberba, não venha a cair na (mesma) condenação do demónio (quando caiu do céu).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 7, 'Importa também que tenha boa reputação entre aqueles que estão fora (da Igreja), para que não caia no opróbrio e no laço do demónio.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 8, 'Igualmente os diáconos sejam modestos, não de duas línguas, nem dados a muito vinho, nem ávidos de sórdidos lucros'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 9, 'e conservem o mistério de fé com uma consciência pura.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 10, 'Que estes sejam também provados antes, e, se forem achados irrepreensíveis, sejam admitidos ao ministério do diaconado.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 11, 'Do mesmo modo as mulheres sejam honestas, não maldizentes, sóbrias, fiéis em tudo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 12, 'Os diáconos sejam casados uma só vez e governem bem os seus filhos e as suas casas,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 13, 'porque, os que tiverem exercido bem o seu ministério, ganharão um alto grau de honra e muita confiança na fé que há em Jesus Cristo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 14, 'Escrevo-te estas coisas, esperando que em breve irei ter contigo;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 15, 'porém, se tardar, para que saibas como deves portar-te na casa de Deus, que é a Igreja do Deus vivo, coluna e firmamento da verdade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 3), 16, 'E evidentemente é grande o mistério da piedade: Foi manifestado na carne, justificado no Espírito, visto pelos anjos, pregado aos gentios, crido no mundo, exaltado na glória. (ver nota)');

-- Capítulo 4
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 4, 16);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 1, 'Ora o Espírito diz formalmente que nos últimos tempos alguns apostatarão na fé, dando ouvido a espíritos enganadores e a doutrinas de demónios,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 2, 'seduzidos por mentirosos hipócritas, cuja consciência está marcada com ferro em brasa,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 3, 'que proíbem o matrimônio e o uso de alimentos, que Deus criou, para que, com ação de graças, participem deles os fiéis e aqueles que conhecem a verdade. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 4, 'Efetivamente, tudo o que Deus criou é bom, e não é para desprezar nada do que se toma com ação de graças,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 5, 'porquanto é santificado pela palavra de Deus e pela oração.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 6, 'Propondo estes ensinamentos aos irmãos, serás um bom ministro de Jesus Cristo, nutrido com as palavras da fé e da boa doutrina a que firmemente te ligaste.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 7, 'Rejeita as fábulas profanas, esses contos de velhas, e exercita-te na piedade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 8, 'O exercício corporal para pouco serve, mas a piedade para tudo é útil, porque tem a promessa da vida presente e da futura. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 9, 'Palavra segura é esta, e digna de toda a aceitação.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 10, 'Se padecemos trabalhos e combatemos, é porque esperamos no Deus vivo, que é o Salvador de todos os homens, principalmente dos fiéis.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 11, 'Manda estas coisas e ensina-as.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 12, 'Ninguém despreze a tua mocidade; sê, porém, modelo dos fiéis na palavra, no modo de tratar com o próximo, na caridade, na fé, na castidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 13, 'Enquanto eu não vou, aplica-te à leitura, à exortação e ao ensino.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 14, 'Não desprezes o dom espiritual que há em ti, o qual te foi dado (apesar dos teus poucos anos) em virtude de uma profecia (particular), pela imposição das mãos da assembleia dos presbíteros. (ver nota)'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 15, 'Medita estas coisas, ocupa-te nelas, a fim de que o teu aproveitamento seja manifesto a todos.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 4), 16, 'Vela por ti e pelo teu ensino; persevera nestas coisas, porque, fazendo isto te salvarás a ti mesmo e aqueles que te ouvem.');

-- Capítulo 5
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 5, 25);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 1, 'Não repreendas com aspereza o velho, mas exorta-o como a um pai; (adverte) os jovens, como a irmãos;'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 2, 'as velhas, como a mães; as jovens, como a irmãs, com toda a castidade.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 3, 'Honra as viúvas, que são verdadeiramente viúvas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 4, 'Se uma viúva tem filhos ou netos, aprendam estes, antes de tudo, a exercer a piedade para com sua própria família e a retribuir a seus pais os cuidados que deles receberam porque isto é agradável a Deus.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 5, 'Aquela que é verdadeiramente viúva e desamparada, confie em Deus e persevere em suplicar e orar, de noite e de dia,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 6, 'porque, a que vive em deleites, vivendo, está morta (diante de Deus).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 7, 'Manda, pois, isto, para que sejam irrepreensíveis.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 8, 'Se, porventura, alguém não tem cuidado dos seus, e principalmente dos da sua casa, negou a fé e é pior que um infiel.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 9, 'Somente seja inscrita no grupo das viúvas (para o serviço da Igreja) uma mulher com sessenta anos, casada uma só vez,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 10, 'que tenha reputação de boas obras, que tenha educado bem os filhos, praticado a hospitalidade, lavado os pés dos santos, acudido aos atribulados, realizado toda a obra boa.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 11, 'Não admitas viúvas jovens, porque, quando os seus desejos as afastam de Cristo (seu esposo), querem voltar a casar-se.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 12, 'e tornam-se culpadas faltando ao seu primeiro compromisso.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 13, 'Além disto, vivendo na ociosidade, acostumam-se a andar de casa em casa; não somente são ociosas, mas também chocarreiras e curiosas, falando sobre o que não convém.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 14, '(Antes) quero pois que as jovens viúvas (que não têm virtude para viver na continência) se casem, criem filhos, sejam (boas) mães de família, não dêem ocasião ao adversário de dizer mal.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 15, 'Realmente já algumas se perverteram para seguir Satanás.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 16, 'Se algum fiel tem viúvas (na sua família), socorra-as, e não seja sobrecarregada a Igreja, a fim de que tenha o bastante para as que são verdadeiramente viúvas (necessitadas).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 17, 'Os presbíteros que exercem bem a presidência, sejam considerados dignos de estipêndio dobrado, principalmente os que trabalham em pregar e ensinar.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 18, 'Com efeito diz a Escritura: Não ligarás a boca ao boi que debulha (Dt. 25, 4); e ainda: o operário é digno da sua paga (Lc. 10, 7).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 19, 'Não recebas acusação contra um presbítero, senão com duas ou três testemunhas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 20, 'Aos que pecarem, repreende-os diante de todos, para que também os outros tenham medo.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 21, 'Eu te conjuro diante de Deus, de Jesus Cristo e dos anjos escolhidos, que guardes estas coisas sem prevenção, não fazendo nada por inclinação particular.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 22, 'Não te apresses a impor as mãos a ninguém, e não te faças participante dos pecados dos outros. Conserva-te a ti mesmo puro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 23, 'Não continues a beber água só, mas usa de um pouco de vinho, por causa do teu estômago e das tuas frequentes enfermidades.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 24, 'Os pecados de alguns homens são manifestos, mesmo antes de se examinarem em juízo, mas os de outros manifestam-se somente depois.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 5), 25, 'Igualmente as boas obras são manifestas; e as que o não são ainda, não podem permanecer ocultas.');

-- Capítulo 6
INSERT INTO bible_chapters (book_id, chapter_number, total_verses)
VALUES ((SELECT id FROM bible_books WHERE abbrev = 'undefined'), 6, 21);

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 1, 'Todos os escravos, que estão sob o jugo, considerem os seus senhores dignos de toda a honra, para que o nome do Senhor e a sua doutrina não sejam blasfemados.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 2, 'Os que têm senhores fiéis, não os desprezem, porque são irmãos, antes os sirvam melhor, pelo facto de serem fiéis e amados (de Deus) aqueles que recebem os seus serviços. Isto ensina e exorta.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 3, 'Se alguém ensina de modo diferente, e não abraça as sãs palavras de Nosso Senhor Jesus Cristo e aquela doutrina que é conforme a piedade,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 4, 'é um soberbo, que nada sabe, um espírito doente, que se ocupa de questões e contendas de palavras, donde se originam invejas, contendas, maledicências, más suspeitas,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 5, 'altercações de homens com o espírito pervertido, que estão privados da verdade e pensam que a piedade é uma fonte de lucro.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 6, 'Verdadeiramente a piedade é uma grande fonte de lucro, tornando-nos contentes com o que basta (para viver).'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 7, 'Como nada trouxemos para este mundo, também, sem dúvida, não podemos levar nada dele.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 8, 'Tendo, pois, os alimentos (necessários) e com que nos cobrir, contentemo-nos com isto,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 9, 'porque os que querem enriquecer, caem na tentação e no laço (do demônio) e em muitos desejos insensatos e perniciosos, que submergem os homens na ruína e na perdição.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 10, 'Com efeito, a raiz de todos os males é o amor ao dinheiro, por causa do qual alguns se desencaminharam da fé e se enredaram em muitas aflições.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 11, 'Mas tu, ó homem de Deus, foge destas coisas e segue a justiça, a piedade, a fé, a caridade, a paciência, a mansidão.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 12, 'Combate o bom combate da fé, conquista a vida eterna, para a qual foste chamado e fizeste uma bela confissão (da divindade de Jesus) diante de muitas testemunhas.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 13, 'Eu te ordeno, diante de Deus, que dá vida a todas as coisas, e diante de Jesus Cristo, que perante Pôncio Pilatos fez uma tão bela confissão (da sua divindade),'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 14, 'que observes este mandamento, (conservando-te) sem mácula, irrepreensível, até à vinda de Nosso Senhor Jesus Cristo,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 15, 'que mostrará, a seu tempo, o bem-aventurado e o único poderoso, o Rei dos reis e Senhor dos senhores,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 16, 'o único que possui a imortalidade, que habita numa luz inacessível, que não foi nem pode ser visto por nenhum homem. A ele, honra e império sempiterno ! Amém.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 17, 'Manda aos ricos deste mundo que não sejam altivos, nem confiem na incerteza das riquezas, mas em Deus, o qual nos dá abundantemente todas as coisas para nosso uso.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 18, 'que façam bem, que se tornem ricos em boas obras, que sejam generosos, que repartam,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 19, 'que juntem (assim) para si um sólido tesouro para o futuro, a fim de alcançarem a verdadeira vida.'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 20, 'Ó Timóteo, guarda o depósito (da fé), evitando as disputas vãs e ímpias e as contradições de uma ciência de falso nome,'),
((SELECT id FROM bible_chapters WHERE book_id = (SELECT id FROM bible_books WHERE abbrev = 'undefined') AND chapter_number = 6), 21, 'professando a qual alguns se desviaram da fé. A graça seja convosco!');

