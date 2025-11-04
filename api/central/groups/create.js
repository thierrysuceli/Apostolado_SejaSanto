import { authenticate } from '../../middleware/auth.js';
import { supabaseAdmin } from '../../lib/supabaseServer.js';

export default async function handler(req, res) {
  // POST - Criar novo grupo
  if (req.method === 'POST') {
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
        return res.status(403).json({ error: 'Apenas admins podem criar grupos' });
      }

      const { name, display_name, description, color } = req.body;

      console.log('📝 Dados recebidos para criar grupo:', { name, display_name, description, color });

      if (!name || !display_name) {
        return res.status(400).json({ error: 'Nome e nome de exibição são obrigatórios' });
      }

      const normalizedName = name.toUpperCase().replace(/\s+/g, '_');
      console.log('📝 Nome normalizado:', normalizedName);

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

      // Criar nova role (SEM permissões, is_system = false)
      console.log('✨ Criando nova role...');
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
        return res.status(500).json({ error: 'Erro ao criar grupo' });
      }

      console.log('✅ Role criada com sucesso:', newRole.id);

      // Verificar se já existe grupo para essa role (pode ter sido criado por trigger)
      const { data: existingGroupForRole } = await supabaseAdmin
        .from('central_groups')
        .select('*')
        .eq('role_id', newRole.id)
        .maybeSingle();

      let newGroup;
      
      if (existingGroupForRole) {
        console.log('ℹ️ Grupo Central já existe (criado por trigger):', existingGroupForRole.id);
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
        console.log('✨ Criando grupo Central para role_id:', newRole.id);
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
          console.log('🔄 Revertendo criação da role:', newRole.id);
          await supabaseAdmin.from('roles').delete().eq('id', newRole.id);
          return res.status(500).json({ error: 'Erro ao criar grupo central' });
        }

        newGroup = createdGroup;
        console.log('✅ Grupo Central criado com sucesso:', newGroup.id);
      }

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

  return res.status(405).json({ error: 'Method not allowed' });
}
