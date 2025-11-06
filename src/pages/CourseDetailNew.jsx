import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const [showDescription, setShowDescription] = useState(false);

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
      navigate('/courses');
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
          <Link to="/courses" className="inline-block mt-4 text-amber-600 dark:text-amber-500 hover:underline font-semibold">
            ← Voltar para Cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
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

          {/* Botão Assine agora - só para não-logados */}
          {!user && (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Assine agora
            </Link>
          )}

          {/* Avaliação com estrelas */}
          <div className="mt-6 flex items-center gap-3 text-white">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-6 h-6 ${i < Math.floor(course.rating || 5) ? 'text-amber-400' : 'text-gray-500'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-2xl font-bold">{course.rating || '5,0'}</span>
            <span className="text-gray-300">({course.reviews || '2.769'} avaliações)</span>
          </div>
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
          <Link to="/courses" className="text-amber-600 dark:text-amber-500 hover:underline font-semibold">
            Cursos
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 dark:text-gray-300">{course.title}</span>
        </div>

        {/* Descrição expansível "Venha trilhar esta jornada..." */}
        {(course.description || course.detailed_description) && (
          <div className="mb-8">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="w-full text-left bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Venha trilhar esta jornada para entender...
                </h2>
                <svg 
                  className={`w-6 h-6 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${showDescription ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {showDescription && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: course.detailed_description || course.description }}
                  />
                </div>
              )}
            </button>
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
                        to={`/courses/${id}/topics/${topic.id}`}
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
