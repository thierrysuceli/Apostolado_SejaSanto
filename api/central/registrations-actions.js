// =====================================================
// API - CENTRAL REGISTRATIONS ACTIONS (CONSOLIDADA)
// Combina subscribe, delete, edit em 1 função
// =====================================================

import { authenticate } from '../../middleware-api/auth.js';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  await authenticate(req, res);
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const { id: registrationId, action } = req.query;
  
  console.log('[registrations-actions] Request:', { 
    method: req.method, 
    registrationId, 
    action,
    userId: req.user?.id 
  });
  
  if (!registrationId) {
    return res.status(400).json({ error: 'ID da inscrição é obrigatório' });
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
    // 1. POST ?action=subscribe - Se inscrever
    // ============================================
    if (req.method === 'POST' && action === 'subscribe') {
      console.log('[Subscribe] Starting subscription for registration:', registrationId);
      
      // Buscar inscrição (pode ser pública ou de grupo)
      const { data: registration, error: regError } = await supabaseAdmin
        .from('central_registrations')
        .select('*')
        .eq('id', registrationId)
        .single();
      
      console.log('[Subscribe] Registration query result:', { 
        found: !!registration, 
        error: regError,
        registrationData: registration ? { id: registration.id, title: registration.title } : null
      });
      
      if (regError || !registration) {
        console.error('[Subscribe] Registration not found:', regError);
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }
      
      // Verificar se está ativa
      if (!registration.is_active) {
        console.log('Registration not active:', registration.id);
        return res.status(400).json({ error: 'Inscrição não está ativa' });
      }
      
      // Verificar período
      const now = new Date();
      const startsAt = new Date(registration.registration_starts);
      const endsAt = new Date(registration.registration_ends);
      
      console.log('Subscribe check:', { now: now.toISOString(), startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() });
      
      if (now < startsAt) {
        return res.status(400).json({ 
          error: 'Inscrições ainda não começaram',
          starts_at: startsAt.toISOString()
        });
      }
      
      if (now > endsAt) {
        return res.status(400).json({ 
          error: 'Inscrições encerradas',
          ended_at: endsAt.toISOString()
        });
      }
      
      // Verificar se já está inscrito (ignora se foi rejeitado)
      const { data: existing, error: existError } = await supabaseAdmin
        .from('central_registration_participants')
        .select('id, status')
        .eq('registration_id', registrationId)
        .eq('user_id', req.user.id)
        .maybeSingle(); // 🔧 Usa maybeSingle para não dar erro se não existir
      
      console.log('[Subscribe] Existing participation check:', { 
        hasExisting: !!existing, 
        status: existing?.status,
        existError: existError?.code 
      });
      
      if (existing && (existing.status === 'pending' || existing.status === 'approved')) {
        console.log('[Subscribe] User already has active participation:', existing.status);
        return res.status(400).json({ 
          error: existing.status === 'pending' 
            ? 'Você já tem uma inscrição pendente' 
            : 'Você já está inscrito' 
        });
      }
      
      // Se foi rejeitado, pode se inscrever novamente
      if (existing && existing.status === 'rejected') {
        console.log('[Subscribe] Previous participation was rejected, allowing new subscription');
      }
      
      // Verificar vagas
      if (registration.max_participants) {
        const { count } = await supabaseAdmin
          .from('central_registration_participants')
          .select('id', { count: 'exact', head: true })
          .eq('registration_id', registrationId)
          .eq('status', 'approved');
        
        if (count >= registration.max_participants) {
          return res.status(400).json({ error: 'Vagas esgotadas' });
        }
      }
      
      // Criar participação
      const status = registration.approval_type === 'automatic' ? 'approved' : 'pending';
      
      const { error: insertError } = await supabaseAdmin
        .from('central_registration_participants')
        .insert({
          registration_id: registrationId,
          user_id: req.user.id,
          status,
          approved_by: registration.approval_type === 'automatic' ? registration.author_id : null,
          approved_at: registration.approval_type === 'automatic' ? new Date().toISOString() : null
        });
      
      if (insertError) throw insertError;
      
      // Se aprovação automática, dar a role
      if (registration.approval_type === 'automatic') {
        // Verificar se usuário já tem a role
        const { data: hasRole } = await supabaseAdmin
          .from('user_roles')
          .select('id')
          .eq('user_id', req.user.id)
          .eq('role_id', registration.role_to_grant)
          .single();
        
        if (!hasRole) {
          await supabaseAdmin
            .from('user_roles')
            .insert({
              user_id: req.user.id,
              role_id: registration.role_to_grant,
              assigned_by: registration.author_id
            });
        }
      }
      
      return res.status(200).json({ 
        message: registration.approval_type === 'automatic' 
          ? 'Inscrição confirmada! Role atribuída.' 
          : 'Inscrição enviada! Aguarde aprovação.',
        status
      });
    }
    
    // ============================================
    // 2. DELETE ?action=delete - Deletar inscrição
    // ============================================
    if (req.method === 'DELETE' && action === 'delete') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem deletar inscrições' });
      }

      // Verificar se a inscrição existe
      const { data: registration, error: fetchError } = await supabaseAdmin
        .from('central_registrations')
        .select('id, group_id')
        .eq('id', registrationId)
        .single();

      if (fetchError || !registration) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }

      // Deletar participantes relacionados primeiro
      await supabaseAdmin
        .from('central_registration_participants')
        .delete()
        .eq('registration_id', registrationId);

      // Deletar comentários relacionados
      await supabaseAdmin
        .from('central_comments')
        .delete()
        .eq('registration_id', registrationId);

      // Deletar a inscrição
      const { error: deleteError } = await supabaseAdmin
        .from('central_registrations')
        .delete()
        .eq('id', registrationId);

      if (deleteError) throw deleteError;

      return res.status(200).json({ 
        message: 'Inscrição deletada com sucesso',
        deleted_id: registrationId
      });
    }
    
    // ============================================
    // 3. PUT ?action=edit - Editar inscrição
    // ============================================
    if (req.method === 'PUT' && action === 'edit') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem editar inscrições' });
      }

      const { 
        title, 
        description, 
        is_pinned, 
        registration_ends, 
        max_participants,
        approval_type 
      } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Título é obrigatório' });
      }

      if (!description || description.trim() === '') {
        return res.status(400).json({ error: 'Descrição é obrigatória' });
      }

      // Verificar se a inscrição existe
      const { data: registration, error: fetchError } = await supabaseAdmin
        .from('central_registrations')
        .select('id, group_id')
        .eq('id', registrationId)
        .single();

      if (fetchError || !registration) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }

      // Atualizar a inscrição
      const updateData = {
        title: title.trim(),
        description: description.trim(),
        is_pinned: is_pinned || false,
        max_participants: max_participants || null,
        approval_type: approval_type || 'automatic',
        updated_at: new Date().toISOString()
      };

      if (registration_ends) {
        updateData.registration_ends = registration_ends;
      }

      const { data, error: updateError } = await supabaseAdmin
        .from('central_registrations')
        .update(updateData)
        .eq('id', registrationId)
        .select()
        .single();

      if (updateError) throw updateError;

      return res.status(200).json({ 
        message: 'Inscrição atualizada com sucesso',
        registration: data
      });
    }

    // ============================================
    // 4. POST ?action=approve&participant_id=X - Aprovar inscrição (ADMIN)
    // ============================================
    if (req.method === 'POST' && action === 'approve') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem aprovar inscrições' });
      }

      const { participant_id } = req.query;
      if (!participant_id) {
        return res.status(400).json({ error: 'ID do participante é obrigatório' });
      }

      // Buscar participante e inscrição
      const { data: participant, error: participantError } = await supabaseAdmin
        .from('central_registration_participants')
        .select(`
          *,
          registration:central_registrations(role_to_grant)
        `)
        .eq('id', participant_id)
        .single();

      if (participantError || !participant) {
        return res.status(404).json({ error: 'Participante não encontrado' });
      }

      if (participant.status === 'approved') {
        return res.status(400).json({ error: 'Já aprovado' });
      }

      // Atualizar status para aprovado
      const { error: updateError } = await supabaseAdmin
        .from('central_registration_participants')
        .update({ status: 'approved' })
        .eq('id', participant_id);

      if (updateError) throw updateError;

      // Conceder role ao usuário
      const roleId = participant.registration.role_to_grant;
      
      // Verificar se já tem a role
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('id')
        .eq('user_id', participant.user_id)
        .eq('role_id', roleId)
        .single();

      if (!existingRole) {
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: participant.user_id,
            role_id: roleId
          });

        if (roleError) throw roleError;
      }

      return res.status(200).json({ 
        message: 'Inscrição aprovada e cargo concedido com sucesso'
      });
    }

    // ============================================
    // 5. POST ?action=reject&participant_id=X - Rejeitar inscrição (ADMIN)
    // ============================================
    if (req.method === 'POST' && action === 'reject') {
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem rejeitar inscrições' });
      }

      const { participant_id } = req.query;
      if (!participant_id) {
        return res.status(400).json({ error: 'ID do participante é obrigatório' });
      }

      // Buscar participante
      const { data: participant, error: participantError } = await supabaseAdmin
        .from('central_registration_participants')
        .select('id, status')
        .eq('id', participant_id)
        .single();

      if (participantError || !participant) {
        return res.status(404).json({ error: 'Participante não encontrado' });
      }

      if (participant.status === 'rejected') {
        return res.status(400).json({ error: 'Já rejeitado' });
      }

      // Atualizar status para rejeitado
      const { error: updateError } = await supabaseAdmin
        .from('central_registration_participants')
        .update({ status: 'rejected' })
        .eq('id', participant_id);

      if (updateError) throw updateError;

      return res.status(200).json({ 
        message: 'Inscrição rejeitada com sucesso'
      });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
    
  } catch (error) {
    console.error('Registration action error:', error);
    return res.status(500).json({ error: 'Erro ao processar ação' });
  }
}
