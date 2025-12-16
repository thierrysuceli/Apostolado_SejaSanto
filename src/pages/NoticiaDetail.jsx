import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const NoticiaDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { get, post, del } = useApi();
  const { currentUser, user } = useAuth();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const userIsAdmin = user?.roles?.some(r => r.name === 'ADMIN') || false;
      setIsAdmin(userIsAdmin);
    }
  }, [user]);

  useEffect(() => {
    fetchNews();
  }, [slug]);

  const fetchNews = async () => {
    try {
      const data = await get(`/api/content?type=news&id=${slug}`);
      
      if (data && data.news) {
        const newsItem = data.news;
        setNews(newsItem);
        
        // Increment views (sempre, não precisa estar logado)
        fetch('/api/public-data?type=news-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ news_id: newsItem.id })
        }).catch(err => console.log('View count skipped:', err));
        
        // Save to history
        if (currentUser) {
          await post('/api/public-data?type=news-history', {
            news_id: newsItem.id,
            scroll_percentage: 0,
            reading_time_seconds: 0
          }).catch(err => console.log('History save skipped:', err));
        }
        
        // Fetch related news based on tags
        if (newsItem.news_tags && newsItem.news_tags.length > 0) {
          const allNews = await get('/api/content?type=news');
          const tagIds = newsItem.news_tags.map(t => t.id);
          const related = (allNews.news || [])
            .filter(n => 
              n.id !== newsItem.id && 
              n.news_tags?.some(t => tagIds.includes(t.id))
            )
            .slice(0, 3);
          setRelatedNews(related);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar notícia:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar esta notícia? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await del(`/api/content?type=news&id=${news.id}`);
      alert('Notícia deletada com sucesso!');
      navigate('/noticias');
    } catch (error) {
      console.error('Erro ao deletar notícia:', error);
      alert('Erro ao deletar notícia. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-4">Notícia não encontrada</h1>
          <Link to="/noticias" className="text-primary-600 hover:text-primary-700">← Voltar para notícias</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Link to="/" className="hover:text-amber-500">Início</Link>
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/noticias" className="hover:text-amber-500">Notícias</Link>
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Notícia</span>
            </div>
            
            {/* Botões Admin */}
            {isAdmin && (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/admin/news/edit/${news.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition font-semibold"
                >
                  <PencilIcon className="w-5 h-5" />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  <TrashIcon className="w-5 h-5" />
                  Deletar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden mb-12">
          {/* Cover Image */}
          {news.cover_image_url && (
            <div className="relative h-96">
              <img
                src={news.cover_image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Tags */}
            {news.news_tags && news.news_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {news.news_tags.map(tag => (
                  <Link key={tag.id} to={`/noticias?tag=${tag.slug}`}>
                    <span 
                      className="inline-block px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-black hover:bg-amber-600 transition shadow-lg"
                    >
                      #{tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {news.title}
            </h1>

            {/* Subtitle */}
            {news.subtitle && (
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic font-medium">
                {news.subtitle}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b-2 border-gray-200 dark:border-gray-700">
              {news.author && (
                <div className="flex items-center">
                  {news.author.avatar_url ? (
                    <img src={news.author.avatar_url} alt={news.author.name} className="w-10 h-10 rounded-full mr-3" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold mr-3">
                      {news.author.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{news.author.name}</span>
                </div>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-gray-700 dark:text-gray-200">
                {new Date(news.published_at).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-700 dark:text-gray-200 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {news.views_count || 0} visualizações
              </span>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-800 dark:prose-p:text-white prose-p:leading-relaxed prose-p:mb-4
                [&_p]:dark:text-white [&_p]:text-gray-800
                prose-a:text-amber-600 dark:prose-a:text-amber-300 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                prose-em:text-gray-800 dark:prose-em:text-gray-50
                prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 dark:prose-blockquote:bg-amber-900/20 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:text-gray-800 dark:prose-blockquote:text-gray-50
                prose-ul:text-gray-800 dark:prose-ul:text-white
                prose-ol:text-gray-800 dark:prose-ol:text-white
                prose-li:text-gray-800 dark:prose-li:text-white prose-li:mb-2
                prose-img:rounded-lg prose-img:shadow-xl"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {/* Source Link */}
            {news.source_url && (
              <div className="mt-8 pt-6 border-t border-beige-200 dark:border-gray-700">
                <p className="text-sm text-secondary-600 dark:text-gray-400">
                  Fonte: <a href={news.source_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">{news.source_name || 'Ver fonte'}</a>
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-6">
              Notícias Relacionadas
            </h2>
            <div className="space-y-4">
              {relatedNews.map(related => (
                <Link key={related.id} to={`/noticias/${related.slug}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-beige-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all flex">
                    {related.cover_image_url && (
                      <img src={related.cover_image_url} alt={related.title} className="w-32 h-32 object-cover flex-shrink-0" />
                    )}
                    <div className="p-4 flex-1">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {related.news_tags?.slice(0, 2).map(tag => (
                          <span 
                            key={tag.id}
                            className="inline-block px-2 py-0.5 text-xs font-bold rounded-full text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-secondary-700 dark:text-gray-200 line-clamp-2 mb-1">{related.title}</h3>
                      <p className="text-xs text-secondary-600 dark:text-gray-400">
                        {new Date(related.published_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mb-12">
          <Link 
            to="/noticias"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para notícias
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoticiaDetail;
