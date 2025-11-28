import { useState, useEffect } from 'react';
import { XMarkIcon, CogIcon } from '@heroicons/react/24/outline';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Sempre true, não pode ser desabilitado
    performance: false,
    functionality: false
  });

  useEffect(() => {
    // Verificar se o usuário já aceitou/rejeitou cookies
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Aguardar 1 segundo antes de mostrar o banner
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      timestamp: new Date().toISOString(),
      preferences: prefs
    }));
    setShowBanner(false);
    setShowDetails(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      performance: true,
      functionality: true
    };
    savePreferences(allAccepted);
  };

  const acceptEssentialOnly = () => {
    savePreferences({
      essential: true,
      performance: false,
      functionality: false
    });
  };

  const acceptCustom = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      {/* Overlay escurecido */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 pointer-events-auto ${
          showDetails ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowDetails(false)}
      />

      {/* Banner de Cookies */}
      <div className="relative w-full max-w-4xl mx-4 mb-4 pointer-events-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          {!showDetails ? (
            // Vista Simples
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Cookies e Privacidade
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Respeitamos sua privacidade conforme a LGPD
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Utilizamos cookies essenciais para o funcionamento do site e cookies opcionais para melhorar sua experiência, 
                analisar o desempenho e personalizar conteúdos. Você pode escolher quais categorias aceitar.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Aceitar Todos
                </button>
                <button
                  onClick={acceptEssentialOnly}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Apenas Essenciais
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-medium px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200"
                >
                  <CogIcon className="w-5 h-5" />
                  Personalizar
                </button>
              </div>

              <div className="mt-4 text-center">
                <a 
                  href="/politica-de-privacidade" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leia nossa Política de Privacidade
                </a>
              </div>
            </div>
          ) : (
            // Vista Detalhada
            <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Preferências de Cookies
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Selecione quais tipos de cookies você deseja permitir. Cookies essenciais são sempre necessários para o funcionamento básico do site.
              </p>

              <div className="space-y-4 mb-8">
                {/* Cookies Essenciais */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        Cookies Essenciais
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold rounded">
                          Sempre Ativos
                        </span>
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Necessários para o funcionamento básico do site, como autenticação, segurança e preferências de idioma. Não podem ser desativados.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="w-5 h-5 text-primary-600 rounded cursor-not-allowed opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Cookies de Desempenho */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        Cookies de Desempenho
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Coletam informações anônimas sobre como você usa o site para nos ajudar a melhorar o desempenho e a experiência do usuário.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.performance}
                        onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Cookies de Funcionalidade */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        Cookies de Funcionalidade
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Permitem que o site lembre suas preferências (como tema escuro/claro) e ofereçam recursos personalizados.
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.functionality}
                        onChange={(e) => setPreferences({ ...preferences, functionality: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={acceptCustom}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Salvar Preferências
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Aceitar Todos
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Para mais informações sobre como tratamos seus dados, consulte nossa{' '}
                  <a 
                    href="/politica-de-privacidade" 
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidade
                  </a>
                  {' '}e{' '}
                  <a 
                    href="/termos-de-uso" 
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Termos de Uso
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
