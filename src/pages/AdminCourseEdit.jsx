import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import ImageUploader from '../components/ImageUploader';
import RichTextEditor from '../components/RichTextEditor';

const AdminCourseEdit = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    cover_image_url: '',
    status: 'draft',
  });

  const [modules, setModules] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [availableThematicTags, setAvailableThematicTags] = useState([]);
  const [selectedThematicTagIds, setSelectedThematicTagIds] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll para o topo ao carregar
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Carregar roles disponíveis (usar endpoint admin para pegar TODAS)
        const rolesData = await api.admin.roles.getAll();
        setAvailableRoles(rolesData.roles || []);
        
        // Carregar tags temáticas disponíveis (com fallback)
        try {
          const tagsData = await api.tags.getAll();
          setAvailableThematicTags(tagsData.tags || []);
        } catch (tagErr) {
          console.warn('Tags não disponíveis ainda (aplicar migração):', tagErr);
          setAvailableThematicTags([]);
        }
        
        // Carregar curso
        const data = await api.courses.getById(id);
        const course = data.course;
        
        setFormData({
          title: course.title || '',
          slug: course.slug || '',
          description: course.description || '',
          cover_image_url: course.cover_image_url || '',
          status: course.status || 'draft',
        });

        // Carregar módulos
        if (course.modules && course.modules.length > 0) {
          setModules(course.modules.map(m => ({
            id: m.id,
            title: m.title || '',
            description: m.description || '',
            order_index: m.order_index || 0
          })));
        }

        // Carregar tags/roles selecionadas (permissões)
        if (course.course_tags && course.course_tags.length > 0) {
          const roleIds = course.course_tags.map(tag => tag.role_id);
          setSelectedRoleIds(roleIds);
        }

        // Carregar tags temáticas selecionadas
        if (course.course_content_tags && course.course_content_tags.length > 0) {
          const thematicTagIds = course.course_content_tags.map(tag => tag.tag_id);
          setSelectedThematicTagIds(thematicTagIds);
        }

      } catch (err) {
        console.error('Error loading course:', err);
        setError('Erro ao carregar curso');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

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

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules([...modules, { title: '', description: '', order_index: modules.length }]);
  };

  const removeModule = (index) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
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
    setSaving(true);
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

      // Update course with tags
      await api.courses.update(id, {
        ...formData,
        tags: selectedRoleIds,
        thematicTags: selectedThematicTagIds
      });

      // Navigate to course detail
      navigate(`/courses/${id}`);
    } catch (err) {
      console.error('Error updating course:', err);
      setError(err.message || 'Erro ao atualizar curso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Voltar para Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para o Curso
          </button>
          <h1 className="text-4xl font-bold text-secondary-500 dark:text-gray-400 mb-2">
            Editar Curso
          </h1>
          <p className="text-secondary-600 dark:text-gray-300">
            Edite as informações do curso abaixo.
          </p>
          
          {/* Link para gerenciar módulos */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/courses/${id}/modules`)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Gerenciar Módulos e Aulas
            </button>
          </div>
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
                Descrição * (Rich Text)
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                placeholder="Descreva o curso com formatação rica..."
                minHeight="300px"
                isAdmin={true}
              />
              <p className="text-xs text-secondary-500 dark:text-gray-400 mt-1">
                Use o editor acima para formatar o texto: negrito, itálico, listas, links, cores, etc.
              </p>
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
                      <span
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{ 
                          backgroundColor: tag.color + '20', 
                          color: tag.color,
                          border: `1px solid ${tag.color}40`
                        }}
                      >
                        {tag.name}
                      </span>
                    </div>
                    {tag.description && (
                      <p className="text-xs text-secondary-600 dark:text-gray-400 mt-1">
                        {tag.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {availableThematicTags.length === 0 && (
              <p className="text-sm text-secondary-600 dark:text-gray-400 italic">
                Nenhuma tag temática disponível. Configure tags no painel administrativo.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/courses/${id}`)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCourseEdit;
