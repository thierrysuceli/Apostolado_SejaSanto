import { useEffect } from 'react';

const PoliticaDePrivacidade = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Política de Privacidade
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
                1. INTRODUÇÃO
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Esta Política de Privacidade descreve como o Apostolado Seja Santo, uma iniciativa conduzida por Marcello Medeiros Dias, Coordenador Geral da Associação de Fiéis Leigos Católicos "Apostolado Seja Santo", com e-mail de contato sancti.missaocatolica@gmail.com, coleta, usa, armazena e protege os dados pessoais dos usuários ("Usuários") que acessam e utilizam nosso site.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                A proteção da sua privacidade e dos seus dados pessoais é de extrema importância para nós. Nosso compromisso é tratar seus dados de forma transparente, segura e em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Ao acessar e utilizar o Apostolado Seja Santo, você concorda com os termos desta Política de Privacidade. Caso não concorde, por favor, não utilize nosso site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. CONTROLADOR DOS DADOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Para os fins desta Política de Privacidade, o Controlador dos Dados Pessoais é Marcello Medeiros Dias, coordenador geral e responsável pelo Apostolado Seja Santo. Você pode entrar em contato conosco através do e-mail sancti.missaocatolica@gmail.com para quaisquer questões relacionadas à privacidade e proteção de dados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. DADOS PESSOAIS COLETADOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Coletamos diferentes tipos de dados pessoais, dependendo da sua interação com nosso site:
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                a) Dados Fornecidos Voluntariamente por Você:
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li><strong>Dados de Contato:</strong> Nome e endereço de e-mail, quando você se cadastra para receber nossa newsletter, participa de um curso que exige cadastro, ou entra em contato conosco.</li>
                <li><strong>Dados de Cadastro:</strong> Se você criar uma conta para acessar conteúdos exclusivos, como cursos, podemos coletar nome de usuário, senha e outras informações que você optar por fornecer.</li>
                <li><strong>Dados de Interação:</strong> Informações que você compartilha em comentários, fóruns de discussão ou outras áreas interativas do site.</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                b) Dados Coletados Automaticamente:
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, sistema operacional, páginas visitadas, tempo de permanência no site, data e hora do acesso, e outras estatísticas de uso. Esses dados são coletados através de cookies e tecnologias semelhantes.</li>
                <li><strong>Dados de Dispositivo:</strong> Informações sobre o dispositivo que você usa para acessar nosso site, como modelo, sistema operacional e identificadores únicos.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. FINALIDADE DA COLETA E USO DOS DADOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Utilizamos seus dados pessoais para as seguintes finalidades:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Para Fornecer Nossos Serviços:</strong> Oferecer acesso aos artigos, cursos e demais conteúdos gratuitos do Apostolado Seja Santo.</li>
                <li><strong>Comunicação:</strong> Enviar newsletters, atualizações sobre novos conteúdos, eventos e informações relevantes sobre a fé católica.</li>
                <li><strong>Melhoria do Site:</strong> Analisar o desempenho do site, entender como os Usuários interagem com o conteúdo e identificar áreas para melhoria.</li>
                <li><strong>Segurança:</strong> Detectar e prevenir atividades fraudulentas, spam e outras atividades maliciosas.</li>
                <li><strong>Cumprimento de Obrigações Legais:</strong> Cumprir com quaisquer obrigações legais ou regulatórias aplicáveis.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. BASE LEGAL PARA O TRATAMENTO DE DADOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                O tratamento dos seus dados pessoais é realizado com base nas seguintes hipóteses legais da LGPD:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Consentimento:</strong> Quando você nos fornece seu e-mail para receber a newsletter ou se cadastra para um curso.</li>
                <li><strong>Legítimo Interesse:</strong> Para aprimorar nossos serviços, garantir a segurança do site e realizar análises estatísticas de uso.</li>
                <li><strong>Execução de Contrato:</strong> Se houver um serviço específico que exija o tratamento de dados para sua entrega.</li>
                <li><strong>Cumprimento de Obrigação Legal:</strong> Quando somos legalmente obrigados a coletar ou compartilhar determinados dados.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. COMPARTILHAMENTO DE DADOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                O Apostolado Seja Santo não vende, aluga ou comercializa seus dados pessoais com terceiros. No entanto, podemos compartilhar seus dados com:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Provedores de Serviços:</strong> Empresas que nos auxiliam na operação do site, como serviços de hospedagem, plataformas de e-mail marketing e ferramentas de análise de tráfego.</li>
                <li><strong>Autoridades Legais:</strong> Caso seja exigido por lei ou por ordem judicial.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. ARMAZENAMENTO E RETENÇÃO DOS DADOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Seus dados pessoais são armazenados em servidores seguros, podendo estar localizados no Brasil ou no exterior. Em caso de transferência internacional, garantimos proteção compatível com a LGPD. Retemos seus dados apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados ou para cumprir obrigações legais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. DIREITOS DO TITULAR DOS DADOS (LGPD)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Em conformidade com a LGPD, você possui os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Confirmação:</strong> Direito de confirmar se tratamos dados pessoais seus.</li>
                <li><strong>Acesso:</strong> Direito de acessar os dados pessoais que mantemos sobre você.</li>
                <li><strong>Retificação:</strong> Direito de solicitar a correção de dados incompletos, inexatos ou desatualizados.</li>
                <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Direito de solicitar a eliminação de dados desnecessários ou tratados em desconformidade com a LGPD.</li>
                <li><strong>Portabilidade:</strong> Direito de receber seus dados pessoais em um formato estruturado.</li>
                <li><strong>Revogação do Consentimento:</strong> Direito de revogar o consentimento a qualquer momento.</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Para exercer qualquer um desses direitos, entre em contato através do e-mail: sancti.missaocatolica@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. SEGURANÇA DOS DADOS
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição indevida. Apesar dos nossos esforços, a segurança da internet não pode ser garantida 100%.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. USO DE COOKIES E TECNOLOGIAS SEMELHANTES
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Nosso site utiliza cookies e outras tecnologias de rastreamento para melhorar sua experiência de navegação:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Cookies Essenciais:</strong> São necessários para o funcionamento básico do site e não podem ser desativados.</li>
                <li><strong>Cookies de Desempenho:</strong> Coletam informações anônimas sobre como os visitantes usam o site.</li>
                <li><strong>Cookies de Funcionalidade:</strong> Lembram suas preferências para oferecer uma experiência mais personalizada.</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-3">
                Você pode gerenciar suas preferências de cookies através das configurações do seu navegador ou através da ferramenta de consentimento de cookies apresentada em nosso site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                11. LINKS PARA SITES DE TERCEIROS
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Nosso site pode conter links para sites de terceiros. Esta Política de Privacidade se aplica apenas ao Apostolado Seja Santo. Não nos responsabilizamos pelas práticas de privacidade ou conteúdo de sites de terceiros. Recomendamos que você leia as políticas de privacidade de qualquer site que visitar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                12. ALTERAÇÕES NESTA POLÍTICA DE PRIVACIDADE
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação aplicável. Quando ocorrerem alterações significativas, você será notificado. Recomendamos que você revise esta política regularmente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                13. CONTATO
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Para quaisquer dúvidas sobre esta Política de Privacidade, para exercer seus direitos como titular de dados ou para fazer uma reclamação, por favor, entre em contato conosco pelo e-mail: sancti.missaocatolica@gmail.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                14. LEI APLICÁVEL E FORO
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Esta Política de Privacidade será regida e interpretada de acordo com as leis da República Federativa do Brasil. As partes elegem o foro da Comarca de Vila Velha/ES para dirimir quaisquer questões ou litígios decorrentes desta Política de Privacidade.
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

export default PoliticaDePrivacidade;
