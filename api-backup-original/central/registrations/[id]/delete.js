import { authenticate } from '../../../middleware/auth.js';
import { supabaseAdmin } from '../../../lib/supabaseServer.js';

export default async function handler(req, res) {
  // Apenas DELETE
  if (req.method !== 'DELETE') {
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
      return res.status(403).json({ error: 'Apenas admins podem deletar inscrições' });
    }

    const id = req.query?.id || req._expressParams?.id;

    if (!id) {
      return res.status(400).json({ error: 'ID da inscrição é obrigatório' });
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

    // Deletar participantes relacionados primeiro
    await supabaseAdmin
      .from('central_registration_participants')
      .delete()
      .eq('registration_id', id);

    // Deletar comentários relacionados
    await supabaseAdmin
      .from('central_comments')
      .delete()
      .eq('registration_id', id);

    // Deletar a inscrição
    const { error: deleteError } = await supabaseAdmin
      .from('central_registrations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Erro ao deletar inscrição:', deleteError);
      return res.status(500).json({ error: 'Erro ao deletar inscrição' });
    }

    return res.status(200).json({ 
      message: 'Inscrição deletada com sucesso',
      deleted_id: id
    });

  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
