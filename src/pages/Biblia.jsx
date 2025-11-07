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
  const [menuLivrosAberto, setMenuLivrosAberto] = useState(false);

  const livros = bibliaLivros[testamento];

  // Carregar João 3 (texto inicial)
  useEffect(() => {
    const carregarTextoInicial = async () => {
      const joao = bibliaLivros['Novo Testamento'].find(l => l.abbrev === 'jo');
      if (joao) {
        setLivroSelecionado(joao);
        setCapituloSelecionado(3);
        await buscarVersiculos(joao.abbrev, 3);
      }
    };
    carregarTextoInicial();
  }, []);

  const buscarVersiculos = async (abbrev, capitulo) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BIBLIA_API_URL}/verses/nvi/${abbrev}/${capitulo}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar versículos');
      }
      
      const data = await response.json();
      setVersiculos(data.verses || []);
    } catch (err) {
      console.error('Erro ao buscar versículos:', err);
      setError('Não foi possível carregar os versículos. A API externa pode estar indisponível. Tente novamente mais tarde.');
      setVersiculos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLivro = (livro) => {
    setLivroSelecionado(livro);
    setCapituloSelecionado(1);
    setMenuLivrosAberto(false);
    buscarVersiculos(livro.abbrev, 1);
  };

  const handleSelectCapitulo = (capitulo) => {
    setCapituloSelecionado(capitulo);
    buscarVersiculos(livroSelecionado.abbrev, capitulo);
  };

  const livrosFiltrados = livros.filter(livro =>
    livro.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header Compacto */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Título */}
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-amber-600 dark:text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 1H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-4 4H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z"/>
              </svg>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Bíblia Sagrada
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {livroSelecionado 
                    ? `${livroSelecionado.name}${capituloSelecionado ? ` ${capituloSelecionado}` : ''}`
                    : 'Nova Versão Internacional'
                  }
                </p>
              </div>
            </div>

            {/* Controles Compactos */}
            <div className="flex items-center gap-2">
              {/* Dropdown Testamento */}
              <select
                value={testamento}
                onChange={(e) => {
                  setTestamento(e.target.value);
                  setMenuLivrosAberto(false);
                }}
                className="px-3 py-2 rounded-lg border-2 border-amber-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm"
              >
                <option value="Antigo Testamento">Antigo Testamento</option>
                <option value="Novo Testamento">Novo Testamento</option>
              </select>

              {/* Botão Menu Livros */}
              {livroSelecionado && (
                <button
                  onClick={() => setMenuLivrosAberto(!menuLivrosAberto)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-all flex items-center gap-2 text-sm"
                >
                  📖 Livros
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Menu de Livros */}
      {menuLivrosAberto && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setMenuLivrosAberto(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Selecionar Livro
                </h2>
                <button
                  onClick={() => setMenuLivrosAberto(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {/* Search */}
              <input
                type="text"
                placeholder="Buscar livro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Lista de Livros */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {livrosFiltrados.map((livro) => (
                  <button
                    key={livro.abbrev}
                    onClick={() => handleSelectLivro(livro)}
                    className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                      livroSelecionado?.abbrev === livro.abbrev
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {livro.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {livroSelecionado && capituloSelecionado && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            {/* Header do Capítulo com Navegação */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {livroSelecionado.name} {capituloSelecionado}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {versiculos.length} versículos
                </p>
              </div>

              {/* Navegação de Capítulos */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => capituloSelecionado > 1 && handleSelectCapitulo(capituloSelecionado - 1)}
                  disabled={capituloSelecionado <= 1}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-amber-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Anterior
                </button>
                
                <select
                  value={capituloSelecionado}
                  onChange={(e) => handleSelectCapitulo(parseInt(e.target.value))}
                  className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold"
                >
                  {Array.from({ length: livroSelecionado.chapters }, (_, i) => i + 1).map((cap) => (
                    <option key={cap} value={cap}>Cap. {cap}</option>
                  ))}
                </select>

                <button
                  onClick={() => capituloSelecionado < livroSelecionado.chapters && handleSelectCapitulo(capituloSelecionado + 1)}
                  disabled={capituloSelecionado >= livroSelecionado.chapters}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-amber-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Próximo →
                </button>
              </div>
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
  );
};

export default Biblia;
