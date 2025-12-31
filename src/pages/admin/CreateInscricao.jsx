import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FormQuestionsManager from '../../components/FormQuestionsManager';

const CreateInscricao = () => {
  const navigate = useNavigate();
  const { id: inscricaoId } = useParams(); // Se tem ID, é edição
  const { user, isAdmin } = useAuth();
  const api = useApi();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image_url: '',
    role_to_grant: '',
    max_participants: '',
    approval_type: 'automatic',
    registration_starts: '',
    registration_ends: '',
    is_active: true,
    visible_to_roles: [] // 🆕 Array de role IDs que podem ver a inscrição
  });
  
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!inscricaoId);
  const [error, setError] = useState('');
  const [showNewRole, setShowNewRole] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    display_name: '',
    color: '#f59e0b'
  });

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/');
      return;
    }
    loadRoles();
    
    // Se tem ID, carregar dados da inscrição
    if (inscricaoId) {
      loadInscricao();
    }
  }, [user, isAdmin, navigate, inscricaoId]);

  const loadInscricao = async () => {
    try {
      setLoadingData(true);
      const data = await api.registrations.getById(inscricaoId);
      const inscricao = data.registration;
      
      setFormData({
        title: inscricao.title || '',
        description: inscricao.description || '',
        cover_image_url: inscricao.cover_image_url || '',
        role_to_grant: inscricao.role_to_grant || '',
        max_participants: inscricao.max_participants || '',
        approval_type: inscricao.approval_type || 'automatic',
        registration_starts: inscricao.registration_starts ? new Date(inscricao.registration_starts).toISOString().slice(0, 16) : '',
        registration_ends: inscricao.registration_ends ? new Date(inscricao.registration_ends).toISOString().slice(0, 16) : '',
        is_active: inscricao.is_active !== false,
        visible_to_roles: inscricao.visible_to_roles || [] // 🆕 Carregar visibilidade
      });
    } catch (err) {
      console.error('Error loading inscricao:', err);
      alert('Erro ao carregar inscrição');
      navigate('/admin#inscricoes');
    } finally {
      setLoadingData(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await api.admin.roles.getAll();
      setRoles(data.roles || []);
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.display_name) {
      alert('Preencha nome e nome de exibição da role');
      return;
    }

    try {
      const roleKey = newRole.name.toUpperCase().replace(/\s+/g, '_');
      const response = await api.admin.roles.create({
        name: roleKey,
        display_name: newRole.display_name,
        color: newRole.color,
        description: `Cargo criado via inscrição: ${newRole.display_name}`
      });

      setRoles([...roles, response.role]);
      setFormData({ ...formData, role_to_grant: response.role.id });
      setShowNewRole(false);
      setNewRole({ name: '', display_name: '', color: '#f59e0b' });
      alert('Role criada com sucesso!');
    } catch (err) {
      console.error('Error creating role:', err);
      alert('Erro ao criar role: ' + (err.response?.data?.error || err.message));
    }
  };

  // 🆕 Upload de imagem (converte para URL via upload ou base64 temporário)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }
    
    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 2MB.');
      return;
    }
    
    try {
      setUploadingImage(true);
      
      // Por enquanto, converte para base64 (ideal seria upload para Supabase Storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, cover_image_url: reader.result });
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Erro ao carregar imagem');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Erro ao fazer upload da imagem');
      setUploadingImage(false);
    }
  };
  
  // 🆕 Toggle de role no seletor de visibilidade
  const toggleRoleVisibility = (roleId) => {
    const current = formData.visible_to_roles || [];
    if (current.includes(roleId)) {
      setFormData({ 
        ...formData, 
        visible_to_roles: current.filter(id => id !== roleId) 
      });
    } else {
      setFormData({ 
        ...formData, 
        visible_to_roles: [...current, roleId] 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.role_to_grant) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        title: formData.title,
        description: formData.description,
        cover_image_url: formData.cover_image_url || null,
        role_to_grant: formData.role_to_grant,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        approval_type: formData.approval_type,
        registration_starts: formData.registration_starts || null,
        registration_ends: formData.registration_ends || null,
        is_active: formData.is_active
      };

      if (inscricaoId) {
        // Editar
        await api.registrations.adminUpdate(inscricaoId, payload);
        alert('✅ Inscrição atualizada com sucesso!');
      } else {
        // Criar
        const result = await api.registrations.adminCreate(payload);
        alert('✅ Inscrição criada com sucesso! Agora você pode adicionar perguntas ao formulário.');
        
        // Redirecionar para edição para poder adicionar perguntas
        navigate(`/admin/inscricoes/edit/${result.registration.id}`);
        return;
      }
      
      navigate('/admin#inscricoes');
      
    } catch (err) {
      console.error('Error saving inscricao:', err);
      setError(err.response?.data?.error || 'Erro ao salvar inscrição');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ]
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando inscrição...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{inscricaoId ? 'Editar' : 'Criar'} Inscrição - Admin - Apostolado</title>
      </Helmet>

      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/admin#inscricoes')}
            className="mb-6 text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
          >
            ← Voltar ao Painel
          </button>

          <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-8">
            <h1 className="text-3xl font-bold text-secondary-700 dark:text-gray-200 mb-6">
              {inscricaoId ? '✏️ Editar Inscrição' : '📝 Criar Nova Inscrição'}
            </h1>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: Inscrição para Equipe de Liturgia"
                  required
                />
              </div>

              {/* Imagem de Capa (opcional) */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">
                  Imagem de Capa (opcional)
                </label>
                
                <div className="space-y-3">
                  {/* Upload de arquivo */}
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {uploadingImage ? 'Carregando...' : 'Escolher Arquivo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                    <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                      Máx 2MB (JPG, PNG, GIF)
                    </span>
                  </div>
                  
                  {/* Ou URL direta */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">OU</span>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  
                  <input
                    type="url"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                    placeholder="Colar URL da imagem (https://...)"
                  />
                  
                  {/* Preview */}
                  {formData.cover_image_url && (
                    <div className="relative">
                      <img 
                        src={formData.cover_image_url} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        onError={(e) => {
                          e.target.src = '';
                          e.target.alt = 'Erro ao carregar imagem';
                          e.target.className = 'w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-red-500 text-red-500';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, cover_image_url: '' })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        title="Remover imagem"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição com Quill */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">
                  Descrição *
                </label>
                <div className="bg-white dark:bg-gray-800 rounded-lg">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    modules={quillModules}
                    className="min-h-[300px] text-secondary-700 dark:text-gray-200"
                    placeholder="Descreva a inscrição, requisitos, benefícios, etc..."
                  />
                </div>
              </div>

              {/* Cargo a Conceder */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">
                  Cargo que será concedido *
                </label>
                <div className="flex gap-3">
                  <select
                    value={formData.role_to_grant}
                    onChange={(e) => setFormData({ ...formData, role_to_grant: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Selecione um cargo</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.display_name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewRole(!showNewRole)}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    + Nova Role
                  </button>
                </div>
              </div>

              {/* Modal Nova Role */}
              {showNewRole && (
                <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-bold text-secondary-700 dark:text-gray-200 mb-3">Criar Nova Role</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="Nome técnico (ex: LITURGIA_TEAM)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200"
                    />
                    <input
                      type="text"
                      value={newRole.display_name}
                      onChange={(e) => setNewRole({ ...newRole, display_name: e.target.value })}
                      placeholder="Nome de exibição (ex: Equipe de Liturgia)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200"
                    />
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-secondary-700 dark:text-gray-200">Cor:</label>
                      <input
                        type="color"
                        value={newRole.color}
                        onChange={(e) => setNewRole({ ...newRole, color: e.target.value })}
                        className="w-20 h-10 rounded cursor-pointer"
                      />
                      <span className="text-sm text-secondary-600 dark:text-gray-400">{newRole.color}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCreateRole}
                        className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition"
                      >
                        ✓ Criar Role
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewRole(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-secondary-700 dark:text-gray-200 rounded font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 🆕 Visibilidade por Cargos (opcional) */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">
                  Visibilidade (Quem pode ver a inscrição?)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Se nenhum cargo for selecionado, a inscrição será pública para todos
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  {roles.length === 0 ? (
                    <p className="col-span-full text-sm text-gray-500 dark:text-gray-400">
                      Nenhum cargo disponível
                    </p>
                  ) : (
                    roles.map(role => {
                      const isSelected = (formData.visible_to_roles || []).includes(role.id);
                      return (
                        <label 
                          key={role.id}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                            isSelected 
                              ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500' 
                              : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-primary-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRoleVisibility(role.id)}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <span 
                            className="text-sm font-medium"
                            style={{ color: isSelected ? role.color : undefined }}
                          >
                            {role.display_name}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Tipo de Aprovação */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">
                  Tipo de Aprovação
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="automatic"
                      checked={formData.approval_type === 'automatic'}
                      onChange={(e) => setFormData({ ...formData, approval_type: e.target.value })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-secondary-700 dark:text-gray-200">⚡ Automática (cargo concedido imediatamente)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="manual"
                      checked={formData.approval_type === 'manual'}
                      onChange={(e) => setFormData({ ...formData, approval_type: e.target.value })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-secondary-700 dark:text-gray-200">👤 Manual (admin precisa aprovar)</span>
                  </label>
                </div>
              </div>

              {/* Máximo de Participantes */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">
                  Máximo de Participantes (opcional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                  placeholder="Deixe em branco para sem limite"
                />
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">
                    Início das Inscrições
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.registration_starts}
                    onChange={(e) => setFormData({ ...formData, registration_starts: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-secondary-600 dark:text-gray-400 mt-1">
                    Deixe em branco para iniciar agora
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">
                    Fim das Inscrições
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.registration_ends}
                    onChange={(e) => setFormData({ ...formData, registration_ends: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-secondary-600 dark:text-gray-400 mt-1">
                    Deixe em branco para 30 dias
                  </p>
                </div>
              </div>

              {/* Ativa */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-primary-600"
                  id="is_active"
                />
                <label htmlFor="is_active" className="text-secondary-700 dark:text-gray-200 font-semibold cursor-pointer">
                  Inscrição ativa (visível para usuários)
                </label>
              </div>

              {/* Formulário de Perguntas - Apenas em modo de edição */}
              {inscricaoId && (
                <FormQuestionsManager registrationId={inscricaoId} />
              )}

              {/* Botões */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading 
                    ? (inscricaoId ? 'Salvando...' : 'Criando...') 
                    : (inscricaoId ? '✓ Salvar Alterações' : '✓ Criar Inscrição')
                  }
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin#inscricoes')}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-secondary-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateInscricao;
