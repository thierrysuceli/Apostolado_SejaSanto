import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { useTheme } from '../contexts/ThemeContext';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const api = useApi();
  const { isDark } = useTheme();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const courseData = await api.courses.getById(id);
        setCourse(courseData.course);
        
        // Expandir primeiro módulo por padrão
        if (courseData.course.modules && courseData.course.modules.length > 0) {
          setExpandedModules({ [courseData.course.modules[0].id]: true });
        }
      } catch (err) {
        console.error('Error loading course:', err);
        setError('Erro ao carregar curso');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja deletar o curso "${course.title}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await api.courses.delete(id);
      alert('Curso deletado com sucesso!');
      navigate('/cursos');
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Erro ao deletar curso: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 dark:border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            {error || 'Curso não encontrado'}
          </div>
          <Link to="/cursos" className="inline-block mt-4 text-amber-600 dark:text-amber-500 hover:underline font-semibold">
            ← Voltar para Cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* SEO Meta Tags + Structured Data */}
      <Helmet>
        <title>{course.title} | Curso de Formação Católica | Apostolado Seja Santo</title>
        <meta name="description" content={course.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Curso completo de ${course.title} com ${course.modules?.length || 0} módulos. Aprenda sobre formação católica com qualidade.`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${course.title} | Curso Católico`} />
        <meta property="og:description" content={course.description?.replace(/<[^>]*>/g, '').substring(0, 200)} />
        <meta property="og:image" content={course.cover_image_url || course.image} />
        <meta property="og:type" content="website.course" />
        <meta property="og:url" content={`https://www.apostoladosejasanto.com.br/cursos/${course.slug || id}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${course.title} | Curso Católico`} />
        <meta name="twitter:description" content={course.description?.replace(/<[^>]*>/g, '').substring(0, 200)} />
        <meta name="twitter:image" content={course.cover_image_url || course.image} />
        
        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description": course.description?.replace(/<[^>]*>/g, '').substring(0, 500),
            "provider": {
              "@type": "Organization",
              "name": "Apostolado Seja Santo",
              "sameAs": "https://www.apostoladosejasanto.com.br"
            },
            "image": course.cover_image_url || course.image,
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "online",
              "courseWorkload": `PT${(course.modules?.length || 0) * 2}H`
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "BRL",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
      
      {/* Hero Section com imagem de fundo */}
      <div className="relative h-[60vh] min-h-[400px]">
        {/* Imagem de fundo escurecida */}
        <div className="absolute inset-0">
          <img 
            src={course.cover_image_url || course.image || '/Apostolado_PNG.png'} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Conteúdo sobreposto */}
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          {/* Categoria */}
          {course.category && (
            <span className="inline-block text-amber-500 dark:text-amber-400 text-sm font-bold uppercase tracking-wider mb-4">
              {course.category}
            </span>
          )}

          {/* Título */}
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
            {course.title}
          </h1>

          {/* Botão Assista agora - só para não-logados */}
          {!user && (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Assista agora
            </Link>
          )}
        </div>

        {/* Admin Actions - posicionado no canto superior direito */}
        {isAdmin() && (
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => navigate(`/admin/courses/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="hidden sm:inline">Editar</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              title="Deletar curso"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Deletar</span>
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <Link to="/cursos" className="text-amber-600 dark:text-amber-500 hover:underline font-semibold">
            Cursos
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 dark:text-gray-300">{course.title}</span>
        </div>

        {/* Seção Sobre o Curso - VISÍVEL PARA SEO */}
        {(course.description || course.detailed_description) && (
          <div className="mb-12">
            {/* Título "Sobre este Curso" */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-amber-500 pl-4">
              Sobre este Curso
            </h2>
            
            {/* Descrição COMPLETA e visível (NÃO em accordion) */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: course.detailed_description || course.description }}
              />
              
              {/* Tags/Badges do curso */}
              <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {course.modules?.length || 0} Módulos
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Curso Gratuito
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Online • No seu ritmo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Aulas do Curso */}
        <div className="space-y-8">
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((module, moduleIndex) => (
              <div key={module.id}>
                {/* Cabeçalho do Módulo */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 mb-4 bg-gray-100 dark:bg-gray-900 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <svg 
                      className={`w-6 h-6 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${expandedModules[module.id] ? 'rotate-90' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {module.topics?.reduce((total, topic) => {
                          const match = topic.duration?.match(/(\d+):(\d+):(\d+)/);
                          if (match) {
                            const [_, hours, minutes, seconds] = match;
                            return total + parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
                          }
                          return total;
                        }, 0) > 0 ? (
                          <>
                            {Math.floor(module.topics.reduce((total, topic) => {
                              const match = topic.duration?.match(/(\d+):(\d+):(\d+)/);
                              if (match) {
                                const [_, hours, minutes, seconds] = match;
                                return total + parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
                              }
                              return total;
                            }, 0) / 3600)}:{String(Math.floor((module.topics.reduce((total, topic) => {
                              const match = topic.duration?.match(/(\d+):(\d+):(\d+)/);
                              if (match) {
                                const [_, hours, minutes, seconds] = match;
                                return total + parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
                              }
                              return total;
                            }, 0) % 3600) / 60)).padStart(2, '0')}:{String(module.topics.reduce((total, topic) => {
                              const match = topic.duration?.match(/(\d+):(\d+):(\d+)/);
                              if (match) {
                                const [_, hours, minutes, seconds] = match;
                                return total + parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
                              }
                              return total;
                            }, 0) % 60).padStart(2, '0')}
                          </>
                        ) : `${module.topics?.length || 0} aulas`}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Lista de Aulas */}
                {expandedModules[module.id] && module.topics && module.topics.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {module.topics.map((topic, topicIndex) => (
                      <Link
                        key={topic.id}
                        to={`/cursos/${id}/topics/${topic.id}`}
                        className="group block bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-4 p-4">
                          {/* Miniatura */}
                          <div className="relative w-32 h-20 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={topic.thumbnail || course.cover_image_url || course.image || '/Apostolado_PNG.png'} 
                              alt={topic.title}
                              className="w-full h-full object-cover"
                            />
                            {/* Ícone de play */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
                              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </div>
                            {/* Duração no canto */}
                            {topic.duration && (
                              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                {topic.duration.replace(/^0:/, '')}
                              </div>
                            )}
                          </div>

                          {/* Título e info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-300">
                              {moduleIndex + 1}.{topicIndex + 1}. {topic.title}
                            </h4>
                            {topic.description && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                {topic.description.replace(/<[^>]*>/g, '')}
                              </p>
                            )}
                          </div>

                          {/* Seta */}
                          <svg className="w-6 h-6 text-gray-400 dark:text-gray-600 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              Nenhuma aula disponível ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
