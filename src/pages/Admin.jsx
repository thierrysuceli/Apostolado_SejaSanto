import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbUsers, dbRoles, dbCourses, dbPosts, dbEvents } from '../data/mockDatabase';
import Modal from '../components/Modal';

const Admin = ({ onNavigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(dbUsers);
  const [roles, setRoles] = useState(dbRoles);
  const [courses, setCourses] = useState(dbCourses);
  const [posts, setPosts] = useState(dbPosts);
  const [events, setEvents] = useState(dbEvents);
  
  const [editingUser, setEditingUser] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newRoleName, setNewRoleName] = useState('');

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-primary-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-3xl font-bold text-secondary-500 mb-4">Acesso Negado</h2>
          <p className="text-secondary-600 mb-6">Você não possui permissões de administrador.</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-md"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  // User Management Functions
  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setModalType('editUser');
    setModalOpen(true);
  };

  const handleToggleUserRole = (role) => {
    if (!editingUser) return;
    const hasRole = editingUser.roles.includes(role);
    const updatedRoles = hasRole
      ? editingUser.roles.filter(r => r !== role)
      : [...editingUser.roles, role];
    setEditingUser({ ...editingUser, roles: updatedRoles });
  };

  const handleSaveUser = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (userId === 0) {
      alert('Não é possível deletar o usuário Admin principal');
      return;
    }
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  // Role Management Functions
  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;
    if (roles.includes(newRoleName)) {
      alert('Esta role já existe');
      return;
    }
    setRoles([...roles, newRoleName]);
    setNewRoleName('');
  };

  const handleDeleteRole = (role) => {
    if (role === 'Admin' || role === 'user') {
      alert('Não é possível deletar roles do sistema');
      return;
    }
    if (window.confirm(`Tem certeza que deseja deletar a role "${role}"?`)) {
      setRoles(roles.filter(r => r !== role));
    }
  };

  // Content Management Functions
  const handleEditContent = (content, type) => {
    setEditingContent({ ...content, contentType: type });
    setModalType('editContent');
    setModalOpen(true);
  };

  const handleToggleContentRole = (role) => {
    if (!editingContent) return;
    const requiredRoles = editingContent.requiredRoles || [];
    const hasRole = requiredRoles.includes(role);
    const updatedRoles = hasRole
      ? requiredRoles.filter(r => r !== role)
      : [...requiredRoles, role];
    setEditingContent({ ...editingContent, requiredRoles: updatedRoles });
  };

  const handleSaveContent = () => {
    const { contentType, ...content } = editingContent;
    if (contentType === 'course') {
      setCourses(courses.map(c => c.id === content.id ? content : c));
    } else if (contentType === 'post') {
      setPosts(posts.map(p => p.id === content.id ? content : p));
    } else if (contentType === 'event') {
      setEvents(events.map(e => e.id === content.id ? content : e));
    }
    setModalOpen(false);
    setEditingContent(null);
  };

  return (
    <div className="min-h-screen bg-beige-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-secondary-500 mb-2">Admin Panel</h1>
          <p className="text-secondary-600">Gerenciamento completo do sistema</p>
        </div>

        {/* Tabs */}
        <div className="bg-beige-100 border border-beige-200 rounded-xl p-2 mb-6 shadow-md">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-secondary-600 hover:text-secondary-500 hover:bg-beige-50'
              }`}
            >
              Usuários
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'content'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-secondary-600 hover:text-secondary-500 hover:bg-beige-50'
              }`}
            >
              Conteúdos
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'roles'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-secondary-600 hover:text-secondary-500 hover:bg-beige-50'
              }`}
            >
              Roles
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'admins'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-secondary-600 hover:text-secondary-500 hover:bg-beige-50'
              }`}
            >
              Admins
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-beige-100 border border-beige-200 rounded-xl p-6 shadow-lg">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Gerenciamento de Usuários</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-beige-200">
                      <th className="text-left py-3 px-4 text-secondary-600 font-semibold">ID</th>
                      <th className="text-left py-3 px-4 text-secondary-600 font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 text-secondary-600 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-secondary-600 font-semibold">Roles</th>
                      <th className="text-left py-3 px-4 text-secondary-600 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-beige-200 hover:bg-white border border-beige-200">
                        <td className="py-4 px-4 text-secondary-700">#{user.id}</td>
                        <td className="py-4 px-4 text-secondary-700">{user.name}</td>
                        <td className="py-4 px-4 text-secondary-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.slice(0, 2).map(role => (
                              <span key={role} className="text-xs bg-primary-600/20 text-primary-700 px-2 py-1 rounded">
                                {role}
                              </span>
                            ))}
                            {user.roles.length > 2 && (
                              <span className="text-xs bg-gray-700 text-secondary-600 px-2 py-1 rounded">
                                +{user.roles.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-primary-700 hover:text-primary-400"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 hover:text-red-400"
                              disabled={user.id === 0}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Gerenciamento de Conteúdo</h2>
              
              {/* Courses */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Cursos</h3>
                <div className="space-y-3">
                  {courses.map(course => (
                    <div key={course.id} className="bg-white border border-beige-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{course.title}</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {course.requiredRoles.length === 0 ? (
                            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Público</span>
                          ) : (
                            course.requiredRoles.map(role => (
                              <span key={role} className="text-xs bg-primary-600/20 text-primary-700 px-2 py-1 rounded">
                                {role}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditContent(course, 'course')}
                        className="text-primary-700 hover:text-primary-400 ml-4"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posts */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Postagens</h3>
                <div className="space-y-3">
                  {posts.map(post => (
                    <div key={post.id} className="bg-white border border-beige-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{post.title}</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.requiredRoles.length === 0 ? (
                            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Público</span>
                          ) : (
                            post.requiredRoles.map(role => (
                              <span key={role} className="text-xs bg-primary-600/20 text-primary-700 px-2 py-1 rounded">
                                {role}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditContent(post, 'post')}
                        className="text-primary-700 hover:text-primary-400 ml-4"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Events */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Eventos</h3>
                <div className="space-y-3">
                  {events.map(event => (
                    <div key={event.id} className="bg-white border border-beige-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{event.title}</h4>
                        <p className="text-secondary-600 text-sm">{event.date} - {event.time}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {event.requiredRoles.length === 0 ? (
                            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Público</span>
                          ) : (
                            event.requiredRoles.map(role => (
                              <span key={role} className="text-xs bg-primary-600/20 text-primary-700 px-2 py-1 rounded">
                                {role}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditContent(event, 'event')}
                        className="text-primary-700 hover:text-primary-400 ml-4"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Gerenciamento de Roles</h2>
              
              {/* Create New Role */}
              <div className="bg-white border border-beige-200 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-3">Criar Nova Role</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Nome da nova role..."
                    className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-primary-500 focus:outline-none"
                  />
                  <button
                    onClick={handleCreateRole}
                    className="bg-primary-600 text-secondary-500 px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                  >
                    Criar
                  </button>
                </div>
              </div>

              {/* Existing Roles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {roles.map(role => (
                  <div
                    key={role}
                    className={`rounded-lg p-4 flex items-center justify-between ${
                      role === 'Admin' || role === 'user'
                        ? 'bg-primary-600/20 border border-primary-500'
                        : 'bg-white border border-beige-200'
                    }`}
                  >
                    <span className={`font-semibold ${
                      role === 'Admin' || role === 'user' ? 'text-primary-700' : 'text-secondary-700'
                    }`}>
                      {role}
                    </span>
                    {role !== 'Admin' && role !== 'user' && (
                      <button
                        onClick={() => handleDeleteRole(role)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    {(role === 'Admin' || role === 'user') && (
                      <span className="text-xs bg-primary-600/20 text-primary-700 px-2 py-1 rounded">Sistema</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === 'admins' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Gerenciamento de Administradores</h2>
              <p className="text-secondary-600 mb-6">
                Conceda ou revogue permissões de administrador para usuários.
              </p>
              <div className="space-y-3">
                {users.map(user => {
                  const isUserAdmin = user.roles.includes('Admin');
                  return (
                    <div key={user.id} className="bg-white border border-beige-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-black font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{user.name}</p>
                          <p className="text-secondary-600 text-sm">{user.email}</p>
                        </div>
                        {isUserAdmin && (
                          <span className="text-xs bg-primary-600 text-secondary-500 px-3 py-1 rounded-full font-semibold">
                            Admin
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const updatedUser = { ...user };
                          if (isUserAdmin) {
                            updatedUser.roles = user.roles.filter(r => r !== 'Admin');
                          } else {
                            updatedUser.roles = [...user.roles, 'Admin'];
                          }
                          setUsers(users.map(u => u.id === user.id ? updatedUser : u));
                        }}
                        disabled={user.id === 0}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          user.id === 0
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : isUserAdmin
                            ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                            : 'bg-primary-600 text-secondary-500 hover:bg-primary-600'
                        }`}
                      >
                        {user.id === 0 ? 'Principal' : isUserAdmin ? 'Revogar Admin' : 'Tornar Admin'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        <Modal
          isOpen={modalOpen && modalType === 'editUser'}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          title="Editar Usuário"
        >
          {editingUser && (
            <div>
              <div className="mb-6">
                <p className="text-white font-semibold text-lg mb-2">{editingUser.name}</p>
                <p className="text-secondary-600">{editingUser.email}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Roles do Usuário</h3>
                <p className="text-secondary-600 text-sm mb-4">
                  Selecione as roles que este usuário possui:
                </p>
                <div className="space-y-2">
                  {roles.map(role => (
                    <label key={role} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingUser.roles.includes(role)}
                        onChange={() => handleToggleUserRole(role)}
                        className="w-5 h-5 rounded bg-white border border-beige-200 border-gray-700 text-primary-700 focus:ring-primary-500"
                      />
                      <span className="text-secondary-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveUser}
                  className="flex-1 bg-primary-600 text-secondary-500 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 bg-white border border-beige-200 text-white py-3 rounded-lg font-semibold hover:bg-beige-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Content Modal */}
        <Modal
          isOpen={modalOpen && modalType === 'editContent'}
          onClose={() => {
            setModalOpen(false);
            setEditingContent(null);
          }}
          title="Editar Permissões de Conteúdo"
        >
          {editingContent && (
            <div>
              <div className="mb-6">
                <p className="text-white font-semibold text-lg mb-2">{editingContent.title}</p>
                <p className="text-secondary-600 text-sm">
                  {editingContent.contentType === 'course' && 'Curso'}
                  {editingContent.contentType === 'post' && 'Postagem'}
                  {editingContent.contentType === 'event' && 'Evento'}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Roles Necessárias</h3>
                <p className="text-secondary-600 text-sm mb-4">
                  Selecione as roles necessárias para acessar este conteúdo. Deixe tudo desmarcado para conteúdo público.
                </p>
                <div className="space-y-2">
                  {roles.map(role => (
                    <label key={role} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(editingContent.requiredRoles || []).includes(role)}
                        onChange={() => handleToggleContentRole(role)}
                        className="w-5 h-5 rounded bg-white border border-beige-200 border-gray-700 text-primary-700 focus:ring-primary-500"
                      />
                      <span className="text-secondary-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveContent}
                  className="flex-1 bg-primary-600 text-secondary-500 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setEditingContent(null);
                  }}
                  className="flex-1 bg-white border border-beige-200 text-white py-3 rounded-lg font-semibold hover:bg-beige-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Admin;
