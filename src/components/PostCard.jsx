import React from 'react';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onNavigate }) => {
  const { hasAccess } = useAuth();
  const isLocked = !hasAccess(post.requiredRoles);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all shadow-md border border-beige-200 dark:border-gray-700">
      <div className="relative aspect-video">
        <img 
          src={post.image} 
          alt={post.title}
          className={`w-full h-full object-cover ${isLocked ? 'opacity-50' : ''}`}
        />
        
        {isLocked && (
          <div className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5 bg-beige-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <span className="text-primary-700 dark:text-primary-500 text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-secondary-500 dark:text-gray-400 text-xs font-medium">
            {post.date}
          </span>
        </div>
        
        <h3 className="text-secondary-700 dark:text-gray-200 font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors leading-tight">
          {post.title}
        </h3>
        
        {!isLocked && (
          <p className="text-secondary-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {isLocked && (
          <p className="text-secondary-500 dark:text-gray-400 text-sm italic">
            Conteúdo disponível apenas para membros com acesso.
          </p>
        )}
      </div>
    </div>
  );
};

export default PostCard;
