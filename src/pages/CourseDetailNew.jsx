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

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll para o topo ao carregar
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
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            {error || 'Curso não encontrado'}
          </div>
          <Link to="/courses" className="inline-block mt-4 text-primary-600 hover:underline">
            ← Voltar para Cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/courses" className="text-primary-700 dark:text-primary-500 hover:underline">
              Cursos
            </Link>
            <span className="text-secondary-500 dark:text-gray-400">/</span>
            <span className="text-secondary-600 dark:text-gray-300">{course.title}</span>
          </div>
          
          {/* Admin Actions */}
          {isAdmin() && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/admin/courses/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
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

        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-beige-300 dark:border-gray-700 p-8 mb-8 transition-colors duration-300">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Course image */}
            <div>
              <img 
                src={course.cover_image_url || course.image || '/Apostolado_PNG.png'} 
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Course info */}
            <div>
              <span className="inline-block bg-primary-600 text-white text-xs px-3 py-1 rounded-full mb-3">
                {course.category}
              </span>
              
              {course.badge && (
                <span className="inline-block bg-amber-500 text-black text-xs px-3 py-1 rounded-full mb-3 ml-2">
                  {course.badge}
                </span>
              )}

              <h1 className="text-secondary-800 dark:text-gray-100 text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300">
                {course.title}
              </h1>
              
              <div 
                className="text-secondary-600 dark:text-gray-300 text-lg mb-6"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < Math.floor(course.rating || 0) ? 'text-primary-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-primary-700 dark:text-primary-500 text-lg font-semibold">
                    {course.rating || 0}
                  </span>
                  <span className="text-secondary-500 dark:text-gray-400">
                    ({course.reviews || 0} avaliações)
                  </span>
                </div>
              </div>

              {/* Course stats */}
              <div className="mt-6 flex gap-4">
                <div className="bg-beige-100 dark:bg-gray-900 px-4 py-2 rounded-lg">
                  <p className="text-secondary-500 dark:text-gray-400 text-xs">Módulos</p>
                  <p className="text-secondary-600 dark:text-gray-300 font-semibold">
                    {course.modules?.length || 0}
                  </p>
                </div>
                
                <div className="bg-beige-100 dark:bg-gray-900 px-4 py-2 rounded-lg">
                  <p className="text-secondary-500 dark:text-gray-400 text-xs">Total de Aulas</p>
                  <p className="text-secondary-600 dark:text-gray-300 font-semibold">
                    {course.modules?.reduce((acc, m) => acc + (m.topics?.length || 0), 0) || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules and Topics */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Modules list */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-beige-300 dark:border-gray-700 p-6 sticky top-6 transition-colors duration-300">
              <h2 className="text-secondary-800 dark:text-gray-100 text-xl font-bold mb-4">
                Conteúdo do Curso
              </h2>
              
              <div className="space-y-3">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, index) => (
                    <div key={module.id}>
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-3 bg-beige-50 dark:bg-gray-900 rounded-lg hover:bg-beige-100 dark:hover:bg-gray-700 transition-colors duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <div className="text-left">
                            <p className="text-secondary-700 dark:text-gray-200 font-semibold text-sm">
                              {module.title}
                            </p>
                            <p className="text-secondary-500 dark:text-gray-400 text-xs">
                              {module.topics?.length || 0} aulas
                            </p>
                          </div>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-secondary-700 dark:text-gray-300 transition-transform ${expandedModules[module.id] ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {expandedModules[module.id] && module.topics && module.topics.length > 0 && (
                        <div className="ml-11 mt-2 space-y-2">
                          {module.topics.map((topic, topicIndex) => (
                            <Link
                              key={topic.id}
                              to={`/courses/${id}/topics/${topic.id}`}
                              className="block p-2 text-sm text-secondary-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-500 hover:bg-beige-50 dark:hover:bg-gray-900 rounded transition-colors duration-300"
                            >
                              {topicIndex + 1}. {topic.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-secondary-600 dark:text-gray-300 text-sm text-center py-4">
                    Nenhum módulo disponível
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main content - Course details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-beige-300 dark:border-gray-700 p-8 transition-colors duration-300">
              <h2 className="text-secondary-800 dark:text-gray-100 text-2xl font-bold mb-6">
                Sobre o Curso
              </h2>
              
              <div 
                className="prose prose-lg max-w-none text-secondary-600 dark:text-gray-300 mb-8"
                dangerouslySetInnerHTML={{ __html: course.detailed_description || course.description }}
              />

              {/* What you'll learn */}
              {course.learning_objectives && course.learning_objectives.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-secondary-800 dark:text-gray-100 text-xl font-bold mb-4">
                    O que você vai aprender
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {course.learning_objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-secondary-600 dark:text-gray-300">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-secondary-800 dark:text-gray-100 text-xl font-bold mb-4">
                    Requisitos
                  </h3>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary-600 font-bold">•</span>
                        <span className="text-secondary-600 dark:text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course instructor */}
              {course.instructor && (
                <div className="border-t border-beige-300 dark:border-gray-700 pt-6">
                  <h3 className="text-secondary-800 dark:text-gray-100 text-xl font-bold mb-4">
                    Instrutor
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                      {course.instructor.name?.[0] || 'I'}
                    </div>
                    <div>
                      <p className="text-secondary-700 dark:text-gray-200 font-semibold text-lg">
                        {course.instructor.name || 'Instrutor'}
                      </p>
                      <p className="text-secondary-500 dark:text-gray-400 text-sm">
                        {course.instructor.bio || 'Instrutor do curso'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Start course button */}
            {course.modules && course.modules.length > 0 && course.modules[0].topics && course.modules[0].topics.length > 0 && (
              <div className="mt-6 text-center">
                <Link
                  to={`/courses/${id}/topics/${course.modules[0].topics[0].id}`}
                  className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors duration-300"
                >
                  Começar Curso
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
