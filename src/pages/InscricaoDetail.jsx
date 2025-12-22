import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import DOMPurify from 'isomorphic-dompurify';

const InscricaoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const api = useApi();
  
  const [inscricao, setInscricao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userParticipation, setUserParticipation] = useState(null);

  useEffect(() => {
    loadInscricao();
  }, [id]);

  const loadInscricao = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await api.registrations.getById(id);
      setInscricao(data.registration);
      setUserParticipation(data.user_participation || null);
    } catch (err) {
      console.error('Error loading inscricao:', err);
      setError('Erro ao carregar inscrição');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      alert('Você precisa estar logado para se inscrever');
      navigate('/login');
      return;
    }

    if (!confirm('Deseja confirmar sua inscrição?')) return;

    try {
      setSubmitting(true);
      const result = await api.registrations.subscribe(id);
      alert(result.message);
      await loadInscricao(); // Recarregar para atualizar status
    } catch (err) {
      console.error('Error subscribing:', err);
      alert(err.response?.data?.error || 'Erro ao se inscrever');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = () => {
    if (!inscricao) return null;
    
    const now = new Date();
    const starts = new Date(inscricao.registration_starts);
    const ends = new Date(inscricao.registration_ends);
    
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
    
    if (userParticipation) {
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
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(inscricao.description) }}
            />

            {/* Subscribe Button */}
            {statusInfo.canSubscribe && (
              <button
                onClick={handleSubscribe}
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Inscrevendo...' : 'Inscrever-se Agora'}
              </button>
            )}

            {/* Info Messages */}
            {userParticipation?.status === 'pending' && (
              <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg">
                Sua inscrição está aguardando aprovação do administrador.
              </div>
            )}

            {userParticipation?.status === 'approved' && (
              <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
                ✓ Você está inscrito! O cargo foi atribuído à sua conta.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InscricaoDetail;
