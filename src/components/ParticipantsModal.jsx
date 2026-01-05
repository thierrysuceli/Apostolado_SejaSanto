// =====================================================
// COMPONENTE: Modal de Participantes com Respostas
// =====================================================

import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';

export default function ParticipantsModal({ registrationId, onClose, onCancel, onApprove, onReject }) {
  const api = useApi();
  const [participants, setParticipants] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [actionLoading, setActionLoading] = useState(null); // ID do participante sendo processado

  useEffect(() => {
    loadParticipants();
  }, [registrationId]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await api.registrations.getParticipants(registrationId);
      setParticipants(data.participants || []);
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Error loading participants:', error);
      alert('Erro ao carregar participantes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (participantId) => {
    if (!confirm('Tem certeza que deseja cancelar esta inscrição?')) return;

    try {
      setActionLoading(participantId);
      await onCancel(participantId);
      await loadParticipants();
    } catch (error) {
      console.error('Error canceling:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (participantId) => {
    try {
      setActionLoading(participantId);
      await onApprove(participantId);
      await loadParticipants();
    } catch (error) {
      console.error('Error approving:', error);
      alert('Erro ao aprovar inscrição');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (participantId) => {
    if (!confirm('Tem certeza que deseja rejeitar esta inscrição?')) return;

    try {
      setActionLoading(participantId);
      await onReject(participantId);
      await loadParticipants();
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Erro ao rejeitar inscrição');
    } finally {
      setActionLoading(null);
    }
  };

  const getResponse = (participantResponses, questionId) => {
    if (!participantResponses || !participantResponses[questionId]) {
      return '(Não respondido)';
    }
    
    const response = participantResponses[questionId];
    if (Array.isArray(response)) {
      return response.join(', ');
    }
    return response;
  };

  const filteredParticipants = participants.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    };
    
    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            👥 Participantes Inscritos
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Todos ({participants.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === 'pending'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Pendentes ({participants.filter(p => p.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === 'approved'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Aprovados ({participants.filter(p => p.status === 'approved').length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : filteredParticipants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum participante encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {filteredParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {participant.user?.avatar_url && participant.user_id !== null && (
                        <img
                          src={participant.user.avatar_url}
                          alt={participant.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {participant.user_id === null ? participant.guest_name : (participant.user?.name || 'Usuário Desconhecido')}
                          {participant.user_id === null && (
                            <span className="ml-2 text-xs font-normal text-amber-600 dark:text-amber-400">
                              (Visitante)
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {participant.user_id === null ? 'Sem cadastro' : (participant.user?.email || 'Email não disponível')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(participant.status)}
                      
                      {/* Botões de ação */}
                      {participant.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(participant.id)}
                            disabled={actionLoading === participant.id}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition disabled:opacity-50"
                            title="Aprovar inscrição"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReject(participant.id)}
                            disabled={actionLoading === participant.id}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition disabled:opacity-50"
                            title="Rejeitar inscrição"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleCancel(participant.id)}
                        disabled={actionLoading === participant.id}
                        className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition disabled:opacity-50"
                        title="Cancelar inscrição"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Respostas */}
                  {questions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setSelectedParticipant(
                          selectedParticipant?.id === participant.id ? null : participant
                        )}
                        className="text-sm font-semibold text-amber-500 hover:text-amber-600 transition"
                      >
                        {selectedParticipant?.id === participant.id ? '▼' : '▶'} Ver Respostas do Formulário
                      </button>

                      {selectedParticipant?.id === participant.id && (
                        <div className="mt-3 space-y-3">
                          {questions.map((q, index) => (
                            <div key={q.id} className="text-sm">
                              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                {index + 1}. {q.question_text}
                              </p>
                              <p className="text-gray-700 dark:text-gray-300 pl-4">
                                {getResponse(participant.form_responses, q.id)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Inscrito em: {new Date(participant.registered_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
