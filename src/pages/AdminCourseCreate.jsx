import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import ImageUploader from '../components/ImageUploader';

const AdminCourseCreate = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [availableThematicTags, setAvailableThematicTags] = useState([]);
  const [selectedThematicTagIds, setSelectedThematicTagIds] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    cover_image_url: '',
    status: 'draft',
  });

  // Carregar roles e tags disponíveis
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll para o topo ao carregar
    const loadOptions = async () => {
      try {
        // Carregar roles disponíveis (usar endpoint admin para pegar TODAS)
        const rolesData = await api.admin.roles.getAll();
        setAvailableRoles(rolesData.roles || []);
        
        // Pré-selecionar INSCRITO e ADMIN
        const inscritorole = rolesData.roles.find(r => r.name === 'INSCRITO');
        const adminRole = rolesData.roles.find(r => r.name === 'ADMIN');
        const preSelectedIds = [inscritorole?.id, adminRole?.id].filter(Boolean);
        setSelectedRoleIds(preSelectedIds);
        
        // Carregar tags temáticas disponíveis (com fallback)
        try {
          const tagsData = await api.tags.getAll();
          setAvailableThematicTags(tagsData.tags || []);
        } catch (tagErr) {
          console.warn('Tags não disponíveis ainda (aplicar migração):', tagErr);
          setAvailableThematicTags([]);
        }
      } catch (err) {
        console.error('Error loading options:', err);
      }
    };
    
    loadOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleRoleToggle = (roleId) => {
    setSelectedRoleIds(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleThematicTagToggle = (tagId) => {
    setSelectedThematicTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.description) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      // Validate tags
      if (selectedRoleIds.length === 0) {
        throw new Error('Selecione pelo menos uma permissão de visualização');
      }

      // Create course with tags
      const courseData = await api.courses.create({
        ...formData,
        tags: selectedRoleIds,
        thematicTags: selectedThematicTagIds
      });
      const courseId = courseData.course.id;

      // Navigate to module management page
      navigate(`/admin/courses/${courseId}/modules`);
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.message || 'Erro ao criar curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/courses')}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para Cursos
          </button>
          <h1 className="text-4xl font-bold text-secondary-500 dark:text-gray-400 mb-2">
            Criar Novo Curso
          </h1>
          <p className="text-secondary-600 dark:text-gray-300">
            Preencha as informações abaixo para criar um novo curso.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-secondary-500 dark:text-gray-400">Informações Básicas</h2>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Introdução à Fé Católica"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Slug (URL amigável) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="introducao-fe-catolica"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Descrição *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Descreva o curso..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Imagem de Capa *
              </label>
              <ImageUploader
                currentImageUrl={formData.cover_image_url}
                onImageUploaded={(url) => setFormData({ ...formData, cover_image_url: url })}
                folder="course-covers"
              />
              <p className="text-xs text-secondary-500 dark:text-gray-400 mt-1">
                Formatos aceitos: JPG, PNG, GIF, WEBP (máx. 5MB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

          {/* Permissions / Tags */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-secondary-500 dark:text-gray-400">
              Quem Pode Ver Este Curso? *
            </h2>
            <p className="text-sm text-secondary-600 dark:text-gray-400 mb-4">
              Selecione os níveis de acesso que poderão visualizar este curso
            </p>
            
            <div className="space-y-3">
              {availableRoles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-secondary-900 dark:text-gray-200">
                        {role.display_name || role.name}
                      </span>
                      {role.color && (
                        <span
                          className="px-2 py-1 text-xs rounded"
                          style={{ backgroundColor: role.color + '20', color: role.color }}
                        >
                          {role.name}
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            {selectedRoleIds.length === 0 && (
              <p className="text-sm text-red-500 mt-2">
                ⚠️ Selecione pelo menos uma permissão
              </p>
            )}
          </div>

          {/* Thematic Tags */}
          {availableThematicTags.length > 0 && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-secondary-500 dark:text-gray-400">
                Temas do Curso
              </h2>
              <p className="text-sm text-secondary-600 dark:text-gray-400 mb-4">
                Selecione os temas relacionados ao conteúdo deste curso (opcional)
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableThematicTags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center p-3 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedThematicTagIds.includes(tag.id)}
                      onChange={() => handleThematicTagToggle(tag.id)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-secondary-900 dark:text-gray-200">
                          {tag.name}
                        </span>
                        {tag.color && (
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: tag.color }}
                            title={tag.name}
                          />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Info sobre módulos */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  📚 Adicionar Módulos e Aulas
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Após criar o curso, você será direcionado para a página de gerenciamento de módulos e tópicos, onde poderá estruturar todo o conteúdo do curso.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCourseCreate;
