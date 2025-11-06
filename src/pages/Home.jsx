import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import CourseCard from '../components/CourseCard';
import PostCard from '../components/PostCard';

const Home = () => {
  const api = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [heroItems, setHeroItems] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [coursesData, postsData, groupsData, eventsData] = await Promise.all([
          api.courses.getAll(),
          api.posts.getAll(),
          api.groups?.getAll().catch(() => ({ groups: [] })) || { groups: [] },
          api.events?.getAll().catch(() => ({ events: [] })) || { events: [] }
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
        
        // Para "RECENTES" - puxar do Central (posts de grupos, polls, registrations) + Eventos do calendário
        const recentActivity = [];
        
        // Puxar posts, polls e registrations dos grupos que o user participa
        if (groupsData.groups && Array.isArray(groupsData.groups)) {
          for (const group of groupsData.groups) {
            try {
              // Posts do grupo
              if (group.group_posts) {
                group.group_posts.forEach(post => {
                  recentActivity.push({
                    ...post,
                    type: 'post',
                    group_name: group.name,
                    group_emoji: group.emoji
                  });
                });
              }
              
              // Polls do grupo
              if (group.polls) {
                group.polls.forEach(poll => {
                  recentActivity.push({
                    ...poll,
                    type: 'poll',
                    group_name: group.name,
                    group_emoji: group.emoji
                  });
                });
              }
              
              // Registrations do grupo
              if (group.registrations) {
                group.registrations.forEach(reg => {
                  recentActivity.push({
                    ...reg,
                    type: 'registration',
                    group_name: group.name,
                    group_emoji: group.emoji
                  });
                });
              }
            } catch (err) {
              console.error(`Error loading group ${group.id} content:`, err);
            }
          }
        }
        
        // Adicionar eventos do calendário (filtrados por role do user)
        if (eventsData.events && Array.isArray(eventsData.events)) {
          eventsData.events.forEach(event => {
            recentActivity.push({
              ...event,
              type: 'event',
              title: event.title || event.name
            });
          });
        }
        
        // Ordenar por data de criação
        recentActivity.sort((a, b) => {
          const dateA = new Date(a.created_at || a.date);
          const dateB = new Date(b.created_at || b.date);
          return dateB - dateA;
        });
        
        setRecentItems(recentActivity.slice(0, 10));
        
        // Show only first 4 of each for bottom sections
        setCourses(coursesData.courses?.slice(0, 4) || []);
        setPosts(postsData.posts?.slice(0, 6) || []);
      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Erro ao carregar conteúdo');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  // Auto-play carousel
  useEffect(() => {
    if (heroItems.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroItems.length]);

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
        <section className="relative h-[600px] md:h-[700px] overflow-hidden">
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

      {/* Recentes Section - Feed Unificado (Central + Calendário) */}
      {recentItems.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Recentes</h2>
              <p className="text-gray-600 dark:text-gray-400">Últimas atividades dos seus grupos e eventos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map((item, index) => {
                const getIcon = () => {
                  if (item.type === 'post') return item.group_emoji || '📄';
                  if (item.type === 'poll') return '📊';
                  if (item.type === 'registration') return '📝';
                  if (item.type === 'event') return '📅';
                  return '📄';
                };
                
                const getTypeLabel = () => {
                  if (item.type === 'post') return 'Post';
                  if (item.type === 'poll') return 'Enquete';
                  if (item.type === 'registration') return 'Inscrição';
                  if (item.type === 'event') return 'Evento';
                  return 'Atividade';
                };
                
                const handleClick = () => {
                  if (item.type === 'event') navigate('/calendar');
                  else if (item.type === 'post' || item.type === 'poll' || item.type === 'registration') navigate('/central');
                };
                
                return (
                  <div
                    key={`${item.type}-${item.id}-${index}`}
                    onClick={handleClick}
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer border border-gray-200 dark:border-gray-700/50 hover:border-amber-500/50 shadow-sm hover:shadow-md"
                  >
                    {/* Type Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">
                        {getIcon()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-amber-600 dark:text-amber-500 text-sm font-bold uppercase tracking-wider">
                          {getTypeLabel()}
                        </span>
                        {item.group_name && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {item.group_name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description/Excerpt */}
                    {(item.excerpt || item.description || item.content) && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        {(item.excerpt || item.description || item.content)?.replace(/<[^>]*>/g, '')}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                      {item.created_at && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
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
