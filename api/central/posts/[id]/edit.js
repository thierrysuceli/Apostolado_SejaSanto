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
      return res.status(403).json({ error: 'Apenas admins podem editar posts' });
    }

    const id = req.query?.id || req._expressParams?.id;
    const { title, content, is_pinned } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID do post é obrigatório' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Conteúdo é obrigatório' });
    }

    // Verificar se o post existe
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('central_posts')
      .select('id, group_id')
      .eq('id', id)
      .single();

    if (fetchError || !post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Atualizar o post
    const { data, error: updateError } = await supabaseAdmin
      .from('central_posts')
      .update({
        title: title || null,
        content: content.trim(),
        is_pinned: is_pinned || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar post:', updateError);
      return res.status(500).json({ error: 'Erro ao atualizar post' });
    }

    return res.status(200).json({ 
      message: 'Post atualizado com sucesso',
      post: data
    });

  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
