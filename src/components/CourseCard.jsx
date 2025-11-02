import React from 'react';
import { useAuth } from '../context/AuthContext';

const CourseCard = ({ course, onNavigate }) => {
  const { hasAccess } = useAuth();
  const isLocked = !hasAccess(course.requiredRoles);

  return (
    <div className="relative bg-white rounded-xl overflow-hidden group cursor-pointer transform transition-transform hover:scale-105 shadow-md hover:shadow-xl border border-beige-200 dark:border-gray-700">
      <div className="relative aspect-video">
        <img 
          src={course.image} 
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

      <div className="p-5 bg-beige-50 dark:bg-gray-900">
        <div className="text-primary-700 dark:text-primary-500 text-xs font-bold mb-2 uppercase tracking-wider">
          {course.category}
        </div>
        <h3 className="text-secondary-700 dark:text-gray-200 font-bold text-lg mb-2 line-clamp-2 leading-tight">
          {course.title}
        </h3>
        <p className="text-secondary-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {!isLocked && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-secondary-700 dark:text-gray-200 text-sm font-bold ml-1">{course.rating}</span>
              <span className="text-secondary-500 dark:text-gray-400 text-xs ml-1">({course.reviews})</span>
            </div>
          </div>
        )}

        <button
          onClick={() => !isLocked && onNavigate('curso-detalhe', course.id)}
          disabled={isLocked}
          className={`w-full py-3 rounded-lg font-bold transition-all ${
            isLocked
              ? 'bg-beige-200 text-secondary-400 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isLocked ? 'Acesso Restrito' : 'Assistir ao curso'}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
