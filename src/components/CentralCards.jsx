import { useState } from 'react';

// =====================================================
// COMPONENTE: Poll Card
// =====================================================
export const PollCard = ({ poll, onVote, onDelete, onEdit, isAdmin }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleToggleOption = (optionId) => {
    if (poll.user_voted) return;

    if (poll.allow_multiple) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitVote = () => {
    if (selectedOptions.length === 0) return;
    onVote(poll.id, selectedOptions);
  };

  const getPercentage = (option) => {
    if (poll.total_votes === 0) return 0;
    return Math.round((option.votes?.length || 0) / poll.total_votes * 100);
  };

  const isEnded = poll.ends_at && new Date(poll.ends_at) < new Date();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-amber-500/10 min-w-[320px] max-w-[400px]">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-200 dark:border-gray-800/50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {poll.is_pinned && (
              <div className="flex items-center gap-2 text-amber-500 text-sm font-medium bg-amber-500/10 px-3 py-1 rounded-full w-fit mb-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.409 1.574 1.232 1.574H6.83l.943-.943a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414l.943.943h-.484c-1.588 0-2.798-1.534-2.24-2.84l.818-2.552a.75.75 0 011.436.459z" />
                </svg>
                <span>Fixado</span>
              </div>
            )}
            {poll.group_name && (
              <div className="text-xs text-amber-500 font-semibold mb-2">
                {poll.group_emoji} {poll.group_name}
              </div>
            )}
          </div>

          {/* Botões de Ação (Admin) */}
          {isAdmin && onEdit && onDelete && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(poll)}
                className="p-2 text-gray-700 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                title="Editar enquete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(poll.id)}
                className="p-2 text-gray-700 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                title="Deletar enquete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">{poll.question}</h3>
      
        {poll.description && (
          <p className="text-gray-700 dark:text-gray-400 text-sm mb-3">{poll.description}</p>
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {poll.author?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400 flex-wrap">
            <span className="font-medium text-gray-300">{poll.author?.name || 'Anônimo'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {poll.total_votes || 0} votos
            </span>
            {poll.ends_at && (
              <>
                <span>•</span>
                <span className={`flex items-center gap-1 ${isEnded ? 'text-red-400' : 'text-blue-400'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isEnded ? 'Encerrada' : `Até ${new Date(poll.ends_at).toLocaleDateString('pt-BR')}`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Opções */}
      <div className="p-4 space-y-2">
        {poll.options?.map((option) => (
          <div key={option.id}>
            {poll.user_voted || isEnded ? (
              // Mostrar resultados
              <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700">
                <div className="flex items-center justify-between p-3 relative z-10">
                  <span className="text-gray-900 dark:text-gray-200 font-medium">{option.text}</span>
                  <span className="text-amber-600 dark:text-amber-500 font-bold text-lg">{getPercentage(option)}%</span>
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-amber-200/50 to-amber-300/30 dark:from-amber-500/30 dark:to-amber-600/20 transition-all duration-500 ease-out"
                  style={{ width: `${getPercentage(option)}%` }}
                />
              </div>
            ) : (
              // Permitir votar
              <button
                onClick={() => handleToggleOption(option.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                  selectedOptions.includes(option.id)
                    ? 'border-amber-500 bg-amber-100 dark:bg-amber-500/20 text-gray-900 dark:text-white shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-gray-300 hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOptions.includes(option.id) ? 'border-amber-500 bg-amber-500' : 'border-gray-400 dark:border-gray-600'
                  }`}>
                    {selectedOptions.includes(option.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 pt-3">
        {!poll.user_voted && !isEnded && (
          <button
            onClick={handleSubmitVote}
            disabled={selectedOptions.length === 0}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-amber-500 disabled:hover:to-amber-600 shadow-lg hover:shadow-amber-500/50 transform hover:scale-[1.02]"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirmar Voto
            </span>
          </button>
        )}

        {poll.user_voted && (
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-500/50 rounded-lg text-green-700 dark:text-green-400 text-sm text-center font-medium">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Você já votou nesta enquete
            </span>
          </div>
        )}

        {isEnded && !poll.user_voted && (
          <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-medium">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Enquete encerrada
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// COMPONENTE: Registration Card
// =====================================================
export const RegistrationCard = ({ registration, onSubscribe, onDelete, onEdit, isAdmin }) => {
  const isOpen = registration.is_open && !registration.is_full;
  const canSubscribe = isOpen && !registration.user_subscribed;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-amber-500/10 min-w-[320px] max-w-[400px]">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-200 dark:border-gray-800/50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {registration.is_pinned && (
              <div className="flex items-center gap-2 mb-2 text-amber-500 text-sm font-medium bg-amber-500/10 px-3 py-1 rounded-full w-fit">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.409 1.574 1.232 1.574H6.83l.943-.943a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414l.943.943h-.484c-1.588 0-2.798-1.534-2.24-2.84l.818-2.552a.75.75 0 011.436.459z" />
                </svg>
                <span>Fixado</span>
              </div>
            )}
            {registration.group_name && (
              <div className="text-xs text-amber-500 font-semibold mb-2">
                {registration.group_emoji} {registration.group_name}
              </div>
            )}
          </div>

          {/* Botões de Ação (Admin) */}
          {isAdmin && onEdit && onDelete && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(registration)}
                className="p-2 text-gray-700 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                title="Editar inscrição"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(registration.id)}
                className="p-2 text-gray-700 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                title="Deletar inscrição"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight flex-1">{registration.title}</h3>
          {registration.role_to_grant_info && (
            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
              registration.role_to_grant_info?.color || 'bg-amber-500'
            } text-white shadow-lg`}>
              {registration.role_to_grant_info?.display_name}
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed text-sm">{registration.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-300 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 mb-1 text-xs font-medium">Participantes</p>
            <p className="text-gray-900 dark:text-white font-bold text-lg">
              {registration.approved_count || 0}
              {registration.max_participants && ` / ${registration.max_participants}`}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-300 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 mb-1 text-xs font-medium">Encerra em</p>
            <p className="text-gray-900 dark:text-white font-bold text-lg">
              {new Date(registration.registration_ends).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </p>
          </div>
        </div>

        {registration.approval_type === 'manual' && (
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/50 rounded-lg text-blue-300 text-sm font-medium">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Requer aprovação manual
            </span>
          </div>
        )}

        {registration.user_subscribed ? (
          <div className={`p-3 rounded-lg text-sm text-center font-medium ${
            registration.user_status === 'approved'
              ? 'bg-green-900/20 border border-green-500/50 text-green-400'
              : registration.user_status === 'pending'
              ? 'bg-yellow-900/20 border border-yellow-500/50 text-yellow-400'
              : 'bg-red-900/20 border border-red-500/50 text-red-400'
          }`}>
            {registration.user_status === 'approved' && '✓ Inscrito e aprovado!'}
            {registration.user_status === 'pending' && '⏳ Aguardando aprovação...'}
            {registration.user_status === 'rejected' && '✗ Inscrição rejeitada'}
          </div>
        ) : canSubscribe ? (
          <button
            onClick={() => onSubscribe(registration.id)}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg hover:shadow-amber-500/30"
          >
            Inscrever-se
          </button>
        ) : (
          <div className="p-3 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 text-sm text-center font-medium">
            {registration.is_full ? '🔒 Vagas esgotadas' : '⏰ Inscrições encerradas'}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// COMPONENTE: Event Card (para calendário)
// =====================================================
export const EventCard = ({ event }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-amber-500/10 min-w-[320px] max-w-[400px]">
      <div className="p-4">
        <div className="text-xs text-amber-500 font-semibold mb-2">📅 EVENTO</div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-tight">
          {event.title || event.name}
        </h3>

        {event.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
            {event.description.replace(/<[^>]*>/g, '')}
          </p>
        )}

        <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-500">
          {event.start_date && event.end_date && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(event.start_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {new Date(event.end_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
