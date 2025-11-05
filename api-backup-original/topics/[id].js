// =====================================================
// API - OPERAÇÕES EM TÓPICO
// GET/PUT /api/topics/:id
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, hasRole, hasPermission } from '../middleware/auth.js';
import { sanitizeHTML, isValidYouTubeUrl } from '../lib/sanitize.js';

export default async function handler(req, res) {
  const id = req.query?.id || req._expressParams?.id;
  
  if (!id) {
    return res.status(400).json({ error: 'ID do tópico é obrigatório' });
  }
  
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  // GET - Detalhes do tópico
  if (req.method === 'GET') {
    try {
      const { data: topic, error } = await supabaseAdmin
        .from('topics')
        .select(`
          *,
          modules!inner(
            id,
            title,
            course_id,
            courses!inner(
              id,
              title,
              course_tags(role_id)
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!topic) {
        return res.status(404).json({ error: 'Tópico não encontrado' });
      }
      
      // Verificar acesso
      if (req.user) {
        const isAdmin = await hasRole(req.user.id, 'ADMIN');
        
        if (!isAdmin) {
          const { data: userRoles } = await supabaseAdmin
            .from('user_roles')
            .select('role_id')
            .eq('user_id', req.user.id);
          
          const roleIds = userRoles ? userRoles.map(ur => ur.role_id) : [];
          const courseTags = topic.modules.courses.course_tags.map(ct => ct.role_id);
          
          const hasAccess = roleIds.some(roleId => courseTags.includes(roleId));
          
          if (!hasAccess) {
            return res.status(403).json({ error: 'Sem acesso a este tópico' });
          }
        }
      } else {
        // Visitante
        const { data: visitanteRole } = await supabaseAdmin
          .from('roles')
          .select('id')
          .eq('name', 'VISITANTE')
          .single();
        
        const courseTags = topic.modules.courses.course_tags.map(ct => ct.role_id);
        
        if (!courseTags.includes(visitanteRole.id)) {
          return res.status(403).json({ error: 'Sem acesso a este tópico' });
        }
      }
      
      return res.status(200).json({ topic });
      
    } catch (error) {
      console.error('Get topic error:', error);
      return res.status(500).json({ error: 'Erro ao buscar tópico' });
    }
  }
  
  // PUT - Editar tópico (contentBefore, contentAfter, video_url)
  if (req.method === 'PUT') {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
      }
      
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      const hasEditPermission = await hasPermission(req.user.id, 'EDIT_COURSE');
      
      if (!isAdmin && !hasEditPermission) {
        return res.status(403).json({ error: 'Sem permissão para editar tópicos' });
      }
      
      const { title, content_before, content_after, video_url, duration, order_index } = req.body;
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (content_before !== undefined) updateData.content_before = sanitizeHTML(content_before);
      if (content_after !== undefined) updateData.content_after = sanitizeHTML(content_after);
      if (video_url !== undefined) {
        if (video_url) {
          // Extrair ID do YouTube e converter para formato embed
          const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
          const match = video_url.match(youtubeRegex);
          if (match && match[1]) {
            updateData.video_url = `https://www.youtube.com/embed/${match[1]}`;
          } else if (!isValidYouTubeUrl(video_url)) {
            return res.status(400).json({ error: 'URL do YouTube inválida' });
          }
        } else {
          updateData.video_url = null;
        }
      }
      if (duration !== undefined) updateData.duration = duration;
      if (order_index !== undefined) updateData.order_index = order_index;
      updateData.updated_at = new Date().toISOString();
      
      const { data: updatedTopic, error } = await supabaseAdmin
        .from('topics')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(200).json({ topic: updatedTopic });
      
    } catch (error) {
      console.error('Update topic error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar tópico' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
