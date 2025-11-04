import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  // Com a API, todos os cursos já vêm filtrados por permissão
  const isLocked = false;

  const cardContent = (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden group cursor-pointer transform transition-transform hover:scale-105 shadow-md hover:shadow-xl border border-beige-200 dark:border-gray-700 transition-colors duration-300 h-full flex flex-col">
      <div className="relative aspect-video flex-shrink-0">
        <img 
          src={course.cover_image_url || course.image || '/Apostolado_PNG.png'} 
          alt={course.title}
          className={`w-full h-full object-cover ${isLocked ? 'opacity-50' : ''}`}
        />
        
        {course.badge && !isLocked && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {course.badge}
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5 bg-beige-50 dark:bg-gray-900 flex-grow flex flex-col">
        {course.category && (
          <div className="text-primary-700 dark:text-primary-500 text-xs font-bold mb-2 uppercase tracking-wider flex-shrink-0">
            {course.category}
          </div>
        )}
        <h3 className="text-secondary-700 dark:text-gray-200 font-bold text-lg mb-2 line-clamp-2 leading-tight flex-shrink-0">
          {course.title}
        </h3>
        <div 
          className="text-secondary-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed overflow-hidden flex-shrink-0"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />

        {/* Thematic Tags */}
        {course.course_content_tags && course.course_content_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {course.course_content_tags.slice(0, 3).map((contentTag) => (
              <span
                key={contentTag.tag_id}
                className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: contentTag.tags?.color + '20' || '#6b728020',
                  color: contentTag.tags?.color || '#6b7280',
                  border: `1px solid ${contentTag.tags?.color || '#6b7280'}30`
                }}
                title={contentTag.tags?.description}
              >
                {contentTag.tags?.name || 'Tag'}
              </span>
            ))}
            {course.course_content_tags.length > 3 && (
              <span className="text-xs text-secondary-500 dark:text-gray-400 px-2 py-0.5">
                +{course.course_content_tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="text-secondary-600 dark:text-gray-300 text-sm">
            {course.modules?.length || 0} módulos
          </div>
        </div>

        <div className="mt-auto flex-shrink-0">
          {isLocked ? (
            <div className="w-full py-3 rounded-lg font-bold bg-beige-200 dark:bg-gray-700 text-secondary-400 dark:text-gray-500 cursor-not-allowed text-center transition-colors duration-300">
              Acesso Restrito
            </div>
          ) : (
            <button
              className="w-full py-3 rounded-lg font-bold bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg transition-all"
            >
              Assistir ao curso
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Se está bloqueado, retorna o card sem Link wrapper
  if (isLocked) {
    return cardContent;
  }

  // Se não está bloqueado, envolve em Link para navegação ao clicar no card
  return (
    <Link to={`/courses/${course.id}`} className="block">
      {cardContent}
    </Link>
  );
};

export default CourseCard;
