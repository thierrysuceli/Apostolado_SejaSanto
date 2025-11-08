import React, { useState, useEffect } from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { useTheme } from '../contexts/ThemeContext';
import RichTextEditor from './RichTextEditor';

const BibleCommentsModal = ({ isOpen, onClose, book_abbrev, chapter, verse }) => {
  const { user } = useAuth();
  const api = useApi();
  const { isDark } = useTheme();
  
  const [comments, setComments] = useState([]);
  const [adminNotes, setAdminNotes] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteFormData, setNoteFormData] = useState({ title: '', content: '' });

  // Verificar se usuário é admin pela ROLE, não pela permissão
  // Usuários com role ADMIN podem criar notas e deletar qualquer comentário
  const isAdmin = user?.roles?.some(role => role.name === 'ADMIN' || role.code === 'ADMIN') || false;

  useEffect(() => {
    if (isOpen && book_abbrev && chapter && verse) {
      loadCommentsAndNotes();
    }
  }, [isOpen, book_abbrev, chapter, verse]);

  const loadCommentsAndNotes = async () => {
    try {
      setLoading(true);
      
      // Carregar comentários e notas em paralelo
      const [commentsData, notesData] = await Promise.all([
        api.bibleComments.getAll({ book_abbrev, chapter, verse }),
        api.bibleNotes.getByVerse({ book_abbrev, chapter, verse })
      ]);
      
      // Comentários vem em { comments: [...] }
      const commentsList = commentsData?.comments || [];
      setComments(commentsList);
      
      // Notas vem em { note: {...} } ou { notes: [...] }
      const notesList = notesData?.note ? [notesData.note] : (notesData?.notes || []);
      setAdminNotes(notesList);
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
      loadCommentsAndNotes(); // Recarrega lista
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
      loadCommentsAndNotes(); // Recarrega lista
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
      alert('Erro ao excluir comentário.');
    }
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    if (!noteFormData.title.trim() || !noteFormData.content.trim()) return;

    try {
      setSubmitting(true);
      await api.bibleNotes.create({
        book_abbrev,
        chapter,
        verse,
        title: noteFormData.title.trim(),
        content: noteFormData.content.trim(),
        author_id: user.id // Adicionar author_id
      });
      setNoteFormData({ title: '', content: '' });
      setShowNoteForm(false);
      loadCommentsAndNotes();
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      alert('Erro ao criar nota. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Deseja realmente excluir esta nota?')) return;

    try {
      await api.bibleNotes.delete(noteId);
      loadCommentsAndNotes();
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      alert('Erro ao excluir nota.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden ${
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Carregando...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Notas do Admin - DESTAQUE com Quill */}
              {adminNotes.map((note) => (
                <div
                  key={`note-${note.id}`}
                  className="p-6 rounded-lg border-2 border-green-500 bg-gradient-to-br from-green-500/10 to-green-500/5"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-500 flex-1">
                      {note.title}
                    </h3>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition flex-shrink-0"
                        title="Excluir nota"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <RichTextEditor
                      value={note.content}
                      readOnly={true}
                      minHeight="auto"
                    />
                  </div>
                  <p className={`text-xs mt-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Nota de estudo • {formatDate(note.created_at)}
                  </p>
                </div>
              ))}

              {/* Comentários normais */}
              {comments.length === 0 && adminNotes.length === 0 ? (
                <div className="text-center py-12">
                  <p className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Nenhum comentário ainda. Seja o primeiro!
                  </p>
                </div>
              ) : (
                comments.map((comment) => {
                  // Backend retorna 'users' (plural), não 'user'
                  const userName = comment.users?.name || comment.user?.name || 'Anônimo';
                  
                  return (
                    <div
                      key={comment.id}
                      className={`p-5 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-base text-amber-600 dark:text-amber-500">
                                {userName}
                              </p>
                              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                          </div>
                          <p className="text-base leading-relaxed whitespace-pre-wrap pl-13">
                            {comment.comment_text}
                          </p>
                        </div>
                        {user && (comment.user_id === user.id || isAdmin) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition flex-shrink-0"
                            title="Excluir comentário"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer - Forms */}
        {user && (
          <div className={`sticky bottom-0 px-6 py-4 border-t ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            {/* Botão Admin: Criar Nota */}
            {isAdmin && !showNoteForm && (
              <button
                onClick={() => setShowNoteForm(true)}
                className="w-full mb-3 px-4 py-2 bg-amber-500/20 text-amber-600 dark:text-amber-500 border-2 border-amber-500 font-semibold rounded-lg hover:bg-amber-500/30 transition"
              >
                + Criar Nota de Estudo (Admin)
              </button>
            )}

            {/* Form Nota Admin */}
            {isAdmin && showNoteForm && (
              <form onSubmit={handleSubmitNote} className="space-y-4 mb-4 p-5 border-2 border-green-500 rounded-lg bg-green-500/5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-green-600 dark:text-green-500">
                    Título da Nota de Estudo
                  </label>
                  <input
                    type="text"
                    value={noteFormData.title}
                    onChange={(e) => setNoteFormData({ ...noteFormData, title: e.target.value })}
                    placeholder="Ex: Reflexão sobre o versículo..."
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-green-500 transition ${
                      isDark 
                        ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-green-600 dark:text-green-500">
                    Conteúdo da Nota (Formatação rica)
                  </label>
                  <RichTextEditor
                    value={noteFormData.content}
                    onChange={(content) => setNoteFormData({ ...noteFormData, content })}
                    placeholder="Escreva a nota de estudo com formatação..."
                    minHeight="250px"
                    isAdmin={true}
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNoteForm(false);
                      setNoteFormData({ title: '', content: '' });
                    }}
                    className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
                  >
                    {submitting ? 'Salvando...' : 'Criar Nota'}
                  </button>
                </div>
              </form>
            )}

            {/* Form Comentário Normal */}
            {!showNoteForm && (
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
            )}
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
