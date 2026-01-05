// =====================================================
// COMPONENTE: Formulário de Inscrição (Usuário)
// =====================================================

import { useState, useEffect } from 'react';

export default function RegistrationForm({ questions, onSubmit, submitting }) {
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Limpar erro ao responder
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (questionId, option) => {
    const current = responses[questionId] || [];
    const newValue = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    
    setResponses(prev => ({
      ...prev,
      [questionId]: newValue
    }));
    
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateAndSubmit = () => {
    const newErrors = {};
    
    // Validar perguntas obrigatórias
    questions.forEach(q => {
      if (q.required) {
        const response = responses[q.id];
        if (!response || (Array.isArray(response) && response.length === 0) || response.trim?.() === '') {
          newErrors[q.id] = 'Esta pergunta é obrigatória';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(responses);
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        📝 Formulário de Inscrição
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Responda as perguntas abaixo para completar sua inscrição
      </p>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              {index + 1}. {question.question_text}
              {question.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>

            {/* Texto livre */}
            {question.question_type === 'text' && (
              <textarea
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                placeholder="Sua resposta..."
              />
            )}

            {/* Múltipla escolha - única */}
            {question.question_type === 'single_choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-amber-500 dark:hover:border-amber-500 transition">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={responses[question.id] === option}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="w-4 h-4 text-amber-500"
                    />
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Múltipla escolha - várias */}
            {question.question_type === 'multiple_choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-amber-500 dark:hover:border-amber-500 transition">
                    <input
                      type="checkbox"
                      checked={(responses[question.id] || []).includes(option)}
                      onChange={() => handleCheckboxChange(question.id, option)}
                      className="w-4 h-4 text-amber-500"
                    />
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {errors[question.id] && (
              <p className="text-sm text-red-500">{errors[question.id]}</p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={validateAndSubmit}
        disabled={submitting}
        className="mt-6 w-full px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-semibold disabled:opacity-50"
      >
        {submitting ? 'Enviando...' : 'Confirmar Inscrição'}
      </button>
    </div>
  );
}
