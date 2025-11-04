import { authenticate } from '../../middleware/auth.js';
import { supabaseAdmin } from '../../../lib/supabaseServer.js';

export default async function handler(req, res) {
  try {
    // Autenticação obrigatória
    const authResult = await authenticate(req);
    if (!authResult.success) {
      return res.status(401).json({ error: authResult.error });
    }

    const { id } = req.query; // ID da poll
    const user = authResult.user;

    // GET - Listar comentários da poll
    if (req.method === 'GET') {
      const { data: comments, error } = await supabaseAdmin
        .from('central_comments')
        .select(`
          *,
          author:users!central_comments_author_id_fkey(id, name, avatar_url)
        `)
        .eq('poll_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar comentários:', error);
        return res.status(500).json({ error: 'Erro ao buscar comentários' });
      }

      return res.status(200).json({ comments: comments || [] });
    }

    // POST - Criar comentário
    if (req.method === 'POST') {
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }

      // Verificar se a poll existe
      const { data: poll, error: pollError } = await supabaseAdmin
        .from('central_polls')
        .select('id, group_id')
        .eq('id', id)
        .single();

      if (pollError || !poll) {
        return res.status(404).json({ error: 'Enquete não encontrada' });
      }

      // Verificar se usuário tem acesso ao grupo (via role)
      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id);

      const userRoleIds = userRoles?.map(ur => ur.role_id) || [];

      const { data: group } = await supabaseAdmin
        .from('central_groups')
        .select('role_id')
        .eq('id', poll.group_id)
        .single();

      if (!group || !userRoleIds.includes(group.role_id)) {
        return res.status(403).json({ error: 'Você não tem acesso a este grupo' });
      }

      // Criar comentário
      const { data: comment, error: createError } = await supabaseAdmin
        .from('central_comments')
        .insert({
          poll_id: id,
          author_id: user.id,
          content: content.trim()
        })
        .select(`
          *,
          author:users!central_comments_author_id_fkey(id, name, avatar_url)
        `)
        .single();

      if (createError) {
        console.error('Erro ao criar comentário:', createError);
        return res.status(500).json({ error: 'Erro ao criar comentário' });
      }

      return res.status(201).json({ comment });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
