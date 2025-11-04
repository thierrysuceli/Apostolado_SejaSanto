import { authenticate } from '../../../middleware/auth.js';
import { supabaseAdmin } from '../../../lib/supabaseServer.js';

export default async function handler(req, res) {
  // DELETE - Remover membro do grupo
  if (req.method === 'DELETE') {
    await new Promise((resolve) => authenticate(req, res, resolve));
    
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }

    try {
      const memberId = req.query?.memberId || req._expressParams?.memberId;
      const { user_id, role_id } = req.body;

      if (!user_id || !role_id) {
        return res.status(400).json({ error: 'user_id e role_id são obrigatórios' });
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
      
      if (!isAdmin) {
        return res.status(403).json({ error: 'Apenas admins podem remover membros' });
      }

      // Não permitir remover a role ADMIN do usuário admin
      const { data: targetRole } = await supabaseAdmin
        .from('roles')
        .select('name')
        .eq('id', role_id)
        .single();

      if (targetRole?.name === 'ADMIN') {
        return res.status(403).json({ error: 'Não é possível remover a role ADMIN' });
      }

      // Remover a role do usuário
      const { error: deleteError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', user_id)
        .eq('role_id', role_id);

      if (deleteError) {
        console.error('Erro ao remover membro:', deleteError);
        return res.status(500).json({ error: 'Erro ao remover membro' });
      }

      return res.status(200).json({ 
        message: 'Membro removido com sucesso' 
      });

    } catch (error) {
      console.error('Erro geral:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
