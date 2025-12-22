import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApi } from '../contexts/ApiContext';

const Inscricoes = () => {
  const navigate = useNavigate();
  const api = useApi();
  
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('active'); // active, all, closed

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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
              Inscrições
            </h1>
            <p className="text-lg text-secondary-600 dark:text-gray-300 max-w-2xl mx-auto">
              Participe de grupos e atividades especiais do apostolado
            </p>
          </div>

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
                  onClick={() => navigate(`/inscricoes/${inscricao.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500"
                >
                  {/* Cover Image */}
                  {inscricao.cover_image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={inscricao.cover_image_url}
                        alt={inscricao.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Inscricoes;
