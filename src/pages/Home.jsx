import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import CourseCard from '../components/CourseCard';
import PostCard from '../components/PostCard';

const Home = () => {
  const api = useApi();
  const [courses, setCourses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [coursesData, postsData] = await Promise.all([
          api.courses.getAll(),
          api.posts.getAll()
        ]);
        
        // Show only first 3 of each
        setCourses(coursesData.courses?.slice(0, 3) || []);
        setPosts(postsData.posts?.slice(0, 3) || []);
      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Erro ao carregar conteúdo');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent dark:bg-transparent" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <img 
              src="/Apostolado_PNG.png"
              alt="Apostolado Seja Santo" 
              className="w-32 h-32 drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-700 dark:text-gray-200 mb-6">
            Apostolado
            <span className="block text-primary-600 dark:text-primary-500">Seja Santo</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-primary-700 dark:text-primary-500 italic mb-8 max-w-3xl mx-auto font-semibold">
            "Quem quer ser santo, deve procurar cada dia dar alguns passos no caminho da santificação." - Santo Afonso de Ligório 
          </p>
          
          <p className="text-secondary-600 dark:text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Cursos, formação e conteúdos para aprofundar sua fé e conhecimento da doutrina católica.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl text-center"
            >
              Explorar Cursos
            </Link>
            <Link
              to="/calendar"
              className="bg-white dark:bg-gray-800 border-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg text-center"
            >
              Ver Calendário
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-beige-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-gray-100 mb-2">Cursos em Destaque</h2>
              <p className="text-secondary-600 dark:text-gray-300">Conteúdos de formação católica de qualidade</p>
            </div>
            <Link
              to="/courses"
              className="hidden sm:block text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 font-semibold transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <p className="col-span-3 text-center text-secondary-600 dark:text-gray-300">
                Nenhum curso disponível no momento
              </p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/courses"
              className="text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 font-semibold transition-colors"
            >
              Ver todos os cursos →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-beige-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-gray-100 mb-2">Últimas Postagens</h2>
              <p className="text-secondary-600 dark:text-gray-300">Reflexões e ensinamentos para sua vida espiritual</p>
            </div>
            <Link
              to="/posts"
              className="hidden sm:block text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 font-semibold transition-colors"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <p className="col-span-3 text-center text-secondary-600 dark:text-gray-300">
                Nenhuma postagem disponível no momento
              </p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/posts"
              className="text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 font-semibold transition-colors"
            >
              Ver todas as postagens →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary-900 to-secondary-950 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-gray-100 mb-6">
            Faça Parte da Nossa Comunidade
          </h2>
          <p className="text-beige-200 dark:text-gray-300 text-lg mb-8">
            Cadastre-se gratuitamente e tenha acesso a conteúdos exclusivos de formação católica.
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-colors shadow-xl"
          >
            Criar Conta Grátis
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
