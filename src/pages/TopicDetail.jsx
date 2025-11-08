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
  const [showTextContent, setShowTextContent] = useState(false);

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

  // Salvar que visitou o tópico (apenas registro, sem tempo)
  useEffect(() => {
    if (!user || !course || !topicId) {
      console.log('[TopicDetail] Não salvando progresso:', { 
        hasUser: !!user, 
        hasCourse: !!course, 
        hasTopicId: !!topicId 
      });
      return;
    }

    const saveProgress = async () => {
      // Verificações rigorosas
      if (!user || !user.id) {
        console.warn('[TopicDetail] SKIP: Usuário não autenticado');
        return;
      }
      
      if (!course || !course.id) {
        console.warn('[TopicDetail] SKIP: Curso não carregado');
        return;
      }
      
      if (!topicId) {
        console.warn('[TopicDetail] SKIP: Topic ID ausente');
        return;
      }

      try {
        console.log('[TopicDetail] ✓ Iniciando salvamento de progresso:', {
          user_id: user.id,
          user_email: user.email,
          course_id: course.id,
          course_title: course.title,
          topic_id: topicId
        });
        
        const payload = {
          course_id: course.id,
          topic_id: topicId,
          progress_seconds: 0,
          completed: false
        };
        
        console.log('[TopicDetail] → Payload sendo enviado:', payload);
        
        const result = await api.progress.saveCourseProgress(payload);
        
        console.log('[TopicDetail] ✓✓✓ PROGRESSO SALVO COM SUCESSO! ✓✓✓');
        console.log('[TopicDetail] Resposta da API:', result);
        
        // Verificar se realmente salvou no banco
        if (result && result.progress) {
          console.log('[TopicDetail] ✓ Confirmado: registro criado/atualizado no banco');
          console.log('[TopicDetail] ID do registro:', result.progress.id);
        }
        
      } catch (err) {
        console.error('[TopicDetail] ❌❌❌ ERRO AO SALVAR PROGRESSO ❌❌❌');
        console.error('[TopicDetail] Erro completo:', err);
        console.error('[TopicDetail] Mensagem:', err.message);
        console.error('[TopicDetail] Response data:', err.response?.data);
        console.error('[TopicDetail] Status:', err.response?.status);
        console.error('[TopicDetail] Headers:', err.response?.headers);
      }
    };

    // Salvar apenas uma vez ao carregar (com delay para garantir que user e course estejam prontos)
    const timer = setTimeout(() => {
      saveProgress();
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
  }, [user, course, topicId, api]);

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
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 transition-colors duration-300">
          {/* User info */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-600 dark:bg-amber-500 flex items-center justify-center text-white dark:text-black font-bold flex-shrink-0">
              {(comment.users?.name?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                {comment.users?.name || 'Usuário'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
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
                className="text-amber-600 dark:text-amber-500 hover:underline text-sm transition-colors duration-300 font-semibold"
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
                isAdmin={isAdmin()}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddReply(comment.id)}
                  className="bg-amber-600 dark:bg-amber-500 text-white dark:text-black px-4 py-2 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 font-semibold"
                >
                  Enviar Resposta
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
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
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 dark:border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Carregando aula...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-500 mb-4">{error || 'Tópico não encontrado'}</p>
          <Link to="/courses" className="text-amber-600 dark:text-amber-500 hover:underline font-semibold">
            ← Voltar para Cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm flex-wrap">
          <Link to="/courses" className="text-amber-600 dark:text-amber-500 hover:underline font-semibold">
            Cursos
          </Link>
          <span className="text-gray-400">/</span>
          {course && (
            <>
              <Link to={`/courses/${course.id}`} className="text-amber-600 dark:text-amber-500 hover:underline font-semibold">
                {course.title}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          )}
          {module && (
            <>
              <span className="text-gray-700 dark:text-gray-300">{module.title}</span>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-700 dark:text-gray-300">{topic.title}</span>
        </div>

        {/* Video player */}
        {topic.video_url && topic.video_url.includes('youtube.com/embed/') && (
          <div className="bg-gray-950 rounded-xl overflow-hidden mb-6 shadow-2xl">
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

        {/* Texto da aula - Expansível */}
        {(topic.content_before || topic.content_after) && (
          <div className="mb-6">
            <button
              onClick={() => setShowTextContent(!showTextContent)}
              className="w-full text-left bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Texto da aula
                  </h2>
                </div>
                <svg 
                  className={`w-6 h-6 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${showTextContent ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {showTextContent && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  {topic.content_before && (
                    <div className="mb-6">
                      <RichTextEditor 
                        value={topic.content_before}
                        readOnly={true}
                        minHeight="auto"
                      />
                    </div>
                  )}
                  {topic.content_after && (
                    <div>
                      <RichTextEditor 
                        value={topic.content_after}
                        readOnly={true}
                        minHeight="auto"
                      />
                    </div>
                  )}
                </div>
              )}
            </button>
          </div>
        )}

        {/* Barra de ações - Comentários, Likes, Imprimir */}
        <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-6">
            {/* Comentários */}
            <button
              onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-semibold">{comments.length}</span>
            </button>

          </div>

          {/* Botão Imprimir */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="hidden sm:inline font-semibold">Imprimir</span>
          </button>
        </div>

        {/* Attachments */}
        {topic.attachments && topic.attachments.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8 transition-colors duration-300">
            <h3 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">
              Material Complementar
            </h3>
            <div className="space-y-2">
              {topic.attachments.map(file => (
                <a
                  key={file.id}
                  href={file.url}
                  download
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {file.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments section */}
        <div id="comments-section" className="mt-8">
          <h2 className="text-gray-900 dark:text-gray-100 text-2xl font-bold mb-6 transition-colors duration-300">
            Comentários ({comments.length})
          </h2>

          {/* Add comment form */}
          {(user && user.id) ? (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors duration-300">
              <RichTextEditor
                value={newComment}
                onChange={setNewComment}
                placeholder="Compartilhe suas dúvidas ou reflexões sobre esta aula..."
                minHeight="200px"
                isAdmin={isAdmin()}
              />
              <button
                onClick={handleAddComment}
                className="mt-4 bg-amber-600 dark:bg-amber-500 text-white dark:text-black px-6 py-3 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 font-semibold"
              >
                Publicar Comentário
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6 text-center transition-colors duration-300">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Você precisa estar logado para comentar.
              </p>
              <Link 
                to="/login" 
                className="inline-block bg-amber-600 dark:bg-amber-500 text-white dark:text-black px-6 py-3 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 font-semibold"
              >
                Fazer Login
              </Link>
            </div>
          )}

          {/* Comments list */}
          <div>
            {comments.length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300 text-center py-8">
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
