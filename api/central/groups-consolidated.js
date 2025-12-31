// =====================================================
// API - CENTRAL GROUPS (CONSOLIDADA)
// Combina 7 endpoints em 1 função usando query params
// =====================================================

import { authenticate, hasRole } from '../../middleware-api/auth.js';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';

// ============================================
// 🌐 FUNÇÃO: Inscrições Públicas (SEM autenticação)
// ============================================
async function handlePublicRegistrations(req, res) {
  try {
    const { id: registrationId } = req.query;

    // Se tem ID, buscar uma específica
    if (registrationId) {
      const { data: registration, error } = await supabaseAdmin
        .from('central_registrations')
        .select(`
          *,
          author:users!central_registrations_author_id_fkey(id, name, avatar_url),
          role_to_grant_info:roles!central_registrations_role_to_grant_fkey(id, name, display_name, color)
        `)
        .eq('id', registrationId)
        .is('group_id', null)
        .single();

      if (error || !registration) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }

      // Contar participantes aprovados
      const { count } = await supabaseAdmin
        .from('central_registration_participants')
        .select('id', { count: 'exact', head: true })
        .eq('registration_id', registrationId)
        .eq('status', 'approved');

      registration.participants_count = count || 0;

      // Se tiver token, verificar se usuário já se inscreveu
      let userParticipation = null;
      const authHeader = req.headers.authorization;
      
      console.log('[Public Registration Detail] Auth check:', {
        hasAuthHeader: !!authHeader,
        authHeaderType: authHeader?.substring(0, 20)
      });
      
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log('[Public Registration Detail] Token received:', token.substring(0, 20) + '...');
        
        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
        
        console.log('[Public Registration Detail] User auth result:', {
          hasUser: !!userData?.user,
          userId: userData?.user?.id,
          userError: userError?.message
        });
        
        if (userData?.user) {
          console.log('[Public Registration Detail] Querying participation:', {
            registrationId,
            userId: userData.user.id
          });

          // Primeiro: listar TODAS as participações para debug
          const { data: allParticipations, error: allError } = await supabaseAdmin
            .from('central_registration_participants')
            .select('id, user_id, registration_id, status')
            .eq('registration_id', registrationId);

          console.log('[Public Registration Detail] ALL participations for this registration:', {
            count: allParticipations?.length || 0,
            participations: allParticipations,
            error: allError
          });

          // Segundo: buscar a participação específica do usuário
          const { data: participation, error: partError } = await supabaseAdmin
            .from('central_registration_participants')
            .select('*')
            .eq('registration_id', registrationId)
            .eq('user_id', userData.user.id)
            .maybeSingle(); // 🔧 Usa maybeSingle para não dar erro se não existir

          console.log('[Public Registration Detail] Participation check:', {
            hasParticipation: !!participation,
            status: participation?.status,
            participationData: participation,
            partError
          });

          userParticipation = participation;
        }
      }

      console.log('[Public Registration Detail] Final response:', {
        registrationId,
        hasUserParticipation: !!userParticipation,
        participationStatus: userParticipation?.status,
        participationId: userParticipation?.id
      });

      return res.status(200).json({ 
        registration,
        user_participation: userParticipation
      });
    }

    // Listar todas as inscrições públicas
    const { data: registrations, error } = await supabaseAdmin
      .from('central_registrations')
      .select(`
        *,
        author:users!central_registrations_author_id_fkey(id, name, avatar_url),
        role_to_grant_info:roles!central_registrations_role_to_grant_fkey(id, name, display_name, color)
      `)
      .is('group_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Buscar contagem de participantes
    const regIds = registrations?.map(r => r.id) || [];
    
    if (regIds.length > 0) {
      const { data: participantCounts } = await supabaseAdmin
        .from('central_registration_participants')
        .select('registration_id, status')
        .in('registration_id', regIds)
        .eq('status', 'approved');

      const counts = {};
      participantCounts?.forEach(p => {
        counts[p.registration_id] = (counts[p.registration_id] || 0) + 1;
      });

      registrations.forEach(reg => {
        reg.participants_count = counts[reg.id] || 0;
      });
    }

    return res.status(200).json({ registrations });

  } catch (error) {
    console.error('Public registrations error:', error);
    return res.status(500).json({ error: 'Erro ao buscar inscrições públicas' });
  }
}

export default async function handler(req, res) {
  const { resource } = req.query;
  
  // ============================================
  // 🌐 Endpoint público: Inscrições públicas
  // ============================================
  if (resource === 'public-registrations') {
    // Permite acesso sem autenticação para listar inscrições públicas
    return handlePublicRegistrations(req, res);
  }
  
  // ============================================
  // 🔒 Demais endpoints exigem autenticação
  // ============================================
  await authenticate(req, res);
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const user = req.user;
  const { id: groupId, action } = req.query;
  
  // ============================================
  // ADMIN ONLY: Criar Inscrição Pública
  // ============================================
  if (req.method === 'POST' && resource === 'admin-registrations') {
    const isAdmin = await hasRole(user.id, 'ADMIN');
    if (!isAdmin) {
      return res.status(403).json({ error: 'Apenas administradores podem criar inscrições' });
    }

    try {
      const {
        title,
        description,
        cover_image_url,
        role_to_grant,
        max_participants,
        approval_type,
        registration_starts,
        registration_ends,
        is_active
      } = req.body;

      if (!title || !description || !role_to_grant) {
        return res.status(400).json({ error: 'Título, descrição e cargo são obrigatórios' });
      }

      // Criar slug a partir do título
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const startsAt = registration_starts || new Date().toISOString();
      const endsAt = registration_ends || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: registration, error } = await supabaseAdmin
        .from('central_registrations')
        .insert({
          group_id: null, // NULL = inscrição pública
          author_id: user.id,
          title,
          description,
          slug,
          cover_image_url: cover_image_url || null,
          role_to_grant,
          max_participants: max_participants || null,
          approval_type: approval_type || 'automatic',
          registration_starts: startsAt,
          registration_ends: endsAt,
          is_active: is_active !== false
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
      console.error('Create registration error:', error);
      return res.status(500).json({ error: 'Erro ao criar inscrição' });
    }
  }

  // ============================================
  // ADMIN ONLY: Editar Inscrição Pública
  // ============================================
  if (req.method === 'PUT' && resource === 'admin-registrations') {
    const isAdmin = await hasRole(user.id, 'ADMIN');
    if (!isAdmin) {
      return res.status(403).json({ error: 'Apenas administradores podem editar inscrições' });
    }

    try {
      const { id: registrationId } = req.query;
      if (!registrationId) {
        return res.status(400).json({ error: 'ID da inscrição é obrigatório' });
      }

      const {
        title,
        description,
        cover_image_url,
        role_to_grant,
        max_participants,
        approval_type,
        registration_starts,
        registration_ends,
        is_active
      } = req.body;

      const updates = {};
      if (title !== undefined) {
        updates.title = title;
        updates.slug = title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      if (description !== undefined) updates.description = description;
      if (cover_image_url !== undefined) updates.cover_image_url = cover_image_url;
      if (role_to_grant !== undefined) updates.role_to_grant = role_to_grant;
      if (max_participants !== undefined) updates.max_participants = max_participants;
      if (approval_type !== undefined) updates.approval_type = approval_type;
      if (registration_starts !== undefined) updates.registration_starts = registration_starts;
      if (registration_ends !== undefined) updates.registration_ends = registration_ends;
      if (is_active !== undefined) updates.is_active = is_active;

      const { data: registration, error } = await supabaseAdmin
        .from('central_registrations')
        .update(updates)
        .eq('id', registrationId)
        .is('group_id', null)
        .select(`
          *,
          author:users!central_registrations_author_id_fkey(id, name, avatar_url),
          role_to_grant_info:roles!central_registrations_role_to_grant_fkey(id, name, display_name, color)
        `)
        .single();

      if (error) throw error;

      return res.status(200).json({ registration });
    } catch (error) {
      console.error('Update registration error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar inscrição' });
    }
  }

  // ============================================
  // ADMIN ONLY: Deletar Inscrição Pública
  // ============================================
  if (req.method === 'DELETE' && resource === 'admin-registrations') {
    const isAdmin = await hasRole(user.id, 'ADMIN');
    if (!isAdmin) {
      return res.status(403).json({ error: 'Apenas administradores podem deletar inscrições' });
    }

    try {
      const { id: registrationId } = req.query;
      if (!registrationId) {
        return res.status(400).json({ error: 'ID da inscrição é obrigatório' });
      }

      const { error } = await supabaseAdmin
        .from('central_registrations')
        .delete()
        .eq('id', registrationId)
        .is('group_id', null);

      if (error) throw error;

      return res.status(200).json({ message: 'Inscrição deletada com sucesso' });
    } catch (error) {
      console.error('Delete registration error:', error);
      return res.status(500).json({ error: 'Erro ao deletar inscrição' });
    }
  }

  // ============================================
  // ADMIN ONLY: Listar Aprovações Pendentes
  // ============================================
  if (req.method === 'GET' && resource === 'pending-approvals') {
    const isAdmin = await hasRole(user.id, 'ADMIN');
    if (!isAdmin) {
      return res.status(403).json({ error: 'Apenas administradores podem ver aprovações' });
    }

    try {
      console.log('[Pending Approvals] Starting fetch...');
      
      // Buscar todas as inscrições públicas com aprovação manual
      const { data: registrations, error: regError } = await supabaseAdmin
        .from('central_registrations')
        .select('id, title')
        .is('group_id', null)
        .eq('approval_type', 'manual');

      if (regError) {
        console.error('[Pending Approvals] Error fetching registrations:', regError);
        throw regError;
      }

      console.log('[Pending Approvals] Found registrations:', registrations?.length || 0);

      if (!registrations || registrations.length === 0) {
        console.log('[Pending Approvals] No manual registrations found, returning empty');
        return res.status(200).json({ approvals: [] });
      }

      const registrationIds = registrations.map(r => r.id);
      console.log('[Pending Approvals] Registration IDs:', registrationIds);

      // Buscar participantes pendentes (SEM join, fazer manual)
      const { data: participants, error: partError } = await supabaseAdmin
        .from('central_registration_participants')
        .select('*')
        .in('registration_id', registrationIds)
        .eq('status', 'pending')
        .order('registered_at', { ascending: false });

      if (partError) {
        console.error('[Pending Approvals] Error fetching participants:', partError);
        throw partError;
      }

      console.log('[Pending Approvals] Found pending participants:', participants?.length || 0);

      // Buscar dados dos usuários separadamente
      const userIds = [...new Set(participants?.map(p => p.user_id) || [])];
      console.log('[Pending Approvals] User IDs to fetch:', userIds);

      const { data: users, error: usersError } = await supabaseAdmin
        .from('users')
        .select('id, name, email, avatar_url')
        .in('id', userIds);

      if (usersError) {
        console.error('[Pending Approvals] Error fetching users:', usersError);
        throw usersError;
      }

      // Montar aprovações com dados completos
      const approvals = (participants || []).map(p => {
        const registration = registrations.find(r => r.id === p.registration_id);
        const user = users?.find(u => u.id === p.user_id);
        
        if (!registration) {
          console.warn('[Pending Approvals] Registration not found for participant:', p.id);
        }
        if (!user) {
          console.warn('[Pending Approvals] User not found for participant:', p.id);
        }
        
        return {
          ...p,
          registration,
          user
        };
      });

      console.log('[Pending Approvals] Returning', approvals.length, 'approvals');
      return res.status(200).json({ approvals });
    } catch (error) {
      console.error('[Pending Approvals] Error:', error);
      console.error('[Pending Approvals] Error stack:', error.stack);
      return res.status(500).json({ 
        error: 'Erro ao buscar aprovações pendentes',
        details: error.message 
      });
    }
  }
  
  // ============================================
  // 1. GET /api/central/groups - Listar grupos
  // ============================================
  if (req.method === 'GET' && !groupId && !resource) {
    try {
      // 🔑 ADMIN vê TODOS os grupos, user normal vê apenas suas roles
      const isAdmin = await hasRole(user.id, 'ADMIN');
      
      let groups;
      
      if (isAdmin) {
        // ADMIN: Ver todos os grupos ativos
        console.log(`[Central Groups] Admin ${user.id} listing all groups`);
        const { data, error } = await supabaseAdmin
          .from('central_groups')
          .select(`
            *,
            roles(id, name, display_name, color)
          `)
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        groups = data;
      } else {
        // USER: Ver apenas grupos das suas roles
        console.log(`[Central Groups] User ${user.id} listing role-based groups`);
        const { data: userRoles } = await supabaseAdmin
          .from('user_roles')
          .select('role_id')
          .eq('user_id', user.id);
        
        const roleIds = userRoles?.map(ur => ur.role_id) || [];
        
        if (roleIds.length === 0) {
          return res.status(200).json({ groups: [] });
        }
        
        // Buscar grupos dessas roles
        const { data, error } = await supabaseAdmin
          .from('central_groups')
          .select(`
            *,
            roles(id, name, display_name, color)
          `)
          .in('role_id', roleIds)
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        groups = data;
      }
      
      // Formatar
      groups?.forEach(group => {
        group.role = group.roles;
        delete group.roles;
      });
      
      // 🚫 CACHE BUSTING - Sempre retornar dados frescos
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      console.log(`[Central Groups] Returning ${groups?.length || 0} groups`);
      return res.status(200).json({ groups: groups || [] });
      
    } catch (error) {
      console.error('Get central groups error:', error);
      return res.status(500).json({ error: 'Erro ao buscar grupos' });
    }
  }
  
  // ==============================================================
  // 🔒 HELPER: Verificar acesso ao grupo (para rotas com groupId)
  // ==============================================================
  async function verifyGroupAccess(groupId, userId) {
    const { data: group } = await supabaseAdmin
      .from('central_groups')
      .select('role_id')
      .eq('id', groupId)
      .single();
    
    if (!group) {
      return { hasAccess: false, isAdmin: false, error: 'Grupo não encontrado', statusCode: 404 };
    }
    
    const { data: userRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId);
    
    const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
    const hasAccess = userRoleIds.includes(group.role_id);
    const isAdmin = await hasRole(userId, 'ADMIN');
    
    if (!hasAccess && !isAdmin) {
      return { hasAccess: false, isAdmin: false, error: 'Sem acesso a este grupo', statusCode: 403 };
    }
    
    return { hasAccess: true, isAdmin, group };
  }
  
  // ============================================
  // 2. POST ?action=create - Criar grupo
  // ============================================
  if (req.method === 'POST' && action === 'create') {
    try {
      // Verificar se é admin usando função auxiliar do middleware
      const isAdmin = await hasRole(user.id, 'ADMIN');
      
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem criar grupos' });
      }

      const { name, display_name, description, color } = req.body;

      if (!name || !display_name) {
        return res.status(400).json({ error: 'Nome e nome de exibição são obrigatórios' });
      }

      const normalizedName = name.toUpperCase().replace(/\s+/g, '_');

      // Verificar se já existe role com esse nome
      const { data: existingRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', normalizedName)
        .maybeSingle();

      if (existingRole) {
        return res.status(409).json({ error: 'Já existe uma role com este nome' });
      }

      // Verificar se já existe grupo Central com esse display_name
      const { data: existingGroup } = await supabaseAdmin
        .from('central_groups')
        .select('id, name')
        .eq('name', display_name)
        .maybeSingle();

      if (existingGroup) {
        return res.status(409).json({ error: 'Já existe um grupo com este nome' });
      }

      // Criar nova role
      const { data: newRole, error: roleError } = await supabaseAdmin
        .from('roles')
        .insert({
          name: normalizedName,
          display_name,
          description: description || null,
          color: color || '#6b7280',
          is_system: false
        })
        .select()
        .single();

      if (roleError) {
        console.error('❌ Erro ao criar role:', roleError);
        return res.status(500).json({ error: 'Erro ao criar grupo', details: roleError.message });
      }
      
      console.log('✅ Role criada:', newRole);

      // Verificar se já existe grupo para essa role
      const { data: existingGroupForRole } = await supabaseAdmin
        .from('central_groups')
        .select('*')
        .eq('role_id', newRole.id)
        .maybeSingle();

      let newGroup;
      
      if (existingGroupForRole) {
        newGroup = existingGroupForRole;
        
        // Atualizar os campos se necessário
        const { data: updatedGroup } = await supabaseAdmin
          .from('central_groups')
          .update({
            name: display_name,
            description: description || `Grupo ${display_name}`
          })
          .eq('id', existingGroupForRole.id)
          .select()
          .single();
        
        newGroup = updatedGroup || existingGroupForRole;
      } else {
        // Criar o grupo Central
        const { data: createdGroup, error: groupError } = await supabaseAdmin
          .from('central_groups')
          .insert({
            name: display_name,
            description: description || `Grupo ${display_name}`,
            role_id: newRole.id
          })
          .select()
          .single();

        if (groupError) {
          console.error('❌ Erro ao criar grupo central:', groupError);
          // Reverter criação da role
          await supabaseAdmin.from('roles').delete().eq('id', newRole.id);
          return res.status(500).json({ error: 'Erro ao criar grupo central', details: groupError.message });
        }

        console.log('✅ Grupo central criado:', createdGroup);
        newGroup = createdGroup;
      }

      console.log('✅ Retornando sucesso. Role:', newRole.id, 'Group:', newGroup?.id);

      return res.status(201).json({
        message: 'Grupo criado com sucesso',
        role: newRole,
        group: newGroup
      });

    } catch (error) {
      console.error('Erro geral:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // ==============================================================
  // 🔒 Verificar acesso ao grupo (para TODAS as rotas com groupId)
  // ==============================================================
  if (groupId) {
    try {
      const accessCheck = await verifyGroupAccess(groupId, user.id);
      
      if (!accessCheck.hasAccess) {
        console.log(`[Central Groups] Access denied for user ${user.id} to group ${groupId}`);
        return res.status(accessCheck.statusCode).json({ error: accessCheck.error });
      }
      
      const isAdmin = accessCheck.isAdmin;
      console.log(`[Central Groups] Access granted for user ${user.id} to group ${groupId} (admin: ${isAdmin})`);
      
      // ============================================
      // 2.5. GET ?id=X - Buscar grupo individual com conteúdo
      // ============================================
      if (req.method === 'GET' && !resource) {
        // Buscar grupo básico
        const { data: group, error: groupError } = await supabaseAdmin
          .from('central_groups')
          .select(`
            *,
            roles(id, name, display_name, color)
          `)
          .eq('id', groupId)
          .single();
        
        if (groupError) throw groupError;
        
        // Buscar posts do grupo
        const { data: posts } = await supabaseAdmin
          .from('central_posts')
          .select(`
            *,
            author:users!central_posts_author_id_fkey(id, name, avatar_url)
          `)
          .eq('group_id', groupId)
          .order('created_at', { ascending: false })
          .limit(20);
        
        // Buscar polls do grupo
        const { data: polls } = await supabaseAdmin
          .from('central_polls')
          .select(`
            *,
            author:users!central_polls_author_id_fkey(id, name, avatar_url)
          `)
          .eq('group_id', groupId)
          .order('created_at', { ascending: false })
          .limit(20);
        
        // Buscar registrations do grupo
        const { data: registrations } = await supabaseAdmin
          .from('central_registrations')
          .select(`
            *,
            author:users!central_registrations_author_id_fkey(id, name, avatar_url)
          `)
          .eq('group_id', groupId)
          .order('created_at', { ascending: false })
          .limit(20);
        
        // Formatar response
        const response = {
          group: {
            ...group,
            role: group.roles,
            group_posts: posts || [],
            polls: polls || [],
            registrations: registrations || []
          }
        };
        
        delete response.group.roles;
        
        console.log(`[Central Groups] Returning group ${groupId} with ${posts?.length || 0} posts, ${polls?.length || 0} polls, ${registrations?.length || 0} registrations`);
        return res.status(200).json(response);
      }
      
      // ============================================
      // 3. GET ?id=X&resource=posts - Listar posts
      // ============================================
      if (req.method === 'GET' && resource === 'posts') {
        const { data: posts, error } = await supabaseAdmin
          .from('central_posts')
          .select(`
            *,
            author:users!central_posts_author_id_fkey(id, name, avatar_url)
          `)
          .eq('group_id', groupId)
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return res.status(200).json({ posts: posts || [] });
      }
      
      // ============================================
      // 4. POST ?id=X&resource=posts - Criar post
      // ============================================
      if (req.method === 'POST' && resource === 'posts') {
        const { title, content, type, metadata, attachments } = req.body;
        
        if (!content) {
          return res.status(400).json({ error: 'Conteúdo é obrigatório' });
        }
        
        const { data: post, error } = await supabaseAdmin
          .from('central_posts')
          .insert({
            group_id: groupId,
            author_id: user.id,
            title: title || null,
            content,
            type: type || 'post',
            metadata: metadata || {},
            attachments: attachments || []
          })
          .select(`
            *,
            author:users!central_posts_author_id_fkey(id, name, avatar_url)
          `)
          .single();
        
        if (error) throw error;
        
        // 🚫 Cache busting
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        console.log(`[Central Groups] Post created in group ${groupId} by user ${user.id}`);
        return res.status(201).json({ post });
      }
      
      // ============================================
      // 5. GET ?id=X&resource=polls - Listar enquetes
      // ============================================
      if (req.method === 'GET' && resource === 'polls') {
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
          .eq('user_id', user.id)
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
      }
      
      // ============================================
      // 6. POST ?id=X&resource=polls - Criar enquete
      // ============================================
      if (req.method === 'POST' && resource === 'polls') {
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
            author_id: user.id,
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
      }
      
      // ============================================
      // 7. GET ?id=X&resource=registrations - Listar inscrições
      // ============================================
      if (req.method === 'GET' && resource === 'registrations') {
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
          .eq('user_id', user.id)
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
          
          // GARANTIR que registration_starts e registration_ends existem e são válidos
          if (!reg.registration_starts) {
            reg.registration_starts = now.toISOString();
          }
          if (!reg.registration_ends) {
            // Default: 30 dias a partir de agora
            const defaultEnds = new Date(now);
            defaultEnds.setDate(defaultEnds.getDate() + 30);
            reg.registration_ends = defaultEnds.toISOString();
          }
          
          const startsAt = new Date(reg.registration_starts);
          const endsAt = new Date(reg.registration_ends);
          
          // Verificar se datas são válidas
          if (isNaN(startsAt.getTime())) {
            console.error(`[Registration ${reg.id}] INVALID registration_starts:`, reg.registration_starts);
            startsAt.setTime(now.getTime());
          }
          if (isNaN(endsAt.getTime())) {
            console.error(`[Registration ${reg.id}] INVALID registration_ends:`, reg.registration_ends);
            endsAt.setTime(now.getTime() + (30 * 24 * 60 * 60 * 1000));
          }
          
          reg.is_open = now >= startsAt && now <= endsAt;
          reg.is_full = reg.max_participants && reg.approved_count >= reg.max_participants;
          
          // Debug para verificar datas
          console.log(`[Registration ${reg.id}] Status:`, {
            title: reg.title,
            now: now.toISOString(),
            starts: startsAt.toISOString(),
            ends: endsAt.toISOString(),
            is_open: reg.is_open,
            is_full: reg.is_full,
            hasValidDates: !isNaN(startsAt.getTime()) && !isNaN(endsAt.getTime())
          });
        });
        
        return res.status(200).json({ registrations: registrations || [] });
      }
      
      // ============================================
      // 8. POST ?id=X&resource=registrations - Criar inscrição (apenas admin)
      // ============================================
      if (req.method === 'POST' && resource === 'registrations') {
        if (!isAdmin) {
          return res.status(403).json({ error: 'Apenas admins podem criar inscrições' });
        }
        
        const { 
          title, 
          description, 
          role_to_grant, 
          max_participants, 
          approval_type,
          registration_starts,
          registration_ends 
        } = req.body;
        
        if (!title || !description || !role_to_grant) {
          return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }
        
        // Se registration_ends não for fornecido, usar 30 dias a partir de agora
        const endsAt = registration_ends || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const startsAt = registration_starts || new Date().toISOString();
        
        const { data: registration, error } = await supabaseAdmin
          .from('central_registrations')
          .insert({
            group_id: groupId,
            author_id: user.id,
            title,
            description,
            role_to_grant,
            max_participants: max_participants || null,
            approval_type: approval_type || 'automatic',
            registration_starts: startsAt,
            registration_ends: endsAt
          })
          .select(`
            *,
            author:users!central_registrations_author_id_fkey(id, name, avatar_url),
            role_to_grant_info:roles!central_registrations_role_to_grant_fkey(id, name, display_name, color)
          `)
          .single();
        
        if (error) throw error;
        
        return res.status(201).json({ registration });
      }
      
      // ============================================
      // 9. GET ?id=X&resource=approvals - Listar aprovações pendentes (apenas admin)
      // ============================================
      if (req.method === 'GET' && resource === 'approvals') {
        if (!isAdmin) {
          return res.status(403).json({ error: 'Apenas admins podem visualizar aprovações' });
        }
        
        const { data: subscriptions, error } = await supabaseAdmin
          .from('central_registration_participants')
          .select(`
            *,
            registration:central_registrations(id, title, group_id, approval_type),
            user:users!central_registration_participants_user_id_fkey(id, name, email)
          `)
          .eq('status', 'pending')
          .eq('registration.group_id', groupId);

        if (error) throw error;

        // Filtrar apenas inscrições de aprovação manual
        const filtered = subscriptions.filter(sub => 
          sub.registration && sub.registration.approval_type === 'manual'
        );

        return res.status(200).json({ subscriptions: filtered });
      }
      
      // ============================================
      // 10. GET ?id=X&resource=members - Listar membros (apenas admin)
      // ============================================
      if (req.method === 'GET' && resource === 'members') {
        if (!isAdmin) {
          return res.status(403).json({ error: 'Apenas admins podem visualizar membros' });
        }
        
        const { data: group, error: groupError } = await supabaseAdmin
          .from('central_groups')
          .select('*, role:roles(id, name, display_name)')
          .eq('id', groupId)
          .single();

        if (groupError || !group) {
          return res.status(404).json({ error: 'Grupo não encontrado' });
        }

        const { data: members, error: membersError } = await supabaseAdmin
          .from('user_roles')
          .select(`
            *,
            user:users!user_roles_user_id_fkey(id, name, email, avatar_url)
          `)
          .eq('role_id', group.role_id);

        if (membersError) throw membersError;

        return res.status(200).json({ 
          group,
          members: members || [] 
        });
      }
      
    } catch (error) {
      console.error('Group resource error:', error);
      return res.status(500).json({ error: 'Erro ao processar requisição' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
