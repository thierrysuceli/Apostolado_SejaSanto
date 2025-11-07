// =====================================================
// MODAL DE LINK DE CONTEÚDO - Versão Simplificada
// Modal para inserir links para cursos/posts/eventos/grupos
// =====================================================

import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const ContentLinkModal = ({ isOpen, onClose, onInsert }) => {
  const api = useApi();
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [step, setStep] = useState(1); // 1: tipo, 2: conteúdo, 3: tópico (opcional)
  const [selectedType, setSelectedType] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [topicList, setTopicList] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const contentTypes = [
    { id: 'courses', label: 'Curso', icon: '📚', path: '/courses' },
    { id: 'posts', label: 'Artigo/Post', icon: '📄', path: '/posts' },
    { id: 'events', label: 'Evento', icon: '📅', path: '/calendar' },
    { id: 'groups', label: 'Grupo (Central)', icon: '👥', path: '/central' }
  ];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedType(null);
      setSelectedContent(null);
      setSelectedTopic(null);
      setSearchTerm('');
    }
  }, [isOpen]);

  const loadContent = async (type) => {
    try {
      setLoading(true);
      let data = [];
      
      switch(type.id) {
        case 'courses':
          const coursesRes = await api.courses.getAll();
          data = coursesRes.courses || [];
          break;
        case 'posts':
          const postsRes = await api.posts.getAll();
          data = postsRes.posts || [];
          break;
        case 'events':
          const eventsRes = await api.events.getAll();
          data = eventsRes.events || [];
          break;
        case 'groups':
          const groupsRes = await api.groups.getAll();
          data = groupsRes.groups || [];
          break;
      }
      
      setContentList(data);
    } catch (err) {
      console.error('Erro ao carregar conteúdo:', err);
      setContentList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (course) => {
    try {
      setLoading(true);
      const courseRes = await api.courses.getById(course.id);
      const courseData = courseRes.course;
      
      const allTopics = [];
      if (courseData.modules) {
        courseData.modules.forEach(module => {
          if (module.topics) {
            module.topics.forEach(topic => {
              allTopics.push({
                ...topic,
                moduleName: module.title
              });
            });
          }
        });
      }
      
      setTopicList(allTopics);
    } catch (err) {
      console.error('Erro ao carregar tópicos:', err);
      setTopicList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = async (type) => {
    setSelectedType(type);
    await loadContent(type);
    setStep(2);
  };

  const handleContentSelect = async (content) => {
    setSelectedContent(content);
    
    // Se for curso, oferecer opção de selecionar tópico
    if (selectedType.id === 'courses') {
      await loadTopics(content);
      setStep(3);
    } else {
      // Para outros tipos, inserir direto
      insertLink(content, null);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    insertLink(selectedContent, topic);
  };

  const handleSkipTopic = () => {
    insertLink(selectedContent, null);
  };

  const insertLink = (content, topic) => {
    let url = '';
    let displayText = content.title || content.name || '';
    
    switch(selectedType.id) {
      case 'courses':
        if (topic) {
          url = `/courses/${content.id}/topics/${topic.id}`;
          displayText = `${content.title} - ${topic.title}`;
        } else {
          url = `/courses/${content.id}`;
        }
        break;
      case 'posts':
        url = `/posts/${content.id}`;
        break;
      case 'events':
        url = `/calendar?event=${content.id}`;
        break;
      case 'groups':
        url = `/central?group=${content.id}`;
        break;
    }

    onInsert({
      url,
      text: displayText,
      type: selectedType.id
    });
    
    onClose();
  };

  const filteredContent = contentList.filter(item => {
    const title = item.title || item.name || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredTopics = topicList.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Inserir Link de Conteúdo
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className={step >= 1 ? 'text-amber-500 font-semibold' : ''}>1. Tipo</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-amber-500 font-semibold' : ''}>2. Conteúdo</span>
            {selectedType?.id === 'courses' && (
              <>
                <span>→</span>
                <span className={step >= 3 ? 'text-amber-500 font-semibold' : ''}>3. Tópico (opcional)</span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Tipo de Conteúdo */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              {contentTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type)}
                  className={`p-6 rounded-xl border-2 ${
                    isDark
                      ? 'border-gray-700 hover:border-amber-500 hover:bg-gray-800'
                      : 'border-gray-200 hover:border-amber-500 hover:bg-amber-50'
                  } transition-all text-center group`}
                >
                  <div className="text-4xl mb-3">{type.icon}</div>
                  <div className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-500">
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Selecionar Conteúdo */}
          {step === 2 && (
            <div>
              {/* Search */}
              <input
                type="text"
                placeholder={`Buscar ${selectedType.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:border-amber-500 focus:outline-none mb-4`}
              />

              {/* Lista */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
              ) : filteredContent.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Nenhum conteúdo encontrado
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredContent.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleContentSelect(item)}
                      className={`w-full p-4 rounded-lg border-2 ${
                        isDark
                          ? 'border-gray-700 hover:border-amber-500 hover:bg-gray-800'
                          : 'border-gray-200 hover:border-amber-500 hover:bg-amber-50'
                      } transition-all text-left`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {item.title || item.name}
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.description.replace(/<[^>]*>/g, '')}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStep(1)}
                className="mt-4 text-gray-600 dark:text-gray-400 hover:text-amber-500 text-sm"
              >
                ← Voltar para seleção de tipo
              </button>
            </div>
          )}

          {/* Step 3: Selecionar Tópico (opcional, apenas cursos) */}
          {step === 3 && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Curso selecionado: <strong className="text-gray-900 dark:text-white">{selectedContent?.title}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Você pode selecionar um tópico específico ou pular esta etapa para linkar o curso inteiro.
                </p>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Buscar tópico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:border-amber-500 focus:outline-none mb-4`}
              />

              {/* Lista */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
              ) : filteredTopics.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Nenhum tópico encontrado
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                  {filteredTopics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className={`w-full p-4 rounded-lg border-2 ${
                        isDark
                          ? 'border-gray-700 hover:border-amber-500 hover:bg-gray-800'
                          : 'border-gray-200 hover:border-amber-500 hover:bg-amber-50'
                      } transition-all text-left`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {topic.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Módulo: {topic.moduleName}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSkipTopic}
                  className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold"
                >
                  Linkar Curso Inteiro
                </button>
                <button
                  onClick={() => setStep(2)}
                  className={`px-6 py-3 rounded-lg border-2 ${
                    isDark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'
                  } hover:border-amber-500`}
                >
                  ← Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentLinkModal;
