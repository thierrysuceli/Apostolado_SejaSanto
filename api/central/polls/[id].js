// =====================================================
// API - /api/central/polls/[id]
// Endpoint dinâmico para ações em polls específicas
// =====================================================

import { authenticate } from '../../../middleware-api/auth.js';
import { supabaseAdmin } from '../../../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  await authenticate(req, res);
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const { id: pollId, action } = req.query;
  
  if (!pollId) {
    return res.status(400).json({ error: 'ID da enquete é obrigatório' });
  }

  // Verificar se é admin
  const { data: adminRole } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('name', 'ADMIN')
    .single();
  
  const { data: userRoles } = await supabaseAdmin
    .from('user_roles')
    .select('role_id')
    .eq('user_id', req.user.id);
  
  const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
  const isAdmin = adminRole && userRoleIds.includes(adminRole.id);

  try {
    // ============================================
    // 1. POST ?action=vote - Votar em enquete
    // ============================================
    if (req.method === 'POST' && action === 'vote') {
      const { option_ids } = req.body;
      
      if (!option_ids || !Array.isArray(option_ids) || option_ids.length === 0) {
        return res.status(400).json({ error: 'Opções de voto são obrigatórias' });
      }
      
      // Buscar enquete
      const { data: poll, error: pollError } = await supabaseAdmin
        .from('central_polls')
        .select('*, central_groups(role_id)')
        .eq('id', pollId)
        .single();
      
      if (pollError || !poll) {
        console.error('[POLL VOTE] Poll not found:', pollError);
        return res.status(404).json({ error: 'Enquete não encontrada' });
      }
      
      // Verificar se enquete ainda está ativa
      if (poll.ends_at && new Date(poll.ends_at) < new Date()) {
        return res.status(400).json({ error: 'Enquete encerrada' });
      }
      
      // Verificar acesso ao grupo (todos os membros do grupo podem votar)
      const groupRoleId = poll.central_groups?.role_id;
      const hasAccess = groupRoleId && userRoleIds.includes(groupRoleId);
      
      console.log('[POLL VOTE] Access check:', { pollId, groupRoleId, userRoleIds, hasAccess, isAdmin });
      
      if (!hasAccess && !isAdmin) {
        return res.status(403).json({ 
          error: 'Sem acesso a este grupo',
          debug: { groupRoleId, hasRole: hasAccess }
        });
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
      
      if (voteError) {
        console.error('[POLL VOTE] Vote insert error:', voteError);
        throw voteError;
      }
      
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
      
      if (updateError) {
        console.error('[POLL VOTE] Options update error:', updateError);
        throw updateError;
      }
      
      console.log('[POLL VOTE] Success:', { pollId, userId: req.user.id, option_ids });
      return res.status(200).json({ message: 'Voto registrado com sucesso' });
    }
    
    // ============================================
    // 2. DELETE - Deletar enquete
    // ============================================
    if (req.method === 'DELETE') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem deletar enquetes' });
      }

      // Verificar se a enquete existe
      const { data: poll, error: fetchError } = await supabaseAdmin
        .from('central_polls')
        .select('id, group_id')
        .eq('id', pollId)
        .single();

      if (fetchError || !poll) {
        return res.status(404).json({ error: 'Enquete não encontrada' });
      }

      // Deletar votos relacionados primeiro
      await supabaseAdmin
        .from('central_poll_votes')
        .delete()
        .eq('poll_id', pollId);

      // Deletar comentários relacionados
      await supabaseAdmin
        .from('central_comments')
        .delete()
        .eq('poll_id', pollId);

      // Deletar a enquete
      const { error: deleteError } = await supabaseAdmin
        .from('central_polls')
        .delete()
        .eq('id', pollId);

      if (deleteError) throw deleteError;

      console.log('[POLL DELETE] Success:', pollId);
      return res.status(200).json({ 
        message: 'Enquete deletada com sucesso',
        deleted_id: pollId
      });
    }
    
    // ============================================
    // 3. PUT - Editar enquete (/edit não é necessário)
    // ============================================
    if (req.method === 'PUT') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem editar enquetes' });
      }

      const { question, description, is_pinned, ends_at } = req.body;

      if (!question || question.trim() === '') {
        return res.status(400).json({ error: 'Pergunta é obrigatória' });
      }

      // Verificar se a enquete existe
      const { data: poll, error: fetchError } = await supabaseAdmin
        .from('central_polls')
        .select('id, group_id')
        .eq('id', pollId)
        .single();

      if (fetchError || !poll) {
        return res.status(404).json({ error: 'Enquete não encontrada' });
      }

      // Atualizar a enquete
      const updateData = {
        question: question.trim(),
        description: description?.trim() || null,
        is_pinned: is_pinned || false,
        updated_at: new Date().toISOString()
      };

      if (ends_at) {
        updateData.ends_at = ends_at;
      }

      const { data, error: updateError } = await supabaseAdmin
        .from('central_polls')
        .update(updateData)
        .eq('id', pollId)
        .select()
        .single();

      if (updateError) throw updateError;

      console.log('[POLL UPDATE] Success:', pollId);
      return res.status(200).json({ 
        message: 'Enquete atualizada com sucesso',
        poll: data
      });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
    
  } catch (error) {
    console.error('[POLL API] Error:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar ação',
      details: error.message 
    });
  }
}
