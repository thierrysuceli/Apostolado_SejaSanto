import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';
import TableOfContents from '../components/TableOfContents';

// Helper para converter ISO datetime para formato datetime-local
const formatDateTimeLocal = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    // Formato: YYYY-MM-DDTHH:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    return '';
  }
};

const AdminNovenaCreate = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    editorial_column_id: '',
    status: 'published',
    published_at: formatDateTimeLocal(new Date().toISOString()),
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
        setLoading(true);
        const [columnsRes, rolesData] = await Promise.all([
          api.get('/api/public-data?type=editorial-columns'),
          api.admin.roles.getAll()
        ]);
        
        setAvailableColumns(columnsRes.columns || []);
        setAvailableRoles(rolesData.roles || []);
        
        // Se está editando, carregar dados da novena
        if (editId) {
          try {
            const novenaData = await api.get(`/api/content?type=novenas&id=${editId}`);
            if (novenaData && novenaData.novena) {
              const novena = novenaData.novena;
              console.log('📝 [EDIT] Novena loaded:', novena);
              console.log('📝 [EDIT] editorial_column_id:', novena.editorial_column_id);
              console.log('📝 [EDIT] allowed_role_ids:', novena.allowed_role_ids);
              
              setFormData({
                title: novena.title || '',
                slug: novena.slug || '',
                excerpt: novena.excerpt || '',
                content: novena.content || '',
                cover_image_url: novena.cover_image_url || '',
                editorial_column_id: novena.editorial_column_id || '',
                status: novena.status || 'draft',
                published_at: formatDateTimeLocal(novena.published_at),
                is_featured: novena.is_featured || false
              });
              
              // Garantir que roles são carregadas corretamente
              const roleIds = novena.allowed_role_ids || [];
              console.log('📝 [EDIT] Setting selectedRoleIds:', roleIds);
              setSelectedRoleIds(roleIds);
            }
          } catch (err) {
            console.error('Error loading novena:', err);
            console.error('Error response:', err.response);
            const errorMsg = err.response?.data?.message || err.message || 'Erro desconhecido';
            const errorDetails = err.response?.data?.details;
            setError('Erro ao carregar novena: ' + errorMsg + (errorDetails ? ' - ' + errorDetails : ''));
          }
        } else {
          // Pré-selecionar INSCRITO e ADMIN apenas para novas novenas
          const inscritoRole = rolesData.roles.find(r => r.name === 'INSCRITO');
          const adminRole = rolesData.roles.find(r => r.name === 'ADMIN');
          const preSelectedIds = [inscritoRole?.id, adminRole?.id].filter(Boolean);
          setSelectedRoleIds(preSelectedIds);
          // Garantir valores padrão para nova novena
          setFormData(prev => ({
            ...prev,
            status: 'published',
            published_at: formatDateTimeLocal(new Date().toISOString()),
            is_featured: false
          }));
        }
      } catch (err) {
        console.error('Error loading options:', err);
        setError('Erro ao carregar opções: ' + (err.message || 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, [editId]);

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
      if (!formData.title || !formData.slug || !formData.content || !formData.cover_image_url) {
        throw new Error('Preencha todos os campos obrigatórios (título, conteúdo e imagem de capa)');
      }

      if (selectedRoleIds.length === 0) {
        throw new Error('Selecione pelo menos uma permissão de visualização');
      }

      // Set published_at if status is published and not already set
      const novenaData = { 
        ...formData,
        // Converter string vazia para null
        editorial_column_id: formData.editorial_column_id || null,
        visibilityRoles: selectedRoleIds
      };
      
      if (novenaData.status === 'published' && !novenaData.published_at) {
        novenaData.published_at = new Date().toISOString();
      }

      // Criar ou atualizar novena
      if (editId) {
        await api.put(`/api/content?type=novenas&id=${editId}`, novenaData);
        alert('Novena atualizada com sucesso!');
      } else {
        await api.post('/api/content?type=novenas', novenaData);
        alert('Novena criada com sucesso!');
      }
      
      navigate('/novenas');
    } catch (err) {
      console.error('Error creating novena:', err);
      setError(err.message || 'Erro ao criar novena');
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
            onClick={() => navigate('/novenas')}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para Novenas
          </button>
          <h1 className="text-4xl font-bold text-secondary-500 dark:text-gray-400 mb-2">
            {editId ? 'Editar Novena' : 'Criar Nova Novena'}
          </h1>
          <p className="text-secondary-600 dark:text-gray-300">
            {editId ? 'Atualize as informações da novena abaixo.' : 'Preencha as informações abaixo para criar uma nova novena.'}
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
                placeholder="Ex: Novena a Nossa Senhora das Graças"
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
                placeholder="novena-nossa-senhora-das-gracas"
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
                placeholder="Breve resumo da novena..."
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
                Imagem de Capa * (obrigatória para novenas)
              </label>
              <ImageUploader
                currentImage={formData.cover_image_url}
                onImageUpload={handleImageUpload}
                folder="novenas"
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

          {/* Content with Preview Toggle */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-secondary-500 dark:text-gray-400">Conteúdo *</h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                {showPreview ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modo Edição
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Preview
                  </>
                )}
              </button>
            </div>

            {!showPreview ? (
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                isAdmin={true}
              />
            ) : (
              // Preview Layout com TOC (replicando layout da leitura)
              <div className="bg-gray-50 dark:bg-gray-950 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 min-h-[600px]">
                <div className="lg:flex lg:justify-center lg:gap-6 lg:max-w-[1600px] lg:mx-auto">
                  {/* Table of Contents - Esquerda (box separada) */}
                  <div className="lg:w-64 xl:w-72 lg:flex-shrink-0">
                    <div className="lg:sticky lg:top-6">
                      <TableOfContents content={formData.content} />
                    </div>
                  </div>

                  {/* Content Preview - Direita (box branca separada) */}
                  <div className="w-full lg:max-w-4xl lg:flex-shrink-0 mt-6 lg:mt-0">
                    <article className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 md:p-12 border-2 border-gray-200 dark:border-gray-700">
                      {/* Title */}
                      <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-6">
                        {formData.title || 'Título da Novena'}
                      </h1>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formData.published_at ? new Date(formData.published_at).toLocaleDateString('pt-BR') : 'Data não definida'}
                        </span>
                        <span>•</span>
                        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-semibold">
                          {availableColumns.find(c => c.id === formData.editorial_column_id)?.name || 'Sem coluna'}
                        </span>
                      </div>

                      {/* Content */}
                      <div 
                        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-img:rounded-xl prose-img:shadow-lg prose-a:text-primary-600 dark:prose-a:text-primary-400"
                        dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-500 italic">O conteúdo aparecerá aqui...</p>' }}
                      />
                    </article>
                  </div>

                  {/* Espaçador direito (balanceia o layout como na leitura) */}
                  <div className="hidden lg:block lg:w-72 xl:w-80 lg:flex-shrink-0"></div>
                </div>
              </div>
            )}
          </div>

          {/* Permissões de Visualização */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-secondary-500 dark:text-gray-400">Permissões de Visualização *</h2>
            <p className="text-sm text-secondary-600 dark:text-gray-400">Selecione quais roles podem ver esta novena:</p>
            
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
              onClick={() => navigate('/novenas')}
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
              {loading ? (editId ? 'Atualizando...' : 'Criando...') : (editId ? 'Atualizar Novena' : 'Criar Novena')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNovenaCreate;
