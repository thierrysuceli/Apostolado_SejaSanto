import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { useTheme } from '../contexts/ThemeContext';
import RichTextEditor from '../components/RichTextEditor';

function TopicDetail() {
  const { courseId, moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, hasPermission } = useAuth();
  const api = useApi();
  const { isDark } = useTheme();
  
  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  // Função para buscar respostas de um comentário
  const getCommentReplies = (parentId) => {
    return comments.filter(c => c.parent_comment_id === parentId);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Carregar tópico (já vem com dados do módulo e curso)
        const topicData = await api.topics.getById(topicId);
        const loadedTopic = topicData.topic;
        
        setTopic(loadedTopic);
        
        // Extrair curso e módulo da estrutura aninhada
        if (loadedTopic.modules) {
          setModule(loadedTopic.modules);
          
          if (loadedTopic.modules.courses) {
            setCourse(loadedTopic.modules.courses);
          }
        }
        
        // Carregar comentários
        const commentsData = await api.comments.getAll({ topic_id: topicId });
        setComments(commentsData.comments || []);
        
      } catch (err) {
        console.error('Error loading topic:', err);
        setError('Erro ao carregar tópico');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [topicId]);

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
      const commentData = await api.comments.create({
        topic_id: topicId,
        content: newComment,
        parent_comment_id: null
      });
      
      // Recarregar comentários
      const commentsData = await api.comments.getAll({ topic_id: topicId });
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
        topic_id: topicId,
        content: replyContent,
        parent_comment_id: parentId
      });
      
      // Recarregar comentários
      const commentsData = await api.comments.getAll({ topic_id: topicId });
      setComments(commentsData.comments || []);
      setReplyContent('');
      setReplyTo(null);
    } catch (err) {
      console.error('Error adding reply:', err);
      alert('Erro ao adicionar resposta');
    }
  };

  const renderComment = (comment, depth = 0) => {
    const replies = getCommentReplies(comment.id);
    
    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
        {/* Pack #2: Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 p-4 transition-colors duration-300">
          {/* User info */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {(comment.users?.name?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {/* Pack #6: Body text */}
              <p className="text-secondary-600 dark:text-gray-300 font-semibold">
                {comment.users?.name || 'Usuário'}
              </p>
              {/* Pack #7: Secondary text */}
              <p className="text-secondary-500 dark:text-gray-400 text-sm">
                {new Date(comment.date).toLocaleDateString('pt-BR', {
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
            
            {/* Admin delete button */}
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
                {/* Pack #9: Primary button */}
                <button
                  onClick={() => handleAddReply(comment.id)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300"
                >
                  Enviar Resposta
                </button>
                {/* Pack #10: Secondary button */}
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
      /* Pack #1: Page background */
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
        {/* Pack #6: Body text */}
        <div className="container mx-auto px-4 py-8 text-secondary-600 dark:text-gray-300 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Carregando aula...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      /* Pack #1: Page background */
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
        {/* Pack #6: Body text */}
        <div className="container mx-auto px-4 py-8 text-secondary-600 dark:text-gray-300 text-center">
          <p className="text-red-500 mb-4">{error || 'Tópico não encontrado'}</p>
          <Link to="/courses" className="text-primary-600 hover:underline">
            Voltar para Cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    /* Pack #1: Page background */
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm flex-wrap">
          {/* Pack #13: Link */}
          <Link to="/courses" className="text-primary-700 dark:text-primary-500 hover:underline">
            Cursos
          </Link>
          {/* Pack #7: Secondary text */}
          <span className="text-secondary-500 dark:text-gray-400">/</span>
          {course && (
            <>
              <Link to={`/courses/${course.id}`} className="text-primary-700 dark:text-primary-500 hover:underline">
                {course.title}
              </Link>
              <span className="text-secondary-500 dark:text-gray-400">/</span>
            </>
          )}
          {module && (
            <>
              <span className="text-secondary-600 dark:text-gray-300">{module.title}</span>
              <span className="text-secondary-500 dark:text-gray-400">/</span>
            </>
          )}
          <span className="text-secondary-600 dark:text-gray-300">{topic.title}</span>
        </div>

        {/* Topic header */}
        {/* Pack #2: Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 p-6 md:p-8 mb-6 transition-colors duration-300">
          {/* Pack #4: H1 title */}
          <h1 className="text-secondary-800 dark:text-gray-100 text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300">
            {topic.title}
          </h1>
          
          {/* Topic meta */}
          <div className="flex items-center gap-4 text-sm">
            {/* Pack #14: Badge */}
            {module && (
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full">
                {module.title}
              </span>
            )}
            {topic.duration && (
              /* Pack #7: Secondary text */
              <span className="text-secondary-500 dark:text-gray-400">
                Duração: {topic.duration}
              </span>
            )}
          </div>
        </div>

        {/* Content before video */}
        {topic.content_before && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 p-6 md:p-8 mb-6 transition-colors duration-300">
            <RichTextEditor 
              value={topic.content_before}
              readOnly={true}
              minHeight="auto"
            />
          </div>
        )}

        {/* Video player */}
        {topic.video_url && topic.video_url.includes('youtube.com/embed/') && (
          /* Pack #2: Card */
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-300">
            <div className="aspect-video">
              <iframe
                src={topic.video_url}
                title={topic.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {/* Aviso de URL inválida para admin */}
        {isAdmin() && topic.video_url && !topic.video_url.includes('youtube.com/embed/') && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              ⚠️ <strong>URL de vídeo inválida.</strong> A URL deve estar no formato: 
              <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded mx-1">
                https://www.youtube.com/embed/VIDEO_ID
              </code>
              <br />
              <span className="text-xs">
                URL atual: <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">{topic.video_url}</code>
              </span>
              <br />
              <a 
                href={`/admin/courses/${course?.id}/modules`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-2 inline-block"
              >
                Clique aqui para corrigir →
              </a>
            </p>
          </div>
        )}

        {/* Content after video */}
        {topic.content_after && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 p-6 md:p-8 mb-6 transition-colors duration-300">
            <RichTextEditor 
              value={topic.content_after}
              readOnly={true}
              minHeight="auto"
            />
          </div>
        )}

        {/* Attachments */}
        {topic.attachments && topic.attachments.length > 0 && (
          /* Pack #2: Card */
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 p-6 md:p-8 mb-6 transition-colors duration-300">
            {/* Pack #5: H2/H3 subtitle */}
            <h3 className="text-secondary-700 dark:text-gray-200 text-xl font-semibold mb-4">
              Material Complementar
            </h3>
            <div className="space-y-2">
              {topic.attachments.map(file => (
                <a
                  key={file.id}
                  href={file.url}
                  download
                  className="flex items-center gap-3 bg-beige-100 dark:bg-gray-900 p-3 rounded-lg hover:bg-beige-200 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  {/* Pack #18: Icon */}
                  <svg className="w-6 h-6 text-secondary-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {/* Pack #6: Body text */}
                  <span className="text-secondary-600 dark:text-gray-300">
                    {file.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments section */}
        <div className="mt-8">
          {/* Pack #5: H2/H3 subtitle */}
          <h2 className="text-secondary-700 dark:text-gray-200 text-2xl font-bold mb-6 transition-colors duration-300">
            Comentários ({comments.length})
          </h2>

          {/* Add comment form */}
          {(user && user.id) ? (
            /* Pack #2: Card */
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-beige-300 dark:border-gray-700 p-6 mb-6 transition-colors duration-300">
              <RichTextEditor
                value={newComment}
                onChange={setNewComment}
                placeholder="Compartilhe suas dúvidas ou reflexões sobre esta aula..."
                minHeight="200px"
              />
              {/* Pack #9: Primary button */}
              <button
                onClick={handleAddComment}
                className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300"
              >
                Publicar Comentário
              </button>
            </div>
          ) : (
            /* Pack #2: Card */
            <div className="bg-beige-100 dark:bg-gray-900 rounded-lg border border-beige-300 dark:border-gray-700 p-6 mb-6 text-center transition-colors duration-300">
              {/* Pack #6: Body text */}
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
              /* Pack #6: Body text */
              <p className="text-secondary-600 dark:text-gray-300 text-center py-8">
                Seja o primeiro a comentar!
              </p>
            ) : (
              comments.map(comment => renderComment(comment))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicDetail;
