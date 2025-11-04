import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';

const ModuleTopicEditor = ({ modules, courseId, onSave, onCancel }) => {
  const [editingModules, setEditingModules] = useState(modules || []);
  const [expandedModuleIndex, setExpandedModuleIndex] = useState(null);
  const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);

  // Adicionar novo módulo
  const addModule = () => {
    setEditingModules([
      ...editingModules,
      {
        id: `temp-${Date.now()}`,
        title: '',
        description: '',
        order_index: editingModules.length,
        topics: [],
        isNew: true
      }
    ]);
  };

  // Adicionar novo tópico a um módulo
  const addTopic = (moduleIndex) => {
    const updatedModules = [...editingModules];
    const module = updatedModules[moduleIndex];
    module.topics = module.topics || [];
    module.topics.push({
      id: `temp-topic-${Date.now()}`,
      title: '',
      content_before: '',
      video_url: '',
      content_after: '',
      order_index: module.topics.length,
      isNew: true
    });
    setEditingModules(updatedModules);
    setExpandedTopicIndex(module.topics.length - 1);
  };

  // Atualizar módulo
  const updateModule = (index, field, value) => {
    const updatedModules = [...editingModules];
    updatedModules[index][field] = value;
    setEditingModules(updatedModules);
  };

  // Atualizar tópico
  const updateTopic = (moduleIndex, topicIndex, field, value) => {
    const updatedModules = [...editingModules];
    updatedModules[moduleIndex].topics[topicIndex][field] = value;
    setEditingModules(updatedModules);
  };

  // Remover módulo
  const removeModule = (index) => {
    if (window.confirm('Deseja realmente remover este módulo e todos os seus tópicos?')) {
      const updatedModules = editingModules.filter((_, i) => i !== index);
      setEditingModules(updatedModules);
    }
  };

  // Remover tópico
  const removeTopic = (moduleIndex, topicIndex) => {
    if (window.confirm('Deseja realmente remover este tópico?')) {
      const updatedModules = [...editingModules];
      updatedModules[moduleIndex].topics = updatedModules[moduleIndex].topics.filter((_, i) => i !== topicIndex);
      setEditingModules(updatedModules);
    }
  };

  // Extrair ID do vídeo do YouTube
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-gray-200">
          Módulos e Tópicos
        </h3>
        <button
          type="button"
          onClick={addModule}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Adicionar Módulo
        </button>
      </div>

      {editingModules.length === 0 && (
        <div className="text-center py-8 text-secondary-500 dark:text-gray-400">
          Nenhum módulo adicionado. Clique em "Adicionar Módulo" para começar.
        </div>
      )}

      {editingModules.map((module, moduleIndex) => (
        <div
          key={module.id}
          className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
        >
          {/* Cabeçalho do Módulo */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={module.title}
                onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                placeholder="Título do Módulo"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 font-semibold"
              />
              <textarea
                value={module.description || ''}
                onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                placeholder="Descrição do módulo (opcional)"
                rows={2}
                className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExpandedModuleIndex(expandedModuleIndex === moduleIndex ? null : moduleIndex)}
                className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                title={expandedModuleIndex === moduleIndex ? 'Recolher' : 'Expandir'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={expandedModuleIndex === moduleIndex ? "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" : "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"} clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => removeModule(moduleIndex)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                title="Remover Módulo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tópicos do Módulo */}
          {expandedModuleIndex === moduleIndex && (
            <div className="ml-4 space-y-4 border-l-2 border-primary-300 dark:border-primary-700 pl-4">
              <button
                type="button"
                onClick={() => addTopic(moduleIndex)}
                className="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 text-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Adicionar Tópico/Aula
              </button>

              {module.topics && module.topics.length > 0 ? (
                module.topics.map((topic, topicIndex) => (
                  <div
                    key={topic.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                  >
                    {/* Cabeçalho do Tópico */}
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={topic.title}
                        onChange={(e) => updateTopic(moduleIndex, topicIndex, 'title', e.target.value)}
                        placeholder="Título do Tópico/Aula"
                        className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200 font-medium"
                      />
                      <div className="flex gap-2 ml-2">
                        <button
                          type="button"
                          onClick={() => setExpandedTopicIndex(expandedTopicIndex === topicIndex ? null : topicIndex)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded text-sm"
                        >
                          {expandedTopicIndex === topicIndex ? '▲' : '▼'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTopic(moduleIndex, topicIndex)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Conteúdo do Tópico */}
                    {expandedTopicIndex === topicIndex && (
                      <div className="space-y-4">
                        {/* Conteúdo Antes do Vídeo */}
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                            Conteúdo Antes do Vídeo
                          </label>
                          <RichTextEditor
                            value={topic.content_before || ''}
                            onChange={(content) => updateTopic(moduleIndex, topicIndex, 'content_before', content)}
                            placeholder="Introdução da aula, conceitos, etc..."
                          />
                        </div>

                        {/* URL do Vídeo do YouTube */}
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                            Vídeo do YouTube (URL)
                          </label>
                          <input
                            type="text"
                            value={topic.video_url || ''}
                            onChange={(e) => updateTopic(moduleIndex, topicIndex, 'video_url', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-secondary-900 dark:text-gray-200"
                          />
                          {topic.video_url && getYouTubeVideoId(topic.video_url) && (
                            <div className="mt-3 aspect-video rounded-lg overflow-hidden">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(topic.video_url)}`}
                                title="Preview do vídeo"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}
                        </div>

                        {/* Conteúdo Depois do Vídeo */}
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                            Conteúdo Depois do Vídeo
                          </label>
                          <RichTextEditor
                            value={topic.content_after || ''}
                            onChange={(content) => updateTopic(moduleIndex, topicIndex, 'content_after', content)}
                            placeholder="Conclusão, exercícios, materiais complementares..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-secondary-500 dark:text-gray-400 text-center py-4">
                  Nenhum tópico/aula neste módulo
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Botões de Ação */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave(editingModules)}
          className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Salvar Todos os Módulos e Tópicos
        </button>
      </div>
    </div>
  );
};

export default ModuleTopicEditor;
