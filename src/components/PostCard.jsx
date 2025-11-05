import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  // Com a API, todos os posts já vêm filtrados por permissão
  const isLocked = false;

  const cardContent = (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 shadow-md border-2 border-beige-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 flex flex-col h-[420px]">
      {/* Fixed Height Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden flex-shrink-0">
        <img 
          src={post.cover_image_url || post.image || '/Apostolado_PNG.png'} 
          alt={post.title}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${isLocked ? 'opacity-50' : ''}`}
          onError={(e) => { e.target.src = '/Apostolado_PNG.png'; }}
        />
        
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Fixed Height Content Container */}
      <div className="p-5 bg-beige-50 dark:bg-gray-900 flex flex-col flex-1 min-h-0">
        {/* Meta Info */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <span className="text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">
            {post.category || 'Artigo'}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
          </span>
        </div>
        
        {/* Title - Fixed 2 Lines */}
        <h3 className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-3 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors leading-snug flex-shrink-0 min-h-[3.5rem]">
          {post.title}
        </h3>
        
        {/* Excerpt - Fixed 3 Lines */}
        {!isLocked && post.excerpt && (
          <div 
            className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed prose prose-sm max-w-none dark:prose-invert overflow-hidden flex-1"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        {isLocked && (
          <p className="text-gray-500 dark:text-gray-500 text-sm italic flex-1">
            Conteúdo disponível apenas para membros com acesso.
          </p>
        )}

        {/* Read More Link */}
        {!isLocked && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
            <span className="text-amber-600 dark:text-amber-500 text-sm font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center gap-2">
              Ler mais
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Se está bloqueado, não permite navegação
  if (isLocked) {
    return cardContent;
  }

  // Se não está bloqueado, envolve em Link
  return (
    <Link to={`/posts/${post.id}`}>
      {cardContent}
    </Link>
  );
};

export default PostCard;
