import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Noticias = () => {
  const { isDark } = useTheme();
  const { get } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.roles) {
      const adminRole = user.roles.some(r => r.name === 'ADMIN');
      setIsAdmin(adminRole);
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [newsRes, tagsRes] = await Promise.all([
        get('/api/content?type=news'),
        get('/api/public-data?type=news-tags')
      ]);
      
      setNews(newsRes.news || []);
      setTags(tagsRes.tags || []);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = selectedTag
    ? news.filter(n => n.news_tags?.some(t => t.id === selectedTag))
    : news;

  const featuredNews = filteredNews.filter(n => n.is_featured).slice(0, 2);
  const regularNews = filteredNews.filter(n => !n.is_featured);

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
              <div className="flex items-center mb-2">
                <div className="w-2 h-8 bg-primary-600 mr-3"></div>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary-700 dark:text-gray-200">
                  Notícias
                </h1>
              </div>
              <p className="text-secondary-600 dark:text-gray-400 text-lg ml-5">
                Acompanhe as últimas notícias da Igreja e do mundo católico
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin/news/create')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Notícia
              </button>
            )}
          </div>
        </div>

        {/* Tag Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                !selectedTag
                  ? 'bg-secondary-700 dark:bg-gray-700 text-white'
                  : 'bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-300 border border-beige-300 dark:border-gray-700 hover:border-secondary-700 dark:hover:border-gray-600'
              }`}
            >
              Todas
            </button>
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                  selectedTag === tag.id
                    ? 'text-white'
                    : 'bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-300 border dark:border-gray-700'
                }`}
                style={{
                  backgroundColor: selectedTag === tag.id ? tag.color : undefined,
                  borderColor: tag.color
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured News - Large Cards */}
        {featuredNews.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {featuredNews.map(item => (
              <Link key={item.id} to={`/noticias/${item.slug}`}>
                <article className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-beige-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  {item.cover_image_url && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                        DESTAQUE
                      </span>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </h2>
                    {item.excerpt && (
                      <p className="text-secondary-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-secondary-500 dark:text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {new Date(item.published_at).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                      <span className="mx-2">•</span>
                      <span>{Math.ceil(item.content?.length / 1000) || 4} min de leitura</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Regular News - Compact List Style */}
        <div className="space-y-4">
          {regularNews.map(item => (
            <Link key={item.id} to={`/noticias/${item.slug}`}>
              <article className="group bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md border border-beige-200 dark:border-gray-800 hover:shadow-xl hover:border-primary-600 dark:hover:border-primary-500 transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  {item.cover_image_url && (
                    <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Tags */}
                      {item.news_tags && item.news_tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.news_tags.slice(0, 2).map(tag => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 text-xs font-semibold rounded"
                              style={{ 
                                backgroundColor: `${tag.color}20`,
                                color: tag.color 
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold text-secondary-700 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {item.title}
                      </h3>
                      
                      {item.excerpt && (
                        <p className="text-secondary-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(item.published_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {item.views_count || 0} visualizações
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-secondary-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-secondary-600 dark:text-gray-400 text-lg">
              Nenhuma notícia encontrada com esta tag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Noticias;
