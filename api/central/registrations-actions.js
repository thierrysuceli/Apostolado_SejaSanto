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
      // Buscar inscrição
      const { data: registration, error: regError } = await supabaseAdmin
        .from('central_registrations')
        .select(`
          *,
          central_groups!inner(role_id)
        `)
        .eq('id', registrationId)
        .single();
      
      if (regError || !registration) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }
      
      // Verificar se está ativa
      if (!registration.is_active) {
        return res.status(400).json({ error: 'Inscrição não está ativa' });
      }
      
      // Verificar período
      const now = new Date();
      const startsAt = new Date(registration.registration_starts);
      const endsAt = new Date(registration.registration_ends);
      
      if (now < startsAt) {
        return res.status(400).json({ error: 'Inscrições ainda não começaram' });
      }
      
      if (now > endsAt) {
        return res.status(400).json({ error: 'Inscrições encerradas' });
      }
      
      // Verificar se já está inscrito
      const { data: existing } = await supabaseAdmin
        .from('central_registration_participants')
        .select('id, status')
        .eq('registration_id', registrationId)
        .eq('user_id', req.user.id)
        .single();
      
      if (existing) {
        return res.status(400).json({ error: 'Você já está inscrito' });
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
    
    return res.status(405).json({ error: 'Método não permitido' });
    
  } catch (error) {
    console.error('Registration action error:', error);
    return res.status(500).json({ error: 'Erro ao processar ação' });
  }
}
