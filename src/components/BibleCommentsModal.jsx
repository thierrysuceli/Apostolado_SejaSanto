import React, { useState, useEffect } from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { useTheme } from '../contexts/ThemeContext';

const BibleCommentsModal = ({ isOpen, onClose, book_abbrev, chapter, verse }) => {
  const { user } = useAuth();
  const { api } = useApi();
  const { isDark } = useTheme();
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && book_abbrev && chapter && verse) {
      loadComments();
    }
  }, [isOpen, book_abbrev, chapter, verse]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await api.bibleComments.getAll({ book_abbrev, chapter, verse });
      setComments(data || []);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      setSubmitting(true);
      await api.bibleComments.create({
        book_abbrev,
        chapter,
        verse,
        comment_text: newComment.trim()
      });
      setNewComment('');
      loadComments(); // Recarrega lista
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      alert('Erro ao enviar comentário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Deseja realmente excluir este comentário?')) return;

    try {
      await api.bibleComments.delete(commentId);
      loadComments(); // Recarrega lista
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
      alert('Erro ao excluir comentário.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl overflow-hidden ${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Comentários - Versículo {verse}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {book_abbrev} {chapter}:{verse}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {/* Lista de Comentários */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Carregando comentários...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                Nenhum comentário ainda. Seja o primeiro!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg ${
                    isDark ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-sm text-amber-500">
                          {comment.user_name || 'Anônimo'}
                        </p>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.comment_text}
                      </p>
                    </div>
                    {user && (comment.user_id === user.id || user.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        title="Excluir comentário"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Form de Novo Comentário */}
        {user && (
          <div className={`sticky bottom-0 px-6 py-4 border-t ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva seu comentário..."
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border-2 resize-none focus:outline-none focus:border-amber-500 transition ${
                  isDark 
                    ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {submitting ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {!user && (
          <div className={`px-6 py-4 text-center border-t ${
            isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
          }`}>
            <p className="text-sm">
              Faça login para comentar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleCommentsModal;
