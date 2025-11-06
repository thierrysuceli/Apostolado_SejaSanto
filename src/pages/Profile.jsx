import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import ImageUploader from '../components/ImageUploader';

const Profile = () => {
  const navigate = useNavigate();
  const { user, permissions, loading, logout, isAdmin, refreshUser } = useAuth();
  const api = useApi();
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-secondary-600 dark:text-gray-300 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-500 dark:text-gray-400 mb-4">Acesso Restrito</h2>
          <p className="text-secondary-600 dark:text-gray-300 mb-6">Você precisa estar logado para acessar o perfil.</p>
          <button
            onClick={() => navigate('/login')}
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
    navigate('/');
  };

  const handleProfilePhotoUpload = async (newPhotoUrl) => {
    try {
      setUploading(true);
      setUploadMessage('');
      
      // Atualizar foto de perfil no backend
      await api.users.updateProfilePhoto(user.id, { avatar_url: newPhotoUrl });
      
      setUploadMessage('Foto de perfil atualizada com sucesso!');
      
      // Recarregar dados do usuário
      if (refreshUser) {
        await refreshUser();
      }
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setUploadMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile photo:', err);
      setUploadMessage('Erro ao atualizar foto de perfil');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-4">
            {user.profile_photo_url ? (
              <img 
                src={user.profile_photo_url} 
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white dark:border-gray-800"
              />
            ) : (
              <div className="w-32 h-32 bg-amber-600 dark:bg-amber-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800">
                <span className="text-white dark:text-black font-bold text-5xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          
          {/* Upload Message */}
          {uploadMessage && (
            <div className={`mt-4 p-3 rounded-lg ${uploadMessage.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {uploadMessage}
            </div>
          )}
        </div>

        {/* Seção de Upload de Foto de Perfil */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Foto de Perfil</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Atualize sua foto de perfil. Ela será exibida em seus comentários e interações.
          </p>
          <ImageUploader
            currentImageUrl={user.profile_photo_url || ''}
            onImageUploaded={handleProfilePhotoUpload}
            folder="profile-photos"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Formatos aceitos: JPG, PNG, GIF, WEBP (máx. 5MB). Recomendamos uma imagem quadrada de pelo menos 200x200px.
          </p>
          {uploading && (
            <div className="mt-3 flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 dark:border-amber-500"></div>
              <span className="text-sm font-semibold">Atualizando foto...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Informações do Usuário</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">ID do Usuário</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">#{user.id}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Nome</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Email</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-secondary-500 dark:text-gray-400 mb-4">Permissões de Acesso</h2>
            <p className="text-secondary-600 dark:text-gray-300 text-sm mb-4">
              Suas classes e níveis de acesso no apostolado:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {user.roles && user.roles.map(role => (
                <span
                  key={role.id}
                  className={`px-4 py-2 rounded-lg font-semibold shadow-sm ${
                    role.name === 'ADMIN'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 border border-beige-200 dark:border-gray-700 text-primary-600'
                  }`}
                  style={{ backgroundColor: role.name === 'ADMIN' ? undefined : role.color + '20', color: role.name === 'ADMIN' ? undefined : role.color }}
                >
                  {role.display_name}
                </span>
              ))}
            </div>
            
            {isAdmin() && (
              <div className="mt-4 p-4 bg-primary-100 border border-primary-300 rounded-lg">
                <p className="text-primary-700 text-sm font-semibold">
                  ⚡ Você possui permissões de administrador
                </p>
              </div>
            )}

            {permissions && permissions.length > 0 && (
              <div className="mt-4">
                <p className="text-secondary-600 dark:text-gray-300 text-xs mb-2">Permissões ({permissions.length}):</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {permissions.map((perm, index) => (
                    <div key={perm.id || `perm-${index}`} className="text-xs text-secondary-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      {perm.display_name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-secondary-500 dark:text-gray-400 mb-4">Ações</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {isAdmin() && (
              <button
                onClick={() => navigate('/admin')}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-md"
              >
                Ir para Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex-1 bg-white dark:bg-gray-800 border border-beige-200 dark:border-gray-700 text-secondary-500 dark:text-gray-400 py-3 rounded-lg font-semibold hover:bg-beige-50 dark:bg-gray-950 transition-colors shadow-sm"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
