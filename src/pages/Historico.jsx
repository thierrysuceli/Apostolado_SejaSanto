// =====================================================
// HISTÓRICO - Página de Progresso do Usuário
// =====================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useTheme } from '../contexts/ThemeContext';
import { ClockIcon, BookOpenIcon, DocumentTextIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Historico() {
  const api = useApi();
  const { isDark } = useTheme();
  const [courseProgress, setCourseProgress] = useState([]);
  const [postProgress, setPostProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar progresso de cursos e posts em paralelo
      const [coursesData, postsData] = await Promise.all([
        api.progress.getCourseProgress(),
        api.progress.getPostProgress()
      ]);

      setCourseProgress(coursesData.progress || []);
      setPostProgress(postsData.progress || []);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Erro ao carregar seu histórico. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourseProgress = async (courseId) => {
    if (!confirm('Deseja remover este curso do seu histórico?')) return;

    try {
      await api.progress.deleteCourseProgress(courseId);
      setCourseProgress(prev => prev.filter(p => p.course_id !== courseId));
    } catch (err) {
      console.error('Erro ao deletar progresso:', err);
      alert('Erro ao remover curso do histórico');
    }
  };

  const handleDeletePostProgress = async (postId) => {
    if (!confirm('Deseja remover este artigo do seu histórico?')) return;

    try {
      await api.progress.deletePostProgress(postId);
      setPostProgress(prev => prev.filter(p => p.post_id !== postId));
    } catch (err) {
      console.error('Erro ao deletar progresso:', err);
      alert('Erro ao remover artigo do histórico');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0min';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <ClockIcon className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-lg">Carregando seu histórico...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadProgress}
              className="px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasProgress = courseProgress.length > 0 || postProgress.length > 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl sm:text-4xl font-bold">Meu Histórico</h1>
          </div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Continue de onde você parou
          </p>
        </div>

        {!hasProgress ? (
          <div className="text-center py-20">
            <ClockIcon className={`w-20 h-20 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
            <h2 className="text-2xl font-semibold mb-2">Nenhum histórico ainda</h2>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Comece a assistir cursos ou ler artigos para construir seu histórico
            </p>
            <Link
              to="/cursos"
              className="inline-block px-6 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition"
            >
              Explorar Cursos
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Cursos */}
            {courseProgress.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpenIcon className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold">Cursos em Andamento</h2>
                  <span className={`ml-auto text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {courseProgress.length} {courseProgress.length === 1 ? 'curso' : 'cursos'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courseProgress.map((progress) => {
                    const course = progress.courses;
                    if (!course) return null;

                    const progressPercentage = course.duration 
                      ? Math.min(100, Math.round((progress.progress_seconds / course.duration) * 100))
                      : 0;

                    return (
                      <div
                        key={progress.id}
                        className={`group relative rounded-xl overflow-hidden ${
                          isDark ? 'bg-gray-900' : 'bg-white'
                        } shadow-lg hover:shadow-xl transition`}
                      >
                        {/* Thumbnail */}
                        <Link to={`/cursos/${course.id}`} className="block">
                          <div className="relative aspect-video overflow-hidden">
                            {course.thumbnail_url ? (
                              <img
                                src={course.thumbnail_url}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                                <BookOpenIcon className="w-16 h-16 text-white opacity-50" />
                              </div>
                            )}
                            {progress.completed && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                                <CheckCircleIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="p-4">
                          <Link to={`/cursos/${course.id}`}>
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-amber-500 transition">
                              {course.title}
                            </h3>
                          </Link>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                {progressPercentage}% concluído
                              </span>
                              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                {formatDuration(progress.progress_seconds)}
                              </span>
                            </div>
                            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {formatDate(progress.updated_at)}
                            </span>
                            <div className="flex gap-2">
                              <Link
                                to={`/cursos/${course.id}`}
                                className="px-4 py-2 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-600 transition"
                              >
                                Continuar
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteCourseProgress(course.id);
                                }}
                                className={`p-2 rounded-lg transition ${
                                  isDark 
                                    ? 'hover:bg-red-500/20 text-red-400' 
                                    : 'hover:bg-red-100 text-red-600'
                                }`}
                                title="Remover do histórico"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Artigos */}
            {postProgress.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <DocumentTextIcon className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold">Artigos em Leitura</h2>
                  <span className={`ml-auto text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {postProgress.length} {postProgress.length === 1 ? 'artigo' : 'artigos'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {postProgress.map((progress) => {
                    const post = progress.posts;
                    if (!post) return null;

                    const scrollPercentage = progress.scroll_percentage || 0;

                    return (
                      <div
                        key={progress.id}
                        className={`group relative rounded-xl overflow-hidden ${
                          isDark ? 'bg-gray-900' : 'bg-white'
                        } shadow-lg hover:shadow-xl transition`}
                      >
                        {/* Thumbnail */}
                        <Link to={`/artigos/${post.id}`} className="block">
                          <div className="relative aspect-video overflow-hidden">
                            {post.thumbnail_url ? (
                              <img
                                src={post.thumbnail_url}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <DocumentTextIcon className="w-16 h-16 text-white opacity-50" />
                              </div>
                            )}
                            {progress.completed && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                                <CheckCircleIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="p-4">
                          <Link to={`/artigos/${post.id}`}>
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-amber-500 transition">
                              {post.title}
                            </h3>
                          </Link>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                {Math.round(scrollPercentage)}% lido
                              </span>
                              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                {formatDuration(progress.reading_time_seconds)}
                              </span>
                            </div>
                            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, scrollPercentage)}%` }}
                              />
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {formatDate(progress.updated_at)}
                            </span>
                            <div className="flex gap-2">
                              <Link
                                to={`/artigos/${post.id}`}
                                className="px-4 py-2 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-600 transition"
                              >
                                Continuar
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeletePostProgress(post.id);
                                }}
                                className={`p-2 rounded-lg transition ${
                                  isDark 
                                    ? 'hover:bg-red-500/20 text-red-400' 
                                    : 'hover:bg-red-100 text-red-600'
                                }`}
                                title="Remover do histórico"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
