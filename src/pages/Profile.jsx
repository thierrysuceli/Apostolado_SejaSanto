import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-500 dark:text-gray-400 mb-4">Acesso Restrito</h2>
          <p className="text-secondary-600 dark:text-gray-300 mb-6">Você precisa estar logado para acessar o perfil.</p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-md"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-white font-bold text-4xl">
              {currentUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-secondary-500 dark:text-gray-400 mb-2">{currentUser.name}</h1>
          <p className="text-secondary-600">{currentUser.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-secondary-500 dark:text-gray-400 mb-4">Informações do Usuário</h2>
            <div className="space-y-3">
              <div>
                <p className="text-secondary-600 dark:text-gray-300 text-sm mb-1">ID do Usuário</p>
                <p className="text-secondary-500 font-semibold">#{currentUser.id}</p>
              </div>
              <div>
                <p className="text-secondary-600 dark:text-gray-300 text-sm mb-1">Nome</p>
                <p className="text-secondary-500 font-semibold">{currentUser.name}</p>
              </div>
              <div>
                <p className="text-secondary-600 dark:text-gray-300 text-sm mb-1">Email</p>
                <p className="text-secondary-500 font-semibold">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-secondary-500 dark:text-gray-400 mb-4">Permissões de Acesso</h2>
            <p className="text-secondary-600 dark:text-gray-300 text-sm mb-4">
              Suas classes e níveis de acesso no apostolado:
            </p>
            <div className="flex flex-wrap gap-2">
              {currentUser.roles && currentUser.roles.map(role => (
                <span
                  key={role}
                  className={`px-4 py-2 rounded-lg font-semibold shadow-sm ${
                    role === 'Admin'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 border border-beige-200 dark:border-gray-700 text-primary-600'
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
            
            {currentUser.roles && currentUser.roles.includes('Admin') && (
              <div className="mt-4 p-4 bg-primary-100 border border-primary-300 rounded-lg">
                <p className="text-primary-700 text-sm font-semibold">
                  ⚡ Você possui permissões de administrador
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 bg-beige-100 dark:bg-gray-900 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-secondary-500 dark:text-gray-400 mb-4">Ações</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {currentUser.roles && currentUser.roles.includes('Admin') && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-md"
              >
                Ir para Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex-1 bg-white dark:bg-gray-800 dark:bg-gray-800 border border-beige-200 dark:border-gray-700 text-secondary-500 dark:text-gray-400 py-3 rounded-lg font-semibold hover:bg-beige-50 dark:bg-gray-950 transition-colors shadow-sm"
            >
              Sair da Conta
            </button>
          </div>
        </div>

        {/* Statistics (optional) */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 text-center shadow-md">
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-500 mb-2">12</p>
            <p className="text-secondary-600 dark:text-gray-300 text-sm">Cursos Acessados</p>
          </div>
          <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 text-center shadow-md">
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-500 mb-2">45</p>
            <p className="text-secondary-600 dark:text-gray-300 text-sm">Horas Assistidas</p>
          </div>
          <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 text-center shadow-md">
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-500 mb-2">8</p>
            <p className="text-secondary-600 dark:text-gray-300 text-sm">Comentários</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
