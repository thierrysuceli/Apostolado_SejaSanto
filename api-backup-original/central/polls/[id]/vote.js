// =====================================================
// API - VOTAR EM ENQUETE
// POST /api/central/polls/:id/vote
// =====================================================

import { supabaseAdmin } from '../../../lib/supabaseServer.js';
import { authenticate } from '../../../middleware/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  
  const pollId = req.query?.id || req._expressParams?.id;
  
  if (!pollId) {
    return res.status(400).json({ error: 'ID da enquete é obrigatório' });
  }
  
  try {
    const { option_ids } = req.body;
    
    if (!option_ids || !Array.isArray(option_ids) || option_ids.length === 0) {
      return res.status(400).json({ error: 'Opções de voto são obrigatórias' });
    }
    
    // Buscar enquete
    const { data: poll, error: pollError } = await supabaseAdmin
      .from('central_polls')
      .select('*, central_groups!inner(role_id)')
      .eq('id', pollId)
      .single();
    
    if (pollError || !poll) {
      return res.status(404).json({ error: 'Enquete não encontrada' });
    }
    
    // Verificar se enquete ainda está ativa
    if (poll.ends_at && new Date(poll.ends_at) < new Date()) {
      return res.status(400).json({ error: 'Enquete encerrada' });
    }
    
    // Verificar acesso ao grupo
    const { data: userRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role_id')
      .eq('user_id', req.user.id);
    
    const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
    const hasAccess = userRoleIds.includes(poll.central_groups.role_id);
    
    const { data: adminRole } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'ADMIN')
      .single();
    
    const isAdmin = adminRole && userRoleIds.includes(adminRole.id);
    
    if (!hasAccess && !isAdmin) {
      return res.status(403).json({ error: 'Sem acesso a este grupo' });
    }
    
    // Verificar se pode votar em múltiplas opções
    if (!poll.allow_multiple && option_ids.length > 1) {
      return res.status(400).json({ error: 'Esta enquete permite apenas um voto' });
    }
    
    // Registrar/atualizar voto
    const { error: voteError } = await supabaseAdmin
      .from('central_poll_votes')
      .upsert({
        poll_id: pollId,
        user_id: req.user.id,
        option_ids
      }, {
        onConflict: 'poll_id,user_id'
      });
    
    if (voteError) throw voteError;
    
    // Atualizar contagem de votos nas opções
    const updatedOptions = poll.options.map(opt => {
      // Remover voto anterior do usuário
      const votes = (opt.votes || []).filter(v => v !== req.user.id);
      
      // Adicionar novo voto se opção foi selecionada
      if (option_ids.includes(opt.id)) {
        votes.push(req.user.id);
      }
      
      return { ...opt, votes };
    });
    
    const { error: updateError } = await supabaseAdmin
      .from('central_polls')
      .update({ options: updatedOptions })
      .eq('id', pollId);
    
    if (updateError) throw updateError;
    
    return res.status(200).json({ message: 'Voto registrado com sucesso' });
    
  } catch (error) {
    console.error('Vote poll error:', error);
    return res.status(500).json({ error: 'Erro ao registrar voto' });
  }
}
