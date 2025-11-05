// =====================================================
// API - LISTAR/CRIAR EVENTOS
// GET/POST /api/events
// =====================================================

import { supabaseAdmin, supabase } from '../lib/supabaseServer.js';
import { sanitizeHTML, sanitizeText, generateSlug } from '../lib/sanitize.js';
import { authenticate, hasRole } from '../middleware/auth.js';
import { runMiddleware } from '../lib/expressHelpers.js';

export default async function handler(req, res) {
  await runMiddleware(authenticate)(req, res);
  
  // GET - Listar eventos
  if (req.method === 'GET') {
    try {
      let query = supabaseAdmin
        .from('events')
        .select(`
          *,
          users(id, name, email),
          event_tags(roles(id, name, display_name)),
          event_category_tags(category_id, event_categories(id, name, color, icon))
        `)
        .order('start_date', { ascending: true });
      
      // Admin vê tudo (tabela events não tem campo status)
      const isAdmin = req.user ? await hasRole(req.user.id, 'ADMIN') : false;
      
      const { data: events, error } = await query;
      
      if (error) throw error;
      
      // Filtrar por role
      let filteredEvents = events || [];
      
      if (!isAdmin && req.user) {
        // Buscar roles do usuário
        const { data: userRoles } = await supabaseAdmin
          .from('user_roles')
          .select('role_id')
          .eq('user_id', req.user.id);
        
        const userRoleIds = userRoles?.map(ur => ur.role_id) || [];
        
        filteredEvents = events.filter(event => {
          const eventRoleIds = event.event_tags?.map(et => et.roles.id) || [];
          return eventRoleIds.some(roleId => userRoleIds.includes(roleId));
        });
        
      } else if (!req.user) {
        // Visitante - apenas eventos com tag VISITANTE
        const { data: visitanteRole } = await supabaseAdmin
          .from('roles')
          .select('id')
          .eq('name', 'VISITANTE')
          .single();
        
        if (visitanteRole) {
          filteredEvents = events.filter(event => {
            const eventRoleIds = event.event_tags?.map(et => et.roles.id) || [];
            return eventRoleIds.includes(visitanteRole.id);
          });
        } else {
          filteredEvents = [];
        }
      }
      
      // Remover duplicatas
      const uniqueEvents = Array.from(
        new Map(filteredEvents.map(e => [e.id, e])).values()
      );
      
      // Formatar tags
      uniqueEvents.forEach(event => {
        event.author = event.users;
        event.tags = event.event_tags?.map(et => et.roles) || [];
        // Manter event_category_tags para o frontend
        delete event.users;
        delete event.event_tags;
      });
      
      return res.status(200).json({ events: uniqueEvents });
      
    } catch (error) {
      console.error('Get events error:', error);
      return res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
  }
  
  // POST - Criar evento
  if (req.method === 'POST') {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }
    
    const isAdmin = await hasRole(req.user.id, 'ADMIN');
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Apenas admin pode criar eventos' });
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
        categories = [],
        roles = [],
        status 
      } = req.body;
      
      if (!title || !start_date) {
        return res.status(400).json({ error: 'title e start_date são obrigatórios' });
      }
      
      // Validar datas
      if (end_date && new Date(end_date) < new Date(start_date)) {
        return res.status(400).json({ error: 'end_date deve ser posterior a start_date' });
      }
      
      // Sanitizar dados
      const cleanTitle = sanitizeText(title);
      const cleanDescription = sanitizeHTML(description);
      const slug = generateSlug(cleanTitle);
      const cleanLocation = location ? sanitizeText(location) : null;
      
      // Criar evento
      const { data: event, error } = await supabaseAdmin
        .from('events')
        .insert({
          title: cleanTitle,
          description: cleanDescription || '',
          slug,
          start_date,
          end_date: end_date || null,
          all_day: all_day || false,
          location: cleanLocation,
          meeting_link: meeting_link || null,
          color: color || null,
          created_by: req.user.id,
          status: status || 'published'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Associar roles (tags)
      if (roles && roles.length > 0) {
        const eventTags = roles.map(roleId => ({
          event_id: event.id,
          role_id: roleId
        }));
        
        await supabaseAdmin
          .from('event_tags')
          .insert(eventTags);
      }
      
      // Associar categorias
      if (categories && categories.length > 0) {
        const eventCategories = categories.map(categoryId => ({
          event_id: event.id,
          category_id: categoryId
        }));
        
        await supabaseAdmin
          .from('event_category_tags')
          .insert(eventCategories);
      }
      
      return res.status(201).json({ event });
      
    } catch (error) {
      console.error('Create event error:', error);
      return res.status(500).json({ error: 'Erro ao criar evento' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
