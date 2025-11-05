// =====================================================
// API - CENTRAL GROUPS (CONSOLIDADA)
// Combina 7 endpoints em 1 função usando query params
// =====================================================

import { authenticate, hasRole } from '../../middleware-api/auth.js';
import { supabaseAdmin } from '../../lib-api/supabaseServer.js';

export default async function handler(req, res) {
  // Autenticação obrigatória
  await authenticate(req, res);
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const user = req.user;
  const { id: groupId, resource, action } = req.query;
  
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
          const startsAt = new Date(reg.registration_starts);
          const endsAt = new Date(reg.registration_ends);
          
          reg.is_open = now >= startsAt && now <= endsAt;
          reg.is_full = reg.max_participants && reg.approved_count >= reg.max_participants;
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
        
        if (!title || !description || !role_to_grant || !registration_ends) {
          return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }
        
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
            registration_starts: registration_starts || new Date().toISOString(),
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
