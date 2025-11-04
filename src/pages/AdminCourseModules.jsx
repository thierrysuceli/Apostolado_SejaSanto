import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from '../components/RichTextEditor';

const AdminCourseModules = () => {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();
  const api = useApi();
  const { isAdmin } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  
  // Form states
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', order_index: 0 });
  const [topicForm, setTopicForm] = useState({
    title: '',
    content_before: '',
    video_url: '',
    content_after: '',
    duration: '',
    order_index: 0
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await api.courses.getById(id);
      setCourse(data.course);
      setModules(data.course.modules || []);
    } catch (err) {
      console.error('Error loading course:', err);
      setError('Erro ao carregar curso');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = () => {
    setEditingModule(null);
    setModuleForm({ title: '', description: '', order_index: modules.length });
    setShowModuleModal(true);
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description || '',
      order_index: module.order_index
    });
    setShowModuleModal(true);
  };

  const handleSaveModule = async () => {
    try {
      if (!moduleForm.title.trim()) {
        alert('O título do módulo é obrigatório');
        return;
      }

      if (editingModule) {
        // Update existing module
        await api.modules.update(editingModule.id, moduleForm);
      } else {
        // Create new module
        await api.modules.create({
          ...moduleForm,
          course_id: id
        });
      }

      setShowModuleModal(false);
      await loadCourse();
    } catch (err) {
      console.error('Error saving module:', err);
      alert('Erro ao salvar módulo: ' + err.message);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Tem certeza que deseja deletar este módulo? Todos os tópicos dentro dele também serão deletados.')) {
      return;
    }

    try {
      await api.modules.delete(moduleId);
      await loadCourse();
    } catch (err) {
      console.error('Error deleting module:', err);
      alert('Erro ao deletar módulo: ' + err.message);
    }
  };

  const handleCreateTopic = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    setSelectedModuleId(moduleId);
    setEditingTopic(null);
    setTopicForm({
      title: '',
      content_before: '',
      video_url: '',
      content_after: '',
      duration: '',
      order_index: module?.topics?.length || 0
    });
    setShowTopicModal(true);
  };

  const handleEditTopic = (topic, moduleId) => {
    setSelectedModuleId(moduleId);
    setEditingTopic(topic);
    setTopicForm({
      title: topic.title,
      content_before: topic.content_before || '',
      video_url: topic.video_url || '',
      content_after: topic.content_after || '',
      duration: topic.duration || '',
      order_index: topic.order_index
    });
    setShowTopicModal(true);
  };

  const handleSaveTopic = async () => {
    try {
      if (!topicForm.title.trim()) {
        alert('O título do tópico é obrigatório');
        return;
      }

      // Sanitize and convert YouTube URL to embed format before saving
      let videoUrl = topicForm.video_url?.trim() || '';
      
      // Remove HTML tags if present (sanitization)
      videoUrl = videoUrl.replace(/<[^>]*>/g, '').trim();
      
      if (videoUrl) {
        // Convert to embed format
        if (videoUrl.includes('youtube.com/watch?v=')) {
          const videoId = videoUrl.split('v=')[1]?.split('&')[0];
          if (videoId) {
            videoUrl = `https://www.youtube.com/embed/${videoId}`;
          }
        } else if (videoUrl.includes('youtu.be/')) {
          const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
          if (videoId) {
            videoUrl = `https://www.youtube.com/embed/${videoId}`;
          }
        }
        
        // Validate final URL format
        if (videoUrl && !videoUrl.includes('youtube.com/embed/')) {
          console.warn('URL do YouTube não está no formato embed correto:', videoUrl);
        }
      }

      const topicData = { ...topicForm, video_url: videoUrl };

      if (editingTopic) {
        // Update existing topic
        await api.topics.update(editingTopic.id, topicData);
      } else {
        // Create new topic
        await api.topics.create({
          ...topicData,
          module_id: selectedModuleId
        });
      }

      setShowTopicModal(false);
      await loadCourse();
    } catch (err) {
      console.error('Error saving topic:', err);
      alert('Erro ao salvar tópico: ' + err.message);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!confirm('Tem certeza que deseja deletar este tópico?')) {
      return;
    }

    try {
      await api.topics.delete(topicId);
      await loadCourse();
    } catch (err) {
      console.error('Error deleting topic:', err);
      alert('Erro ao deletar tópico: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/admin/courses/${id}/edit`)}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para Editar Curso
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-secondary-500 dark:text-gray-400 mb-2">
                Gerenciar Módulos e Aulas
              </h1>
              <p className="text-secondary-600 dark:text-gray-300">
                {course?.title}
              </p>
            </div>
            
            <button
              onClick={handleCreateModule}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Novo Módulo
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Modules List */}
        <div className="space-y-6">
          {modules.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 text-center">
              <p className="text-secondary-600 dark:text-gray-300 mb-4">
                Nenhum módulo criado ainda.
              </p>
              <button
                onClick={handleCreateModule}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
              >
                Criar Primeiro Módulo
              </button>
            </div>
          ) : (
            modules.map((module, moduleIndex) => (
              <div key={module.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                {/* Module Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">
                        Módulo {moduleIndex + 1}: {module.title}
                      </h2>
                      {module.description && (
                        <div 
                          className="text-primary-100"
                          dangerouslySetInnerHTML={{ __html: module.description }}
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditModule(module)}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        title="Editar módulo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Deletar módulo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCreateTopic(module.id)}
                    className="mt-4 bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2 text-sm font-semibold"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nova Aula
                  </button>
                </div>

                {/* Topics List */}
                <div className="p-6">
                  {(!module.topics || module.topics.length === 0) ? (
                    <p className="text-secondary-600 dark:text-gray-300 text-center py-4">
                      Nenhuma aula criada neste módulo.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {module.topics.map((topic, topicIndex) => (
                        <div
                          key={topic.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-600 dark:hover:border-primary-500 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-secondary-700 dark:text-gray-200 mb-1">
                                Aula {topicIndex + 1}: {topic.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-gray-400">
                                {topic.duration && (
                                  <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    {topic.duration}
                                  </span>
                                )}
                                {topic.video_url && (
                                  <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                    </svg>
                                    Vídeo
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditTopic(topic, module.id)}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Editar aula"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTopic(topic.id)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Deletar aula"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Module Modal */}
        {showModuleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-4">
                  {editingModule ? 'Editar Módulo' : 'Novo Módulo'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200"
                      placeholder="Ex: Introdução ao Tema"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200"
                      placeholder="Breve descrição do módulo..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSaveModule}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
                  >
                    {editingModule ? 'Salvar' : 'Criar Módulo'}
                  </button>
                  <button
                    onClick={() => setShowModuleModal(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Topic Modal */}
        {showTopicModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary-700 dark:text-gray-200 mb-4">
                  {editingTopic ? 'Editar Aula' : 'Nova Aula'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                      Título da Aula *
                    </label>
                    <input
                      type="text"
                      value={topicForm.title}
                      onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200"
                      placeholder="Ex: Aula 1 - Conceitos Básicos"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                        URL do Vídeo (YouTube)
                      </label>
                      <input
                        type="text"
                        value={topicForm.video_url}
                        onChange={(e) => {
                          setTopicForm({ ...topicForm, video_url: e.target.value });
                        }}
                        onBlur={(e) => {
                          let url = e.target.value.trim();
                          if (!url) return;
                          
                          // Remove HTML tags (sanitization)
                          url = url.replace(/<[^>]*>/g, '').trim();
                          if (!url) return;
                          
                          // Auto-convert YouTube URL to embed format
                          if (url.includes('youtube.com/watch?v=')) {
                            const videoId = url.split('v=')[1]?.split('&')[0];
                            if (videoId) {
                              url = `https://www.youtube.com/embed/${videoId}`;
                            }
                          } else if (url.includes('youtu.be/')) {
                            const videoId = url.split('youtu.be/')[1]?.split('?')[0];
                            if (videoId) {
                              url = `https://www.youtube.com/embed/${videoId}`;
                            }
                          }
                          
                          if (url !== e.target.value.trim()) {
                            setTopicForm({ ...topicForm, video_url: url });
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200"
                        placeholder="Cole qualquer URL do YouTube (será convertido automaticamente)"
                      />
                      <p className="text-xs text-secondary-500 dark:text-gray-400 mt-1">
                        ✨ Cole a URL normal do YouTube (ex: youtube.com/watch?v=xxx) - converteremos automaticamente!
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                        Duração
                      </label>
                      <input
                        type="text"
                        value={topicForm.duration}
                        onChange={(e) => setTopicForm({ ...topicForm, duration: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200"
                        placeholder="Ex: 15 min"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                      Conteúdo Antes do Vídeo
                    </label>
                    <RichTextEditor
                      value={topicForm.content_before || ''}
                      onChange={(content) => setTopicForm({ ...topicForm, content_before: content })}
                      placeholder="Texto introdutório, contexto, objetivos..."
                      minHeight="150px"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                      Conteúdo Depois do Vídeo
                    </label>
                    <RichTextEditor
                      value={topicForm.content_after || ''}
                      onChange={(content) => setTopicForm({ ...topicForm, content_after: content })}
                      placeholder="Resumo, exercícios, reflexões..."
                      minHeight="150px"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSaveTopic}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
                  >
                    {editingTopic ? 'Salvar' : 'Criar Aula'}
                  </button>
                  <button
                    onClick={() => setShowTopicModal(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseModules;
