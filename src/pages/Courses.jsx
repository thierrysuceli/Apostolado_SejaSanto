import React, { useState } from 'react';
import { dbCourses } from '../data/mockDatabase';
import CourseCard from '../components/CourseCard';

const Courses = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(dbCourses.map(c => c.category))];

  // Filter courses by category
  const filteredCourses = selectedCategory === 'all' 
    ? dbCourses 
    : dbCourses.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
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

        {/* Category Filter */}
        <div className="mb-8">
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

        {/* Course Count */}
        <div className="mb-6">
          <p className="text-secondary-600 dark:text-gray-300 font-medium">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onNavigate={onNavigate} />
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
