import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Liturgia = () => {
  const { isDark } = useTheme();
  const [liturgia, setLiturgia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchLiturgia();
  }, []);

  const fetchLiturgia = async (date = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = 'https://liturgia.up.railway.app/v2/';
      
      if (date) {
        const [year, month, day] = date.split('-');
        url += `?dia=${day}&mes=${month}&ano=${year}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Liturgia não encontrada para esta data');
      }
      
      const data = await response.json();
      setLiturgia(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date) {
      fetchLiturgia(date);
    } else {
      fetchLiturgia();
    }
  };

  const getCorColor = (cor) => {
    const cores = {
      'Verde': 'bg-green-600',
      'Vermelho': 'bg-red-600',
      'Roxo': 'bg-purple-600',
      'Rosa': 'bg-pink-500',
      'Branco': 'bg-white border-2 border-gray-300'
    };
    return cores[cor] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-800 dark:text-red-300 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!liturgia) return null;

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-8 md:py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-700 dark:text-gray-200">
              Liturgia Diária
            </h1>
            
            {/* Date Picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-4 py-2 rounded-lg border border-beige-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          {/* Data e Cor Litúrgica */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-beige-200 dark:border-gray-800 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-gray-400 mb-1">Data</p>
                <p className="text-xl font-bold text-secondary-700 dark:text-gray-200">{liturgia.data}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-gray-400 mb-1 text-right">Cor Litúrgica</p>
                  <p className="text-lg font-semibold text-secondary-700 dark:text-gray-200 text-right">{liturgia.cor}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${getCorColor(liturgia.cor)} shadow-lg`}></div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-beige-200 dark:border-gray-700">
              <p className="text-base font-bold text-primary-700 dark:text-primary-400">{liturgia.liturgia}</p>
            </div>
          </div>
        </div>

        {/* Orações */}
        {liturgia.oracoes && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              Orações
            </h2>
            
            {liturgia.oracoes.coleta && (
              <div className="bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-primary-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400 mb-3">Oração da Coleta</h3>
                <p className="text-secondary-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{liturgia.oracoes.coleta}</p>
              </div>
            )}
            
            {liturgia.oracoes.oferendas && (
              <div className="bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-primary-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400 mb-3">Oração sobre as Oferendas</h3>
                <p className="text-secondary-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{liturgia.oracoes.oferendas}</p>
              </div>
            )}
            
            {liturgia.oracoes.comunhao && (
              <div className="bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-primary-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400 mb-3">Oração após a Comunhão</h3>
                <p className="text-secondary-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{liturgia.oracoes.comunhao}</p>
              </div>
            )}
          </div>
        )}

        {/* Leituras */}
        {liturgia.leituras && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Leituras
            </h2>

            {/* Primeira Leitura */}
            {liturgia.leituras.primeiraLeitura && liturgia.leituras.primeiraLeitura.map((leitura, idx) => (
              <div key={`primeira-${idx}`} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-beige-200 dark:border-gray-800 p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold rounded-full mb-2">
                    Primeira Leitura
                  </span>
                  <p className="text-sm font-semibold text-secondary-600 dark:text-gray-400">{leitura.referencia}</p>
                  <h3 className="text-lg font-bold text-secondary-700 dark:text-gray-200 mt-1">{leitura.titulo}</h3>
                </div>
                <p className="text-secondary-700 dark:text-gray-300 leading-relaxed">{leitura.texto}</p>
              </div>
            ))}

            {/* Salmo */}
            {liturgia.leituras.salmo && liturgia.leituras.salmo.map((salmo, idx) => (
              <div key={`salmo-${idx}`} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800 p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold rounded-full mb-2">
                    Salmo Responsorial
                  </span>
                  <p className="text-sm font-semibold text-secondary-600 dark:text-gray-400">{salmo.referencia}</p>
                  <p className="text-base font-bold text-blue-700 dark:text-blue-400 italic mt-2">— {salmo.refrao}</p>
                </div>
                <p className="text-secondary-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{salmo.texto}</p>
              </div>
            ))}

            {/* Segunda Leitura */}
            {liturgia.leituras.segundaLeitura && liturgia.leituras.segundaLeitura.map((leitura, idx) => (
              leitura.referencia && (
                <div key={`segunda-${idx}`} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-beige-200 dark:border-gray-800 p-6">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-bold rounded-full mb-2">
                      Segunda Leitura
                    </span>
                    <p className="text-sm font-semibold text-secondary-600 dark:text-gray-400">{leitura.referencia}</p>
                    <h3 className="text-lg font-bold text-secondary-700 dark:text-gray-200 mt-1">{leitura.titulo}</h3>
                  </div>
                  <p className="text-secondary-700 dark:text-gray-300 leading-relaxed">{leitura.texto}</p>
                </div>
              )
            ))}

            {/* Evangelho */}
            {liturgia.leituras.evangelho && liturgia.leituras.evangelho.map((evangelho, idx) => (
              <div key={`evangelho-${idx}`} className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl shadow-xl border-2 border-amber-300 dark:border-amber-700 p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-amber-200 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-sm font-bold rounded-full mb-2">
                    ✠ Evangelho
                  </span>
                  <p className="text-sm font-semibold text-secondary-600 dark:text-gray-400">{evangelho.referencia}</p>
                  <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mt-1">{evangelho.titulo}</h3>
                </div>
                <p className="text-secondary-700 dark:text-gray-300 leading-relaxed font-serif">{evangelho.texto}</p>
              </div>
            ))}
          </div>
        )}

        {/* Antífonas */}
        {liturgia.antifonas && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200">Antífonas</h2>
            
            {liturgia.antifonas.entrada && (
              <div className="bg-beige-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-primary-600">
                <p className="text-sm font-bold text-primary-700 dark:text-primary-400 mb-1">Entrada</p>
                <p className="text-secondary-700 dark:text-gray-300">{liturgia.antifonas.entrada}</p>
              </div>
            )}
            
            {liturgia.antifonas.comunhao && (
              <div className="bg-beige-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-primary-600">
                <p className="text-sm font-bold text-primary-700 dark:text-primary-400 mb-1">Comunhão</p>
                <p className="text-secondary-700 dark:text-gray-300">{liturgia.antifonas.comunhao}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Liturgia;
