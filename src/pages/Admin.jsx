import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const api = useApi();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dashboard data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalCourses: 0,
    totalEvents: 0
  });
  
  // Users data
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  
  // Content data
  const [articles, setArticles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  
  // Inscricoes data
  const [inscricoes, setInscricoes] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [showCreateInscricao, setShowCreateInscricao] = useState(false);
  const [showApprovals, setShowApprovals] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      navigate('/');
    }
  }, [user, authLoading, isAdmin, navigate]);

  // Detectar hash na URL para abrir aba específica
  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove o #
    if (hash && ['dashboard', 'users', 'roles', 'content', 'inscricoes', 'bible-notes'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboard();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'roles') {
      loadRoles();
    } else if (activeTab === 'content') {
      loadContent();
    } else if (activeTab === 'inscricoes') {
      loadInscricoes();
    }
  }, [activeTab]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [usersData, articlesData, coursesData, eventsData] = await Promise.all([
        api.admin.users.getAll(),
        api.get('/api/content?type=articles'),
        api.courses.getAll(),
        api.events.getAll()
      ]);
      
      setStats({
        totalUsers: usersData.users?.length || 0,
        totalArticles: articlesData.articles?.length || 0,
        totalCourses: coursesData.courses?.length || 0,
        totalEvents: eventsData.events?.length || 0
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [usersData, rolesData] = await Promise.all([
        api.admin.users.getAll(),
        api.admin.roles.getAll()
      ]);
      
      setUsers(usersData.users || []);
      setRoles(rolesData.roles || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [rolesData, permissionsData] = await Promise.all([
        api.admin.roles.getAll(),
        api.admin.permissions.getAll()
      ]);
      
      setRoles(rolesData.roles || []);
      setPermissions(permissionsData.permissions || []);
    } catch (err) {
      console.error('Error loading roles:', err);
      setError('Erro ao carregar roles');
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [articlesData, coursesData, eventsData] = await Promise.all([
        api.get('/api/content?type=articles'),
        api.courses.getAll(),
        api.events.getAll()
      ]);
      
      setArticles(articlesData.articles || []);
      setCourses(coursesData.courses || []);
      setEvents(eventsData.events || []);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Erro ao carregar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  const loadInscricoes = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Carregar todas as inscrições públicas (sem grupo)
      const data = await api.registrations.getAll();
      setInscricoes(data.registrations || []);
    } catch (err) {
      console.error('Error loading inscricoes:', err);
      setError('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingApprovals = async () => {
    try {
      const data = await api.registrations.getPendingApprovals();
      setPendingApprovals(data.approvals || []);
    } catch (err) {
      console.error('Error loading pending approvals:', err);
      setPendingApprovals([]);
    }
  };

  const handleApprove = async (participantId) => {
    if (!confirm('Aprovar esta inscrição?')) return;
    
    try {
      await api.registrations.approve(participantId);
      alert('✅ Inscrição aprovada! Cargo atribuído ao usuário.');
      await loadPendingApprovals(); // Recarregar lista
    } catch (err) {
      console.error('Error approving:', err);
      alert('Erro ao aprovar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleReject = async (participantId) => {
    if (!confirm('Rejeitar esta inscrição?')) return;
    
    try {
      await api.registrations.reject(participantId);
      alert('❌ Inscrição rejeitada.');
      await loadPendingApprovals(); // Recarregar lista
    } catch (err) {
      console.error('Error rejecting:', err);
      alert('Erro ao rejeitar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleToggleActive = async (inscricaoId, newStatus) => {
    const action = newStatus ? 'ativar' : 'desativar';
    if (!confirm(`Deseja ${action} esta inscrição?`)) return;
    
    try {
      await api.registrations.adminUpdate(inscricaoId, { is_active: newStatus });
      alert(`✅ Inscrição ${newStatus ? 'ativada' : 'desativada'} com sucesso!`);
      await loadInscricoes();
    } catch (err) {
      console.error('Error toggling active:', err);
      alert('Erro ao atualizar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEditInscricao = (inscricaoId) => {
    navigate(`/admin/inscricoes/edit/${inscricaoId}`);
  };

  const handleDeleteInscricao = async (inscricaoId) => {
    if (!confirm('⚠️ ATENÇÃO: Deletar esta inscrição irá remover TODOS os participantes associados. Deseja continuar?')) return;
    
    try {
      await api.registrations.adminDelete(inscricaoId);
      alert('✅ Inscrição deletada com sucesso!');
      await loadInscricoes();
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Erro ao deletar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleAssignRoles = async (userId, roleIds) => {
    try {
      await api.admin.users.assignRoles(userId, roleIds);
      alert('Roles atribuídas com sucesso!');
      loadUsers();
      setSelectedUser(null);
    } catch (err) {
      console.error('Error assigning roles:', err);
      alert('Erro ao atribuir roles: ' + err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-700 dark:text-gray-200 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-secondary-600 dark:text-gray-300">
            Gerencie usuários, roles, permissões e conteúdo
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-2 mb-8 flex flex-wrap gap-2">
          {['dashboard', 'users', 'roles', 'content', 'inscricoes', 'bible-notes'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                window.location.hash = tab;
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-beige-50 dark:bg-gray-800 text-secondary-600 dark:text-gray-300 hover:bg-beige-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'dashboard' && '📊 Dashboard'}
              {tab === 'users' && '👥 Usuários'}
              {tab === 'roles' && '🔐 Roles & Permissões'}
              {tab === 'content' && '📝 Conteúdo'}
              {tab === 'inscricoes' && '📋 Inscrições'}
              {tab === 'bible-notes' && '📖 Notas Bíblicas'}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon="👥" title="Usuários" value={stats.totalUsers} color="blue" />
              <StatCard icon="📝" title="Artigos" value={stats.totalArticles} color="green" />
              <StatCard icon="🎓" title="Cursos" value={stats.totalCourses} color="purple" />
              <StatCard icon="📅" title="Eventos" value={stats.totalEvents} color="orange" />
            </div>

            {/* Atalhos Rápidos */}
            <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-4">Atalhos Rápidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/admin/tags')}
                  className="flex items-center gap-3 p-4 border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-left"
                >
                  <div className="text-3xl">🏷️</div>
                  <div>
                    <h3 className="font-bold text-amber-700 dark:text-amber-500">Tags Temáticas</h3>
                    <p className="text-sm text-amber-600 dark:text-amber-400">Gerenciar categorias de conteúdo</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/users')}
                  className="flex items-center gap-3 p-4 border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
                >
                  <div className="text-3xl">👥</div>
                  <div>
                    <h3 className="font-bold text-purple-700 dark:text-purple-500">Usuários</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Criar e gerenciar usuários</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/roles')}
                  className="flex items-center gap-3 p-4 border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-left"
                >
                  <div className="text-3xl">🎭</div>
                  <div>
                    <h3 className="font-bold text-indigo-700 dark:text-indigo-500">Roles & Permissões</h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Editar roles e cores</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/editorial-columns')}
                  className="flex items-center gap-3 p-4 border-2 border-pink-500 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors text-left"
                >
                  <div className="text-3xl">📰</div>
                  <div>
                    <h3 className="font-bold text-pink-700 dark:text-pink-500">Colunas Editoriais</h3>
                    <p className="text-sm text-pink-600 dark:text-pink-400">Gerenciar colunas de artigos</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/news-tags')}
                  className="flex items-center gap-3 p-4 border-2 border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors text-left"
                >
                  <div className="text-3xl">#️⃣</div>
                  <div>
                    <h3 className="font-bold text-cyan-700 dark:text-cyan-500">Tags de Notícias</h3>
                    <p className="text-sm text-cyan-600 dark:text-cyan-400">Gerenciar tags de notícias</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/courses/create')}
                  className="flex items-center gap-3 p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
                >
                  <div className="text-3xl">📚</div>
                  <div>
                    <h3 className="font-bold text-blue-700 dark:text-blue-500">Novo Curso</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Criar um novo curso</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/articles/create')}
                  className="flex items-center gap-3 p-4 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
                >
                  <div className="text-3xl">✍️</div>
                  <div>
                    <h3 className="font-bold text-green-700 dark:text-green-500">Novo Artigo</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">Escrever um novo artigo</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/events/create')}
                  className="flex items-center gap-3 p-4 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left"
                >
                  <div className="text-3xl">📅</div>
                  <div>
                    <h3 className="font-bold text-red-700 dark:text-red-500">Novo Evento</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">Criar um novo evento</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-6">Gerenciar Usuários</h2>
            
            {/* Barra de Pesquisa */}
            <div className="mb-6">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-beige-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-beige-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-secondary-600 dark:text-gray-300 font-semibold">Nome</th>
                    <th className="text-left py-3 px-4 text-secondary-600 dark:text-gray-300 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-secondary-600 dark:text-gray-300 font-semibold">Roles</th>
                    <th className="text-left py-3 px-4 text-secondary-600 dark:text-gray-300 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(usr => 
                      usr.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      usr.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(usr => (
                    <tr key={usr.id} className="border-b border-beige-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-secondary-700 dark:text-gray-200">{usr.name}</td>
                      <td className="py-3 px-4 text-secondary-600 dark:text-gray-300">{usr.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {usr.roles?.map(role => (
                            <span key={role.id} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                              {role.display_name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedUser(usr);
                            setUserRoles(usr.roles?.map(r => r.id) || []);
                          }}
                          className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                        >
                          Editar Roles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit User Roles Modal */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-secondary-700 dark:text-gray-200 mb-4">
                    Editar Roles - {selectedUser.name}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    {roles.map(role => (
                      <label key={role.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userRoles.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserRoles([...userRoles, role.id]);
                            } else {
                              setUserRoles(userRoles.filter(id => id !== role.id));
                            }
                          }}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="text-secondary-700 dark:text-gray-200">{role.display_name}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAssignRoles(selectedUser.id, userRoles)}
                      className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="flex-1 bg-beige-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-beige-300 dark:hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-6">Roles do Sistema</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map(role => (
                  <div key={role.id} className="bg-beige-50 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-secondary-700 dark:text-gray-200">{role.display_name}</h3>
                      {role.is_system && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Sistema</span>
                      )}
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-gray-300 mb-3">
                      {role.description || 'Sem descrição'}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-gray-400">
                      {role.permissions?.length || 0} permissões
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-6">Permissões Disponíveis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(permissions.grouped || {}).map(([category, perms]) => (
                  <div key={category} className="bg-beige-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-secondary-700 dark:text-gray-200 mb-3">{category}</h4>
                    <ul className="space-y-2">
                      {perms.map(perm => (
                        <li key={perm.id} className="text-sm text-secondary-600 dark:text-gray-300" title={perm.description}>
                          • {perm.display_name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200">Artigos ({articles.length})</h2>
                <button
                  onClick={() => navigate('/admin/articles/create')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700"
                >
                  + Criar Artigo
                </button>
              </div>
              
              <div className="space-y-3">
                {articles.slice(0, 5).map(article => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-beige-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-secondary-700 dark:text-gray-200">{article.title}</h3>
                      <p className="text-sm text-secondary-600 dark:text-gray-300">
                        Por {article.author?.name} • {new Date(article.published_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/artigos/${article.slug}`)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                    >
                      Ver
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200">Cursos ({courses.length})</h2>
              </div>
              
              <div className="space-y-3">
                {courses.slice(0, 5).map(course => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-beige-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-secondary-700 dark:text-gray-200">{course.title}</h3>
                      <p className="text-sm text-secondary-600 dark:text-gray-300">
                        {course.modules?.length || 0} módulos
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/cursos/${course.slug || course.id}`)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                    >
                      Ver
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200">Eventos ({events.length})</h2>
              </div>
              
              <div className="space-y-3">
                {events.slice(0, 5).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-beige-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-secondary-700 dark:text-gray-200">{event.title}</h3>
                      <p className="text-sm text-secondary-600 dark:text-gray-300">
                        {new Date(event.start_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-semibold">Ver</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inscricoes Tab */}
        {activeTab === 'inscricoes' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200">
                  Inscrições Públicas ({inscricoes.length})
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowApprovals(true);
                      loadPendingApprovals();
                    }}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                  >
                    ⏳ Aprovações Pendentes
                  </button>
                  <button
                    onClick={() => navigate('/admin/inscricoes/create')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    + Criar Inscrição
                  </button>
                </div>
              </div>
              
              {inscricoes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-secondary-600 dark:text-gray-400 mb-4">
                    Nenhuma inscrição criada ainda
                  </p>
                  <button
                    onClick={() => navigate('/admin/inscricoes/create')}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    Criar Primeira Inscrição
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {inscricoes.map(inscricao => {
                    const now = new Date();
                    const starts = new Date(inscricao.registration_starts);
                    const ends = new Date(inscricao.registration_ends);
                    const isOpen = now >= starts && now <= ends && inscricao.is_active;
                    
                    return (
                      <div key={inscricao.id} className="flex items-center justify-between p-4 bg-beige-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-secondary-700 dark:text-gray-200">
                              {inscricao.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              isOpen 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {isOpen ? '🟢 Aberta' : '🔴 Encerrada'}
                            </span>
                            {inscricao.approval_type === 'manual' && (
                              <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                👤 Aprovação Manual
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-secondary-600 dark:text-gray-400">
                            {inscricao.participants_count || 0} inscritos • 
                            Até {new Date(inscricao.registration_ends).toLocaleDateString('pt-BR')}
                          </p>
                          {inscricao.role_to_grant_info && (
                            <div className="mt-2">
                              <span 
                                className="inline-block px-2 py-1 rounded text-xs font-semibold"
                                style={{ 
                                  backgroundColor: `${inscricao.role_to_grant_info.color}20`,
                                  color: inscricao.role_to_grant_info.color 
                                }}
                              >
                                🎭 Cargo: {inscricao.role_to_grant_info.display_name}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/inscricoes/${inscricao.id}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center gap-1"
                            title="Ver detalhes"
                          >
                            👁️ Ver
                          </button>
                          <button
                            onClick={() => handleToggleActive(inscricao.id, !inscricao.is_active)}
                            className={`text-sm font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1 ${
                              inscricao.is_active
                                ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                            title={inscricao.is_active ? 'Desativar' : 'Ativar'}
                          >
                            {inscricao.is_active ? '⏸️ Desativar' : '▶️ Ativar'}
                          </button>
                          <button
                            onClick={() => handleEditInscricao(inscricao.id)}
                            className="text-purple-600 hover:text-purple-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition flex items-center gap-1"
                            title="Editar"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteInscricao(inscricao.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-1"
                            title="Deletar"
                          >
                            🗑️ Deletar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal de Aprovações Pendentes */}
            {showApprovals && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-secondary-700 dark:text-gray-200">
                      ⏳ Aprovações Pendentes
                    </h3>
                    <button
                      onClick={() => setShowApprovals(false)}
                      className="text-secondary-600 hover:text-secondary-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>

                  {pendingApprovals.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">✅</div>
                      <p className="text-secondary-600 dark:text-gray-400">
                        Nenhuma aprovação pendente no momento
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingApprovals.map(approval => (
                        <div key={approval.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-secondary-700 dark:text-gray-200">
                                {approval.user?.name}
                              </p>
                              <p className="text-sm text-secondary-600 dark:text-gray-400">
                                {approval.user?.email}
                              </p>
                              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                                📋 {approval.registration?.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Solicitado em {new Date(approval.created_at).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(approval.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                              >
                                ✓ Aprovar
                              </button>
                              <button
                                onClick={() => handleReject(approval.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                              >
                                ✕ Rejeitar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bible Notes Tab */}
        {activeTab === 'bible-notes' && (
          <div className="bg-white dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6">
            <p className="text-center text-secondary-600 dark:text-gray-400 mb-4">
              Redirecionando para interface completa de Notas Bíblicas...
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/admin/bible-notes')}
                className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition"
              >
                Acessar Gerenciador de Notas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200'
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-6`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-semibold">{title}</div>
    </div>
  );
};

export default Admin;
