import { authenticate } from '../../../middleware/auth.js';
import { supabaseAdmin } from '../../../lib/supabaseServer.js';

export default async function handler(req, res) {
  // Apenas PUT
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  try {
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
      return res.status(403).json({ error: 'Apenas admins podem editar inscrições' });
    }

    const id = req.query?.id || req._expressParams?.id;
    const { 
      title, 
      description, 
      is_pinned, 
      registration_ends, 
      max_participants,
      approval_type 
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID da inscrição é obrigatório' });
    }

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
      .eq('id', id)
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

    // Adicionar registration_ends se fornecido
    if (registration_ends) {
      updateData.registration_ends = registration_ends;
    }

    const { data, error: updateError } = await supabaseAdmin
      .from('central_registrations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar inscrição:', updateError);
      return res.status(500).json({ error: 'Erro ao atualizar inscrição' });
    }

    return res.status(200).json({ 
      message: 'Inscrição atualizada com sucesso',
      registration: data
    });

  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
