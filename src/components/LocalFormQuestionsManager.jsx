// =====================================================
// COMPONENTE: Gerenciador LOCAL de Perguntas (sem API)
// Usado na CRIAÇÃO de inscrições
// =====================================================

import { useState } from 'react';

export default function LocalFormQuestionsManager({ questions, onChange }) {
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_type: 'text',
    options: [],
    required: false
  });
  
  const [optionInput, setOptionInput] = useState('');

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setNewQuestion(prev => ({
        ...prev,
        options: [...prev.options, optionInput.trim()]
      }));
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleCreateQuestion = () => {
    if (!newQuestion.question_text.trim()) {
      alert('Digite a pergunta');
      return;
    }

    if ((newQuestion.question_type === 'single' || newQuestion.question_type === 'multiple') && newQuestion.options.length < 2) {
      alert('Adicione pelo menos 2 opções');
      return;
    }

    const questionToAdd = {
      ...newQuestion,
      id: Date.now(), // ID temporário
      options: ['single', 'multiple'].includes(newQuestion.question_type) ? newQuestion.options : null
    };

    onChange([...questions, questionToAdd]);
    
    setNewQuestion({
      question_text: '',
      question_type: 'text',
      options: [],
      required: false
    });
  };

  const handleDeleteQuestion = (questionId) => {
    if (!confirm('Tem certeza que deseja deletar esta pergunta?')) return;
    onChange(questions.filter(q => q.id !== questionId));
  };

  const questionTypeLabels = {
    text: 'Texto',
    single: 'Múltipla Escolha (única)',
    multiple: 'Múltipla Escolha (várias)'
  };

  return (
    <div className="space-y-6">
      <div className="border-t pt-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📝 Formulário de Inscrição
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Adicione perguntas que os usuários deverão responder ao se inscrever
        </p>

        {/* Lista de perguntas existentes */}
        {questions.length > 0 && (
          <div className="space-y-3 mb-6">
            {questions.map((q, index) => (
              <div key={q.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {index + 1}. {q.question_text}
                      </span>
                      {q.required && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">
                          Obrigatória
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tipo: {questionTypeLabels[q.question_type]}
                    </p>
                    {q.options && q.options.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Opções: {q.options.join(', ')}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulário para nova pergunta */}
        <div className="p-4 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Pergunta
            </label>
            <input
              type="text"
              value={newQuestion.question_text}
              onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
              placeholder="Ex: Qual sua motivação para participar?"
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Resposta
            </label>
            <select
              value={newQuestion.question_type}
              onChange={(e) => setNewQuestion({ ...newQuestion, question_type: e.target.value, options: [] })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="text">Texto (resposta livre)</option>
              <option value="single">Múltipla Escolha (escolher 1)</option>
              <option value="multiple">Múltipla Escolha (escolher várias)</option>
            </select>
          </div>

          {/* Opções para múltipla escolha */}
          {(newQuestion.question_type === 'single' || newQuestion.question_type === 'multiple') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Opções
              </label>
              <div className="space-y-2">
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-gray-900 dark:text-white">
                      {option}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                    placeholder="Digite uma opção"
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={newQuestion.required}
              onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="required" className="text-sm text-gray-700 dark:text-gray-300">
              Pergunta obrigatória
            </label>
          </div>

          <button
            type="button"
            onClick={handleCreateQuestion}
            className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-semibold"
          >
            + Adicionar Pergunta
          </button>
        </div>
      </div>
    </div>
  );
}
