import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import BibleCommentsModal from '../components/BibleCommentsModal';

const Biblia = () => {
  const { isDark } = useTheme();
  const api = useApi();
  const { user } = useAuth();
  
  const [testamento, setTestamento] = useState('Novo Testamento');
  const [livros, setLivros] = useState([]);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [capituloSelecionado, setCapituloSelecionado] = useState(null);
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuLivrosAberto, setMenuLivrosAberto] = useState(false);
  const [showLivroModal, setShowLivroModal] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);

  // Carregar todos os livros e último progresso do usuário
  useEffect(() => {
    const carregarLivros = async () => {
      try {
        const response = await api.bible.getBooks();
        setLivros(response.books || []);
        
        let livroInicial = null;
        let capituloInicial = 1;
        
        // Se usuário logado, carregar último progresso
        if (user) {
          try {
            const progressResponse = await api.bibleProgress.get();
            if (progressResponse?.progress) {
              const { book_abbrev, chapter } = progressResponse.progress;
              livroInicial = response.books.find(l => l.abbrev === book_abbrev);
              capituloInicial = chapter || 1;
              console.log(`[BIBLIA] Carregando último progresso: ${book_abbrev} ${chapter}`);
            }
          } catch (err) {
            console.error('[BIBLIA] Erro ao carregar progresso:', err);
          }
        }
        
        // Se não tem progresso, auto-selecionar João 3
        if (!livroInicial) {
          livroInicial = response.books.find(l => l.abbrev === 'jo');
          capituloInicial = 3;
        }
        
        if (livroInicial) {
          setLivroSelecionado(livroInicial);
          setCapituloSelecionado(capituloInicial);
          await buscarVersiculos(livroInicial.abbrev, capituloInicial);
        }
      } catch (err) {
        console.error('Erro ao carregar livros:', err);
        setError('Erro ao carregar os livros da Bíblia');
      } finally {
        setLoadingBooks(false);
      }
    };
    
    carregarLivros();
  }, [user]);

  const buscarVersiculos = async (abbrev, capitulo) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.bible.getVerses(abbrev, capitulo);
      setVersiculos(response.verses || []);
      
      // Salvar progresso se usuário logado
      if (user) {
        try {
          await api.bibleProgress.save({
            book_abbrev: abbrev,
            chapter: capitulo,
            verse: 1
          });
        } catch (err) {
          console.error('Erro ao salvar progresso:', err);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar versículos:', err);
      setError('Erro ao buscar versículos');
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

  const livrosDoTestamento = livros.filter(l => l.testament === testamento);
  const livrosFiltrados = livrosDoTestamento.filter(livro =>
    livro.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingBooks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Carregando Bíblia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20">
      {/* Header Unificado - Compacto e Fixo */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Linha 1: Título e Controles */}
          <div className="flex items-center justify-between gap-4 mb-3">
            {/* Título */}
            <div className="flex items-center gap-3">
              <svg className="w-7 h-7 text-amber-600 dark:text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 1H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-4 4H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z"/>
              </svg>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
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

            {/* Controles */}
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
              <button
                onClick={() => setMenuLivrosAberto(!menuLivrosAberto)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-all flex items-center gap-2 text-sm"
              >
                📖 {livroSelecionado ? 'Trocar' : 'Livros'}
              </button>
            </div>
          </div>

          {/* Linha 2: Navegação de Capítulos */}
          {livroSelecionado && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 pb-2">
              <div className="flex items-center gap-3">
                {/* Botão Anterior */}
                <button
                  onClick={() => {
                    if (capituloSelecionado > 1) {
                      handleSelectCapitulo(capituloSelecionado - 1);
                    }
                  }}
                  disabled={capituloSelecionado === 1}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    capituloSelecionado === 1
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-md'
                  }`}
                >
                  ← Anterior
                </button>

                {/* Lista de Capítulos */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0">
                      Cap:
                    </span>
                    <div className="flex-1 overflow-x-auto min-w-0" style={{ msOverflowStyle: 'none', scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}>
                      <div className="flex gap-1.5 py-1">
                        {Array.from({ length: livroSelecionado.chapters }, (_, i) => i + 1).map((cap) => (
                          <button
                            key={cap}
                            onClick={() => handleSelectCapitulo(cap)}
                            className={`px-2.5 py-1.5 rounded-md font-semibold text-xs transition-all flex-shrink-0 ${
                              capituloSelecionado === cap
                                ? 'bg-amber-600 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {cap}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Próximo */}
                <button
                  onClick={() => {
                    if (capituloSelecionado < livroSelecionado.chapters) {
                      handleSelectCapitulo(capituloSelecionado + 1);
                    }
                  }}
                  disabled={capituloSelecionado === livroSelecionado.chapters}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    capituloSelecionado === livroSelecionado.chapters
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-md'
                  }`}
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}
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

      {/* Conteúdo Principal - Estilo Medieval */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {livroSelecionado && capituloSelecionado && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">

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

            {/* Versículos - Estilo Medieval com Drop Cap */}
            {!loading && !error && versiculos.length > 0 && (
              <div className="space-y-0 max-w-6xl mx-auto">
                {versiculos.map((versiculo, index) => {
                  const firstLetter = versiculo.text.charAt(0);
                  const restOfText = versiculo.text.slice(1);
                  const isFirstVerse = index === 0;

                  return (
                    <div
                      key={versiculo.verse_number}
                      className="group relative py-1 px-3 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors rounded cursor-pointer"
                      onClick={() => {
                        setSelectedVerse(versiculo.verse_number);
                        setCommentModalOpen(true);
                      }}
                      title="Clique para comentar"
                    >
                      <div className="flex gap-2 items-start">
                        {/* Número do Versículo - Estilo Medieval */}
                        <span 
                          className="flex-shrink-0 select-none text-amber-700 dark:text-amber-500 font-serif pt-0.5"
                          style={{ 
                            fontFamily: "'Cinzel Decorative', 'Playfair Display', serif",
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            lineHeight: '1.6'
                          }}
                        >
                          {versiculo.verse_number}
                        </span>

                        {/* Texto do Versículo */}
                        <p 
                          className="flex-1 text-gray-900 dark:text-gray-100"
                          style={{ 
                            fontFamily: "'Crimson Text', 'Lora', 'Georgia', serif",
                            fontSize: '1.125rem',
                            lineHeight: '1.6',
                            textAlign: 'justify',
                            hyphens: 'auto'
                          }}
                        >
                          {isFirstVerse ? (
                            <>
                              {/* Drop Cap - Primeira Letra Iluminada */}
                              <span 
                                className="float-left text-amber-700 dark:text-amber-500 font-bold mr-1.5 leading-none select-none"
                                style={{
                                  fontFamily: "'Cinzel Decorative', 'Playfair Display', serif",
                                  fontSize: '3.2rem',
                                  lineHeight: '2.6rem',
                                  marginTop: '0.1rem'
                                }}
                              >
                                {firstLetter}
                              </span>
                              <span>{restOfText}</span>
                            </>
                          ) : (
                            versiculo.text
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
                  Capítulo {capituloSelecionado} de {livroSelecionado.total_chapters}
                </span>
                <button
                  onClick={() => capituloSelecionado < livroSelecionado.total_chapters && handleSelectCapitulo(capituloSelecionado + 1)}
                  disabled={capituloSelecionado === livroSelecionado.total_chapters}
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

      {/* Modal de Comentários */}
      {selectedVerse && (
        <BibleCommentsModal
          isOpen={commentModalOpen}
          onClose={() => {
            setCommentModalOpen(false);
            setSelectedVerse(null);
          }}
          book_abbrev={livroSelecionado?.abbrev}
          chapter={capituloSelecionado}
          verse={selectedVerse}
        />
      )}
    </div>
  );
};

export default Biblia;
