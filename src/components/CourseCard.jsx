import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  // Com a API, todos os cursos já vêm filtrados por permissão
  const isLocked = false;

  const cardContent = (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 shadow-md border-2 border-beige-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 flex flex-col h-[480px]">
      {/* Fixed Height Image Container */}
      <div className="relative h-52 overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <img 
          src={course.cover_image_url || course.image || '/Apostolado_PNG.png'} 
          alt={course.title}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${isLocked ? 'opacity-50' : ''}`}
        />
        
        {/* Badge Overlay */}
        {course.badge && !isLocked && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
            {course.badge}
          </div>
        )}

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        {/* Module Count Badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {course.modules?.length || 0} módulos
        </div>
      </div>

      {/* Fixed Height Content Container */}
      <div className="p-5 bg-beige-50 dark:bg-gray-900 flex flex-col flex-1 min-h-0">
        {/* Category Badge */}
        {course.category && (
          <div className="mb-3 flex-shrink-0">
            <span className="inline-block text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">
              {course.category}
            </span>
          </div>
        )}
        
        {/* Title - Fixed 2 Lines */}
        <h3 className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-3 line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors flex-shrink-0 min-h-[3.5rem]">
          {course.title}
        </h3>
        
        {/* Description - Fixed 2 Lines */}
        <div 
          className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed overflow-hidden flex-shrink-0"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />

        {/* Thematic Tags - Scrollable if needed */}
        {course.course_content_tags && course.course_content_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 flex-shrink-0">
            {course.course_content_tags.slice(0, 3).map((contentTag) => (
              <span
                key={contentTag.tag_id}
                className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full transition-all hover:scale-105"
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
            {course.course_content_tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 font-medium">
                +{course.course_content_tags.length - 3} mais
              </span>
            )}
          </div>
        )}

        {/* CTA Button - Fixed at Bottom */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          {isLocked ? (
            <div className="w-full py-3 rounded-lg font-bold bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed text-center transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Acesso Restrito
            </div>
          ) : (
            <button
              className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Assistir ao Curso
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
