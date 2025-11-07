// =====================================================
// CONTENT AUTOCOMPLETE - Autocompletar Links de Conteúdo
// Aparece quando usuário digita / no editor
// =====================================================

import { useState, useEffect, useRef } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const ContentAutocomplete = ({ position, onSelect, onClose, searchTerm }) => {
  const api = useApi();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [step, setStep] = useState('type'); // 'type', 'content', 'topic'
  const [selectedType, setSelectedType] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const contentTypes = [
    { id: 'courses', label: 'Cursos', icon: '📚', color: 'amber' },
    { id: 'posts', label: 'Posts', icon: '📄', color: 'blue' },
    { id: 'events', label: 'Eventos', icon: '📅', color: 'purple' },
    { id: 'groups', label: 'Central (Grupos)', icon: '👥', color: 'green' }
  ];

  // Resetar ao mudar searchTerm
  useEffect(() => {
    if (!searchTerm) {
      setStep('type');
      setSelectedType(null);
      setSelectedContent(null);
      setSelectedIndex(0);
    } else {
      // Parse do searchTerm para determinar step
      const parts = searchTerm.split('/').filter(Boolean);
      
      if (parts.length === 0) {
        setStep('type');
      } else if (parts.length === 1) {
        // Primeiro /: tipo de conteúdo
        const typeMatch = contentTypes.find(t => 
          t.label.toLowerCase().startsWith(parts[0].toLowerCase())
        );
        if (typeMatch) {
          setSelectedType(typeMatch);
          setStep('content');
          loadContent(typeMatch.id);
        } else {
          setStep('type');
        }
      } else if (parts.length === 2) {
        // Segundo /: nome do conteúdo
        const typeMatch = contentTypes.find(t => 
          t.label.toLowerCase().startsWith(parts[0].toLowerCase())
        );
        if (typeMatch && selectedType?.id !== typeMatch.id) {
          setSelectedType(typeMatch);
          loadContent(typeMatch.id);
        }
        setStep('content');
      } else if (parts.length === 3 && selectedType?.id === 'courses') {
        // Terceiro / (opcional, apenas para cursos): tópico específico
        setStep('topic');
        if (selectedContent) {
          loadTopics(selectedContent.id);
        }
      }
    }
  }, [searchTerm]);

  const loadContent = async (type) => {
    try {
      setLoading(true);
      let data = [];
      
      switch(type) {
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

  const loadTopics = async (courseId) => {
    try {
      setLoading(true);
      const courseRes = await api.courses.getById(courseId);
      const course = courseRes.course;
      
      // Extrair todos os tópicos de todos os módulos
      const allTopics = [];
      if (course.modules) {
        course.modules.forEach(module => {
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

  // Filtrar lista baseado no searchTerm
  useEffect(() => {
    const parts = searchTerm.split('/').filter(Boolean);
    const query = parts[parts.length - 1]?.toLowerCase() || '';

    if (step === 'type') {
      const filtered = contentTypes.filter(type =>
        type.label.toLowerCase().includes(query)
      );
      setFilteredList(filtered);
    } else if (step === 'content') {
      const filtered = contentList.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query)
      );
      setFilteredList(filtered);
    } else if (step === 'topic') {
      const filtered = topicList.filter(topic =>
        topic.title?.toLowerCase().includes(query)
      );
      setFilteredList(filtered);
    }
    
    setSelectedIndex(0);
  }, [step, searchTerm, contentList, topicList]);

  // Navegação com teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredList.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredList[selectedIndex]) {
          handleSelect(filteredList[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredList, selectedIndex]);

  const handleSelect = (item) => {
    if (step === 'type') {
      setSelectedType(item);
      setStep('content');
      loadContent(item.id);
    } else if (step === 'content') {
      setSelectedContent(item);
      
      // Se for curso, perguntar se quer especificar tópico
      if (selectedType.id === 'courses') {
        // Por enquanto, completar direto (pode adicionar opção de tópico depois)
        completeLink(item, null);
      } else {
        completeLink(item, null);
      }
    } else if (step === 'topic') {
      completeLink(selectedContent, item);
    }
  };

  const completeLink = (content, topic) => {
    let url = '';
    let displayName = content.title || content.name || '';
    
    switch(selectedType.id) {
      case 'courses':
        url = topic 
          ? `/courses/${content.id}/topics/${topic.id}`
          : `/courses/${content.id}`;
        if (topic) {
          displayName += ` - ${topic.title}`;
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

    onSelect({
      type: selectedType.id.slice(0, -1), // Remove 's' do plural
      id: topic?.id || content.id,
      name: displayName,
      url: url
    });
  };

  if (!position) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 ${isDark ? 'bg-gray-900' : 'bg-white'} border-2 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } rounded-lg shadow-2xl w-80 max-h-96 overflow-hidden`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      {/* Header */}
      <div className={`px-4 py-2 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {step === 'type' && '1. Selecione o tipo de conteúdo'}
            {step === 'content' && `2. Selecione ${selectedType?.label}`}
            {step === 'topic' && '3. Selecione o tópico (opcional)'}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        {step !== 'type' && (
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              {selectedType?.icon} {selectedType?.label}
            </span>
            {selectedContent && (
              <>
                <span>→</span>
                <span className="truncate">{selectedContent.title || selectedContent.name}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Lista */}
      <div className="overflow-y-auto max-h-80">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <p className="text-sm">Nenhum resultado encontrado</p>
            <p className="text-xs mt-1">Tente digitar algo diferente</p>
          </div>
        ) : (
          <ul>
            {filteredList.map((item, index) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? `${isDark ? 'bg-amber-900/30' : 'bg-amber-50'} border-l-4 border-amber-500`
                    : `${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`
                }`}
              >
                <div className="flex items-center gap-3">
                  {step === 'type' ? (
                    <>
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {item.label}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {item.title || item.name}
                        </p>
                        {item.moduleName && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Módulo: {item.moduleName}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer com dicas */}
      <div className={`px-4 py-2 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } text-xs text-gray-500`}>
        <div className="flex items-center gap-4">
          <span>↑↓ Navegar</span>
          <span>Enter Selecionar</span>
          <span>Esc Fechar</span>
        </div>
      </div>
    </div>
  );
};

export default ContentAutocomplete;
