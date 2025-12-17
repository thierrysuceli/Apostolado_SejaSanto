import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';

const CommentsSection = ({ articleId, type = 'article' }) => {
  const { user } = useAuth();
  const api = useApi();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      const typeMap = {
        article: 'article_id',
        post: 'post_id',
        event: 'event_id'
      };
      const paramName = typeMap[type] || 'article_id';
      const data = await api.get(`/api/public-data?type=comments&${paramName}=${articleId}`, false);
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Você precisa estar logado para comentar');
      return;
    }
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const typeMap = {
        article: 'article_id',
        post: 'post_id',
        event: 'event_id'
      };
      const idField = typeMap[type] || 'article_id';
      
      await api.post('/api/public-data?type=comments', {
        content: newComment,
        [idField]: articleId
      });
      
      setNewComment('');
      await loadComments();
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Erro ao publicar comentário');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault();
    if (!user) {
      alert('Você precisa estar logado para responder');
      return;
    }
    if (!replyContent.trim()) return;

    try {
      setLoading(true);
      const typeMap = {
        article: 'article_id',
        post: 'post_id',
        event: 'event_id'
      };
      const idField = typeMap[type] || 'article_id';
      
      await api.post('/api/public-data?type=comments', {
        content: replyContent,
        [idField]: articleId,
        parent_comment_id: parentId
      });
      
      setReplyContent('');
      setReplyTo(null);
      await loadComments();
    } catch (err) {
      console.error('Error posting reply:', err);
      alert('Erro ao publicar resposta');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) return;

    try {
      await api.del(`/api/public-data?type=comments&id=${commentId}`);
      await loadComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Erro ao deletar comentário');
    }
  };

  // Organizar comentários em árvore (parent -> children)
  const organizeComments = () => {
    const commentMap = {};
    const rootComments = [];

    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
      if (comment.parent_comment_id) {
        if (commentMap[comment.parent_comment_id]) {
          commentMap[comment.parent_comment_id].replies.push(commentMap[comment.id]);
        }
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  const renderComment = (comment, depth = 0) => {
    const isAuthor = user?.id === comment.author_id;
    const maxDepth = 3;

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 md:ml-12 mt-4' : 'mt-6'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Comment Header */}
          <div className="flex items-start gap-3 mb-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {comment.users?.avatar_url ? (
                <img
                  src={comment.users.avatar_url}
                  alt={comment.users.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg border-2 border-amber-500">
                  {(comment.users?.name?.[0] || 'U').toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {comment.users?.name || 'Usuário'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Delete Button (only for author) */}
            {isAuthor && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:text-red-600 p-1"
                title="Deletar comentário"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Comment Content */}
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {/* Reply Button */}
          {user && depth < maxDepth && (
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="mt-3 text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              {replyTo === comment.id ? 'Cancelar' : 'Responder'}
            </button>
          )}

          {/* Reply Form */}
          {replyTo === comment.id && (
            <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escreva sua resposta..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                rows="3"
                disabled={loading}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={loading || !replyContent.trim()}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {loading ? 'Enviando...' : 'Enviar Resposta'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="relative">
            {/* Visual connection line */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const organizedComments = organizeComments();

  return (
    <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comentários ({comments.length})
      </h2>

      {/* New Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg border-2 border-amber-500">
                  {(user.name?.[0] || 'U').toUpperCase()}
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Deixe seu comentário..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                rows="4"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="mt-3 px-6 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                {loading ? 'Publicando...' : 'Publicar Comentário'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Você precisa estar <span className="font-semibold text-amber-600 dark:text-amber-500">logado</span> para comentar.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-1">
        {organizedComments.length > 0 ? (
          organizedComments.map(comment => renderComment(comment))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
