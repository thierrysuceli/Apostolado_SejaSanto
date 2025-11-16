import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';

const AdminArticleCreate = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    editorial_column_id: '',
    status: 'draft',
    published_at: null,
    is_featured: false
  });

  const [availableColumns, setAvailableColumns] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);

  // Carregar colunas editoriais e roles
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadOptions = async () => {
      try {
        const [columnsRes, rolesData] = await Promise.all([
          api.get('/api/public-data?type=editorial-columns'),
          api.admin.roles.getAll()
        ]);
        
        setAvailableColumns(columnsRes.columns || []);
        setAvailableRoles(rolesData.roles || []);
        
        // Pré-selecionar INSCRITO e ADMIN
        const inscritoRole = rolesData.roles.find(r => r.name === 'INSCRITO');
        const adminRole = rolesData.roles.find(r => r.name === 'ADMIN');
        const preSelectedIds = [inscritoRole?.id, adminRole?.id].filter(Boolean);
        setSelectedRoleIds(preSelectedIds);
      } catch (err) {
        console.error('Error loading options:', err);
        setError('Erro ao carregar opções');
      }
    };
    loadOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
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

  const handleImageUpload = (url) => {
    setFormData(prev => ({ ...prev, cover_image_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.content || !formData.cover_image_url || !formData.editorial_column_id) {
        throw new Error('Preencha todos os campos obrigatórios (título, conteúdo, imagem de capa e coluna editorial)');
      }

      if (selectedRoleIds.length === 0) {
        throw new Error('Selecione pelo menos uma permissão de visualização');
      }

      // Set published_at if status is published and not already set
      const articleData = { 
        ...formData,
        visibilityRoles: selectedRoleIds
      };
      
      if (articleData.status === 'published' && !articleData.published_at) {
        articleData.published_at = new Date().toISOString();
      }

      // Create article
      await api.post('/articles', articleData);

      // Navigate to articles page
      navigate('/artigos');
    } catch (err) {
      console.error('Error creating article:', err);
      setError(err.message || 'Erro ao criar artigo');
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
            onClick={() => navigate('/artigos')}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para Artigos
          </button>
          <h1 className="text-4xl font-bold text-secondary-500 dark:text-gray-400 mb-2">
            Criar Novo Artigo
          </h1>
          <p className="text-secondary-600 dark:text-gray-300">
            Preencha as informações abaixo para criar um novo artigo editorial.
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
                placeholder="Ex: A importância da Liturgia das Horas"
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
                placeholder="a-importancia-da-liturgia-das-horas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Resumo *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Breve resumo do artigo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Coluna Editorial *
              </label>
              <select
                name="editorial_column_id"
                value={formData.editorial_column_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione uma coluna</option>
                {availableColumns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Imagem de Capa * (obrigatória para artigos)
              </label>
              <ImageUploader
                currentImage={formData.cover_image_url}
                onImageUpload={handleImageUpload}
                folder="articles"
              />
              {formData.cover_image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.cover_image_url} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  Data de Publicação
                </label>
                <input
                  type="datetime-local"
                  name="published_at"
                  value={formData.published_at || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-gray-800 cursor-pointer transition-colors w-full">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-secondary-700 dark:text-gray-300">
                    Destacar
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-secondary-500 dark:text-gray-400">Conteúdo *</h2>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              isAdmin={true}
            />
          </div>

          {/* Permissões de Visualização */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-secondary-500 dark:text-gray-400">Permissões de Visualização *</h2>
            <p className="text-sm text-secondary-600 dark:text-gray-400">Selecione quais roles podem ver este artigo:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableRoles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="flex-1 text-sm font-medium text-secondary-700 dark:text-gray-300">
                    {role.display_name}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/artigos')}
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
              {loading ? 'Criando...' : 'Criar Artigo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminArticleCreate;
