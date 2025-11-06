import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';

const AdminPostEdit = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    status: 'draft',
    published_at: null
  });

  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [availableThematicTags, setAvailableThematicTags] = useState([]);
  const [selectedThematicTagIds, setSelectedThematicTagIds] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Carregar roles disponíveis
        const rolesData = await api.admin.roles.getAll();
        setAvailableRoles(rolesData.roles || []);
        
        // Carregar tags temáticas
        try {
          const tagsData = await api.tags.getAll();
          setAvailableThematicTags(tagsData.tags || []);
        } catch (tagErr) {
          console.warn('Tags não disponíveis:', tagErr);
        }
        
        // Carregar post
        const data = await api.posts.getById(id);
        const post = data.post;
        
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          cover_image_url: post.cover_image_url || '',
          status: post.status || 'draft',
          published_at: post.published_at ? post.published_at.substring(0, 16) : ''
        });

        // Carregar tags/roles selecionadas
        if (post.post_tags && post.post_tags.length > 0) {
          const roleIds = post.post_tags.map(tag => tag.role_id);
          setSelectedRoleIds(roleIds);
        }
        
        // Carregar tags temáticas selecionadas
        if (post.post_content_tags && post.post_content_tags.length > 0) {
          const tagIds = post.post_content_tags.map(ct => ct.tag_id);
          setSelectedThematicTagIds(tagIds);
        }

      } catch (err) {
        console.error('Error loading post:', err);
        setError('Erro ao carregar postagem');
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

  const handleThematicTagToggle = (tagId) => {
    setSelectedThematicTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleImageUpload = (url) => {
    setFormData(prev => ({ ...prev, cover_image_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.content) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      // Validate tags
      if (selectedRoleIds.length === 0) {
        throw new Error('Selecione pelo menos uma permissão de visualização');
      }

      // Update post with tags
      const postData = { ...formData };
      if (postData.status === 'published' && !postData.published_at) {
        postData.published_at = new Date().toISOString();
      }
      postData.tags = selectedRoleIds;
      postData.thematicTags = selectedThematicTagIds;

      await api.posts.update(id, postData);

      // Navigate to post detail
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.message || 'Erro ao atualizar postagem');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando postagem...</p>
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
            onClick={() => navigate('/posts')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Voltar para Postagens
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
            onClick={() => navigate(`/posts/${id}`)}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para a Postagem
          </button>
          <h1 className="text-4xl font-bold text-secondary-500 dark:text-gray-400 mb-2">
            Editar Postagem
          </h1>
          <p className="text-secondary-600 dark:text-gray-300">
            Edite as informações da postagem abaixo.
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
                placeholder="Ex: Bem-vindo ao Apostolado"
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
                placeholder="bem-vindo-apostolado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Resumo
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Breve resumo da postagem..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Imagem de Capa
              </label>
              <ImageUploader
                currentImage={formData.cover_image_url}
                onImageUpload={handleImageUpload}
                folder="posts"
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

            <div className="grid grid-cols-2 gap-4">
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

          {/* Permissions / Tags */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-secondary-500 dark:text-gray-400">
              Quem Pode Ver Este Post? *
            </h2>
            <p className="text-sm text-secondary-600 dark:text-gray-400 mb-4">
              Selecione os níveis de acesso que poderão visualizar esta postagem
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

          {/* Tags Temáticas */}
          {availableThematicTags.length > 0 && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-secondary-500 dark:text-gray-400">Tags Temáticas</h2>
              <p className="text-sm text-secondary-600 dark:text-gray-400">Categorize o conteúdo da postagem:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableThematicTags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedThematicTagIds.includes(tag.id)}
                      onChange={() => handleThematicTagToggle(tag.id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-700 dark:text-gray-300">
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/posts/${id}`)}
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

export default AdminPostEdit;
