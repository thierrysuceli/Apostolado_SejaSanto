import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';

const Inscricoes = () => {
  const navigate = useNavigate();
  const api = useApi();
  const { user, isAdmin } = useAuth();
  
  const [inscricoes, setInscricoes] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('active'); // active, all, closed
  const [showApprovals, setShowApprovals] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);

  const isUserAdmin = isAdmin && isAdmin();

  useEffect(() => {
    loadInscricoes();
  }, [filter]);

  const loadInscricoes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await api.registrations.getAll();
      
      let filtered = data.registrations || [];
      
      const now = new Date();
      
      if (filter === 'active') {
        filtered = filtered.filter(reg => 
          reg.is_active && 
          new Date(reg.registration_starts) <= now &&
          new Date(reg.registration_ends) >= now
        );
      } else if (filter === 'closed') {
        filtered = filtered.filter(reg => 
          !reg.is_active || new Date(reg.registration_ends) < now
        );
      }
      
      setInscricoes(filtered);
    } catch (err) {
      console.error('Error loading inscricoes:', err);
      setError('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingApprovals = async () => {
    if (!isUserAdmin) return;
    
    try {
      const data = await api.registrations.getPendingApprovals();
      setPendingApprovals(data.approvals || []);
    } catch (err) {
      console.error('Error loading pending approvals:', err);
    }
  };

  const handleApprove = async (participantId) => {
    if (!confirm('Aprovar esta inscrição?')) return;
    
    try {
      await api.registrations.approve(participantId);
      alert('✅ Inscrição aprovada! Cargo atribuído ao usuário.');
      await loadPendingApprovals();
    } catch (err) {
      console.error('Error approving:', err);
      alert('Erro ao aprovar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleReject = async (participantId) => {
    if (!confirm('Rejeitar esta inscrição?')) return;
    
    try {
      await api.registrations.reject(participantId);
      alert('❌ Inscrição rejeitada.');
      await loadPendingApprovals();
    } catch (err) {
      console.error('Error rejecting:', err);
      alert('Erro ao rejeitar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleToggleActive = async (inscricaoId, newStatus) => {
    const action = newStatus ? 'ativar' : 'desativar';
    if (!confirm(`Deseja ${action} esta inscrição?`)) return;
    
    try {
      await api.registrations.adminUpdate(inscricaoId, { is_active: newStatus });
      alert(`✅ Inscrição ${newStatus ? 'ativada' : 'desativada'} com sucesso!`);
      await loadInscricoes();
    } catch (err) {
      console.error('Error toggling active:', err);
      alert('Erro ao atualizar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteInscricao = async (inscricaoId) => {
    if (!confirm('⚠️ ATENÇÃO: Deletar esta inscrição irá remover TODOS os participantes associados. Deseja continuar?')) return;
    
    try {
      await api.registrations.adminDelete(inscricaoId);
      alert('✅ Inscrição deletada com sucesso!');
      await loadInscricoes();
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Erro ao deletar: ' + (err.response?.data?.error || err.message));
    }
  };

  const getStatusBadge = (inscricao) => {
    const now = new Date();
    const starts = new Date(inscricao.registration_starts);
    const ends = new Date(inscricao.registration_ends);
    
    if (!inscricao.is_active) {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-600">Inativa</span>;
    }
    
    if (now < starts) {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">Em breve</span>;
    }
    
    if (now > ends) {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">Encerrada</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">Aberta</span>;
  };

  const getApprovalTypeBadge = (type) => {
    if (type === 'automatic') {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-700">Automática</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700">Manual</span>;
  };

  return (
    <>
      <Helmet>
        <title>Inscrições | Apostolado Seja Santo</title>
        <meta name="description" content="Inscreva-se em grupos e atividades do apostolado" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-beige-50 to-white dark:from-gray-950 dark:to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
              Inscrições
            </h1>
            <p className="text-lg text-secondary-600 dark:text-gray-300 max-w-2xl mx-auto">
              Participe de grupos e atividades especiais do apostolado
            </p>
          </div>

          {/* Admin Controls */}
          {isUserAdmin && (
            <div className="mb-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate('/admin/inscricoes/create')}
                className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition flex items-center gap-2"
              >
                ➕ Criar Inscrição
              </button>
              <button
                onClick={() => {
                  setShowApprovals(true);
                  loadPendingApprovals();
                }}
                className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-600 transition flex items-center gap-2"
              >
                ⏳ Aprovações Pendentes
              </button>
              <button
                onClick={() => setShowAdminView(!showAdminView)}
                className={`px-6 py-3 font-bold rounded-xl transition flex items-center gap-2 ${
                  showAdminView
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🔧 {showAdminView ? 'Ocultar' : 'Mostrar'} Controles Admin
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setFilter('active')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Abertas
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'closed'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Encerradas
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && inscricoes.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma inscrição encontrada
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'active' && 'Não há inscrições abertas no momento'}
                {filter === 'closed' && 'Não há inscrições encerradas'}
                {filter === 'all' && 'Ainda não há inscrições disponíveis'}
              </p>
            </div>
          )}

          {/* Grid de Inscrições */}
          {!loading && inscricoes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inscricoes.map((inscricao) => (
                <div
                  key={inscricao.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
                >
                  {/* Cover Image */}
                  {inscricao.cover_image_url && (
                    <div 
                      onClick={() => navigate(`/inscricoes/${inscricao.id}`)}
                      className="h-48 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={inscricao.cover_image_url}
                        alt={inscricao.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div 
                    onClick={() => navigate(`/inscricoes/${inscricao.id}`)}
                    className="p-6 cursor-pointer"
                  >
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {getStatusBadge(inscricao)}
                      {getApprovalTypeBadge(inscricao.approval_type)}
                      {inscricao.role_to_grant_info && (
                        <span 
                          className="px-2 py-1 text-xs font-semibold rounded"
                          style={{ 
                            backgroundColor: `${inscricao.role_to_grant_info.color}20`,
                            color: inscricao.role_to_grant_info.color 
                          }}
                        >
                          {inscricao.role_to_grant_info.display_name}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {inscricao.title}
                    </h3>

                    {/* Description Preview */}
                    <div 
                      className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: inscricao.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                      }}
                    />

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        Termina em: {new Date(inscricao.registration_ends).toLocaleDateString('pt-BR')}
                      </span>
                      {inscricao.max_participants && (
                        <span>
                          {inscricao.participants_count || 0}/{inscricao.max_participants} vagas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Admin Controls */}
                  {isUserAdmin && showAdminView && (
                    <div className="px-4 pb-4 flex gap-2 flex-wrap border-t border-gray-200 dark:border-gray-700 pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/inscricoes/edit/${inscricao.id}`);
                        }}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white text-xs font-semibold rounded hover:bg-purple-700 transition"
                        title="Editar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(inscricao.id, !inscricao.is_active);
                        }}
                        className={`flex-1 px-3 py-2 text-white text-xs font-semibold rounded transition ${
                          inscricao.is_active
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                        title={inscricao.is_active ? 'Desativar' : 'Ativar'}
                      >
                        {inscricao.is_active ? '⏸️ Desativar' : '▶️ Ativar'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInscricao(inscricao.id);
                        }}
                        className="px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition"
                        title="Deletar"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Modal de Aprovações Pendentes */}
          {showApprovals && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-secondary-700 dark:text-gray-200">
                    ⏳ Aprovações Pendentes
                  </h3>
                  <button
                    onClick={() => setShowApprovals(false)}
                    className="text-secondary-600 hover:text-secondary-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-secondary-600 dark:text-gray-400">
                      Nenhuma aprovação pendente no momento
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovals.map(approval => (
                      <div key={approval.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-secondary-700 dark:text-gray-200">
                              {approval.user?.name}
                            </p>
                            <p className="text-sm text-secondary-600 dark:text-gray-400">
                              {approval.user?.email}
                            </p>
                            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                              📋 {approval.registration?.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Solicitado em {new Date(approval.created_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(approval.id)}
                              className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition"
                            >
                              ✓ Aprovar
                            </button>
                            <button
                              onClick={() => handleReject(approval.id)}
                              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition"
                            >
                              ✕ Rejeitar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Inscricoes;
