import { useEffect } from 'react';

const TermosDeUso = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Termo de Uso
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Apostolado Seja Santo
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-12">
            Data da Última Atualização: 21 de novembro de 2025
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. INTRODUÇÃO E ACEITAÇÃO DO TERMO DE USO
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Este Termo de Uso ("Termo") regulamenta o acesso e a utilização do site Apostolado Seja Santo, uma iniciativa conduzida por Marcello Medeiros Dias, coordenador geral da Associação de Fiéis Leigos Católicos que atua sob o nome "Apostolado Seja Santo", com e-mail de contato sancti.missaocatolica@gmail.com.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ao acessar, navegar ou utilizar qualquer conteúdo ou funcionalidade do Apostolado Seja Santo, o usuário ("Usuário") declara ter lido, compreendido e aceitado integralmente o presente Termo de Uso e a Política de Privacidade.
              </p>
              <p className="text-red-600 dark:text-red-400 font-semibold">
                CASO O USUÁRIO NÃO CONCORDA COM QUALQUER DISPOSIÇÃO DESTES TERMOS, NÃO DEVERÁ ACESSAR OU UTILIZAR OS SERVIÇOS DO SITE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. OBJETO DOS SERVIÇOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                O Apostolado Seja Santo tem como objetivo disponibilizar gratuitamente aos Usuários artigos, textos, vídeos, podcasts e outros materiais informativos de cunho católico, bem como cursos online, com o propósito de promover a evangelização, o aprofundamento na fé católica, a formação doutrinal e espiritual. Todos os conteúdos são desenvolvidos e ministrados pela equipe do Apostolado, sob a coordenação de Marcello Medeiros Dias.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. VALORES E PRINCÍPIOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                O Apostolado Seja Santo é um espaço dedicado à divulgação da fé e da doutrina católica, em plena comunhão com o Magistério da Igreja. Desta forma, todos os conteúdos e interações no site devem refletir os valores cristãos de respeito, caridade, verdade e fraternidade.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. ACESSO E CADASTRO
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>4.1.</strong> O acesso à maioria dos conteúdos do Apostolado Seja Santo é livre. No entanto, para acessar determinados cursos ou funcionalidades exclusivas (ex: participação em fóruns, recebimento de newsletters), o Usuário poderá ser solicitado a realizar um cadastro, fornecendo informações precisas, completas e verdadeiras.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>4.2.</strong> O Usuário é o único responsável pela veracidade e atualização dos dados fornecidos em seu cadastro.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>4.3.</strong> O Usuário será o único responsável pela guarda e sigilo de seu login e senha, e por todas as atividades realizadas através de sua conta. O Apostolado Seja Santo não se responsabiliza por acessos indevidos decorrentes de falha na guarda da senha pelo Usuário.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>4.4.</strong> O Usuário compromete-se a notificar imediatamente o Apostolado Seja Santo sobre qualquer uso não autorizado de sua conta ou qualquer outra violação de segurança.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. RESPONSABILIDADES DO USUÁRIO
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>5.1.</strong> O Usuário compromete-se a utilizar o site e seus conteúdos de forma lícita, respeitando a moral, os bons costumes, a doutrina católica e a ordem pública, bem como a legislação brasileira vigente. É vedado, por exemplo, o uso da plataforma para a publicação de conteúdo que promova discurso de ódio, intolerância religiosa, racismo, difamação, calúnia ou qualquer forma de discriminação, ou que seja contrário aos princípios éticos do Apostolado, alinhados à doutrina católica.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>5.2.</strong> É expressamente proibido ao Usuário:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>a)</strong> Publicar, transmitir, divulgar ou compartilhar qualquer conteúdo que viole a lei, direitos de terceiros, que seja ofensivo, difamatório, calunioso, obsceno, blasfemo, discriminatório (racial, religioso, sexual, etc.), que incite à violência, ao ódio ou que seja contrário à fé e à moral católica.</li>
                <li><strong>b)</strong> Reproduzir, distribuir, modificar, adaptar, exibir, comercializar, transferir ou de qualquer forma explorar os artigos, cursos, vídeos, imagens ou qualquer outro material do site sem a autorização prévia e expressa do Apostolado Seja Santo ou de seu coordenador geral.</li>
                <li><strong>c)</strong> Praticar atos de pirataria, download não autorizado, ou compartilhamento indevido dos materiais disponibilizados, incluindo, mas não se limitando aos cursos.</li>
                <li><strong>d)</strong> Realizar qualquer tipo de ataque cibernético, enviar vírus, malware, spam, ou qualquer outro código malicioso que possa danificar, desabilitar, sobrecarregar ou prejudicar o funcionamento do site ou dos servidores do Apostolado Seja Santo.</li>
                <li><strong>e)</strong> Utilizar o site para fins comerciais ou publicitários não autorizados.</li>
                <li><strong>f)</strong> Inserir informações falsas ou enganosas no site.</li>
                <li><strong>g)</strong> Realizar qualquer ação que possa prejudicar a imagem ou a reputação do Apostolado Seja Santo ou de seus responsáveis.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. PROPRIEDADE INTELECTUAL
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>6.1.</strong> Todo o conteúdo presente no Apostolado Seja Santo, incluindo, mas não se limitando a, textos, artigos, cursos, vídeos, imagens, ilustrações, logotipos, marcas, layout, design, software e demais elementos, são de propriedade exclusiva de Marcello Medeiros Dias ou de terceiros que licenciaram o uso, e são protegidos pelas leis brasileiras e internacionais de propriedade intelectual (direitos autorais, marcas, patentes, etc.).
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>6.2.</strong> A utilização do site e o acesso ao conteúdo não concedem ao Usuário qualquer direito de propriedade intelectual sobre o mesmo. O Usuário pode usar o conteúdo exclusivamente para fins pessoais e não comerciais, desde que mantenha intactos todos os avisos de direitos autorais e outras notificações de propriedade.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>6.3.</strong> Qualquer uso, reprodução, distribuição, transmissão, exibição, venda, licenciamento ou exploração não autorizada de qualquer conteúdo do site é estritamente proibida e poderá sujeitar o infrator às sanções legais cabíveis.
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-6">
                6.4. Conteúdo Produzido por Colaboradores (Redatores)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>6.4.1.</strong> O USUÁRIO que atuar como colaborador ou redator de conteúdo (doravante "Colaborador") reconhece e expressamente concorda que, ao submeter qualquer conteúdo para publicação no site "Apostolado Seja Santo", este Apostolado adquirirá os direitos patrimoniais sobre a obra.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>6.4.2.</strong> Não obstante a cessão dos direitos patrimoniais, o Colaborador, na qualidade de criador intelectual da obra, manterá integralmente seus direitos morais de autor, conforme previsto na Lei nº 9.610/98 (Lei de Direitos Autorais).
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>6.4.3.</strong> Em respeito aos direitos morais de autor, o "Apostolado Seja Santo" compromete-se a sempre indicar o nome do Colaborador como autor da obra publicada.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>6.4.4.</strong> O Colaborador declara ser o único e legítimo autor do conteúdo submetido, garantindo que a obra é original e que não infringe quaisquer direitos autorais, de propriedade intelectual ou de imagem de terceiros.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>6.4.5.</strong> O "Apostolado Seja Santo" poderá utilizar o nome, imagem e voz do Colaborador, quando aplicável e com a devida autorização, para fins de divulgação e promoção do conteúdo e da plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. CONDIÇÕES ESPECÍFICAS PARA OS CURSOS GRATUITOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>7.1.</strong> Os cursos online são disponibilizados gratuitamente pelo Apostolado Seja Santo com o intuito de formação e aprofundamento na fé católica.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>7.2.</strong> O acesso aos materiais dos cursos é pessoal e intransferível (se houver cadastro individual).
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>7.3.</strong> Caso sejam oferecidos certificados de conclusão, as condições para sua emissão serão detalhadas na página de cada curso. Os certificados atestam a participação e a conclusão do curso, não conferindo grau acadêmico ou profissional.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>7.4.</strong> Em ambientes de interação (fóruns, comentários dos cursos), espera-se um comportamento respeitoso e condizente com os valores cristãos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. POLÍTICA DE PRIVACIDADE
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>8.1.</strong> A coleta, o tratamento e o armazenamento dos dados pessoais dos Usuários são regidos pela nossa Política de Privacidade.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>8.2.</strong> Ao aceitar este Termo de Uso, o Usuário também concorda expressamente com os termos da nossa Política de Privacidade.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. ISENÇÃO DE RESPONSABILIDADE
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>9.1.</strong> O Apostolado Seja Santo envida seus melhores esforços para manter o site e seus conteúdos atualizados, precisos e livres de erros. Contudo, não garante que o site estará sempre disponível, ininterrupto, seguro ou livre de falhas.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>9.2.</strong> O conteúdo e os cursos são oferecidos para fins informativos e formativos, e não devem ser interpretados como aconselhamento profissional, teológico, espiritual individualizado, jurídico, médico ou financeiro.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>9.3.</strong> O Apostolado Seja Santo não se responsabiliza por quaisquer perdas, danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes da utilização ou impossibilidade de uso do site.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>9.4.</strong> O site pode conter links para sites de terceiros. O Apostolado Seja Santo não tem controle sobre o conteúdo ou as práticas de privacidade desses sites e não assume qualquer responsabilidade por eles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. MODIFICAÇÕES DOS TERMOS DE USO
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>10.1.</strong> O Apostolado Seja Santo reserva-se o direito de modificar, a qualquer tempo, este Termo de Uso, a seu exclusivo critério. Quando ocorrerem alterações significativas, o Usuário será notificado com antecedência razoável.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>10.2.</strong> Quaisquer alterações neste Termo de Uso entrarão em vigor após o período de notificação estabelecido. O uso continuado do site será considerado como aceitação tácita dos novos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                11. DISPOSIÇÕES GERAIS
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>11.1.</strong> Este Termo de Uso constitui o acordo integral entre o Usuário e o Apostolado Seja Santo com relação ao uso do site.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>11.2.</strong> A eventual invalidade ou inexequibilidade de qualquer disposição deste Termo de Uso não afetará a validade ou exequibilidade das demais disposições.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>11.3.</strong> A omissão ou tolerância do Apostolado Seja Santo em exigir o estrito cumprimento de qualquer termo ou condição deste Termo de Uso não constituirá renúncia.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                12. LEI APLICÁVEL E FORO
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>12.1.</strong> Este Termo de Uso será regido e interpretado de acordo com as leis da República Federativa do Brasil.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>12.2.</strong> As partes elegem o foro da Comarca de Vila Velha/ES para dirimir quaisquer questões ou litígios decorrentes deste Termo, renunciando a qualquer outro, por mais privilegiado que seja.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Para dúvidas ou mais informações, entre em contato através do e-mail:{' '}
              <a href="mailto:sancti.missaocatolica@gmail.com" className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400">
                sancti.missaocatolica@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermosDeUso;
