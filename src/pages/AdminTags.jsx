import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';

const AdminTags = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6b7280'
  });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.tags.getAll();
      setTags(data.tags || []);
    } catch (err) {
      console.error('Error loading tags:', err);
      setError('Erro ao carregar tags. Certifique-se de que a migração foi aplicada.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tag = null) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name,
        description: tag.description || '',
        color: tag.color || '#6b7280'
      });
    } else {
      setEditingTag(null);
      setFormData({
        name: '',
        description: '',
        color: '#6b7280'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTag(null);
    setFormData({ name: '', description: '', color: '#6b7280' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingTag) {
        await api.tags.update(editingTag.id, formData);
      } else {
        await api.tags.create(formData);
      }
      
      await loadTags();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving tag:', err);
      setError(err.message || 'Erro ao salvar tag');
    }
  };

  const handleDelete = async (tagId, tagName) => {
    if (!confirm(`Tem certeza que deseja deletar a tag "${tagName}"?`)) return;

    try {
      await api.tags.delete(tagId);
      await loadTags();
    } catch (err) {
      console.error('Error deleting tag:', err);
      alert('Erro ao deletar tag: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando tags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-secondary-800 dark:text-gray-100 mb-2">
                Gerenciar Tags Temáticas
              </h1>
              <p className="text-secondary-600 dark:text-gray-300">
                Crie e edite tags para categorizar cursos, posts e eventos
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Tag
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map(tag => (
            <div
              key={tag.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="px-4 py-2 rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: tag.color + '30',
                    color: tag.color,
                    border: `2px solid ${tag.color}`
                  }}
                >
                  {tag.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(tag)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id, tag.name)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                    title="Deletar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {tag.description && (
                <p className="text-sm text-secondary-600 dark:text-gray-400 mb-3">
                  {tag.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-secondary-500 dark:text-gray-500">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: tag.color }}
                  title={tag.color}
                ></div>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{tag.color}</code>
              </div>
            </div>
          ))}
        </div>

        {tags.length === 0 && !error && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700">
            <p className="text-secondary-600 dark:text-gray-400 mb-4">Nenhuma tag criada ainda.</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Criar Primeira Tag
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-secondary-800 dark:text-gray-100 mb-6">
                {editingTag ? 'Editar Tag' : 'Nova Tag'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: Mariologia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                    placeholder="Descrição da tag (opcional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                    Cor *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10 border border-gray-300 dark:border-gray-700 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      pattern="^#[0-9A-Fa-f]{6}$"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-secondary-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                      placeholder="#6b7280"
                    />
                  </div>
                  <p className="text-xs text-secondary-500 dark:text-gray-500 mt-1">
                    Formato hexadecimal (#RRGGBB)
                  </p>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-secondary-600 dark:text-gray-400 mb-2">Preview:</p>
                  <span
                    className="inline-block px-4 py-2 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: formData.color + '30',
                      color: formData.color,
                      border: `2px solid ${formData.color}`
                    }}
                  >
                    {formData.name || 'Nome da Tag'}
                  </span>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-bold"
                  >
                    {editingTag ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTags;
