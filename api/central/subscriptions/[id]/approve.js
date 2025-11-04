import { authenticate } from '../../../middleware/auth.js';
import { supabaseAdmin } from '../../../lib/supabaseServer.js';

export default async function handler(req, res) {
  // PUT - Aprovar ou rejeitar inscrição
  if (req.method === 'PUT') {
    await new Promise((resolve) => authenticate(req, res, resolve));
    
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }

    try {
      const subscriptionId = req.query?.id || req._expressParams?.id;
      const { action } = req.body; // 'approve' ou 'reject'

      if (!subscriptionId || !action) {
        return res.status(400).json({ error: 'ID e ação são obrigatórios' });
      }

      if (action !== 'approve' && action !== 'reject') {
        return res.status(400).json({ error: 'Ação inválida' });
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
      
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem aprovar inscrições' });
      }

      // Buscar a inscrição
      const { data: subscription, error: fetchError } = await supabaseAdmin
        .from('central_registration_participants')
        .select(`
          *,
          registration:central_registrations(id, title, role_to_grant),
          user:users!central_registration_participants_user_id_fkey(id, name, email)
        `)
        .eq('id', subscriptionId)
        .single();

      if (fetchError || !subscription) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }

      if (subscription.status !== 'pending') {
        return res.status(400).json({ error: 'Esta inscrição já foi processada' });
      }

      const newStatus = action === 'approve' ? 'approved' : 'rejected';

      // Atualizar status
      const { error: updateError } = await supabaseAdmin
        .from('central_registration_participants')
        .update({
          status: newStatus
        })
        .eq('id', subscriptionId);

      if (updateError) {
        console.error('Erro ao atualizar status:', updateError);
        return res.status(500).json({ error: 'Erro ao processar inscrição' });
      }

      // Se aprovado, conceder a role ao usuário
      if (action === 'approve' && subscription.registration.role_to_grant) {
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: subscription.user_id,
            role_id: subscription.registration.role_to_grant
          });

        if (roleError) {
          console.error('Erro ao conceder role:', roleError);
          // Não falha completamente, mas loga o erro
        }
      }

      return res.status(200).json({
        message: action === 'approve' ? 'Inscrição aprovada com sucesso' : 'Inscrição rejeitada',
        subscription: { ...subscription, status: newStatus }
      });

    } catch (error) {
      console.error('Erro geral:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
