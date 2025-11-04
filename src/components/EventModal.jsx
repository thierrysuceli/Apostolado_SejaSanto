import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { useApi } from '../contexts/ApiContext';

const EventModal = ({ 
  show,
  isEditMode,
  eventForm,
  setEventForm,
  categories,
  roles,
  users = [],
  onSave,
  onClose,
  onCategoryCreated
}) => {
  const api = useApi();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#f59e0b',
    icon: ''
  });

  if (!show) return null;

  console.log('EventModal props:', { 
    categories: categories?.length, 
    roles: roles?.length, 
    users: users?.length,
    eventForm 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting event form:', eventForm); // Debug
    console.log('Categories selected:', eventForm.categories);
    console.log('Roles selected:', eventForm.roles);
    onSave(eventForm);
  };

  // Helper to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const toggleCategory = (categoryId) => {
    console.log('Toggle category:', categoryId);
    setEventForm(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      console.log('New categories:', newCategories);
      return {
        ...prev,
        categories: newCategories
      };
    });
  };

  const toggleRole = (roleId) => {
    console.log('Toggle role:', roleId);
    setEventForm(prev => {
      const newRoles = prev.roles.includes(roleId)
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId];
      console.log('New roles:', newRoles);
      return {
        ...prev,
        roles: newRoles
      };
    });
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    console.log('=== CRIAR CATEGORIA ===');
    console.log('newCategory:', newCategory);
    
    if (!newCategory.name.trim()) {
      alert('Nome da categoria é obrigatório');
      return;
    }

    try {
      console.log('Enviando para API...');
      const response = await api.eventCategories.create(newCategory);
      console.log('Resposta da API:', response);
      
      if (response && (response.category || response.id)) {
        alert('Categoria criada com sucesso!');
        setNewCategory({ name: '', description: '', color: '#f59e0b', icon: '' });
        setShowCategoryModal(false);
        
        if (onCategoryCreated) {
          console.log('Chamando onCategoryCreated callback...');
          onCategoryCreated(); // Recarregar categorias
        }
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('ERRO ao criar categoria:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Erro ao criar categoria: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full my-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-white dark:bg-gray-800 pb-2 z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-700 dark:text-gray-200">
              {isEditMode ? 'Editar Evento' : 'Criar Novo Evento'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                Título do Evento *
              </label>
              <input
                type="text"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-secondary-700 dark:text-gray-200"
                required
              />
            </div>

            {/* Date/Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                  Data/Hora Início *
                </label>
                <input
                  type="datetime-local"
                  value={formatDateForInput(eventForm.start_date)}
                  onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-secondary-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2 text-sm sm:text-base">
                  Data/Hora Fim
                </label>
                <input
                  type="datetime-local"
                  value={formatDateForInput(eventForm.end_date)}
                  onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-secondary-700 dark:text-gray-200"
                />
              </div>
            </div>

            {/* All Day */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="all_day"
                checked={eventForm.all_day}
                onChange={(e) => setEventForm({ ...eventForm, all_day: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="all_day" className="ml-2 text-secondary-700 dark:text-gray-200">
                Evento de dia inteiro
              </label>
            </div>

            {/* Location */}
            <div>
              <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                Local
              </label>
              <input
                type="text"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                placeholder="Ex: Igreja Matriz, Salão Paroquial..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-secondary-700 dark:text-gray-200"
              />
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                Link da Reunião (Zoom, Meet, etc)
              </label>
              <input
                type="url"
                value={eventForm.meeting_link}
                onChange={(e) => setEventForm({ ...eventForm, meeting_link: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-secondary-700 dark:text-gray-200"
              />
            </div>

            {/* Categories */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold text-sm sm:text-base">
                  Categorias {eventForm.categories.length > 0 && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                      {eventForm.categories.length} selecionada{eventForm.categories.length > 1 ? 's' : ''}
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Categoria
                </button>
              </div>
              {categories && categories.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {categories.map(category => {
                    const isSelected = eventForm.categories.includes(category.id);
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                          isSelected ? 'shadow-md scale-105' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: isSelected ? category.color : category.color + '40',
                          color: isSelected ? '#ffffff' : category.color,
                          border: `2px solid ${category.color}`
                        }}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma categoria disponível</p>
              )}
            </div>

            {/* Roles (Visibility) */}
            <div>
              <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-3 text-sm sm:text-base">
                Visibilidade por Roles (Grupos)
                {eventForm.roles.length > 0 && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {eventForm.roles.length} role{eventForm.roles.length > 1 ? 's' : ''}
                  </span>
                )}
              </label>
              {roles && roles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {roles.map(role => (
                    <label
                      key={role.id}
                      className="flex items-center gap-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={eventForm.roles.includes(role.id)}
                        onChange={() => toggleRole(role.id)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                      />
                      <span 
                        className="text-xs sm:text-sm font-medium truncate"
                        style={{ color: role.color }}
                      >
                        {role.display_name || role.name}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma role disponível</p>
              )}
            </div>

            {/* Users (Individual Visibility) */}
            {users && users.length > 0 && (
              <div>
                <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-3 text-sm sm:text-base">
                  Usuários Específicos (Opcional)
                  <span className="block sm:inline text-xs sm:text-sm font-normal text-gray-500 sm:ml-2 mt-1 sm:mt-0">
                    (Além das roles acima, você pode selecionar usuários individuais)
                  </span>
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {users.map(user => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={eventForm.users?.includes(user.id) || false}
                          onChange={() => {
                            setEventForm(prev => ({
                              ...prev,
                              users: prev.users?.includes(user.id)
                                ? prev.users.filter(id => id !== user.id)
                                : [...(prev.users || []), user.id]
                            }));
                          }}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Color */}
            <div>
              <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                Cor Personalizada
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Opcional - sobrescreve cor da categoria)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={eventForm.color || '#6b7280'}
                  onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })}
                  className="w-20 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                {eventForm.color && (
                  <button
                    type="button"
                    onClick={() => setEventForm({ ...eventForm, color: '' })}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remover cor personalizada
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                Descrição
              </label>
              <RichTextEditor
                value={eventForm.description}
                onChange={(content) => setEventForm({ ...eventForm, description: content })}
                placeholder="Adicione detalhes sobre o evento..."
                minHeight="200px"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 sm:py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white px-4 py-2.5 sm:py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-md text-sm sm:text-base"
            >
              {isEditMode ? 'Atualizar Evento' : 'Criar Evento'}
            </button>
          </div>
        </form>
      </div>

      {/* Category Creation Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]" onClick={() => setShowCategoryModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateCategory} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-secondary-700 dark:text-gray-200">
                  Nova Categoria
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Ex: Formação, Missa, Retiro..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-secondary-700 dark:text-gray-200"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Descrição opcional..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-secondary-700 dark:text-gray-200"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                    Cor *
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="w-20 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{newCategory.color}</span>
                  </div>
                </div>

                {/* Icon (optional) */}
                <div>
                  <label className="block text-secondary-700 dark:text-gray-200 font-semibold mb-2">
                    Ícone (opcional)
                  </label>
                  <input
                    type="text"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    placeholder="Ex: book, church, calendar..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-secondary-700 dark:text-gray-200"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-md"
                >
                  Criar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModal;
