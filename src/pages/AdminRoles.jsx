import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import { useNavigate } from 'react-router-dom';

const AdminRoles = () => {
  const { user } = useContext(AuthContext);
  const api = useContext(ApiContext);
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  
  const [roleForm, setRoleForm] = useState({
    name: '',
    display_name: '',
    description: '',
    color: '#6B7280',
    permissions: []
  });

  const predefinedColors = [
    { name: 'Cinza', value: '#6B7280' },
    { name: 'Vermelho', value: '#DC2626' },
    { name: 'Laranja', value: '#EA580C' },
    { name: 'Âmbar', value: '#D97706' },
    { name: 'Amarelo', value: '#CA8A04' },
    { name: 'Verde', value: '#16A34A' },
    { name: 'Azul', value: '#2563EB' },
    { name: 'Índigo', value: '#4F46E5' },
    { name: 'Roxo', value: '#9333EA' },
    { name: 'Rosa', value: '#DB2777' }
  ];

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
    loadRoles();
  }, [user, navigate]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const [rolesData, permsData] = await Promise.all([
        api.admin.roles.getAll(),
        api.admin.permissions.getAll()
      ]);
      console.log('Roles data:', rolesData);
      console.log('Permissions data:', permsData);
      setRoles(rolesData.roles || rolesData || []);
      setPermissions(permsData.permissions || []);
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Erro ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleForm({
      name: '',
      display_name: '',
      description: '',
      color: '#6B7280',
      permissions: []
    });
    setShowModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
      color: role.color || '#6B7280',
      permissions: role.permissions?.map(p => p.id) || []
    });
    setShowModal(true);
  };

  const handlePermissionToggle = (permId) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(id => id !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const handleSaveRole = async () => {
    try {
      if (!roleForm.name.trim() || !roleForm.display_name.trim()) {
        alert('Nome e nome de exibição são obrigatórios');
        return;
      }

      // Validate name format (uppercase, no spaces)
      const namePattern = /^[A-Z_]+$/;
      if (!namePattern.test(roleForm.name)) {
        alert('O nome deve ser em MAIÚSCULAS e sem espaços (use underscore se necessário)');
        return;
      }

      if (editingRole) {
        await api.admin.roles.update(editingRole.id, roleForm);
      } else {
        await api.admin.roles.create(roleForm);
      }

      setShowModal(false);
      await loadRoles();
    } catch (err) {
      console.error('Error saving role:', err);
      alert('Erro ao salvar role: ' + err.message);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm('Tem certeza que deseja deletar esta role? Usuários com esta role podem perder acesso.')) {
      return;
    }

    try {
      await api.admin.roles.delete(roleId);
      await loadRoles();
    } catch (err) {
      console.error('Error deleting role:', err);
      alert('Erro ao deletar role: ' + err.message);
    }
  };

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
              Gerenciar Roles
            </h1>
            <p className="text-secondary-600 dark:text-gray-400">
              Configure roles de usuário, cores e permissões
            </p>
          </div>
          <button
            onClick={handleCreateRole}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            + Nova Role
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div
                className="h-3"
                style={{ backgroundColor: role.color || '#6B7280' }}
              ></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">
                      {role.display_name}
                    </h3>
                    <p className="text-xs font-mono text-secondary-500 dark:text-gray-500">
                      {role.name}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: role.color || '#6B7280' }}
                  >
                    {role.display_name}
                  </span>
                </div>

                {role.description && (
                  <p className="text-sm text-secondary-600 dark:text-gray-400 mb-4">
                    {role.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-secondary-100 dark:border-gray-800">
                  <div className="text-xs text-secondary-500 dark:text-gray-500">
                    {role._count?.user_roles || 0} usuários
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Editar
                    </button>
                    {role.name !== 'ADMIN' && role.name !== 'VISITANTE' && (
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Deletar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {roles.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <p className="text-secondary-500 dark:text-gray-400">
              Nenhuma role cadastrada
            </p>
          </div>
        )}
      </div>

      {/* Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-secondary-200 dark:border-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">
                {editingRole ? 'Editar Role' : 'Nova Role'}
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Name (internal) */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  Nome Interno * (MAIÚSCULAS, sem espaços)
                </label>
                <input
                  type="text"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 font-mono"
                  placeholder="NOME_DA_ROLE"
                  disabled={editingRole !== null}
                />
                <p className="text-xs text-secondary-500 dark:text-gray-400 mt-1">
                  {editingRole ? 'O nome interno não pode ser alterado' : 'Ex: INSCRITO, PROFESSOR, COORDENADOR'}
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  Nome de Exibição *
                </label>
                <input
                  type="text"
                  value={roleForm.display_name}
                  onChange={(e) => setRoleForm({ ...roleForm, display_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200"
                  placeholder="Nome que aparece na interface"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200"
                  placeholder="Breve descrição das permissões desta role"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-3">
                  Cor *
                </label>
                
                {/* Predefined Colors */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setRoleForm({ ...roleForm, color: color.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        roleForm.color === color.value
                          ? 'border-primary-600 scale-105'
                          : 'border-gray-300 dark:border-gray-700 hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      <div
                        className="w-full h-8 rounded"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <p className="text-xs text-center mt-1 text-secondary-600 dark:text-gray-400">
                        {color.name}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Custom Color */}
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={roleForm.color}
                    onChange={(e) => setRoleForm({ ...roleForm, color: e.target.value })}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={roleForm.color}
                    onChange={(e) => setRoleForm({ ...roleForm, color: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 font-mono"
                    placeholder="#6B7280"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-3">
                  Permissões
                </label>
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                  {permissions.length === 0 && (
                    <p className="text-sm text-secondary-500 dark:text-gray-400 text-center py-4">
                      Nenhuma permissão cadastrada no sistema
                    </p>
                  )}
                  {permissions.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-start gap-3 p-3 hover:bg-secondary-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={roleForm.permissions.includes(perm.id)}
                        onChange={() => handlePermissionToggle(perm.id)}
                        className="mt-0.5 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-secondary-900 dark:text-gray-200 text-sm">
                            {perm.name}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-secondary-200 dark:bg-gray-700 text-secondary-600 dark:text-gray-400 rounded">
                            {perm.category}
                          </span>
                        </div>
                        {perm.description && (
                          <p className="text-xs text-secondary-500 dark:text-gray-400 mt-1">
                            {perm.description}
                          </p>
                        )}
                        <p className="text-xs font-mono text-secondary-400 dark:text-gray-500 mt-1">
                          {perm.code}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-secondary-500 dark:text-gray-400 mt-2">
                  {roleForm.permissions.length} permissão(ões) selecionada(s)
                </p>
              </div>

              {/* Preview */}
              <div className="p-4 bg-secondary-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-secondary-600 dark:text-gray-400 mb-2">Preview:</p>
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: roleForm.color }}
                >
                  {roleForm.display_name || 'Nome da Role'}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-secondary-200 dark:border-gray-800 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 border border-secondary-300 dark:border-gray-700 text-secondary-700 dark:text-gray-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRole}
                className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              >
                {editingRole ? 'Salvar Alterações' : 'Criar Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
