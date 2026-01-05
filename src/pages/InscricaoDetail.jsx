import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import DOMPurify from 'isomorphic-dompurify';
import RegistrationForm from '../components/RegistrationForm';
import WelcomeModal from '../components/WelcomeModal';

// 🎨 Modal de Confirmação Customizado
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full border-2 border-amber-500 shadow-2xl">
        <h3 className="text-xl font-bold text-secondary-700 dark:text-gray-200 mb-3">{title}</h3>
        <p className="text-secondary-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processando...
              </>
            ) : (
              'Confirmar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const InscricaoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loadUser } = useAuth();
  const api = useApi();
  
  const [inscricao, setInscricao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [userParticipation, setUserParticipation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    loadInscricao();
  }, [id]);

  // 🔄 RECARREGAR quando user logar/deslogar
  useEffect(() => {
    if (!loading) {
      console.log('[InscricaoDetail] User changed, reloading...', { hasUser: !!user });
      loadInscricao();
    }
  }, [user]);

  const loadInscricao = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await api.registrations.getById(id);
      console.log('[InscricaoDetail] Loaded data:', {
        registration: data.registration?.title,
        allow_guest_registration: data.registration?.allow_guest_registration, // 🔍 DEBUG
        userParticipation: data.user_participation,
        hasToken: !!localStorage.getItem('token')
      });
      
      setInscricao(data.registration);
      setUserParticipation(data.user_participation || null);
      
      console.log('[InscricaoDetail] UserParticipation set to:', data.user_participation);
      
      // Carregar perguntas do formulário
      try {
        const questionsData = await api.registrations.getQuestions(id);
        setQuestions(questionsData.questions || []);
      } catch (err) {
        console.error('Error loading questions:', err);
        setQuestions([]);
      }
    } catch (err) {
      console.error('Error loading inscricao:', err);
      setError('Erro ao carregar inscrição');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    // 🆕 Se permite guest e não está logado, mostrar formulário sempre (que inclui campo de nome)
    if (!user && !inscricao?.allow_guest_registration) {
      alert('Você precisa estar logado para se inscrever');
      navigate('/login');
      return;
    }

    // 🆕 Se é guest E não tem perguntas, ainda assim mostrar formulário (só com campo de nome)
    if (!user && inscricao?.allow_guest_registration) {
      setShowFormModal(true);
      return;
    }

    // Se tem perguntas, mostrar formulário
    if (questions.length > 0) {
      setShowFormModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };
  
  const confirmSubscribe = async (payload = {}) => {
    try {
      setSubmitting(true);
      // payload agora pode conter { form_responses, guest_name }
      const result = await api.registrations.subscribe(id, payload.form_responses || payload, payload.guest_name);
      setShowConfirmModal(false);
      setShowFormModal(false);
      
      // Recarregar user para atualizar roles ANTES de recarregar inscrição
      if (user && loadUser) {
        console.log('[InscricaoDetail] Reloading user to update roles...');
        await loadUser();
      }
      
      // Pequeno delay para garantir que o banco atualizou
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('[InscricaoDetail] Reloading inscription to update status...');
      await loadInscricao(); // Recarregar para atualizar status
      
      // 🎉 Mostrar modal de boas-vindas se aprovação automática e tiver mensagem
      console.log('[InscricaoDetail] Welcome check:', {
        approvalType: inscricao?.approval_type,
        hasWelcomeMessage: !!inscricao?.welcome_message,
        welcomeMessage: inscricao?.welcome_message
      });
      
      if (inscricao?.approval_type === 'automatic' && inscricao?.welcome_message) {
        console.log('[InscricaoDetail] Showing welcome modal!');
        setShowWelcome(true);
      } else if (result.message) {
        alert(result.message);
      }
    } catch (err) {
      console.error('Error subscribing:', err);
      alert(err.response?.data?.error || 'Erro ao se inscrever');
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = () => {
    if (!inscricao) return null;
    
    const now = new Date();
    const starts = new Date(inscricao.registration_starts);
    const ends = new Date(inscricao.registration_ends);
    
    console.log('[getStatusInfo] Checking status:', {
      userParticipation,
      isActive: inscricao.is_active,
      now: now.toISOString(),
      starts: starts.toISOString(),
      ends: ends.toISOString()
    });
    
    if (!inscricao.is_active) {
      return { status: 'inactive', label: 'Inscrição Inativa', color: 'gray', canSubscribe: false };
    }
    
    if (now < starts) {
      return { status: 'upcoming', label: 'Em Breve', color: 'blue', canSubscribe: false };
    }
    
    if (now > ends) {
      return { status: 'closed', label: 'Inscrições Encerradas', color: 'red', canSubscribe: false };
    }
    
    if (inscricao.max_participants && inscricao.participants_count >= inscricao.max_participants) {
      return { status: 'full', label: 'Vagas Esgotadas', color: 'orange', canSubscribe: false };
    }
    
    // 🔍 VERIFICAR STATUS DO USUÁRIO
    if (userParticipation) {
      console.log('[getStatusInfo] User has participation:', userParticipation.status);
      
      if (userParticipation.status === 'pending') {
        return { status: 'pending', label: 'Aguardando Aprovação', color: 'yellow', canSubscribe: false };
      }
      if (userParticipation.status === 'approved') {
        return { status: 'approved', label: 'Inscrito ✓', color: 'green', canSubscribe: false };
      }
      if (userParticipation.status === 'rejected') {
        return { status: 'rejected', label: 'Inscrição Recusada', color: 'red', canSubscribe: false };
      }
    }
    
    return { status: 'open', label: 'Inscrições Abertas', color: 'green', canSubscribe: true };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beige-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !inscricao) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-beige-50 to-white dark:from-gray-950 dark:to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error || 'Inscrição não encontrada'}
          </div>
          <button
            onClick={() => navigate('/inscricoes')}
            className="mt-4 text-amber-500 hover:text-amber-600 font-medium"
          >
            ← Voltar para Inscrições
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <>
      <Helmet>
        <title>{inscricao.title} | Inscrições</title>
        <meta name="description" content={inscricao.description?.replace(/<[^>]*>/g, '').substring(0, 160)} />
      </Helmet>
      
      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmSubscribe}
        title="Confirmar Inscrição"
        message={`Deseja se inscrever em "${inscricao.title}"? ${inscricao.approval_type === 'manual' ? 'Sua inscrição ficará pendente até ser aprovada por um administrador.' : 'Você receberá o cargo imediatamente.'}`}
        loading={submitting}
      />

      <div className="min-h-screen bg-gradient-to-b from-beige-50 to-white dark:from-gray-950 dark:to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/inscricoes')}
            className="mb-6 text-amber-500 hover:text-amber-600 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          {/* Cover Image */}
          {inscricao.cover_image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={inscricao.cover_image_url}
                alt={inscricao.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            
            {/* Status Badge */}
            <div className="mb-4">
              <span 
                className={`inline-block px-4 py-2 rounded-full font-semibold text-sm bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}
              >
                {statusInfo.label}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {inscricao.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Termina: {new Date(inscricao.registration_ends).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              
              {inscricao.max_participants && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {inscricao.participants_count || 0} / {inscricao.max_participants} vagas
                </div>
              )}

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Aprovação: {inscricao.approval_type === 'automatic' ? 'Automática' : 'Manual'}
              </div>
            </div>

            {/* Role Badge */}
            {inscricao.role_to_grant_info && (
              <div className="mb-6">
                <span className="text-sm text-gray-600 dark:text-gray-400">Inscrição para:</span>
                <div 
                  className="inline-block ml-2 px-3 py-1 rounded-full font-semibold text-sm"
                  style={{ 
                    backgroundColor: `${inscricao.role_to_grant_info.color}20`,
                    color: inscricao.role_to_grant_info.color 
                  }}
                >
                  {inscricao.role_to_grant_info.display_name}
                </div>
              </div>
            )}

            {/* Description */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none mb-8 [&>*]:text-gray-900 dark:[&>*]:text-gray-100"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(inscricao.description) }}
            />

            {/* Subscribe Button ou Status Badge */}
            {statusInfo.canSubscribe && !userParticipation ? (
              <button
                onClick={handleSubscribe}
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Inscrevendo...' : 'Inscrever-se Agora'}
              </button>
            ) : userParticipation ? (
              <div>
                <div className={`w-full py-4 rounded-xl text-center font-bold ${
                  userParticipation.status === 'approved' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-700 dark:text-green-400'
                    : userParticipation.status === 'pending'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 text-yellow-700 dark:text-yellow-400'
                    : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400'
                }`}>
                  {userParticipation.status === 'approved' && '✓ Você já está inscrito!'}
                  {userParticipation.status === 'pending' && '⏳ Aguardando Aprovação'}
                  {userParticipation.status === 'rejected' && '✕ Inscrição Recusada'}
                </div>
                
                {/* Botão Descrição (para aprovados e pendentes) */}
                {inscricao?.welcome_message && (userParticipation.status === 'approved' || userParticipation.status === 'pending') && (
                  <button
                    onClick={() => setShowWelcome(true)}
                    className="mt-3 w-full py-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors underline"
                  >
                    📖 Ver Descrição
                  </button>
                )}
                
                {/* Recadinho para pendentes */}
                {userParticipation.status === 'pending' && (
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Volte mais tarde para verificar o status da sua inscrição
                  </p>
                )}
              </div>
            ) : (
              <div className="w-full py-4 rounded-xl text-center font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                {statusInfo.label}
              </div>
            )}
            
            {/* DEBUG INFO */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded text-xs text-blue-700 dark:text-blue-400">
                <strong>DEBUG:</strong><br/>
                canSubscribe: {statusInfo.canSubscribe ? 'SIM' : 'NÃO'}<br/>
                userParticipation: {userParticipation ? JSON.stringify(userParticipation.status) : 'null'}<br/>
                statusInfo: {JSON.stringify(statusInfo)}
              </div>
            )}

            {/* Info Messages */}
            {userParticipation?.status === 'pending' && (
              <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg">
                📋 Sua inscrição está aguardando aprovação do administrador.
              </div>
            )}

            {userParticipation?.status === 'approved' && (
              <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
                ✓ Você está inscrito! O cargo foi atribuído à sua conta.
              </div>
            )}
            
            {userParticipation?.status === 'rejected' && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                ✕ Sua inscrição foi recusada pelo administrador.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Formulário */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Complete sua Inscrição
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <RegistrationForm
                questions={questions}
                onSubmit={confirmSubscribe}
                submitting={submitting}
                allowGuest={inscricao?.allow_guest_registration || false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Boas-Vindas */}
      <WelcomeModal 
        message={inscricao?.welcome_message}
        onClose={() => setShowWelcome(false)}
        autoShow={showWelcome}
      />
    </>
  );
};

export default InscricaoDetail;
