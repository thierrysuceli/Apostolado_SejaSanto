import { authenticate } from '../../../middleware/auth.js';
import { supabaseAdmin } from '../../../lib/supabaseServer.js';

export default async function handler(req, res) {
  // GET - Listar membros do grupo
  if (req.method === 'GET') {
    await new Promise((resolve) => authenticate(req, res, resolve));
    
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }

    try {
      const groupId = req.query?.groupId || req._expressParams?.groupId;

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
        return res.status(403).json({ error: 'Apenas admins podem visualizar membros' });
      }

      // Buscar o grupo e sua role
      const { data: group, error: groupError } = await supabaseAdmin
        .from('central_groups')
        .select('*, role:roles(id, name, display_name)')
        .eq('id', groupId)
        .single();

      if (groupError || !group) {
        return res.status(404).json({ error: 'Grupo não encontrado' });
      }

      // Buscar todos os usuários que possuem essa role
      // Especificar FK user_id para evitar ambiguidade (assigned_by também referencia users)
      const { data: members, error: membersError } = await supabaseAdmin
        .from('user_roles')
        .select(`
          *,
          user:users!user_roles_user_id_fkey(id, name, email, avatar_url)
        `)
        .eq('role_id', group.role_id);

      if (membersError) {
        console.error('Erro ao buscar membros:', membersError);
        return res.status(500).json({ error: 'Erro ao buscar membros' });
      }

      return res.status(200).json({ 
        group,
        members: members || [] 
      });

    } catch (error) {
      console.error('Erro geral:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
