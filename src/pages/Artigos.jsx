import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Artigos = () => {
  const { isDark } = useTheme();
  const { get } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.roles) {
      const adminRole = user.roles.some(r => r.name === 'ADMIN');
      setIsAdmin(adminRole);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, columnsRes] = await Promise.all([
        get('/api/content?type=articles'),
        get('/api/public-data?type=editorial-columns')
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-700 dark:text-gray-200 mb-2">
                Artigos
              </h1>
              <p className="text-secondary-600 dark:text-gray-400 text-lg">
                Conteúdos aprofundados de formação católica
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin/articles/create')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Artigo
              </button>
            )}
          </div>
        </div>

        {/* Column Filters with Search */}
        <div className="mb-8">
          {/* Search Bar */}
          {columns.length > 5 && (
            <div className="mb-4 relative max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar coluna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-beige-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}
          
          {/* Horizontal Carousel */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-2" style={{ minWidth: 'min-content' }}>
                <button
                  onClick={() => setSelectedColumn(null)}
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                    !selectedColumn
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-300 border border-beige-200 dark:border-gray-700 hover:border-primary-600 dark:hover:border-primary-500'
                  }`}
                >
                  Todas as Colunas
                </button>
                {columns
                  .filter(col => !searchQuery || col.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(column => (
                    <button
                      key={column.id}
                      onClick={() => setSelectedColumn(column.id)}
                      className={`px-5 py-2.5 rounded-full font-semibold transition-all whitespace-nowrap ${
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
                  ))
                }
              </div>
            </div>
          </div>
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

        {/* Articles Grid - Large Magazine Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {regularArticles.map(article => (
            <Link key={article.id} to={`/artigos/${article.slug}`}>
              <article className="group bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 h-full flex flex-col">
                {/* Large Cover Image */}
                {article.cover_image_url && (
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Editorial Column Badge on Image */}
                    {article.editorial_column && (
                      <div className="absolute top-4 left-4">
                        <span 
                          className="inline-block px-4 py-2 text-sm font-bold rounded-lg shadow-lg text-white backdrop-blur-sm"
                          style={{ backgroundColor: `${article.editorial_column.color}dd` }}
                        >
                          {article.editorial_column.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* Subtitle/Excerpt */}
                  {article.excerpt && (
                    <p className="text-gray-700 dark:text-gray-300 text-base mb-6 line-clamp-3 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>
                  )}
                  
                  {/* Meta Info - Prominent */}
                  <div className="flex flex-wrap items-center gap-4 pt-6 mt-auto border-t-2 border-gray-200 dark:border-gray-700">
                    {/* Author */}
                    {article.author && (
                      <div className="flex items-center">
                        {article.author.avatar_url ? (
                          <img src={article.author.avatar_url} alt={article.author.name} className="w-8 h-8 rounded-full mr-2" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm mr-2">
                            {article.author.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{article.author.name}</span>
                      </div>
                    )}
                    
                    {/* Date */}
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {new Date(article.published_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    
                    {/* Views */}
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {article.views_count || 0} visualizações
                    </div>
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
