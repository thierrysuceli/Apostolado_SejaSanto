// =====================================================
// API - VER/EDITAR/DELETAR EVENTO
// GET/PUT/DELETE /api/events/:id
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { sanitizeHTML, sanitizeText, generateSlug } from '../lib/sanitize.js';
import { authenticate, hasRole } from '../middleware/auth.js';

export default async function handler(req, res) {
  const id = req.query?.id || req._expressParams?.id;
  
  if (!id) {
    return res.status(400).json({ error: 'ID do evento é obrigatório' });
  }
  
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  // GET - Ver evento
  if (req.method === 'GET') {
    try {
      const { data: event, error } = await supabaseAdmin
        .from('events')
        .select(`
          *,
          users(id, name, email, avatar_url),
          event_tags(roles(id, name, display_name, color)),
          event_category_tags(category_id, event_categories(id, name, color, icon)),
          comments(
            *,
            users(id, name, avatar_url)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Evento não encontrado' });
        }
        throw error;
      }
      
      // Verificar acesso
      const isAdmin = req.user ? await hasRole(req.user.id, 'ADMIN') : false;
      
      if (!isAdmin) {
        // Buscar roles do usuário
        let hasAccess = false;
        
        if (req.user) {
          const { data: userRoles } = await supabaseAdmin
            .from('user_roles')
            .select('role_id')
            .eq('user_id', req.user.id);
          
          const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
          const eventRoleIds = event.event_tags?.map(et => et.roles.id) || [];
          
          hasAccess = eventRoleIds.some(roleId => userRoleIds.includes(roleId));
          
        } else {
          // Visitante
          const { data: visitanteRole } = await supabaseAdmin
            .from('roles')
            .select('id')
            .eq('name', 'VISITANTE')
            .single();
          
          if (visitanteRole) {
            const eventRoleIds = event.event_tags?.map(et => et.roles.id) || [];
            hasAccess = eventRoleIds.includes(visitanteRole.id);
          }
        }
        
        if (!hasAccess) {
          return res.status(403).json({ error: 'Acesso negado' });
        }
      }
      
      // Formatar resposta
      event.author = event.users;
      event.tags = event.event_tags?.map(et => et.roles) || [];
      delete event.users;
      delete event.event_tags;
      
      return res.status(200).json({ event });
      
    } catch (error) {
      console.error('Get event error:', error);
      return res.status(500).json({ error: 'Erro ao buscar evento' });
    }
  }
  
  // PUT - Editar evento
  if (req.method === 'PUT') {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }
    
    const isAdmin = await hasRole(req.user.id, 'ADMIN');
    
    // Verificar se é o autor
    const { data: event } = await supabaseAdmin
      .from('events')
      .select('created_by')
      .eq('id', id)
      .single();
    
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    const isAuthor = event.created_by === req.user.id;
    
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ error: 'Apenas admin ou autor podem editar' });
    }
    
    try {
      const { 
        title, 
        description, 
        start_date, 
        end_date, 
        all_day,
        location, 
        meeting_link,
        color,
        categories,
        roles: roleTags,
        status 
      } = req.body;
      
      const updates = {};
      
      if (title !== undefined) {
        updates.title = sanitizeText(title);
        updates.slug = generateSlug(updates.title);
      }
      
      if (description !== undefined) {
        updates.description = sanitizeHTML(description);
      }
      
      if (start_date !== undefined) {
        updates.start_date = start_date;
      }
      
      if (end_date !== undefined) {
        updates.end_date = end_date || null;
        
        // Validar datas
        const finalStartDate = updates.start_date || event.start_date;
        if (updates.end_date && new Date(updates.end_date) < new Date(finalStartDate)) {
          return res.status(400).json({ error: 'end_date deve ser posterior a start_date' });
        }
      }
      
      if (all_day !== undefined) {
        updates.all_day = all_day;
      }
      
      if (location !== undefined) {
        updates.location = location ? sanitizeText(location) : null;
      }
      
      if (meeting_link !== undefined) {
        updates.meeting_link = meeting_link || null;
      }
      
      if (color !== undefined) {
        updates.color = color || null;
      }
      
      if (status !== undefined) {
        updates.status = status;
      }
      
      // Atualizar evento
      const { data: updatedEvent, error: updateError } = await supabaseAdmin
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Atualizar roles (tags) se fornecidas
      if (roleTags && Array.isArray(roleTags)) {
        await supabaseAdmin
          .from('event_tags')
          .delete()
          .eq('event_id', id);
        
        if (roleTags.length > 0) {
          const eventTags = roleTags.map(roleId => ({
            event_id: id,
            role_id: roleId
          }));
          
          await supabaseAdmin
            .from('event_tags')
            .insert(eventTags);
        }
      }
      
      // Atualizar categorias se fornecidas
      if (categories && Array.isArray(categories)) {
        await supabaseAdmin
          .from('event_category_tags')
          .delete()
          .eq('event_id', id);
        
        if (categories.length > 0) {
          const eventCategories = categories.map(categoryId => ({
            event_id: id,
            category_id: categoryId
          }));
          
          await supabaseAdmin
            .from('event_category_tags')
            .insert(eventCategories);
        }
      }
      
      return res.status(200).json({ event: updatedEvent });
      
    } catch (error) {
      console.error('Update event error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar evento' });
    }
  }
  
  // DELETE - Deletar evento
  if (req.method === 'DELETE') {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }
    
    const isAdmin = await hasRole(req.user.id, 'ADMIN');
    
    const { data: event } = await supabaseAdmin
      .from('events')
      .select('created_by')
      .eq('id', id)
      .single();
    
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    const isAuthor = event.created_by === req.user.id;
    
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ error: 'Apenas admin ou autor podem deletar' });
    }
    
    try {
      const { error } = await supabaseAdmin
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: 'Evento deletado com sucesso' });
      
    } catch (error) {
      console.error('Delete event error:', error);
      return res.status(500).json({ error: 'Erro ao deletar evento' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
