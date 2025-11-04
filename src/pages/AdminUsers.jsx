import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import { useNavigate } from 'react-router-dom';
import AdminUserEditModal from '../components/AdminUserEditModal';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const api = useContext(ApiContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll para o topo ao carregar
    if (!user) {
      navigate('/');
      return;
    }
    // Verificar se tem role ADMIN
    const isAdmin = user.roles?.some(r => r.name === 'ADMIN') || false;
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        api.admin.users.getAll(), // Usar endpoint admin para pegar TODOS os usuários
        api.admin.roles.getAll() // Usar endpoint admin para pegar TODAS as roles com permissões
      ]);
      console.log('Users loaded:', usersData.users?.length);
      console.log('Roles loaded:', rolesData.roles?.length);
      setUsers(usersData.users || usersData || []);
      setRoles(rolesData.roles || rolesData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Erro ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    console.log('Editing user:', user);
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveUserEdit = async ({ userId, roles: selectedRoles, isActive }) => {
    try {
      console.log('Saving user roles:', { userId, roles: selectedRoles, isActive });
      
      // Atualizar roles
      await api.admin.users.assignRoles(userId, selectedRoles);
      
      // Atualizar status se necessário
      if (isActive !== editingUser.is_active) {
        await api.admin.users.update(userId, { is_active: isActive });
      }
      
      alert('Usuário atualizado com sucesso!');
      setShowEditModal(false);
      setEditingUser(null);
      await loadData();
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Erro ao salvar usuário: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      await api.admin.users.delete(userId);
      alert('Usuário deletado com sucesso!');
      await loadData();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Erro ao deletar usuário: ' + err.message);
    }
  };

  const getRoleColor = (roleName) => {
    const colors = {
      'ADMIN': 'bg-red-500',
      'INSCRITO': 'bg-blue-500',
      'VISITANTE': 'bg-gray-500'
    };
    return colors[roleName] || 'bg-amber-500';
  };

  // Filtrar usuários por pesquisa
  const filteredUsers = users.filter(user => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            Gerenciar Usuários
          </h1>
          <p className="text-secondary-600 dark:text-gray-400">
            Gerencie usuários e atribua múltiplas roles/permissões. Novos usuários se cadastram via formulário de registro.
          </p>
        </div>

        {/* Users Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-secondary-900 dark:text-white text-lg truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-xs text-secondary-500 dark:text-gray-500 mb-2">Roles:</p>
                <div className="flex flex-wrap gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <span
                        key={role.id}
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(role.name)}`}
                      >
                        {role.display_name || role.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">Sem roles atribuídas</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-secondary-100 dark:border-gray-800">
                <span className="text-xs text-secondary-500 dark:text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-12 text-center">
              <p className="text-secondary-500 dark:text-gray-400">
                Nenhum usuário cadastrado
              </p>
            </div>
          )}
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden md:block bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">
                  Roles
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">
                  Criado em
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-secondary-900 dark:text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-gray-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-secondary-900 dark:text-white">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span
                            key={role.id}
                            className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(role.name)}`}
                          >
                            {role.display_name || role.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">Sem roles</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary-600 dark:text-gray-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary-500 dark:text-gray-400">
                Nenhum usuário cadastrado
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-secondary-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Edit User Modal */}
      <AdminUserEditModal
        show={showEditModal}
        user={editingUser}
        roles={roles}
        onSave={handleSaveUserEdit}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
      />
    </div>
  );
};

export default AdminUsers;
