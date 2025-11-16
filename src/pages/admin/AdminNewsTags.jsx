// =====================================================
// ADMIN - Gerenciamento de Tags de Notícias
// =====================================================

import { useState, useEffect } from 'react';
import { useApi } from '../../contexts/ApiContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PlusCircleIcon, PencilIcon, TrashIcon, HashtagIcon } from '@heroicons/react/24/outline';

export default function AdminNewsTags() {
  const api = useApi();
  const { isDark } = useTheme();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/public-data?type=news-tags');
      setTags(response.tags || []);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      alert('Erro ao carregar tags de notícias');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tag = null) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name,
        slug: tag.slug
      });
    } else {
      setEditingTag(null);
      setFormData({
        name: '',
        slug: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTag(null);
    setFormData({ name: '', slug: '' });
  };

  const handleNameChange = (name) => {
    setFormData({
      name,
      slug: name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTag) {
        // Atualizar tag existente
        await api.put(`/api/public-data?type=news-tags&id=${editingTag.id}`, formData);
      } else {
        // Criar nova tag
        await api.post('/api/public-data?type=news-tags', formData);
      }
      
      await loadTags();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar tag:', error);
      alert('Erro ao salvar tag de notícia');
    }
  };

  const handleDelete = async (tagId) => {
    if (!confirm('Tem certeza que deseja deletar esta tag? Ela será removida de todas as notícias associadas.')) {
      return;
    }

    try {
      await api.delete(`/api/public-data?type=news-tags&id=${tagId}`);
      await loadTags();
    } catch (error) {
      console.error('Erro ao deletar tag:', error);
      alert('Erro ao deletar tag de notícia');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className={isDark ? 'text-white' : 'text-gray-900'}>Carregando tags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <HashtagIcon className="w-8 h-8 text-amber-500" />
              Tags de Notícias
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Gerencie as tags para categorizar notícias
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition font-semibold"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Nova Tag
          </button>
        </div>

        {/* Lista de Tags */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={`rounded-xl p-4 shadow-lg ${
                isDark ? 'bg-gray-900' : 'bg-white'
              } border border-amber-500/20 hover:border-amber-500 transition group`}
            >
              <div className="flex items-center justify-between mb-3">
                <HashtagIcon className="w-5 h-5 text-amber-500" />
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleOpenModal(tag)}
                    className={`p-1 rounded transition ${
                      isDark
                        ? 'hover:bg-gray-800 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-1 rounded transition hover:bg-red-500/20 text-red-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {tag.name}
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {tag.slug}
              </p>
            </div>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="text-center py-20">
            <HashtagIcon className={`w-20 h-20 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Nenhuma tag cadastrada
            </h3>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Crie tags para categorizar e filtrar notícias
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition font-semibold"
            >
              Criar Primeira Tag
            </button>
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} p-6`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {editingTag ? 'Editar Tag' : 'Nova Tag'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nome da Tag *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="Ex: Vaticano, Santos, Liturgia..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Slug (gerado automaticamente)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="slug-da-tag"
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Usado na URL, apenas letras minúsculas e hífens
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`flex-1 px-4 py-2 rounded-lg transition ${
                    isDark
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition font-semibold"
                >
                  {editingTag ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
