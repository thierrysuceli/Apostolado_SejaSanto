import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import CourseCard from '../components/CourseCard';
import PostCard from '../components/PostCard';
import { PollCard, RegistrationCard, EventCard } from '../components/CentralCards';

const Home = () => {
  const api = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [heroItems, setHeroItems] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [currentRecentIndex, setCurrentRecentIndex] = useState(0);
  const [courses, setCourses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Swipe/Drag state (Hero)
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Swipe/Drag state (Recentes)
  const [recentTouchStart, setRecentTouchStart] = useState(0);
  const [recentTouchEnd, setRecentTouchEnd] = useState(0);
  const [isRecentDragging, setIsRecentDragging] = useState(false);

  // Função para carregar atividades recentes
  const loadRecentActivity = async () => {
    try {
      // Se não estiver autenticado, apenas mostrar eventos públicos
      if (!user) {
        console.log('[Home] Usuário não autenticado, buscando apenas eventos públicos');
        try {
          const eventsResponse = await api.get('/api/events');
          const eventsData = eventsResponse.events || [];
          const upcomingEvents = eventsData
            .filter(event => new Date(event.start_date) >= new Date())
            .map(event => ({
              ...event,
              type: 'event',
              title: event.title || event.name
            }))
            .slice(0, 12);
          
          setRecentItems(upcomingEvents);
          console.log('[Home] Total Recent Activities (não autenticado):', upcomingEvents.length);
        } catch (err) {
          console.log('[Home] Erro ao buscar eventos:', err);
          setRecentItems([]);
        }
        return;
      }

      // Usuário autenticado - buscar grupos consolidados
      try {
        const groupsResponse = await api.get('/api/central/groups-consolidated', null, true);
        const groupsData = groupsResponse.groups || [];
        
        const recentActivity = [];
        
        // Extrair posts, polls e registrations de todos os grupos
        groupsData.forEach(group => {
          // Posts do grupo
          (group.posts || []).forEach(post => {
            recentActivity.push({
              ...post,
              type: 'post',
              group_name: group.name,
              group_emoji: group.emoji
            });
          });
          
          // Polls do grupo
          (group.polls || []).forEach(poll => {
            recentActivity.push({
              ...poll,
              type: 'poll',
              group_id: group.id,
              group_name: group.name,
              group_emoji: group.emoji
            });
          });
          
          // Registrations do grupo
          (group.registrations || []).forEach(reg => {
            recentActivity.push({
              ...reg,
              type: 'registration',
              group_id: group.id,
              group_name: group.name,
              group_emoji: group.emoji
            });
          });
        });
        
        // Ordenar por data mais recente
        recentActivity.sort((a, b) => {
          const dateA = new Date(a.created_at || a.published_at || a.date);
          const dateB = new Date(b.created_at || b.published_at || b.date);
          return dateB - dateA;
        });
        
        setRecentItems(recentActivity.slice(0, 12));
        console.log('[Home] Total Recent Activities:', recentActivity.length);
      } catch (err) {
        console.error('[Home] Error reloading recent activity:', err);
        // Se der erro, mostrar array vazio
        setRecentItems([]);
      }
    } catch (err) {
      console.error('[Home] Error in loadRecentActivity:', err);
      setRecentItems([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Verificar se é admin
        const userIsAdmin = user?.roles?.some(r => r.name === 'ADMIN') || false;
        setIsAdmin(userIsAdmin);
        
        const [coursesData, postsData, articlesData, newsData] = await Promise.all([
          api.courses.getAll(),
          api.posts.getAll(),
          api.get('/api/content?type=articles').catch(() => ({ articles: [] })),
          api.get('/api/content?type=news').catch(() => ({ news: [] }))
        ]);
        
        // Últimos 5 para o HERO (misturar posts e cursos)
        const heroContent = [
          ...(coursesData.courses || []).map(c => ({ ...c, type: 'course' })),
          ...(postsData.posts || []).map(p => ({ ...p, type: 'post' }))
        ];
        
        // Ordenar por data mais recente
        heroContent.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || a.date);
          const dateB = new Date(b.published_at || b.created_at || b.date);
          return dateB - dateA;
        });
        
        setHeroItems(heroContent.slice(0, 5));
        
        // Carregar atividades recentes
        await loadRecentActivity();
        
        // Show only first 4 of each for bottom sections
        setCourses(coursesData.courses?.slice(0, 4) || []);
        setPosts(postsData.posts?.slice(0, 6) || []);
        setArticles(articlesData.articles?.slice(0, 3) || []);
        setNews(newsData.news?.slice(0, 4) || []);
      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Erro ao carregar conteúdo');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleVotePoll = async (pollId, optionIds) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/api/central/polls/${pollId}/vote`, { option_ids: optionIds });
      await loadRecentActivity(); // Recarregar atividades
    } catch (error) {
      console.error('Error voting:', error);
      alert('Erro ao votar. Tente novamente.');
    }
  };

  const handleSubscribeRegistration = async (registrationId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/api/central/registrations/${registrationId}/subscribe`);
      await loadRecentActivity(); // Recarregar atividades
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Erro ao se inscrever. Tente novamente.');
    }
  };

  // Auto-rotate hero carousel
  useEffect(() => {
    if (heroItems.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroItems.length]);

  // Swipe/Drag handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentHeroIndex < heroItems.length - 1) {
      setCurrentHeroIndex(prev => prev + 1);
    }
    
    if (isRightSwipe && currentHeroIndex > 0) {
      setCurrentHeroIndex(prev => prev - 1);
    }
    
    setTouchStart(0);
    setTouchEnd(0);
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    handleTouchEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTouchStart(0);
      setTouchEnd(0);
    }
  };

  // Handlers para carrossel de Recentes
  const handleRecentPrev = () => {
    setCurrentRecentIndex(prev => Math.max(0, prev - 1));
  };

  const handleRecentNext = () => {
    setCurrentRecentIndex(prev => Math.min(recentItems.length - 1, prev + 1));
  };

  const handleRecentTouchStart = (e) => {
    setRecentTouchStart(e.targetTouches[0].clientX);
    setIsRecentDragging(true);
  };

  const handleRecentTouchMove = (e) => {
    setRecentTouchEnd(e.targetTouches[0].clientX);
  };

  const handleRecentTouchEnd = () => {
    if (!recentTouchStart || !recentTouchEnd) return;
    
    const distance = recentTouchStart - recentTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentRecentIndex < recentItems.length - 1) {
      handleRecentNext();
    }
    
    if (isRightSwipe && currentRecentIndex > 0) {
      handleRecentPrev();
    }
    
    setRecentTouchStart(0);
    setRecentTouchEnd(0);
    setIsRecentDragging(false);
  };

  const handleRecentMouseDown = (e) => {
    setRecentTouchStart(e.clientX);
    setIsRecentDragging(true);
  };

  const handleRecentMouseMove = (e) => {
    if (!isRecentDragging) return;
    setRecentTouchEnd(e.clientX);
  };

  const handleRecentMouseUp = () => {
    if (!isRecentDragging) return;
    handleRecentTouchEnd();
  };

  const handleRecentMouseLeave = () => {
    if (isRecentDragging) {
      setIsRecentDragging(false);
      setRecentTouchStart(0);
      setRecentTouchEnd(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const currentHero = heroItems[currentHeroIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Hero Carousel Section - Últimos 5 */}
      {heroItems.length > 0 && (
        <section 
          className="relative h-[600px] md:h-[700px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={currentHero?.cover_image_url || currentHero?.image || '/Apostolado_PNG.png'}
              alt={currentHero?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-3xl">
              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {currentHero?.title}
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed line-clamp-3">
                {currentHero?.description?.replace(/<[^>]*>/g, '') || currentHero?.excerpt?.replace(/<[^>]*>/g, '') || 'Conteúdo exclusivo de formação católica'}
              </p>

              {/* CTA Button */}
              <button
                onClick={() => navigate(currentHero?.type === 'course' ? `/courses/${currentHero?.id}` : `/posts/${currentHero?.id}`)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/50 inline-flex items-center gap-3"
              >
                <span>{currentHero?.type === 'course' ? 'Assistir Agora' : 'Ler Artigo'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {heroItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentHeroIndex 
                    ? 'bg-amber-500 w-8' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recentes Section - Carrossel Horizontal */}
      {recentItems.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Atividades Recentes</h2>
              <p className="text-gray-600 dark:text-gray-400">Últimas atualizações dos seus grupos e eventos</p>
            </div>

            {/* Carrossel */}
            <div className="relative">
              {/* Botão Anterior */}
              {currentRecentIndex > 0 && (
                <button
                  onClick={handleRecentPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-amber-500 text-black rounded-full shadow-lg hover:bg-amber-400 transition-all flex items-center justify-center"
                  aria-label="Anterior"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Container do Carrossel */}
              <div 
                className="overflow-hidden cursor-grab active:cursor-grabbing"
                onTouchStart={handleRecentTouchStart}
                onTouchMove={handleRecentTouchMove}
                onTouchEnd={handleRecentTouchEnd}
                onMouseDown={handleRecentMouseDown}
                onMouseMove={handleRecentMouseMove}
                onMouseUp={handleRecentMouseUp}
                onMouseLeave={handleRecentMouseLeave}
              >
                <div
                  className="flex gap-6 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${currentRecentIndex * (window.innerWidth >= 768 ? 33.333 : 100)}%)`
                  }}
                >
                  {recentItems.map((item, index) => {
                    const key = `${item.type}-${item.id}-${index}`;
                    
                    // Render do card baseado no tipo
                    if (item.type === 'poll') {
                      return (
                        <div key={key} className="flex-shrink-0 w-full md:w-1/3 px-2">
                          <PollCard 
                            poll={item} 
                            onVote={handleVotePoll}
                            isAdmin={isAdmin}
                          />
                        </div>
                      );
                    }
                    
                    if (item.type === 'registration') {
                      return (
                        <div key={key} className="flex-shrink-0 w-full md:w-1/3 px-2">
                          <RegistrationCard 
                            registration={item} 
                            onSubscribe={handleSubscribeRegistration}
                            isAdmin={isAdmin}
                          />
                        </div>
                      );
                    }
                    
                    if (item.type === 'event') {
                      return (
                        <Link
                          key={key}
                          to="/calendar"
                          className="flex-shrink-0 w-full md:w-1/3 px-2"
                        >
                          <EventCard event={item} />
                        </Link>
                      );
                    }
                    
                    if (item.type === 'post') {
                      return (
                        <Link
                          key={key}
                          to="/central"
                          className="flex-shrink-0 w-full md:w-1/3 px-2"
                        >
                          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-amber-500/10 min-w-[320px] max-w-[400px]">
                            <div className="p-4">
                              <div className="text-xs text-amber-500 font-semibold mb-2">
                                {item.group_emoji} {item.group_name}
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-tight line-clamp-2">
                                {item.title}
                              </h3>
                              <div 
                                className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4"
                                dangerouslySetInnerHTML={{ __html: item.content?.replace(/<[^>]*>/g, '') || '' }}
                              />
                            </div>
                          </div>
                        </Link>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </div>

              {/* Botão Próximo */}
              {currentRecentIndex < recentItems.length - 1 && (
                <button
                  onClick={handleRecentNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-amber-500 text-black rounded-full shadow-lg hover:bg-amber-400 transition-all flex items-center justify-center"
                  aria-label="Próximo"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Indicadores */}
              <div className="flex justify-center gap-2 mt-8">
                {recentItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentRecentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentRecentIndex
                        ? 'bg-amber-500 w-8'
                        : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Ir para item ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Cursos em Destaque</h2>
              <p className="text-gray-600 dark:text-gray-400">Conteúdos de formação católica de qualidade</p>
            </div>
            <Link
              to="/courses"
              className="hidden sm:flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Ver todos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.slice(0, 4).length > 0 ? (
              courses.slice(0, 4).map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-600 dark:text-gray-400">
                Nenhum curso disponível no momento
              </p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Ver todos os cursos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Últimas Postagens</h2>
              <p className="text-gray-600 dark:text-gray-400">Reflexões e ensinamentos para sua vida espiritual</p>
            </div>
            <Link
              to="/posts"
              className="hidden sm:flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Ver todas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).length > 0 ? (
              posts.slice(0, 6).map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-600 dark:text-gray-400">
                Nenhuma postagem disponível no momento
              </p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Ver todas as postagens
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Artigos em Destaque</h2>
              <p className="text-gray-600 dark:text-gray-400">Conteúdos aprofundados de formação católica</p>
            </div>
            <Link
              to="/artigos"
              className="hidden sm:flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Ver todos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.map(article => (
                <Link key={article.id} to={`/artigos/${article.slug}`} className="group">
                  <article className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all">
                    {article.cover_image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {article.editorial_column && (
                        <span 
                          className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 text-white"
                          style={{ backgroundColor: article.editorial_column.color }}
                        >
                          {article.editorial_column.name}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-amber-500 transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-600 dark:text-gray-400">
                Nenhum artigo disponível no momento
              </p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/artigos"
              className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Ver todos os artigos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Últimas Notícias</h2>
              <p className="text-gray-600 dark:text-gray-400">Acompanhe as novidades da Igreja e do mundo católico</p>
            </div>
            <Link
              to="/noticias"
              className="hidden sm:flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Ver todas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.length > 0 ? (
              news.map(item => (
                <Link key={item.id} to={`/noticias/${item.slug}`} className="group">
                  <article className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all h-full flex flex-col">
                    {item.cover_image_url && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-500 transition-colors">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-600 dark:text-gray-400">
                Nenhuma notícia disponível no momento
              </p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Ver todas as notícias
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action - Apenas para não autenticados */}
      {!user && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black dark:from-gray-900 dark:to-black relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <img 
                src="/Apostolado_PNG.png"
                alt="Apostolado Seja Santo" 
                className="w-24 h-24 drop-shadow-2xl"
              />
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Faça Parte da Nossa Comunidade
            </h2>
            
            <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Cadastre-se gratuitamente e tenha acesso a conteúdos exclusivos de formação católica, cursos completos e uma comunidade engajada na fé.
            </p>
            
            <Link
              to="/login"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-10 py-5 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/50"
            >
              <span>Criar Conta Grátis</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <p className="mt-6 text-gray-500 text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-amber-500 hover:text-amber-400 font-semibold">
                Faça login
              </Link>
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
