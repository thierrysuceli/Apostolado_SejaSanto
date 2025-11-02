import React from 'react';
import { dbCourses, dbPosts } from '../data/mockDatabase';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import PostCard from '../components/PostCard';

const Home = ({ onNavigate }) => {
  const { hasAccess } = useAuth();

  // Show only first 3 courses
  const featuredCourses = dbCourses.slice(0, 3);
  
  // Show only first 3 posts
  const latestPosts = dbPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <img 
              src="/Apostolado_PNG.png"
              alt="Apostolado Seja Santo" 
              className="w-32 h-32 drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-500 dark:text-gray-400 mb-6">
            Apostolado
            <span className="block text-primary-500">Seja Santo</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-primary-600 italic mb-8 max-w-3xl mx-auto">
            "Os que não querem ser vencidos pela verdade, serão vencidos pelo erro."
          </p>
          
          <p className="text-secondary-400 text-lg mb-10 max-w-2xl mx-auto">
            Cursos, formação e conteúdos para aprofundar sua fé e conhecimento da doutrina católica.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('cursos')}
              className="bg-primary-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Explorar Cursos
            </button>
            <button
              onClick={() => onNavigate('calendario')}
              className="bg-beige-50 dark:bg-gray-950 border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-500 hover:text-white transition-colors shadow-md hover:shadow-lg"
            >
              Ver Calendário
            </button>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-beige-50 dark:bg-gray-950 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-500 dark:text-gray-400 mb-2">Cursos em Destaque</h2>
              <p className="text-secondary-400">Conteúdos de formação católica de qualidade</p>
            </div>
            <button
              onClick={() => onNavigate('cursos')}
              className="hidden sm:block text-primary-500 hover:text-primary-600 font-semibold"
            >
              Ver todos →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} onNavigate={onNavigate} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => onNavigate('cursos')}
              className="text-primary-500 hover:text-primary-400 font-semibold"
            >
              Ver todos os cursos →
            </button>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-beige-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-500 dark:text-gray-400 mb-2">Últimas Postagens</h2>
              <p className="text-secondary-400">Reflexões e ensinamentos para sua vida espiritual</p>
            </div>
            <button
              onClick={() => onNavigate('postagens')}
              className="hidden sm:block text-primary-500 hover:text-primary-600 font-semibold"
            >
              Ver todas →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map(post => (
              <PostCard key={post.id} post={post} onNavigate={onNavigate} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => onNavigate('postagens')}
              className="text-primary-500 hover:text-primary-400 font-semibold"
            >
              Ver todas as postagens →
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Faça Parte da Nossa Comunidade
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Cadastre-se gratuitamente e tenha acesso a conteúdos exclusivos de formação católica.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-primary-500 text-secondary-500 dark:text-gray-400 px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary-600 transition-colors shadow-xl"
          >
            Criar Conta Grátis
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
