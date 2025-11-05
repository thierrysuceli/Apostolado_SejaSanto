// =====================================================
// API - CENTRAL POLLS
// GET/POST /api/central/groups/:groupId/polls
// =====================================================

import { supabaseAdmin } from '../../../lib/supabaseServer.js';
import { authenticate } from '../../../middleware/auth.js';

export default async function handler(req, res) {
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  
  const groupId = req.query?.groupId || req._expressParams?.groupId;
  
  if (!groupId) {
    return res.status(400).json({ error: 'ID do grupo é obrigatório' });
  }
  
  // GET - Listar enquetes do grupo
  if (req.method === 'GET') {
    try {
      // Verificar acesso ao grupo
      const { data: group } = await supabaseAdmin
        .from('central_groups')
        .select('role_id')
        .eq('id', groupId)
        .single();
      
      if (!group) {
        return res.status(404).json({ error: 'Grupo não encontrado' });
      }
      
      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role_id')
        .eq('user_id', req.user.id);
      
      const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
      const hasAccess = userRoleIds.includes(group.role_id);
      
      const { data: adminRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'ADMIN')
        .single();
      
      const isAdmin = adminRole && userRoleIds.includes(adminRole.id);
      
      if (!hasAccess && !isAdmin) {
        return res.status(403).json({ error: 'Sem acesso a este grupo' });
      }
      
      // Buscar enquetes
      const { data: polls, error } = await supabaseAdmin
        .from('central_polls')
        .select(`
          *,
          author:users!central_polls_author_id_fkey(id, name, avatar_url)
        `)
        .eq('group_id', groupId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Buscar votos do usuário
      const pollIds = polls?.map(p => p.id) || [];
      const { data: userVotes } = await supabaseAdmin
        .from('central_poll_votes')
        .select('poll_id, option_ids')
        .eq('user_id', req.user.id)
        .in('poll_id', pollIds);
      
      // Marcar enquetes que o usuário já votou
      polls?.forEach(poll => {
        const vote = userVotes?.find(v => v.poll_id === poll.id);
        poll.user_voted = !!vote;
        poll.user_vote_options = vote?.option_ids || [];
        
        // Calcular total de votos
        const options = poll.options || [];
        poll.total_votes = options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0);
      });
      
      return res.status(200).json({ polls: polls || [] });
      
    } catch (error) {
      console.error('Get central polls error:', error);
      return res.status(500).json({ error: 'Erro ao buscar enquetes' });
    }
  }
  
  // POST - Criar enquete
  if (req.method === 'POST') {
    try {
      // Verificar acesso ao grupo
      const { data: group } = await supabaseAdmin
        .from('central_groups')
        .select('role_id')
        .eq('id', groupId)
        .single();
      
      if (!group) {
        return res.status(404).json({ error: 'Grupo não encontrado' });
      }
      
      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role_id')
        .eq('user_id', req.user.id);
      
      const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
      const hasAccess = userRoleIds.includes(group.role_id);
      
      const { data: adminRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'ADMIN')
        .single();
      
      const isAdmin = adminRole && userRoleIds.includes(adminRole.id);
      
      if (!hasAccess && !isAdmin) {
        return res.status(403).json({ error: 'Sem acesso a este grupo' });
      }
      
      const { question, description, options, allow_multiple, is_anonymous, ends_at } = req.body;
      
      if (!question || !options || options.length < 2) {
        return res.status(400).json({ error: 'Pergunta e pelo menos 2 opções são obrigatórias' });
      }
      
      // Formatar opções
      const formattedOptions = options.map((opt, idx) => ({
        id: `opt_${idx}`,
        text: opt,
        votes: []
      }));
      
      const { data: poll, error } = await supabaseAdmin
        .from('central_polls')
        .insert({
          group_id: groupId,
          author_id: req.user.id,
          question,
          description: description || null,
          options: formattedOptions,
          allow_multiple: allow_multiple || false,
          is_anonymous: is_anonymous || false,
          ends_at: ends_at || null
        })
        .select(`
          *,
          author:users!central_polls_author_id_fkey(id, name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({ poll });
      
    } catch (error) {
      console.error('Create central poll error:', error);
      return res.status(500).json({ error: 'Erro ao criar enquete' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
