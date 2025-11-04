// =====================================================
// API - SE INSCREVER EM INSCRIÇÃO
// POST /api/central/registrations/:id/subscribe
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
  
  const registrationId = req.query?.id || req._expressParams?.id;
  
  if (!registrationId) {
    return res.status(400).json({ error: 'ID da inscrição é obrigatório' });
  }
  
  try {
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
    
  } catch (error) {
    console.error('Subscribe registration error:', error);
    return res.status(500).json({ error: 'Erro ao se inscrever' });
  }
}
