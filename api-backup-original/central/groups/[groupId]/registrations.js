// =====================================================
// API - CENTRAL REGISTRATIONS (Inscrições)
// GET/POST /api/central/groups/:groupId/registrations
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
  
  // GET - Listar inscrições do grupo
  if (req.method === 'GET') {
    try {
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
      
      // Buscar inscrições
      const { data: registrations, error } = await supabaseAdmin
        .from('central_registrations')
        .select(`
          *,
          author:users!central_registrations_author_id_fkey(id, name, avatar_url),
          role_to_grant_info:roles!central_registrations_role_to_grant_fkey(id, name, display_name, color)
        `)
        .eq('group_id', groupId)
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Buscar participantes
      const regIds = registrations?.map(r => r.id) || [];
      const { data: participants } = await supabaseAdmin
        .from('central_registration_participants')
        .select('registration_id, status')
        .in('registration_id', regIds);
      
      // Buscar inscrição do usuário
      const { data: userParticipations } = await supabaseAdmin
        .from('central_registration_participants')
        .select('registration_id, status')
        .eq('user_id', req.user.id)
        .in('registration_id', regIds);
      
      // Enriquecer dados
      registrations?.forEach(reg => {
        const regParticipants = participants?.filter(p => p.registration_id === reg.id) || [];
        reg.total_participants = regParticipants.length;
        reg.approved_count = regParticipants.filter(p => p.status === 'approved').length;
        reg.pending_count = regParticipants.filter(p => p.status === 'pending').length;
        
        const userParticipation = userParticipations?.find(p => p.registration_id === reg.id);
        reg.user_subscribed = !!userParticipation;
        reg.user_status = userParticipation?.status || null;
        
        // Verificar se pode se inscrever
        const now = new Date();
        const startsAt = new Date(reg.registration_starts);
        const endsAt = new Date(reg.registration_ends);
        
        reg.is_open = now >= startsAt && now <= endsAt;
        reg.is_full = reg.max_participants && reg.approved_count >= reg.max_participants;
      });
      
      return res.status(200).json({ registrations: registrations || [] });
      
    } catch (error) {
      console.error('Get central registrations error:', error);
      return res.status(500).json({ error: 'Erro ao buscar inscrições' });
    }
  }
  
  // POST - Criar inscrição (apenas admin)
  if (req.method === 'POST') {
    try {
      // Verificar se é admin (apenas admins podem criar inscrições)
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
        return res.status(403).json({ error: 'Apenas admins podem criar inscrições' });
      }
      
      const { 
        title, 
        description, 
        role_to_grant, 
        max_participants, 
        approval_type,
        registration_ends 
      } = req.body;
      
      if (!title || !description || !role_to_grant || !registration_ends) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }
      
      const { data: registration, error } = await supabaseAdmin
        .from('central_registrations')
        .insert({
          group_id: groupId,
          author_id: req.user.id,
          title,
          description,
          role_to_grant,
          max_participants: max_participants || null,
          approval_type: approval_type || 'automatic',
          registration_ends
        })
        .select(`
          *,
          author:users!central_registrations_author_id_fkey(id, name, avatar_url),
          role_to_grant_info:roles!central_registrations_role_to_grant_fkey(id, name, display_name, color)
        `)
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({ registration });
      
    } catch (error) {
      console.error('Create central registration error:', error);
      return res.status(500).json({ error: 'Erro ao criar inscrição' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
