import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const api = useApi();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.courses.getAll();
        setCourses(data.courses || []);
        
        // Extrair tags únicas de todos os cursos
        const tagsSet = new Set();
        (data.courses || []).forEach(course => {
          if (course.course_content_tags) {
            course.course_content_tags.forEach(ct => {
              if (ct.tags) {
                tagsSet.add(JSON.stringify(ct.tags));
              }
            });
          }
        });
        const uniqueTags = Array.from(tagsSet).map(t => JSON.parse(t));
        setAvailableTags(uniqueTags);
        
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Erro ao carregar cursos');
      } finally {
        setLoading(false);
      }
    };
    
    loadCourses();
  }, []);

  // Get unique categories from loaded courses
  const categories = ['all', ...new Set(courses.map(c => c.category).filter(Boolean))];

  // Filter courses by category and tag
  let filteredCourses = courses;
  
  if (selectedCategory !== 'all') {
    filteredCourses = filteredCourses.filter(c => c.category === selectedCategory);
  }
  
  if (selectedTag !== 'all') {
    filteredCourses = filteredCourses.filter(c => 
      c.course_content_tags && 
      c.course_content_tags.some(ct => ct.tags && ct.tags.id === selectedTag)
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando cursos...</p>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded-full px-6 py-2 mb-6">
            <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider text-sm">Programas de Formação</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            CURSOS
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Explore nossos programas de formação católica e aprofunde seu conhecimento da fé através de conteúdos exclusivos.
          </p>
          
          {/* Admin Actions */}
          {isAdmin() && (
            <div className="flex justify-center mb-8">
              <button
                onClick={() => navigate('/admin/courses/create')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 rounded-xl font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/50 flex items-center gap-3 transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Novo Programa
              </button>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <label className="block text-gray-700 dark:text-gray-400 font-bold mb-4 text-sm uppercase tracking-wider">Categorias</label>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-white dark:text-black shadow-lg shadow-amber-500/50 scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 hover:border-amber-500/50'
                }`}
              >
                {category === 'all' ? 'Todos os Programas' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <div className="mb-12">
            <label className="block text-gray-700 dark:text-gray-400 font-bold mb-4 text-sm uppercase tracking-wider">Temas</label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedTag === 'all'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700'
                }`}
              >
                Todos os Temas
              </button>
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 ${
                    selectedTag === tag.id
                      ? 'shadow-xl scale-105'
                      : ''
                  }`}
                  style={{
                    backgroundColor: selectedTag === tag.id ? tag.color : `${tag.color}30`,
                    color: selectedTag === tag.id ? '#000' : tag.color,
                    border: `2px solid ${tag.color}`,
                  }}
                  title={tag.description}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Course Count */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          <p className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider text-sm">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'Programa Disponível' : 'Programas Disponíveis'}
          </p>
        </div>

        {/* Courses Grid - Novo Layout tipo "Programas" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">📚</div>
            <p className="text-gray-700 dark:text-gray-400 text-xl font-medium">Nenhum programa encontrado</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Tente ajustar os filtros acima</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
