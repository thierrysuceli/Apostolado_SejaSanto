import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { bibliaLivros, BIBLIA_API_URL } from '../data/bibliaLivros';

const Biblia = () => {
  const { isDark } = useTheme();
  const [testamento, setTestamento] = useState('Novo Testamento');
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [capituloSelecionado, setCapituloSelecionado] = useState(null);
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const livros = bibliaLivros[testamento];

  const handleSelectLivro = (livro) => {
    setLivroSelecionado(livro);
    setCapituloSelecionado(null);
    setVersiculos([]);
  };

  const handleSelectCapitulo = async (capitulo) => {
    setCapituloSelecionado(capitulo);
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BIBLIA_API_URL}/verses/nvi/${livroSelecionado.abbrev}/${capitulo}`);
      
      if (!response.ok) throw new Error('Erro ao carregar versículos');
      
      const data = await response.json();
      setVersiculos(data.verses || []);
    } catch (err) {
      console.error('Erro ao buscar versículos:', err);
      setError('Não foi possível carregar os versículos. Tente novamente.');
      setVersiculos([]);
    } finally {
      setLoading(false);
    }
  };

  const livrosFiltrados = livros.filter(livro =>
    livro.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <svg className="w-10 h-10 text-amber-600 dark:text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 1H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-4 4H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z"/>
            </svg>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Bíblia Sagrada
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {livroSelecionado 
                  ? `${livroSelecionado.name}${capituloSelecionado ? ` - Capítulo ${capituloSelecionado}` : ''}`
                  : 'Selecione um livro para começar'
                }
              </p>
            </div>
          </div>

          {/* Tabs Testamento */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                setTestamento('Antigo Testamento');
                setLivroSelecionado(null);
                setCapituloSelecionado(null);
                setVersiculos([]);
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                testamento === 'Antigo Testamento'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Antigo Testamento
            </button>
            <button
              onClick={() => {
                setTestamento('Novo Testamento');
                setLivroSelecionado(null);
                setCapituloSelecionado(null);
                setVersiculos([]);
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                testamento === 'Novo Testamento'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Novo Testamento
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Lista de Livros */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-28">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Livros
              </h2>
              
              {/* Search */}
              <input
                type="text"
                placeholder="Buscar livro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />

              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {livrosFiltrados.map((livro) => (
                  <button
                    key={livro.abbrev}
                    onClick={() => handleSelectLivro(livro)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      livroSelecionado?.abbrev === livro.abbrev
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {livro.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {!livroSelecionado ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <svg className="w-24 h-24 mx-auto mb-6 text-amber-600 dark:text-amber-500 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 1H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-4 4H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z"/>
                </svg>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Bem-vindo à Bíblia Sagrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Selecione um livro na barra lateral para começar a ler as Sagradas Escrituras
                </p>
              </div>
            ) : !capituloSelecionado ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {livroSelecionado.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Selecione um capítulo para ler
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                  {Array.from({ length: livroSelecionado.chapters }, (_, i) => i + 1).map((cap) => (
                    <button
                      key={cap}
                      onClick={() => handleSelectCapitulo(cap)}
                      className="aspect-square bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-lg"
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                {/* Header do Capítulo */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {livroSelecionado.name} {capituloSelecionado}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {versiculos.length} versículos
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCapituloSelecionado(null);
                      setVersiculos([]);
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Voltar
                  </button>
                </div>

                {/* Loading */}
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Carregando versículos...</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Versículos */}
                {!loading && !error && versiculos.length > 0 && (
                  <div className="space-y-4">
                    {versiculos.map((versiculo) => (
                      <div
                        key={versiculo.number}
                        className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 font-bold rounded-full text-sm">
                          {versiculo.number}
                        </span>
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                          {versiculo.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Navegação entre capítulos */}
                {!loading && versiculos.length > 0 && (
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => capituloSelecionado > 1 && handleSelectCapitulo(capituloSelecionado - 1)}
                      disabled={capituloSelecionado === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Anterior
                    </button>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">
                      Capítulo {capituloSelecionado} de {livroSelecionado.chapters}
                    </span>
                    <button
                      onClick={() => capituloSelecionado < livroSelecionado.chapters && handleSelectCapitulo(capituloSelecionado + 1)}
                      disabled={capituloSelecionado === livroSelecionado.chapters}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Próximo
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biblia;
