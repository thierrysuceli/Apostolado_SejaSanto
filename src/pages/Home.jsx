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
  const [selectedPollOptions, setSelectedPollOptions] = useState({});
  
  // Swipe/Drag state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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
          console.log('[Home] Processando grupos:', groupsData.groups.length);
          for (const group of groupsData.groups) {
            try {
              // Buscar conteúdo específico do grupo via API
              console.log('[Home] Buscando detalhes do grupo:', group.id, group.name);
              const groupDetails = await api.groups.getById(group.id).catch((err) => {
                console.error('[Home] Erro ao buscar grupo:', err);
                return null;
              });
              
              console.log('[Home] Detalhes do grupo recebidos:', groupDetails);
              
              if (groupDetails && groupDetails.group) {
                // Posts do grupo
                if (groupDetails.group.group_posts && Array.isArray(groupDetails.group.group_posts)) {
                  console.log('[Home] Posts encontrados:', groupDetails.group.group_posts.length);
                  groupDetails.group.group_posts.forEach(post => {
                    recentActivity.push({
                      ...post,
                      type: 'post',
                      group_name: group.name,
                      group_emoji: group.emoji
                    });
                  });
                } else {
                  console.log('[Home] Nenhum post encontrado para grupo', group.name);
                }
                
                // Polls do grupo
                if (groupDetails.group.polls && Array.isArray(groupDetails.group.polls)) {
                  console.log('[Home] Polls encontrados:', groupDetails.group.polls.length);
                  groupDetails.group.polls.forEach(poll => {
                    recentActivity.push({
                      ...poll,
                      type: 'poll',
                      group_name: group.name,
                      group_emoji: group.emoji
                    });
                  });
                } else {
                  console.log('[Home] Nenhuma poll encontrada para grupo', group.name);
                }
                
                // Registrations do grupo
                if (groupDetails.group.registrations && Array.isArray(groupDetails.group.registrations)) {
                  console.log('[Home] Registrations encontrados:', groupDetails.group.registrations.length);
                  groupDetails.group.registrations.forEach(reg => {
                    recentActivity.push({
                      ...reg,
                      type: 'registration',
                      group_name: group.name,
                      group_emoji: group.emoji
                    });
                  });
                } else {
                  console.log('[Home] Nenhuma registration encontrada para grupo', group.name);
                }
              }
            } catch (err) {
              console.error(`[Home] Error loading group ${group.id} content:`, err);
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
          const dateA = new Date(a.created_at || a.date || a.start_date);
          const dateB = new Date(b.created_at || b.date || b.start_date);
          return dateB - dateA;
        });
        
        console.log('[Home] Recent Activity Items:', recentActivity.length); // Debug
        setRecentItems(recentActivity.slice(0, 5));
        
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

  // Auto-rotate hero carousel
  useEffect(() => {
    if (heroItems.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroItems.length]);

  // Handlers para interações
  const handleVotePoll = async (pollId, optionIds) => {
    if (!user) {
      alert('Faça login para votar');
      navigate('/login');
      return;
    }

    try {
      await api.polls.vote(pollId, optionIds);
      // Recarregar dados
      const groupsData = await api.groups?.getAll().catch(() => ({ groups: [] }));
      const recentActivity = [];
      
      if (groupsData.groups && Array.isArray(groupsData.groups)) {
        for (const group of groupsData.groups) {
          const groupDetails = await api.groups.getById(group.id).catch(() => null);
          if (groupDetails?.group?.polls) {
            groupDetails.group.polls.forEach(poll => {
              recentActivity.push({
                ...poll,
                type: 'poll',
                group_name: group.name,
                group_emoji: group.emoji
              });
            });
          }
        }
      }
      
      setRecentItems(prev => 
        prev.map(item => {
          if (item.type === 'poll') {
            const updated = recentActivity.find(p => p.id === item.id);
            return updated || item;
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Erro ao votar:', error);
      alert(error.response?.data?.error || 'Erro ao votar');
    }
  };

  const handleSubscribeRegistration = async (registrationId) => {
    if (!user) {
      alert('Faça login para se inscrever');
      navigate('/login');
      return;
    }

    try {
      await api.registrations.subscribe(registrationId);
      // Recarregar dados
      const groupsData = await api.groups?.getAll().catch(() => ({ groups: [] }));
      const recentActivity = [];
      
      if (groupsData.groups && Array.isArray(groupsData.groups)) {
        for (const group of groupsData.groups) {
          const groupDetails = await api.groups.getById(group.id).catch(() => null);
          if (groupDetails?.group?.registrations) {
            groupDetails.group.registrations.forEach(reg => {
              recentActivity.push({
                ...reg,
                type: 'registration',
                group_name: group.name,
                group_emoji: group.emoji
              });
            });
          }
        }
      }
      
      setRecentItems(prev => 
        prev.map(item => {
          if (item.type === 'registration') {
            const updated = recentActivity.find(r => r.id === item.id);
            return updated || item;
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Erro ao se inscrever:', error);
      alert(error.response?.data?.error || 'Erro ao se inscrever');
    }
  };

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
                const getTypeLabel = () => {
                  if (item.type === 'post') return 'Post';
                  if (item.type === 'poll') return 'Enquete';
                  if (item.type === 'registration') return 'Inscrição';
                  if (item.type === 'event') return 'Evento';
                  return 'Atividade';
                };
                
                return (
                  <div
                    key={`${item.type}-${item.id}-${index}`}
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/50 hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Header clicável */}
                    <div 
                      onClick={() => {
                        if (item.type === 'event') navigate('/calendar');
                        else navigate('/central');
                      }}
                      className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {/* Type Badge */}
                      <div className="flex items-center gap-3 mb-4">
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
                        {item.type === 'poll' ? item.question : item.title}
                      </h3>

                      {/* Description */}
                      {(item.excerpt || item.description || item.content) && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                          {(item.excerpt || item.description || item.content)?.replace(/<[^>]*>/g, '')}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-500">
                        {item.created_at && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(item.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        {item.type === 'event' && item.start_date && item.end_date && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(item.start_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {new Date(item.end_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </span>
                        )}
                        {item.type === 'poll' && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {item.total_votes || 0} votos
                          </span>
                        )}
                        {item.type === 'registration' && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {item.approved_count || 0}{item.max_participants ? `/${item.max_participants}` : ''} inscritos
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botões de Interação */}
                    {item.type === 'poll' && !item.user_voted && (
                      <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-2 mb-3">
                          {item.options?.slice(0, 3).map((option) => {
                            const pollKey = `poll-${item.id}`;
                            const isSelected = selectedPollOptions[pollKey]?.includes(option.id);
                            
                            return (
                              <button
                                key={option.id}
                                onClick={() => {
                                  const currentSelected = selectedPollOptions[pollKey] || [];
                                  if (item.allow_multiple) {
                                    setSelectedPollOptions(prev => ({
                                      ...prev,
                                      [pollKey]: isSelected 
                                        ? currentSelected.filter(id => id !== option.id)
                                        : [...currentSelected, option.id]
                                    }));
                                  } else {
                                    setSelectedPollOptions(prev => ({
                                      ...prev,
                                      [pollKey]: [option.id]
                                    }));
                                  }
                                }}
                                className={`w-full p-2 text-sm rounded-lg border transition-all ${
                                  isSelected
                                    ? 'border-amber-500 bg-amber-100 dark:bg-amber-500/20 text-gray-900 dark:text-white'
                                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 hover:border-amber-500/50'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected ? 'border-amber-500 bg-amber-500' : 'border-gray-400 dark:border-gray-600'
                                  }`}>
                                    {isSelected && (
                                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="truncate">{option.text}</span>
                                </div>
                              </button>
                            );
                          })}
                          {item.options?.length > 3 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">+{item.options.length - 3} opções</p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            const pollKey = `poll-${item.id}`;
                            const selected = selectedPollOptions[pollKey] || [];
                            if (selected.length > 0) {
                              handleVotePoll(item.id, selected);
                              setSelectedPollOptions(prev => ({ ...prev, [pollKey]: [] }));
                            }
                          }}
                          disabled={!selectedPollOptions[`poll-${item.id}`]?.length}
                          className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Votar
                        </button>
                      </div>
                    )}

                    {item.type === 'poll' && item.user_voted && (
                      <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 border border-green-500/50 rounded-lg text-green-700 dark:text-green-400 text-xs text-center font-medium">
                          ✓ Você já votou
                        </div>
                      </div>
                    )}

                    {item.type === 'registration' && !item.user_subscribed && item.is_open && !item.is_full && (
                      <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSubscribeRegistration(item.id)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all text-sm"
                        >
                          Inscrever-se
                        </button>
                      </div>
                    )}

                    {item.type === 'registration' && item.user_subscribed && (
                      <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className={`p-2 rounded-lg text-xs text-center font-medium ${
                          item.user_status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900/30 border border-green-500/50 text-green-700 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-500/50 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {item.user_status === 'approved' ? '✓ Inscrito e aprovado' : '⏳ Aguardando aprovação'}
                        </div>
                      </div>
                    )}

                    {item.type === 'registration' && (!item.is_open || item.is_full) && !item.user_subscribed && (
                      <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 text-xs text-center font-medium">
                          {item.is_full ? '🔒 Vagas esgotadas' : '⏰ Inscrições encerradas'}
                        </div>
                      </div>
                    )}
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
