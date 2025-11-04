import { authenticate } from '../../../middleware/auth.js';
import { supabaseAdmin } from '../../../lib/supabaseServer.js';

export default async function handler(req, res) {
  // GET - Listar inscrições pendentes de aprovação
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
        return res.status(403).json({ error: 'Apenas admins podem visualizar aprovações' });
      }

      // Buscar inscrições pendentes do grupo
      const { data: subscriptions, error } = await supabaseAdmin
        .from('central_registration_participants')
        .select(`
          *,
          registration:central_registrations(id, title, group_id, approval_type),
          user:users!central_registration_participants_user_id_fkey(id, name, email)
        `)
        .eq('status', 'pending')
        .eq('registration.group_id', groupId);

      if (error) {
        console.error('Erro ao buscar aprovações:', error);
        return res.status(500).json({ error: 'Erro ao carregar aprovações' });
      }

      // Filtrar apenas inscrições de aprovação manual
      const filtered = subscriptions.filter(sub => 
        sub.registration && sub.registration.approval_type === 'manual'
      );

      return res.status(200).json({ subscriptions: filtered });

    } catch (error) {
      console.error('Erro geral:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
