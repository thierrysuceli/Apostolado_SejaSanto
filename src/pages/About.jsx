import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5 dark:from-amber-500/5"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Logo do Apostolado */}
          <div className="inline-flex items-center justify-center w-32 h-32 mb-8">
            <img 
              src="/Apostolado_PNG.png" 
              alt="Logo Apostolado Seja Santo" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Apostolado<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
              Seja Santo
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto italic">
            "Não haverá mais belo Apostolado nem mais valiosa obra de zelo que levar aos homens os argumentos e as razões da Fé Católica"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            — Cardeal Sebastião Leme
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Bem-vindo */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-amber-500">✝</span>
              Bem-vindo ao Apostolado Seja Santo
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Uma <strong className="text-amber-600 dark:text-amber-500">Associação Privada de Fiéis Católicos</strong> dedicada a guiar almas no profundo caminho da santidade e da evangelização autêntica. Fundado em <strong>04 de outubro de 2020</strong> por iniciativa do leigo <strong className="text-gray-900 dark:text-white">Marcello Medeiros Dias</strong>, nosso apostolado nasceu do ardente desejo de responder ao chamado de levar Jesus Cristo a todos os corações.
              </p>
            </div>
          </div>

          {/* Nosso Carisma */}
          <div className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-amber-200 dark:border-amber-900/50">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-amber-500">🕊️</span>
              Nosso Carisma
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Nosso carisma central é <strong className="text-amber-600 dark:text-amber-500">fomentar a experiência pessoal do encontro com Jesus Cristo na eficácia do Espírito Santo</strong>, preparando e apressando a vinda gloriosa do Senhor. Acreditamos firmemente que <em>"não haverá mais belo apostolado... do que levar aos homens os argumentos e as razões da Fé Católica"</em> (Cardeal Sebastião Leme), e que a santidade pessoal — <strong>"Ser um santo para ser um verdadeiro adorador"</strong> — é o cerne de nossa missão.
              </p>
            </div>
          </div>

          {/* Tradição Carmelita */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-amber-500">🌹</span>
              Inspiração Carmelita
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Inspirados pela rica <strong className="text-amber-600 dark:text-amber-500">Tradição Carmelita</strong> e pelos ensinamentos de mestres como <strong>Santa Teresa de Jesus</strong>, <strong>São João da Cruz</strong> e <strong>Santa Teresinha do Menino Jesus</strong>, cultivamos uma profunda vida interior pautada na oração mental, na contemplação, na centralidade da Eucaristia e na especialíssima devoção mariana.
              </p>
              <p>
                Abraçamos o <strong className="text-amber-600 dark:text-amber-500">"Apostolado da Cruz"</strong> como caminho de purificação e despojamento total, buscando unir nossos sofrimentos à Paixão de Cristo.
              </p>
            </div>
          </div>

          {/* Nossa Missão */}
          <div className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-amber-200 dark:border-amber-900/50">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-amber-500">📖</span>
              Nossa Missão
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Nossa missão vai além: buscamos <strong className="text-amber-600 dark:text-amber-500">evangelizar o ser humano, a sociedade e a família</strong>, combatendo as chagas que afetam sua integridade e oferecendo um acolhimento caloroso àqueles que buscam uma renovação da fé em meio aos desafios da vida moderna.
              </p>
              <p>
                Com uma sólida formação <strong>humana-espiritual na sã doutrina católica, filosofia clássica e psicologia tomista</strong>, queremos conduzir as almas à perfeição e à vida eterna.
              </p>
            </div>
          </div>

          {/* Educação Integral */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-amber-500">🎓</span>
              Educação Integral
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                O Apostolado Seja Santo é um <strong className="text-amber-600 dark:text-amber-500">espaço de educação integral</strong>, onde a fé, a cultura e a amizade católica se entrelaçam. Estamos em comunhão com a <strong>Paróquia São Francisco de Assis</strong>, em Itapoã (Vila Velha/ES), somos uma família espiritual que busca a santidade no cotidiano e a fidelidade inegociável a Cristo, à Igreja e ao Papa.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 shadow-2xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Convidamos você a conhecer mais sobre nossa jornada
            </h2>
            <p className="text-amber-50 text-lg mb-6">
              e a caminhar conosco rumo à santidade!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/courses"
                className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-50 transition-all shadow-lg"
              >
                <span>Ver Cursos</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/central"
                className="inline-flex items-center justify-center gap-2 bg-amber-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-800 transition-all shadow-lg"
              >
                <span>Entrar na Central</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              <strong className="text-gray-900 dark:text-white">Fundação:</strong> 04 de outubro de 2020
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              <strong className="text-gray-900 dark:text-white">Fundador:</strong> Marcello Medeiros Dias
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white">Paróquia:</strong> São Francisco de Assis - Itapoã, Vila Velha/ES
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
