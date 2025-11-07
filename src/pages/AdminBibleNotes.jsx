import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { PencilIcon, TrashIcon, PlusIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const AdminBibleNotes = () => {
  const { isDark } = useTheme();
  const { api } = useAuth();
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    book_abbrev: '',
    chapter: 1,
    verse: 1,
    title: '',
    content: ''
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await api.bibleNotes.getAll();
      setNotes(data || []);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingNote) {
        await api.bibleNotes.update(editingNote.id, formData);
      } else {
        await api.bibleNotes.create(formData);
      }
      
      resetForm();
      loadNotes();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      alert('Erro ao salvar nota. Verifique os dados.');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      book_abbrev: note.book_abbrev,
      chapter: note.chapter,
      verse: note.verse,
      title: note.title,
      content: note.content
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir esta nota?')) return;

    try {
      await api.bibleNotes.delete(id);
      loadNotes();
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      alert('Erro ao excluir nota.');
    }
  };

  const resetForm = () => {
    setFormData({
      book_abbrev: '',
      chapter: 1,
      verse: 1,
      title: '',
      content: ''
    });
    setEditingNote(null);
    setShowForm(false);
  };

  return (
    <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpenIcon className="w-10 h-10 text-amber-500" />
            <h1 className="text-3xl font-bold">Notas Bíblicas</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Nova Nota
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className={`mb-8 p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4">
              {editingNote ? 'Editar Nota' : 'Nova Nota'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Livro (abrev)</label>
                  <input
                    type="text"
                    value={formData.book_abbrev}
                    onChange={(e) => setFormData({ ...formData, book_abbrev: e.target.value })}
                    placeholder="Ex: gn, mt, jo"
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Capítulo</label>
                  <input
                    type="number"
                    value={formData.chapter}
                    onChange={(e) => setFormData({ ...formData, chapter: parseInt(e.target.value) })}
                    min={1}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Versículo</label>
                  <input
                    type="number"
                    value={formData.verse}
                    onChange={(e) => setFormData({ ...formData, verse: parseInt(e.target.value) })}
                    min={1}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título da nota"
                  required
                  className={`w-full px-4 py-2 rounded-lg border-2 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Conteúdo</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Conteúdo da nota..."
                  rows={6}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 resize-none ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600"
                >
                  {editingNote ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Notas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Carregando notas...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhuma nota criada ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-amber-500 font-semibold mb-1">
                      {note.book_abbrev.toUpperCase()} {note.chapter}:{note.verse}
                    </p>
                    <h3 className="text-lg font-bold">{note.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap line-clamp-4">
                  {note.content}
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(note.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBibleNotes;
