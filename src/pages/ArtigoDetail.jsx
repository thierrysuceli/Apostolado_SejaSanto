import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ArtigoDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { get, post, del } = useApi();
  const { currentUser, user } = useAuth();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const userIsAdmin = user?.roles?.some(r => r.name === 'ADMIN') || false;
      setIsAdmin(userIsAdmin);
    }
  }, [user]);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const data = await get(`/api/content?type=articles&id=${slug}`);
      
      if (data && data.article) {
        const article = data.article;
        setArticle(article);
        
        // Save to history
        if (currentUser) {
          await post('/api/public-data?type=article-history', {
            article_id: article.id,
            scroll_percentage: 0,
            reading_time_seconds: 0
          }).catch(err => console.log('History save skipped:', err));
        }
        
        // Fetch related articles (mesma coluna editorial)
        if (article.editorial_column_id) {
          const allArticles = await get('/api/content?type=articles');
          const related = (allArticles.articles || [])
            .filter(a => a.editorial_column_id === article.editorial_column_id && a.id !== article.id)
            .slice(0, 3);
          setRelatedArticles(related);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar este artigo? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await del(`/api/content?type=articles&id=${article.id}`);
      alert('Artigo deletado com sucesso!');
      navigate('/artigos');
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      alert('Erro ao deletar artigo. Tente novamente.');
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

  if (!article) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-4">Artigo não encontrado</h1>
          <Link to="/artigos" className="text-primary-600 hover:text-primary-700">← Voltar para artigos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      {/* Header Image */}
      {article.cover_image_url && (
        <div className="relative h-96 bg-gray-900">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {/* Botões Admin */}
          {isAdmin && (
            <div className="absolute top-4 right-4 z-10 flex gap-3">
              <button
                onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition font-semibold shadow-lg"
              >
                <PencilIcon className="w-5 h-5" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-lg"
              >
                <TrashIcon className="w-5 h-5" />
                Deletar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 ${article.cover_image_url ? '-mt-32 relative z-10' : 'mt-12'} mb-12`}>
          <div className="p-8 md:p-12">
            {/* Category Badge */}
            {article.editorial_column && (
              <div className="mb-6">
                <span 
                  className="inline-block px-4 py-2 text-sm font-bold rounded-lg text-white shadow-lg"
                  style={{ backgroundColor: article.editorial_column.color }}
                >
                  {article.editorial_column.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b-2 border-gray-200 dark:border-gray-700">
              {article.author && (
                <div className="flex items-center">
                  {article.author.avatar_url ? (
                    <img src={article.author.avatar_url} alt={article.author.name} className="w-10 h-10 rounded-full mr-3" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold mr-3">
                      {article.author.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{article.author.name}</span>
                </div>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                {new Date(article.published_at).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-700 dark:text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {article.views_count || 0} visualizações
              </span>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-800 dark:prose-p:text-gray-100 prose-p:leading-relaxed prose-p:text-justify prose-p:mb-4
                prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                prose-em:text-gray-800 dark:prose-em:text-gray-100
                prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 dark:prose-blockquote:bg-amber-900/20 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:text-gray-800 dark:prose-blockquote:text-gray-100
                prose-ul:text-gray-800 dark:prose-ul:text-gray-100 prose-ul:list-disc
                prose-ol:text-gray-800 dark:prose-ol:text-gray-100
                prose-li:text-gray-800 dark:prose-li:text-gray-100 prose-li:mb-2
                prose-code:text-amber-600 dark:prose-code:text-amber-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-6">
              Mais em {article.editorial_column?.name}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <Link key={related.id} to={`/artigos/${related.slug}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-beige-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all">
                    {related.cover_image_url && (
                      <img src={related.cover_image_url} alt={related.title} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-secondary-700 dark:text-gray-200 line-clamp-2 mb-2">{related.title}</h3>
                      <p className="text-sm text-secondary-600 dark:text-gray-400 line-clamp-2">{related.excerpt}</p>
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
            to="/artigos"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para artigos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtigoDetail;
