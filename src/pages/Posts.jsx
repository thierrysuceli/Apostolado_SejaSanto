import React from 'react';
import { dbPosts } from '../data/mockDatabase';
import PostCard from '../components/PostCard';

const Posts = () => {
  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-500 dark:text-gray-400 mb-4">
            Artigos e Notícias
          </h1>
          <p className="text-secondary-600 dark:text-gray-300 max-w-2xl mx-auto">
            Acompanhe as últimas publicações, reflexões e notícias do apostolado.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {dbPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-secondary-600 dark:text-gray-300 text-lg">Nenhuma postagem disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
