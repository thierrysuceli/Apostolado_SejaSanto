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
      return res.status(403).json({ error: 'Apenas admins podem editar enquetes' });
    }

    const id = req.query?.id || req._expressParams?.id;
    const { question, description, is_pinned, ends_at } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID da enquete é obrigatório' });
    }

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Pergunta é obrigatória' });
    }

    // Verificar se a enquete existe
    const { data: poll, error: fetchError } = await supabaseAdmin
      .from('central_polls')
      .select('id, group_id')
      .eq('id', id)
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

    // Adicionar ends_at se fornecido
    if (ends_at) {
      updateData.ends_at = ends_at;
    }

    const { data, error: updateError } = await supabaseAdmin
      .from('central_polls')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar enquete:', updateError);
      return res.status(500).json({ error: 'Erro ao atualizar enquete' });
    }

    return res.status(200).json({ 
      message: 'Enquete atualizada com sucesso',
      poll: data
    });

  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
