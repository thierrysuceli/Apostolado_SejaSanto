// =====================================================
// MODAL - EDITAR USUÁRIO (Admin)
// Atribuir múltiplas roles a um usuário
// =====================================================

import React, { useState, useEffect } from 'react';

const AdminUserEditModal = ({ show, user, roles, onSave, onClose }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [searchRoles, setSearchRoles] = useState('');

  useEffect(() => {
    if (user) {
      // Inicializar com roles atuais do usuário
      setSelectedRoles(user.roles?.map(r => r.id) || []);
      setIsActive(user.is_active ?? true);
    }
  }, [user]);

  if (!show || !user) return null;

  const handleToggleRole = (roleId) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      userId: user.id,
      roles: selectedRoles,
      isActive
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      'ADMIN': 'bg-red-500',
      'INSCRITO': 'bg-blue-500',
      'VISITANTE': 'bg-gray-500'
    };
    return colors[role.name] || 'bg-amber-500';
  };

  // Filtrar roles por pesquisa
  const filteredRoles = roles.filter(role => {
    if (!searchRoles.trim()) return true;
    const search = searchRoles.toLowerCase();
    return (
      role.name?.toLowerCase().includes(search) ||
      role.display_name?.toLowerCase().includes(search) ||
      role.description?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Editar Usuário</h2>
              <p className="text-gray-400 mt-1">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Status do Usuário */}
            <div className="bg-gray-800 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="text-white font-medium">Usuário Ativo</span>
                  <p className="text-sm text-gray-400">
                    Desative para impedir o acesso do usuário ao sistema
                  </p>
                </div>
              </label>
            </div>

            {/* Roles Atuais */}
            {user.roles && user.roles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Roles Atuais
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map(role => (
                    <span
                      key={role.id}
                      className={`px-3 py-1 rounded-full text-white text-sm ${getRoleColor(role)}`}
                    >
                      {role.display_name || role.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selecionar Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Atribuir Roles (Selecione uma ou mais)
              </label>
              <p className="text-sm text-gray-400 mb-4">
                ⚡ As permissões de todas as roles selecionadas serão combinadas. Se qualquer role tiver uma permissão ativa, o usuário terá acesso.
              </p>

              {/* Search Roles */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Pesquisar roles..."
                  value={searchRoles}
                  onChange={(e) => setSearchRoles(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredRoles.map(role => {
                  const isSelected = selectedRoles.includes(role.id);
                  const isVisitante = role.name === 'VISITANTE';
                  
                  return (
                    <div
                      key={role.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 bg-opacity-10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                      onClick={() => handleToggleRole(role.id)}
                    >
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRole(role.id)}
                          className="mt-1 w-5 h-5 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">
                              {role.display_name || role.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs text-white ${getRoleColor(role)}`}
                            >
                              {role.name}
                            </span>
                            {isVisitante && (
                              <span className="px-2 py-0.5 rounded text-xs bg-gray-600 text-gray-300">
                                Padrão
                              </span>
                            )}
                          </div>
                          {role.description && (
                            <p className="text-sm text-gray-400 mt-1">
                              {role.description}
                            </p>
                          )}
                          {role.permissions && role.permissions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">
                                Permissões ({role.permissions.length}):
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {role.permissions.slice(0, 5).map(perm => (
                                  <span
                                    key={perm.code}
                                    className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                                  >
                                    {perm.name || perm.code}
                                  </span>
                                ))}
                                {role.permissions.length > 5 && (
                                  <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                                    +{role.permissions.length - 5} mais
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info sobre permissões combinadas */}
            {selectedRoles.length > 1 && (
              <div className="bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-blue-300 font-medium">
                      Múltiplas Roles Selecionadas
                    </p>
                    <p className="text-blue-200 text-sm mt-1">
                      Este usuário terá a combinação de todas as permissões das {selectedRoles.length} roles selecionadas. 
                      As permissões não se anulam - elas se somam.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Aviso Visitante */}
            {selectedRoles.length === 0 && (
              <div className="bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-yellow-300 font-medium">
                      Nenhuma Role Selecionada
                    </p>
                    <p className="text-yellow-200 text-sm mt-1">
                      Recomenda-se atribuir ao menos a role "Visitante" para acesso básico ao sistema.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserEditModal;
