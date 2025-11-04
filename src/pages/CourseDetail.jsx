import React, { useState } from 'react';
import { dbCourses, dbComments } from '../data/mockDatabase';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail = ({ courseId, onNavigate }) => {
  const { currentUser, hasAccess } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(dbComments);

  const course = dbCourses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Curso não encontrado</h2>
          <button
            onClick={() => onNavigate('cursos')}
            className="text-primary-700 hover:text-primary-400"
          >
            Voltar para cursos
          </button>
        </div>
      </div>
    );
  }

  const canAccess = hasAccess(course.requiredRoles);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    const comment = {
      id: `com${comments.length + 1}`,
      courseId: course.id,
      userId: currentUser.id,
      userName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      text: newComment
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const courseComments = comments.filter(c => c.courseId === course.id);

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => onNavigate('cursos')}
            className="flex items-center text-primary-700 dark:text-primary-500 hover:text-primary-400 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>

          <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-12 text-center">
            <svg className="w-24 h-24 text-primary-700 dark:text-primary-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-3xl font-bold text-white mb-4">Acesso Restrito</h2>
            <p className="text-secondary-600 dark:text-gray-300 mb-8">
              Este curso requer permissões especiais. Entre em contato com o administrador para solicitar acesso.
            </p>
            <button
              onClick={() => onNavigate('cursos')}
              className="bg-primary-600 text-secondary-500 dark:text-gray-400 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Ver Outros Cursos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('cursos')}
          className="flex items-center text-primary-700 dark:text-primary-500 hover:text-primary-400 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </button>

        {/* Course Header */}
        <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-8 mb-8">
          <div className="text-primary-700 text-sm font-semibold mb-3 uppercase tracking-wide">
            {course.category}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
          <div 
            className="text-gray-300 text-lg mb-6"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          
          {/* Thematic Tags */}
          {course.course_content_tags && course.course_content_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {course.course_content_tags.map((contentTag) => (
                <span
                  key={contentTag.tag_id}
                  className="inline-flex items-center text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: contentTag.tags?.color + '20' || '#6b728020',
                    color: contentTag.tags?.color || '#6b7280',
                    border: `1px solid ${contentTag.tags?.color || '#6b7280'}40`
                  }}
                  title={contentTag.tags?.description}
                >
                  {contentTag.tags?.name || 'Tag'}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-primary-700 dark:text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white text-lg font-semibold">{course.rating}</span>
              <span className="text-secondary-600">({course.reviews} avaliações)</span>
            </div>
          </div>
        </div>

        {/* Video Placeholder */}
        <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl overflow-hidden mb-8">
          <div className="aspect-video bg-white dark:bg-gray-800 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-24 h-24 text-primary-700 dark:text-primary-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
              <p className="text-secondary-600">Player de vídeo (placeholder)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Aulas do curso</h2>
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => {
                const lessonLocked = !hasAccess(lesson.requiredRoles);
                return (
                  <div
                    key={lesson.id}
                    className={`bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-lg p-5 flex items-center justify-between ${
                      lessonLocked ? 'opacity-50' : 'hover:bg-white dark:bg-gray-800 border border-beige-200 dark:border-gray-700 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {lessonLocked ? (
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{`${String(index + 1).padStart(2, '0')}. ${lesson.title}`}</p>
                      </div>
                    </div>
                    <div className="text-secondary-600 dark:text-gray-300 text-sm">
                      {lesson.duration}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Info Sidebar */}
          <div>
            <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Informações do Curso</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-secondary-600 dark:text-gray-300 text-sm mb-1">Total de aulas</p>
                  <p className="text-white font-semibold">{course.lessons.length} aulas</p>
                </div>
                <div>
                  <p className="text-secondary-600 dark:text-gray-300 text-sm mb-1">Categoria</p>
                  <p className="text-white font-semibold">{course.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Comentários</h2>
          
          {/* Add Comment Form - Only for logged in users */}
          {currentUser && (
            <form onSubmit={handleAddComment} className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Deixe seu comentário..."
                className="w-full bg-white dark:bg-gray-800 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 text-white rounded-lg p-4 mb-4 border border-gray-700 focus:border-primary-500 focus:outline-none resize-none"
                rows="4"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-primary-600 text-secondary-500 dark:text-gray-400 px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar Comentário
              </button>
            </form>
          )}

          {!currentUser && (
            <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 mb-6 text-center">
              <p className="text-secondary-600 dark:text-gray-300 mb-4">Faça login para deixar um comentário</p>
              <button
                onClick={() => onNavigate('login')}
                className="bg-primary-600 text-secondary-500 dark:text-gray-400 px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {courseComments.length === 0 ? (
              <p className="text-secondary-600 dark:text-gray-300 text-center py-8">Nenhum comentário ainda. Seja o primeiro!</p>
            ) : (
              courseComments.map(comment => (
                <div key={comment.id} className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-black font-semibold">
                        {comment.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{comment.userName}</p>
                      <p className="text-secondary-600 dark:text-gray-300 text-sm">{comment.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-300">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
