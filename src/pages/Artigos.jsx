import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useTheme } from '../contexts/ThemeContext';

const Artigos = () => {
  const { isDark } = useTheme();
  const { get } = useApi();
  const [articles, setArticles] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, columnsRes] = await Promise.all([
        get('/content?type=articles'),
        get('/public-data?type=editorial-columns')
      ]);
      
      setArticles(articlesRes.articles || []);
      setColumns(columnsRes.columns || []);
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = selectedColumn
    ? articles.filter(a => a.editorial_column_id === selectedColumn)
    : articles;

  const featuredArticle = filteredArticles.find(a => a.is_featured);
  const regularArticles = filteredArticles.filter(a => !a.is_featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-700 dark:text-gray-200 mb-2">
            Artigos
          </h1>
          <p className="text-secondary-600 dark:text-gray-400 text-lg">
            Conteúdos aprofundados de formação católica
          </p>
        </div>

        {/* Column Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedColumn(null)}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
              !selectedColumn
                ? 'bg-primary-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-300 border border-beige-200 dark:border-gray-700 hover:border-primary-600 dark:hover:border-primary-500'
            }`}
          >
            Todas as Colunas
          </button>
          {columns.map(column => (
            <button
              key={column.id}
              onClick={() => setSelectedColumn(column.id)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                selectedColumn === column.id
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-300 border border-beige-200 dark:border-gray-700 hover:scale-105'
              }`}
              style={{
                backgroundColor: selectedColumn === column.id ? column.color : undefined,
                borderColor: selectedColumn === column.id ? column.color : undefined
              }}
            >
              {column.name}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <Link to={`/artigos/${featuredArticle.slug}`}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-beige-200 dark:border-gray-800 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="grid md:grid-cols-2 gap-0">
                  {featuredArticle.cover_image_url && (
                    <div className="h-64 md:h-full">
                      <img
                        src={featuredArticle.cover_image_url}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full mb-4 w-fit">
                      DESTAQUE
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 dark:text-gray-200 mb-4 leading-tight">
                      {featuredArticle.title}
                    </h2>
                    {featuredArticle.excerpt && (
                      <p className="text-secondary-600 dark:text-gray-400 text-lg mb-6 line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-secondary-500 dark:text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {new Date(featuredArticle.published_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles Grid - Newspaper Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map(article => (
            <Link key={article.id} to={`/artigos/${article.slug}`}>
              <article className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-beige-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                {article.cover_image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  {article.editorial_column && (
                    <span 
                      className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 w-fit text-white"
                      style={{ backgroundColor: article.editorial_column.color }}
                    >
                      {article.editorial_column.name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-secondary-700 dark:text-gray-200 mb-3 line-clamp-2 leading-tight">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-secondary-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-gray-500 mt-auto pt-4 border-t border-beige-200 dark:border-gray-700">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {new Date(article.published_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {article.views_count || 0}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-secondary-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-secondary-600 dark:text-gray-400 text-lg">
              Nenhum artigo encontrado nesta coluna.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artigos;
