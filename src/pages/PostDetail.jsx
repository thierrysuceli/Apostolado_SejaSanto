import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { useTheme } from '../contexts/ThemeContext';
import RichTextEditor from '../components/RichTextEditor';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, hasPermission } = useAuth();
  const api = useApi();
  const { isDark } = useTheme();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const postData = await api.posts.getById(id);
        setPost(postData.post);
        setEditedContent(postData.post.content);
        
        const commentsData = await api.comments.getAll({ post_id: id });
        setComments(commentsData.comments || []);
        
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Erro ao carregar post');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  const handleEditPost = () => {
    setIsEditing(true);
  };

  const handleSavePost = async () => {
    try {
      await api.posts.update(id, { content: editedContent });
      setPost({ ...post, content: editedContent });
      setIsEditing(false);
      alert('Post atualizado com sucesso!');
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Erro ao salvar post');
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(post?.content || '');
    setIsEditing(false);
  };

  const handleDeletePost = async () => {
    if (!confirm('Tem certeza que deseja deletar este post?')) return;
    
    try {
      await api.posts.delete(id);
      alert('Post deletado com sucesso!');
      navigate('/posts');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Erro ao deletar post');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) return;
    
    try {
      await api.comments.delete(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      alert('Comentário deletado com sucesso!');
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Erro ao deletar comentário');
    }
  };

  const handleAddComment = async () => {
    if (!user || !user.id) {
      alert('Você precisa estar logado para comentar.');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      await api.comments.create({
        post_id: id,
        content: newComment
      });
      
      // Recarregar comentários
      const commentsData = await api.comments.getAll({ post_id: id });
      setComments(commentsData.comments || []);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Erro ao adicionar comentário');
    }
  };

  const handleAddReply = async (parentId) => {
    if (!user || !user.id) {
      alert('Você precisa estar logado para comentar.');
      navigate('/login');
      return;
    }

    if (!replyContent.trim()) {
      return;
    }

    try {
      await api.comments.create({
        post_id: id,
        content: replyContent,
        parent_id: parentId
      });
      
      // Recarregar comentários
      const commentsData = await api.comments.getAll({ post_id: id });
      setComments(commentsData.comments || []);
      setReplyContent('');
      setReplyTo(null);
    } catch (err) {
      console.error('Error adding reply:', err);
      alert('Erro ao adicionar resposta');
    }
  };

  const getCommentReplies = (commentId) => {
    return comments.filter(c => c.parent_id === commentId);
  };

  const renderComment = (comment, depth = 0) => {
    const replies = getCommentReplies(comment.id);
    
    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 p-4 transition-colors duration-300">
          {/* User info */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {(comment.users?.name?.[0] || comment.author_name?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-secondary-600 dark:text-gray-300 font-semibold">
                {comment.users?.name || comment.author_name || 'Usuário'}
              </p>
              <p className="text-secondary-500 dark:text-gray-400 text-sm">
                {new Date(comment.created_at || comment.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Comment content */}
          <div className="mb-3">
            <RichTextEditor 
              value={comment.content}
              readOnly={true}
              minHeight="auto"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="text-primary-700 dark:text-primary-500 hover:underline text-sm transition-colors duration-300"
              >
                Responder
              </button>
            )}
            
            {isAdmin() && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-600 dark:text-red-400 hover:underline text-sm transition-colors duration-300"
              >
                🗑️ Deletar
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyTo === comment.id && (
            <div className="mt-4">
              <RichTextEditor
                value={replyContent}
                onChange={setReplyContent}
                placeholder="Escreva sua resposta..."
                minHeight="150px"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddReply(comment.id)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300"
                >
                  Enviar Resposta
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  className="bg-white dark:bg-gray-800 border border-beige-300 dark:border-gray-700 text-secondary-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-beige-100 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Render replies */}
        {replies.length > 0 && (
          <div className="mt-4">
            {replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            {error || 'Post não encontrado'}
          </div>
          <Link to="/posts" className="inline-block mt-4 text-primary-600 hover:underline">
            ← Voltar para Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link to="/posts" className="text-primary-700 dark:text-primary-500 hover:underline">
            Posts
          </Link>
          <span className="text-secondary-500 dark:text-gray-400">/</span>
          <span className="text-secondary-600 dark:text-gray-300">{post.title}</span>
        </div>

        {/* Post header */}
        <article className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          {/* Featured image */}
          {post.image && (
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-80 object-cover"
            />
          )}

          <div className="p-6 md:p-8">
            {/* Category badge */}
            <span className="inline-block bg-primary-600 text-white text-xs px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-secondary-800 dark:text-gray-100 text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300">
              {post.title}
            </h1>

            {/* Meta info and Admin actions */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-beige-300 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <span className="text-secondary-500 dark:text-gray-400 text-sm">
                  Por {post.author?.name || post.author || 'Autor'}
                </span>
                <span className="text-secondary-500 dark:text-gray-400 text-sm">
                  {new Date(post.published_at || post.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Admin actions */}
              {isAdmin() && (
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => navigate(`/admin/posts/${id}/edit`)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Editar Completo
                      </button>
                      <button
                        onClick={handleEditPost}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        ✏️ Editar Rápido
                      </button>
                      <button
                        onClick={handleDeletePost}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                      >
                        🗑️ Deletar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSavePost}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                      >
                        ✓ Salvar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
                      >
                        ✕ Cancelar
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Post content */}
            <div className="prose max-w-none">
              {isEditing ? (
                <RichTextEditor 
                  value={editedContent}
                  onChange={setEditedContent}
                  placeholder="Edite o conteúdo do post..."
                  minHeight="400px"
                />
              ) : (
                <RichTextEditor 
                  value={post.content}
                  readOnly={true}
                  minHeight="auto"
                />
              )}
            </div>

            {/* Attachments */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-beige-300 dark:border-gray-700">
                <h3 className="text-secondary-700 dark:text-gray-200 text-xl font-semibold mb-4">
                  Arquivos Anexos
                </h3>
                <div className="space-y-2">
                  {post.attachments.map(file => (
                    <a
                      key={file.id}
                      href={file.url}
                      download
                      className="flex items-center gap-3 bg-beige-100 dark:bg-gray-900 p-3 rounded-lg hover:bg-beige-200 dark:hover:bg-gray-800 transition-colors duration-300"
                    >
                      <svg className="w-6 h-6 text-secondary-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-secondary-600 dark:text-gray-300">
                        {file.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Comments section */}
        <div className="mt-8">
          <h2 className="text-secondary-700 dark:text-gray-200 text-2xl font-bold mb-6 transition-colors duration-300">
            Comentários ({comments.length})
          </h2>

          {/* Add comment form */}
          {(user && user.id) ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 p-6 mb-6 transition-colors duration-300">
              <RichTextEditor
                value={newComment}
                onChange={setNewComment}
                placeholder="Escreva seu comentário..."
                minHeight="200px"
              />
              <button
                onClick={handleAddComment}
                className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300"
              >
                Publicar Comentário
              </button>
            </div>
          ) : (
            <div className="bg-beige-100 dark:bg-gray-900 rounded-lg border border-beige-300 dark:border-gray-700 p-6 mb-6 text-center transition-colors duration-300">
              <p className="text-secondary-600 dark:text-gray-300 mb-4">
                Você precisa estar logado para comentar.
              </p>
              <Link 
                to="/login" 
                className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300"
              >
                Fazer Login
              </Link>
            </div>
          )}

          {/* Comments list */}
          <div>
            {comments.length === 0 ? (
              <p className="text-secondary-600 dark:text-gray-300 text-center py-8">
                Seja o primeiro a comentar!
              </p>
            ) : (
              comments.filter(c => !c.parent_id).map(comment => renderComment(comment))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
