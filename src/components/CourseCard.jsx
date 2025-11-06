import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  // Com a API, todos os cursos já vêm filtrados por permissão
  const isLocked = false;

  const cardContent = (
    <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:border-amber-500/50 flex h-[320px]">
      {/* Image Container - Lado Esquerdo */}
      <div className="relative w-2/5 overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-900">
        <img 
          src={course.cover_image_url || course.image || '/Apostolado_PNG.png'} 
          alt={course.title}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${isLocked ? 'opacity-50' : ''}`}
        />
        
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-16 h-16 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
      </div>

      {/* Content Container - Lado Direito */}
      <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
        {/* Header */}
        <div>
          {/* Category Badge */}
          {course.category && (
            <div className="mb-3">
              <span className="inline-block text-amber-500 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
                {course.category}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-gray-900 dark:text-white font-bold text-2xl mb-3 line-clamp-2 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
            {course.title}
          </h3>
          
          {/* Module Count */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="font-semibold">{course.modules?.length || 0} episódios</span>
          </div>
          
          {/* Description */}
          <div 
            className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />

        </div>

        {/* Footer */}
        <div>
          {/* Thematic Tags */}
          {course.course_content_tags && course.course_content_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {course.course_content_tags.slice(0, 3).map((contentTag) => (
                <span
                  key={contentTag.tag_id}
                  className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${contentTag.tags?.color}25` || '#6b728025',
                    color: contentTag.tags?.color || '#6b7280',
                    border: `1px solid ${contentTag.tags?.color}50` || '#6b728050'
                  }}
                  title={contentTag.tags?.description}
                >
                  {contentTag.tags?.name || 'Tag'}
                </span>
              ))}
              {course.course_content_tags.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1 font-medium">
                  +{course.course_content_tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* CTA Button */}
          {isLocked ? (
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Acesso Restrito</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 text-sm font-bold group-hover:gap-3 transition-all">
              <span>Assistir Agora</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
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
