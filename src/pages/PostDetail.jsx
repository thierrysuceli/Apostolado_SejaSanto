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
      <div key={comment.id} className={`${depth > 0 ? 'ml-4 md:ml-12 mt-4' : 'mb-6'}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-xl border-2 ${depth > 0 ? 'border-gray-200 dark:border-gray-700' : 'border-gray-300 dark:border-gray-700'} p-5 md:p-6 transition-all duration-300 hover:shadow-lg`}>
          {/* User Info */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md ${depth > 0 ? 'w-10 h-10 text-base' : ''}`}>
              {(comment.users?.name?.[0] || comment.author_name?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                {comment.users?.name || comment.author_name || 'Usuário'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(comment.created_at || comment.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Comment Content */}
          <div className="mb-4 pl-0 md:pl-15">
            <RichTextEditor 
              value={comment.content}
              readOnly={true}
              minHeight="auto"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pl-0 md:pl-15">
            {user && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Responder
              </button>
            )}
            
            {isAdmin() && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Deletar
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-5 pt-5 border-t-2 border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                Respondendo a {comment.users?.name || comment.author_name || 'Usuário'}:
              </p>
              <RichTextEditor
                value={replyContent}
                onChange={setReplyContent}
                placeholder="Escreva sua resposta..."
                minHeight="150px"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleAddReply(comment.id)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Enviar Resposta
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  className="bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Render Replies */}
        {replies.length > 0 && (
          <div className="mt-3">
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
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Article Header Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 dark:from-gray-900 dark:via-gray-800 dark:to-black py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-white/80">
            <Link to="/posts" className="hover:text-white transition-colors">
              Posts
            </Link>
            <span>/</span>
            <span className="text-white font-medium truncate">{post.title}</span>
          </div>

          {/* Category Badge */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider border border-white/30">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-4xl">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold border border-white/30">
                {(post.author?.name?.[0] || post.author?.[0] || 'A').toUpperCase()}
              </div>
              <span className="font-medium">
                {post.author?.name || post.author || 'Autor'}
              </span>
            </div>
            <span className="text-white/60">•</span>
            <span>
              {new Date(post.published_at || post.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>

        </div>
      </div>

      {/* Admin Actions Bar (Fixed on Scroll) */}
      {isAdmin() && (
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-4 max-w-5xl py-3">
            <div className="flex flex-wrap items-center gap-2 justify-end">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => navigate(`/admin/posts/${id}/edit`)}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={handleEditPost}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    ✏️ Rápido
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    🗑️ Deletar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSavePost}
                    className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    ✓ Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    ✕ Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        {/* Featured Image */}
        {post.image && !isEditing && (
          <div className="mb-12 -mx-4 md:mx-0">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-[400px] md:h-[500px] object-cover md:rounded-2xl shadow-2xl"
            />
          </div>
        )}

        {/* Article Body - Typography Optimized */}
        <div className={`
          prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:leading-tight
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800 prose-h2:pb-2
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
          prose-a:text-amber-600 dark:prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
          prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 dark:prose-blockquote:bg-gray-900 
          prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-lg
          prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
          prose-li:text-gray-700 dark:prose-li:text-gray-300
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
        `}>
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

        {/* Attachments Section */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-800">
            <h3 className="text-gray-900 dark:text-gray-100 text-2xl font-bold mb-6 font-serif">
              📎 Arquivos Anexos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {post.attachments.map(file => (
                <a
                  key={file.id}
                  href={file.url}
                  download
                  className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-800 transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md group"
                >
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                    {file.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Comments Section - New Container */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16 mt-12 border-t-4 border-amber-500">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl md:text-4xl font-bold mb-8 font-serif flex items-center gap-3">
            <span>💬</span>
            Comentários
            <span className="text-2xl text-gray-500 dark:text-gray-400 font-normal">({comments.length})</span>
          </h2>

          {/* Add Comment Form */}
          {(user && user.id) ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-lg">
              <h3 className="text-gray-900 dark:text-gray-100 text-xl font-semibold mb-4">
                Deixe seu comentário
              </h3>
              <RichTextEditor
                value={newComment}
                onChange={setNewComment}
                placeholder="Compartilhe seus pensamentos sobre este artigo..."
                minHeight="180px"
              />
              <button
                onClick={handleAddComment}
                className="mt-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Publicar Comentário
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-gray-800 rounded-2xl border-2 border-amber-200 dark:border-gray-700 p-8 mb-8 text-center shadow-md">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600 dark:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-5 text-lg">
                Você precisa estar logado para comentar.
              </p>
              <Link 
                to="/login" 
                className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              >
                Fazer Login
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div>
            {comments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  Nenhum comentário ainda
                </p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">
                  Seja o primeiro a compartilhar seus pensamentos!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.filter(c => !c.parent_id).map(comment => renderComment(comment))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PostDetail;
