// =====================================================
// API - CENTRAL MANAGEMENT (CONSOLIDADA)
// Combina members/remove e subscriptions/approve em 1 função
// =====================================================

import { authenticate } from '../../middleware-api/auth.js';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const { id, type, action } = req.query;

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
  
  if (!isAdmin) {
    return res.status(403).json({ error: 'Apenas admins podem realizar esta ação' });
  }

  try {
    // ============================================
    // 1. DELETE ?type=member - Remover membro do grupo
    // ============================================
    if (req.method === 'DELETE' && type === 'member') {
      const { user_id, role_id } = req.body;

      if (!user_id || !role_id) {
        return res.status(400).json({ error: 'user_id e role_id são obrigatórios' });
      }

      // Não permitir remover a role ADMIN
      const { data: targetRole } = await supabaseAdmin
        .from('roles')
        .select('name')
        .eq('id', role_id)
        .single();

      if (targetRole?.name === 'ADMIN') {
        return res.status(403).json({ error: 'Não é possível remover a role ADMIN' });
      }

      // Remover a role do usuário
      const { error: deleteError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', user_id)
        .eq('role_id', role_id);

      if (deleteError) throw deleteError;

      return res.status(200).json({ 
        message: 'Membro removido com sucesso' 
      });
    }
    
    // ============================================
    // 2. PUT ?type=subscription - Aprovar/rejeitar inscrição
    // ============================================
    if (req.method === 'PUT' && type === 'subscription') {
      if (!id) {
        return res.status(400).json({ error: 'ID da inscrição é obrigatório' });
      }

      const { action: approvalAction } = req.body; // 'approve' ou 'reject'

      if (!approvalAction || (approvalAction !== 'approve' && approvalAction !== 'reject')) {
        return res.status(400).json({ error: 'Ação inválida (approve ou reject)' });
      }

      // Buscar a inscrição
      const { data: subscription, error: fetchError } = await supabaseAdmin
        .from('central_registration_participants')
        .select(`
          *,
          registration:central_registrations(id, title, role_to_grant),
          user:users!central_registration_participants_user_id_fkey(id, name, email)
        `)
        .eq('id', id)
        .single();

      if (fetchError || !subscription) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }

      if (subscription.status !== 'pending') {
        return res.status(400).json({ error: 'Esta inscrição já foi processada' });
      }

      const newStatus = approvalAction === 'approve' ? 'approved' : 'rejected';

      // Atualizar status
      const { error: updateError } = await supabaseAdmin
        .from('central_registration_participants')
        .update({
          status: newStatus,
          approved_by: req.user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Se aprovado, conceder a role ao usuário
      if (approvalAction === 'approve' && subscription.registration.role_to_grant) {
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: subscription.user_id,
            role_id: subscription.registration.role_to_grant,
            assigned_by: req.user.id
          });

        if (roleError) {
          console.error('Erro ao conceder role:', roleError);
        }
      }

      return res.status(200).json({
        message: approvalAction === 'approve' ? 'Inscrição aprovada com sucesso' : 'Inscrição rejeitada',
        subscription: { ...subscription, status: newStatus }
      });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
    
  } catch (error) {
    console.error('Management action error:', error);
    return res.status(500).json({ error: 'Erro ao processar ação' });
  }
}
