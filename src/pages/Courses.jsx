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
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary-800 dark:text-gray-100 mb-4">
              Cursos
            </h1>
            <p className="text-xl text-primary-700 dark:text-primary-500 italic mb-2 font-bold">
              "Os que não querem ser vencidos pela verdade, serão vencidos pelo erro."
            </p>
            <p className="text-secondary-600 dark:text-gray-300 max-w-2xl mx-auto text-base">
              Explore nossos cursos de formação católica e aprofunde seu conhecimento da fé.
            </p>
          </div>
          
          {/* Admin Actions */}
          {isAdmin() && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => navigate('/admin/courses/create')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Novo Curso
              </button>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-secondary-700 dark:text-gray-200 font-bold mb-3 text-sm uppercase tracking-wider">Categorias</label>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 hover:bg-beige-100 dark:hover:bg-gray-800 border border-beige-300'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <div className="mb-8">
            <label className="block text-secondary-700 dark:text-gray-200 font-bold mb-3 text-sm uppercase tracking-wider">Filtrar por Tema</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === 'all'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                Todos os Temas
              </button>
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag.id
                      ? 'shadow-lg scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: selectedTag === tag.id ? tag.color : tag.color + '20',
                    color: selectedTag === tag.id ? '#fff' : tag.color,
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
        <div className="mb-6">
          <p className="text-secondary-600 dark:text-gray-300 font-medium">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-secondary-600 dark:text-gray-300 text-lg font-medium">Nenhum curso encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
