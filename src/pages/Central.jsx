// =====================================================
// CENTRAL - Sistema de Grupos por Role (Discord-like)
// =====================================================

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Central = () => {
  const { user, isAuthenticated } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // posts, polls, registrations
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  const [showCreateRegModal, setShowCreateRegModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showEditPollModal, setShowEditPollModal] = useState(false);
  const [showEditRegModal, setShowEditRegModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingPoll, setEditingPoll] = useState(null);
  const [editingReg, setEditingReg] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Verificar se é admin
    const userIsAdmin = user?.roles?.some(r => r.name === 'ADMIN') || false;
    setIsAdmin(userIsAdmin);
    loadGroups();
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (selectedGroup) {
      loadGroupContent();
    }
  }, [selectedGroup, activeTab]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/central/groups');
      const userGroups = response.groups || [];
      setGroups(userGroups);
      
      if (userGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(userGroups[0]);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGroupContent = async () => {
    if (!selectedGroup) return;

    try {
      if (activeTab === 'posts') {
        const response = await api.get(`/api/central/groups/${selectedGroup.id}/posts`);
        setPosts(response.posts || []);
      } else if (activeTab === 'polls') {
        const response = await api.get(`/api/central/groups/${selectedGroup.id}/polls`);
        setPolls(response.polls || []);
      } else if (activeTab === 'registrations') {
        const response = await api.get(`/api/central/groups/${selectedGroup.id}/registrations`);
        setRegistrations(response.registrations || []);
      } else if (activeTab === 'approvals' && isAdmin) {
        const response = await api.get(`/api/central/groups/${selectedGroup.id}/approvals`);
        setPendingApprovals(response.subscriptions || []);
      }
    } catch (error) {
      console.error('Error loading group content:', error);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      console.log('Criando post:', postData);
      const response = await api.post(`/api/central/groups/${selectedGroup.id}/posts`, postData);
      console.log('Post criado:', response);
      setShowCreatePostModal(false);
      loadGroupContent();
      alert('Post criado com sucesso!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error.message || 'Erro ao criar post');
    }
  };

  const handleCreatePoll = async (pollData) => {
    try {
      console.log('Criando enquete:', pollData);
      const response = await api.post(`/api/central/groups/${selectedGroup.id}/polls`, pollData);
      console.log('Enquete criada:', response);
      setShowCreatePollModal(false);
      loadGroupContent();
      alert('Enquete criada com sucesso!');
    } catch (error) {
      console.error('Error creating poll:', error);
      alert(error.message || 'Erro ao criar enquete');
    }
  };

  const handleVotePoll = async (pollId, optionIds) => {
    try {
      await api.post(`/api/central/polls/${pollId}/vote`, { option_ids: optionIds });
      loadGroupContent();
    } catch (error) {
      console.error('Error voting:', error);
      alert(error.response?.data?.error || 'Erro ao votar');
    }
  };

  const handleSubscribeRegistration = async (regId) => {
    try {
      const response = await api.post(`/api/central/registrations/${regId}/subscribe`);
      alert(response.message);
      loadGroupContent();
    } catch (error) {
      console.error('Error subscribing:', error);
      alert(error.response?.data?.error || 'Erro ao se inscrever');
    }
  };

  const handleTogglePin = async (postId, isPinned) => {
    try {
      await api.put(`/api/central/posts/${postId}/pin`, { is_pinned: !isPinned });
      loadGroupContent();
    } catch (error) {
      console.error('Error toggling pin:', error);
      alert('Erro ao fixar/desfixar');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await api.del(`/api/central/posts/${postId}/delete`);
      loadGroupContent();
      alert('Post deletado com sucesso!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error.message || 'Erro ao deletar post');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!confirm('Tem certeza que deseja deletar esta enquete? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await api.del(`/api/central/polls/${pollId}/delete`);
      loadGroupContent();
      alert('Enquete deletada com sucesso!');
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert(error.message || 'Erro ao deletar enquete');
    }
  };

  const handleDeleteRegistration = async (regId) => {
    if (!confirm('Tem certeza que deseja deletar esta inscrição? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await api.del(`/api/central/registrations/${regId}/delete`);
      loadGroupContent();
      alert('Inscrição deletada com sucesso!');
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert(error.message || 'Erro ao deletar inscrição');
    }
  };

  // ==================== HANDLERS DE EDIÇÃO ====================

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditPostModal(true);
  };

  const handleEditPoll = (poll) => {
    setEditingPoll(poll);
    setShowEditPollModal(true);
  };

  const handleEditRegistration = (registration) => {
    setEditingReg(registration);
    setShowEditRegModal(true);
  };

  const handleUpdatePost = async (postData) => {
    try {
      await api.put(`/api/central/posts/${editingPost.id}/edit`, postData);
      setShowEditPostModal(false);
      setEditingPost(null);
      loadGroupContent();
      alert('Post atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error.message || 'Erro ao atualizar post');
    }
  };

  const handleUpdatePoll = async (pollData) => {
    try {
      await api.put(`/api/central/polls/${editingPoll.id}/edit`, pollData);
      setShowEditPollModal(false);
      setEditingPoll(null);
      loadGroupContent();
      alert('Enquete atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating poll:', error);
      alert(error.message || 'Erro ao atualizar enquete');
    }
  };

  const handleUpdateRegistration = async (regData) => {
    try {
      await api.put(`/api/central/registrations/${editingReg.id}/edit`, regData);
      setShowEditRegModal(false);
      setEditingReg(null);
      loadGroupContent();
      alert('Inscrição atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating registration:', error);
      alert(error.message || 'Erro ao atualizar inscrição');
    }
  };

  const handleCreateRegistration = async (data) => {
    try {
      console.log('Criando inscrição:', data);
      const response = await api.post(`/api/central/groups/${selectedGroup.id}/registrations`, data);
      console.log('Inscrição criada:', response);
      setShowCreateRegModal(false);
      loadGroupContent();
      alert('Inscrição criada com sucesso!');
    } catch (error) {
      console.error('Error creating registration:', error);
      alert(error.message || error.response?.data?.error || 'Erro ao criar inscrição');
      throw error; // Re-throw para o modal não limpar o form
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const response = await api.post('/api/central/groups/create', groupData);
      setShowCreateGroupModal(false);
      await loadGroups();
      alert('Grupo criado com sucesso!');
    } catch (error) {
      console.error('Error creating group:', error);
      alert(error.message || 'Erro ao criar grupo');
    }
  };

  const handleApproveSubscription = async (subscriptionId) => {
    try {
      await api.put(`/api/central/subscriptions/${subscriptionId}/approve`, { action: 'approve' });
      loadGroupContent();
      alert('Inscrição aprovada com sucesso!');
    } catch (error) {
      console.error('Error approving subscription:', error);
      alert(error.message || 'Erro ao aprovar inscrição');
    }
  };

  const handleRejectSubscription = async (subscriptionId) => {
    if (!confirm('Tem certeza que deseja rejeitar esta inscrição?')) {
      return;
    }
    
    try {
      await api.put(`/api/central/subscriptions/${subscriptionId}/approve`, { action: 'reject' });
      loadGroupContent();
      alert('Inscrição rejeitada');
    } catch (error) {
      console.error('Error rejecting subscription:', error);
      alert(error.message || 'Erro ao rejeitar inscrição');
    }
  };

  const handleViewMembers = async () => {
    if (!selectedGroup) return;
    
    try {
      const response = await api.get(`/api/central/groups/${selectedGroup.id}/members`);
      setGroupMembers(response.members || []);
      setShowMembersModal(true);
    } catch (error) {
      console.error('Error loading members:', error);
      alert(error.message || 'Erro ao carregar membros');
    }
  };

  const handleRemoveMember = async (userId, roleId) => {
    if (!confirm('Tem certeza que deseja remover este membro do grupo?')) {
      return;
    }
    
    try {
      await api.delete(`/api/central/members/${userId}/remove`, { 
        user_id: userId, 
        role_id: roleId 
      });
      // Recarregar lista de membros
      handleViewMembers();
      alert('Membro removido com sucesso!');
    } catch (error) {
      console.error('Error removing member:', error);
      alert(error.message || 'Erro ao remover membro');
    }
  };

  const getGroupIcon = (group) => {
    return group.icon || '👥';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Carregando Central...</p>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Nenhum Grupo Disponível
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Você ainda não tem acesso a nenhum grupo da central. Entre em contato com um administrador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      {/* Sidebar - Lista de Grupos (estilo Discord) */}
      <div 
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-72 max-w-[80vw] bg-gray-50 dark:bg-gray-950 border-r border-gray-300 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          shadow-lg lg:shadow-none
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Central</h1>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Grupos */}
        <div className="overflow-y-auto overflow-x-hidden h-[calc(100vh-4rem)]">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => {
                setSelectedGroup(group);
                setShowMobileMenu(false);
              }}
              className={`
                w-full px-4 py-3 flex items-center gap-3 transition-all
                ${selectedGroup?.id === group.id
                  ? 'bg-amber-100 dark:bg-amber-500/10 border-l-4 border-amber-500 shadow-sm'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-900 border-l-4 border-transparent'
                }
              `}
            >
              <span className="text-2xl flex-shrink-0">{getGroupIcon(group)}</span>
              <div className="flex-1 text-left min-w-0">
                <p className={`font-medium truncate ${
                  selectedGroup?.id === group.id ? 'text-amber-600 dark:text-amber-500' : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {group.name}
                </p>
                <p className={`text-xs truncate ${
                  selectedGroup?.id === group.id ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {group.role?.display_name}
                </p>
              </div>
            </button>
          ))}

          {/* Botão Criar Novo Grupo (Admin) */}
          {isAdmin && (
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="w-full px-4 py-3 flex items-center gap-3 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all border-t border-gray-300 dark:border-gray-800 mt-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Criar Novo Grupo</span>
            </button>
          )}
        </div>
      </div>

      {/* Overlay Mobile */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white dark:bg-gray-950 border-b border-gray-300 dark:border-gray-800 flex items-center justify-between px-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {selectedGroup && (
              <>
                <span className="text-2xl">{getGroupIcon(selectedGroup)}</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedGroup.name}
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-500">
                    {selectedGroup.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 dark:bg-gray-950 border-b border-gray-300 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 gap-2 lg:gap-0">
            <div className="flex gap-2 lg:gap-4 overflow-x-auto w-full lg:w-auto">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-3 px-2 border-b-2 transition-colors font-medium ${
                  activeTab === 'posts'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                📝 Posts
              </button>
              <button
                onClick={() => setActiveTab('polls')}
                className={`py-3 px-2 border-b-2 transition-colors font-medium ${
                  activeTab === 'polls'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                📊 Enquetes
              </button>
              <button
                onClick={() => setActiveTab('registrations')}
                className={`py-3 px-2 border-b-2 transition-colors font-medium ${
                  activeTab === 'registrations'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                📋 Inscrições
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('approvals')}
                  className={`py-3 px-2 border-b-2 transition-colors font-medium ${
                    activeTab === 'approvals'
                      ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  ✅ Aprovações
                </button>
              )}
            </div>

            {/* Botões Admin (Ver Membros + Criar) */}
            {isAdmin && (
              <div className="flex gap-2 w-full lg:w-auto">
                <button
                  onClick={handleViewMembers}
                  className="flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="hidden lg:inline">Ver Membros</span>
                  <span className="lg:hidden">Membros</span>
                </button>
                <button
                  onClick={() => {
                    if (activeTab === 'posts') setShowCreatePostModal(true);
                    else if (activeTab === 'polls') setShowCreatePollModal(true);
                    else if (activeTab === 'registrations') setShowCreateRegModal(true);
                  }}
                  className="flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm lg:text-base"
                >
                  + Criar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'posts' && (
            <div className="max-w-3xl mx-auto space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">Nenhum post ainda</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-amber-500/10">
                    {/* Header com Badge Fixado e Ações */}
                    <div className="flex items-start justify-between p-4 pb-3 border-b border-gray-200 dark:border-gray-800/50">
                      <div className="flex-1">
                        {post.is_pinned && (
                          <div className="flex items-center gap-2 mb-2 text-amber-500 text-sm font-medium bg-amber-500/10 px-3 py-1 rounded-full w-fit">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.409 1.574 1.232 1.574H6.83l.943-.943a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414l.943.943h-.484c-1.588 0-2.798-1.534-2.24-2.84l.818-2.552a.75.75 0 011.436.459z" />
                            </svg>
                            <span>Fixado</span>
                          </div>
                        )}
                        
                        {/* Info do Autor */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {post.author?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-semibold">{post.author?.name}</p>
                            <p className="text-gray-700 dark:text-gray-400 text-sm">
                              {new Date(post.created_at).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Botões de Ação (Admin) */}
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTogglePin(post.id, post.is_pinned)}
                            className="p-2 text-gray-700 dark:text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                            title={post.is_pinned ? 'Desfixar' : 'Fixar'}
                          >
                            <svg className="w-5 h-5" fill={post.is_pinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-gray-700 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Editar post"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-gray-700 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Deletar post"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Conteúdo do Post */}
                    <div className="p-4">
                      {post.title && (
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{post.title}</h3>
                      )}
                      
                      <div 
                        className="text-gray-700 dark:text-gray-300 prose dark:prose-invert prose-amber max-w-none prose-p:leading-relaxed prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-amber-600 dark:prose-a:text-amber-500 prose-strong:text-gray-900 dark:prose-strong:text-white prose-em:text-gray-700 dark:prose-em:text-gray-200"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'polls' && (
            <div className="max-w-3xl mx-auto space-y-4">
              {polls.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-700 dark:text-gray-400">Nenhuma enquete ainda</p>
                </div>
              ) : (
                polls.map((poll) => (
                  <PollCard 
                    key={poll.id} 
                    poll={poll} 
                    onVote={handleVotePoll}
                    onDelete={handleDeletePoll}
                    onEdit={handleEditPoll}
                    isAdmin={isAdmin}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className="max-w-3xl mx-auto space-y-4">
              {registrations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-700 dark:text-gray-400">Nenhuma inscrição ainda</p>
                </div>
              ) : (
                registrations.map((reg) => (
                  <RegistrationCard
                    key={reg.id}
                    registration={reg}
                    onSubscribe={handleSubscribeRegistration}
                    onDelete={handleDeleteRegistration}
                    onEdit={handleEditRegistration}
                    isAdmin={isAdmin}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'approvals' && isAdmin && (
            <div className="max-w-4xl mx-auto space-y-4">
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhuma aprovação pendente</h3>
                  <p className="text-gray-700 dark:text-gray-400">Todas as inscrições foram processadas!</p>
                </div>
              ) : (
                pendingApprovals.map((sub) => (
                  <div key={sub.id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{sub.registration?.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            👤 {sub.user?.name}
                          </span>
                          <span>•</span>
                          <span>{sub.user?.email}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-semibold border border-yellow-500/30">
                        Pendente
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveSubscription(sub.id)}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleRejectSubscription(sub.id)}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        show={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onSubmit={handleCreatePost}
      />

      <CreatePollModal
        show={showCreatePollModal}
        onClose={() => setShowCreatePollModal(false)}
        onSubmit={handleCreatePoll}
      />

      <CreateRegistrationModal
        show={showCreateRegModal}
        onClose={() => setShowCreateRegModal(false)}
        onSubmit={handleCreateRegistration}
      />

      <CreateGroupModal
        show={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onSubmit={handleCreateGroup}
      />

      {/* Modals de Edição */}
      <CreatePostModal
        show={showEditPostModal}
        onClose={() => {
          setShowEditPostModal(false);
          setEditingPost(null);
        }}
        onSubmit={handleUpdatePost}
        initialData={editingPost}
        isEditing={true}
      />

      <CreatePollModal
        show={showEditPollModal}
        onClose={() => {
          setShowEditPollModal(false);
          setEditingPoll(null);
        }}
        onSubmit={handleUpdatePoll}
        initialData={editingPoll}
        isEditing={true}
      />

      <CreateRegistrationModal
        show={showEditRegModal}
        onClose={() => {
          setShowEditRegModal(false);
          setEditingReg(null);
        }}
        onSubmit={handleUpdateRegistration}
        initialData={editingReg}
        isEditing={true}
      />

      {/* Modal Criar Grupo */}
      <CreateGroupModal
        show={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onSubmit={handleCreateGroup}
      />

      {/* Modal Membros do Grupo */}
      <GroupMembersModal
        show={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        members={groupMembers}
        groupName={selectedGroup?.name || ''}
        onRemoveMember={handleRemoveMember}
      />
    </div>
  );
};

// =====================================================
// COMPONENTE: Poll Card
// =====================================================
const PollCard = ({ poll, onVote, onDelete, onEdit, isAdmin }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleToggleOption = (optionId) => {
    if (poll.user_voted) return;

    if (poll.allow_multiple) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitVote = () => {
    if (selectedOptions.length === 0) return;
    onVote(poll.id, selectedOptions);
  };

  const getPercentage = (option) => {
    if (poll.total_votes === 0) return 0;
    return Math.round((option.votes?.length || 0) / poll.total_votes * 100);
  };

  const isEnded = poll.ends_at && new Date(poll.ends_at) < new Date();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-amber-500/10">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-200 dark:border-gray-800/50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {poll.is_pinned && (
              <div className="flex items-center gap-2 text-amber-500 text-sm font-medium bg-amber-500/10 px-3 py-1 rounded-full w-fit">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.409 1.574 1.232 1.574H6.83l.943-.943a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414l.943.943h-.484c-1.588 0-2.798-1.534-2.24-2.84l.818-2.552a.75.75 0 011.436.459z" />
                </svg>
                <span>Fixado</span>
              </div>
            )}
          </div>

          {/* Botões de Ação (Admin) */}
          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(poll)}
                className="p-2 text-gray-700 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                title="Editar enquete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(poll.id)}
                className="p-2 text-gray-700 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                title="Deletar enquete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{poll.question}</h3>
      
        {poll.description && (
          <p className="text-gray-700 dark:text-gray-400 text-sm mb-3">{poll.description}</p>
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {poll.author?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400 flex-wrap">
            <span className="font-medium text-gray-300">{poll.author?.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {poll.total_votes} votos
            </span>
            {poll.ends_at && (
              <>
                <span>•</span>
                <span className={`flex items-center gap-1 ${isEnded ? 'text-red-400' : 'text-blue-400'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isEnded ? 'Encerrada' : `Até ${new Date(poll.ends_at).toLocaleDateString('pt-BR')}`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Opções */}
      <div className="p-4 space-y-2">
        {poll.options.map((option) => (
          <div key={option.id}>
            {poll.user_voted || isEnded ? (
              // Mostrar resultados
              <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700">
                <div className="flex items-center justify-between p-3 relative z-10">
                  <span className="text-gray-900 dark:text-gray-200 font-medium">{option.text}</span>
                  <span className="text-amber-600 dark:text-amber-500 font-bold text-lg">{getPercentage(option)}%</span>
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-amber-200/50 to-amber-300/30 dark:from-amber-500/30 dark:to-amber-600/20 transition-all duration-500 ease-out"
                  style={{ width: `${getPercentage(option)}%` }}
                />
              </div>
            ) : (
              // Permitir votar
              <button
                onClick={() => handleToggleOption(option.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                  selectedOptions.includes(option.id)
                    ? 'border-amber-500 bg-amber-100 dark:bg-amber-500/20 text-gray-900 dark:text-white shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-gray-300 hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOptions.includes(option.id) ? 'border-amber-500 bg-amber-500' : 'border-gray-400 dark:border-gray-600'
                  }`}>
                    {selectedOptions.includes(option.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 pt-3">
        {!poll.user_voted && !isEnded && (
          <button
            onClick={handleSubmitVote}
            disabled={selectedOptions.length === 0}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-amber-500 disabled:hover:to-amber-600 shadow-lg hover:shadow-amber-500/50 transform hover:scale-[1.02]"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirmar Voto
            </span>
          </button>
        )}

        {poll.user_voted && (
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-500/50 rounded-lg text-green-700 dark:text-green-400 text-sm text-center font-medium">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Você já votou nesta enquete
            </span>
          </div>
        )}

        {isEnded && !poll.user_voted && (
          <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-medium">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Enquete encerrada
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// COMPONENTE: Registration Card
// =====================================================
const RegistrationCard = ({ registration, onSubscribe, onDelete, onEdit, isAdmin }) => {
  const isOpen = registration.is_open && !registration.is_full;
  const canSubscribe = isOpen && !registration.user_subscribed;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-amber-500/10">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-200 dark:border-gray-800/50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {registration.is_pinned && (
              <div className="flex items-center gap-2 mb-2 text-amber-500 text-sm font-medium bg-amber-500/10 px-3 py-1 rounded-full w-fit">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.409 1.574 1.232 1.574H6.83l.943-.943a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414l.943.943h-.484c-1.588 0-2.798-1.534-2.24-2.84l.818-2.552a.75.75 0 011.436.459z" />
                </svg>
                <span>Fixado</span>
              </div>
            )}
          </div>

          {/* Botões de Ação (Admin) */}
          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(registration)}
                className="p-2 text-gray-700 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                title="Editar inscrição"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(registration.id)}
                className="p-2 text-gray-700 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                title="Deletar inscrição"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight flex-1">{registration.title}</h3>
          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
            registration.role_to_grant_info?.color || 'bg-amber-500'
          } text-white shadow-lg`}>
            {registration.role_to_grant_info?.display_name}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">

        <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed">{registration.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-300 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 mb-1 text-xs font-medium">Participantes</p>
            <p className="text-gray-900 dark:text-white font-bold text-lg">
              {registration.approved_count}
              {registration.max_participants && ` / ${registration.max_participants}`}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-300 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 mb-1 text-xs font-medium">Encerra em</p>
            <p className="text-gray-900 dark:text-white font-bold text-lg">
              {new Date(registration.registration_ends).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </p>
          </div>
        </div>

        {registration.approval_type === 'manual' && (
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/50 rounded-lg text-blue-300 text-sm font-medium">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Esta inscrição requer aprovação manual
            </span>
          </div>
        )}

        {registration.user_subscribed ? (
          <div className={`p-3 rounded-lg text-sm text-center font-medium ${
            registration.user_status === 'approved'
              ? 'bg-green-900/20 border border-green-500/50 text-green-400'
              : registration.user_status === 'pending'
              ? 'bg-yellow-900/20 border border-yellow-500/50 text-yellow-400'
              : 'bg-red-900/20 border border-red-500/50 text-red-400'
          }`}>
            {registration.user_status === 'approved' && '✓ Inscrito e aprovado!'}
            {registration.user_status === 'pending' && '⏳ Aguardando aprovação...'}
            {registration.user_status === 'rejected' && '✗ Inscrição rejeitada'}
          </div>
        ) : canSubscribe ? (
          <button
            onClick={() => onSubscribe(registration.id)}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg hover:shadow-amber-500/30"
          >
            Inscrever-se
          </button>
        ) : (
          <div className="p-3 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 text-sm text-center font-medium">
            {registration.is_full ? '🔒 Vagas esgotadas' : '⏰ Inscrições encerradas'}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// MODAL: Criar Post
// =====================================================
const CreatePostModal = ({ show, onClose, onSubmit, initialData = null, isEditing = false }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ title: '', content: '', type: 'post' });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        type: 'post',
        is_pinned: initialData.is_pinned || false
      });
    } else if (!show) {
      setFormData({ title: '', content: '', type: 'post' });
    }
  }, [initialData, isEditing, show]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar se o conteúdo não está vazio (Quill pode retornar HTML vazio)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formData.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (!textContent.trim()) {
      alert('O conteúdo do post não pode estar vazio');
      return;
    }
    
    onSubmit(formData);
    setFormData({ title: '', content: '', type: 'post' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className={`sticky top-0 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b p-6`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{isEditing ? 'Editar Post' : 'Criar Post'}</h2>
            <button onClick={onClose} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Título (Opcional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              placeholder="Título do post..."
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Conteúdo *
            </label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Escreva sua mensagem..."
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'color': [] }, { 'background': [] }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
              style={{ minHeight: '200px' }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} rounded-lg transition-colors`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =====================================================
// MODAL: Criar Enquete
// =====================================================
const CreatePollModal = ({ show, onClose, onSubmit, initialData = null, isEditing = false }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    options: ['', ''],
    allow_multiple: false,
    ends_at: ''
  });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        question: initialData.question || '',
        description: initialData.description || '',
        options: initialData.options?.map(opt => opt.text) || ['', ''],
        allow_multiple: initialData.allow_multiple || false,
        ends_at: initialData.ends_at ? new Date(initialData.ends_at).toISOString().slice(0, 16) : '',
        is_pinned: initialData.is_pinned || false
      });
    } else if (!show) {
      setFormData({ question: '', description: '', options: ['', ''], allow_multiple: false, ends_at: '' });
    }
  }, [initialData, isEditing, show]);

  if (!show) return null;

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) return;
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredOptions = formData.options.filter(opt => opt.trim());
    if (filteredOptions.length < 2) {
      alert('Mínimo 2 opções');
      return;
    }
    onSubmit({ ...formData, options: filteredOptions });
    setFormData({ question: '', description: '', options: ['', ''], allow_multiple: false, ends_at: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className={`sticky top-0 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b p-6`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{isEditing ? 'Editar Enquete' : 'Criar Enquete'}</h2>
            <button onClick={onClose} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Pergunta *</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Opções *</label>
            {formData.options.map((opt, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  className={`flex-1 px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder={`Opção ${idx + 1}`}
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
            >
              + Adicionar opção
            </button>
          </div>

          <div>
            <label className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={formData.allow_multiple}
                onChange={(e) => setFormData({ ...formData, allow_multiple: e.target.checked })}
                className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
              />
              Permitir múltiplas respostas
            </label>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Data de Encerramento</label>
            <input
              type="datetime-local"
              value={formData.ends_at}
              onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className={`px-6 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} rounded-lg transition-colors`}>
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors">
              Criar Enquete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =====================================================
// MODAL: Criar Inscrição
// =====================================================
const CreateRegistrationModal = ({ show, onClose, onSubmit, initialData = null, isEditing = false }) => {
  const { isDark } = useTheme();
  const api = useApi();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role_to_grant: '',
    max_participants: '',
    approval_type: 'automatic',
    registration_ends: ''
  });

  // Carregar roles disponíveis
  useEffect(() => {
    if (show) {
      loadRoles();
    }
  }, [show]);

  // Carregar dados iniciais ao editar
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        role_to_grant: initialData.role_to_grant || '',
        max_participants: initialData.max_participants || '',
        approval_type: initialData.approval_type || 'automatic',
        registration_ends: initialData.registration_ends ? new Date(initialData.registration_ends).toISOString().slice(0, 16) : '',
        is_pinned: initialData.is_pinned || false
      });
    } else if (!show) {
      setFormData({
        title: '',
        description: '',
        role_to_grant: '',
        max_participants: '',
        approval_type: 'automatic',
        registration_ends: ''
      });
    }
  }, [initialData, isEditing, show]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await api.admin.roles.getAll();
      setRoles(response.roles || []);
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
      alert('Erro ao carregar roles');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.role_to_grant || !formData.registration_ends) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const submitData = {
      ...formData,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
    };

    console.log('Enviando inscrição:', submitData);
    
    try {
      await onSubmit(submitData);
      // Só limpa o form se der sucesso
      setFormData({
        title: '',
        description: '',
        role_to_grant: '',
        max_participants: '',
        approval_type: 'automatic',
        registration_ends: ''
      });
    } catch (error) {
      console.error('Erro no submit da inscrição:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className={`sticky top-0 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b p-6`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{isEditing ? 'Editar Inscrição' : 'Criar Inscrição'}</h2>
            <button onClick={onClose} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              placeholder="Ex: Inscrição para Retiro Espiritual"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Descrição *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[100px]`}
              placeholder="Descreva os detalhes da inscrição..."
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Role a Conceder *</label>
            <select
              value={formData.role_to_grant}
              onChange={(e) => setFormData({ ...formData, role_to_grant: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              required
              disabled={loading}
            >
              <option value="">Selecione uma role...</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.display_name || role.name}
                </option>
              ))}
            </select>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Ao ser aprovado, o participante receberá esta role automaticamente
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Máximo de Participantes</label>
            <input
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              placeholder="Deixe vazio para ilimitado"
              min="1"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Tipo de Aprovação *</label>
            <div className="space-y-2">
              <label className={`flex items-start gap-3 p-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded-lg cursor-pointer hover:border-amber-500 transition-colors`}>
                <input
                  type="radio"
                  name="approval_type"
                  value="automatic"
                  checked={formData.approval_type === 'automatic'}
                  onChange={(e) => setFormData({ ...formData, approval_type: e.target.value })}
                  className="mt-1 text-amber-500"
                />
                <div>
                  <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Automática</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Participante recebe a role imediatamente ao se inscrever</div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded-lg cursor-pointer hover:border-amber-500 transition-colors`}>
                <input
                  type="radio"
                  name="approval_type"
                  value="manual"
                  checked={formData.approval_type === 'manual'}
                  onChange={(e) => setFormData({ ...formData, approval_type: e.target.value })}
                  className="mt-1 text-amber-500"
                />
                <div>
                  <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Manual</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Admin precisa aprovar cada inscrição manualmente</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Data de Encerramento *</label>
            <input
              type="datetime-local"
              value={formData.registration_ends}
              onChange={(e) => setFormData({ ...formData, registration_ends: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className={`px-6 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} rounded-lg transition-colors`}>
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors">
              Criar Inscrição
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =====================================================
// MODAL: Criar Grupo
// =====================================================
const CreateGroupModal = ({ show, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    color: 'bg-blue-500'
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.display_name.trim()) {
      alert('Nome e nome de exibição são obrigatórios');
      return;
    }
    onSubmit(formData);
    setFormData({ name: '', display_name: '', description: '', color: 'bg-blue-500' });
  };

  const colors = [
    { value: 'bg-blue-500', label: 'Azul' },
    { value: 'bg-green-500', label: 'Verde' },
    { value: 'bg-red-500', label: 'Vermelho' },
    { value: 'bg-purple-500', label: 'Roxo' },
    { value: 'bg-yellow-500', label: 'Amarelo' },
    { value: 'bg-pink-500', label: 'Rosa' },
    { value: 'bg-indigo-500', label: 'Índigo' },
    { value: 'bg-gray-500', label: 'Cinza' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg max-w-md w-full shadow-2xl`}>
        <div className={`p-6 ${isDark ? 'border-gray-800' : 'border-gray-200'} border-b`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Criar Novo Grupo</h2>
            <button onClick={onClose} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Nome Técnico * (será convertido para maiúsculas e underscores)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              placeholder="ex: ministerio_musica"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Nome de Exibição *
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              placeholder="ex: Ministério de Música"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              rows={3}
              placeholder="Descrição do grupo..."
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Cor da Tag
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`
                    px-3 py-2 rounded-lg text-white text-sm font-medium transition-all
                    ${color.value}
                    ${formData.color === color.value ? `ring-2 ring-offset-2 ${isDark ? 'ring-white ring-offset-gray-900' : 'ring-gray-900 ring-offset-white'}` : 'opacity-50 hover:opacity-100'}
                  `}
                >
                  {color.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className={`flex-1 px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} rounded-lg transition-colors`}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Criar Grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =====================================================
// MODAL: Membros do Grupo
// =====================================================
const GroupMembersModal = ({ show, onClose, members, groupName, onRemoveMember }) => {
  const { isDark } = useTheme();
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl`}>
        {/* Header */}
        <div className={`p-6 ${isDark ? 'border-gray-800' : 'border-gray-200'} border-b`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Membros do Grupo</h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{groupName}</p>
            </div>
            <button onClick={onClose} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista de Membros */}
        <div className="p-6 overflow-y-auto flex-1">
          {members.length === 0 ? (
            <div className="text-center py-12">
              <svg className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Nenhum membro neste grupo ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div 
                  key={`${member.user_id}-${member.role_id}`}
                  className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 flex items-center justify-between border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                      {member.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    
                    {/* Info */}
                    <div>
                      <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{member.user?.name || 'Sem nome'}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{member.user?.email}</p>
                    </div>
                  </div>

                  {/* Botão Remover */}
                  <button
                    onClick={() => onRemoveMember(member.user_id, member.role_id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 ${isDark ? 'border-gray-800' : 'border-gray-200'} border-t`}>
          <div className="flex justify-between items-center">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total: <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{members.length}</span> {members.length === 1 ? 'membro' : 'membros'}
            </p>
            <button 
              onClick={onClose} 
              className={`px-6 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} rounded-lg transition-colors`}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Central;
