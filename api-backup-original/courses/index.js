// =====================================================
// API - LISTAR CURSOS
// GET /api/courses
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, hasRole } from '../middleware/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    await new Promise((resolve) => authenticate(req, res, resolve));
    
    let roleIds = [];
    
    if (req.user) {
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      
      if (isAdmin) {
        // Admin vê tudo (inclusive sem tags)
        const { data: courses, error } = await supabaseAdmin
          .from('courses')
          .select(`
            *,
            course_tags(role_id, roles(name, display_name, color)),
            course_content_tags(tag_id, tags(id, name, slug, description, color)),
            modules(id, title, order_index)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Ordenar módulos de cada curso
        courses?.forEach(course => {
          if (course.modules) {
            course.modules.sort((a, b) => a.order_index - b.order_index);
          }
        });
        
        return res.status(200).json({ courses: courses || [] });
      }
      
      // Buscar roles do usuário
      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role_id')
        .eq('user_id', req.user.id);
      
      roleIds = userRoles ? userRoles.map(ur => ur.role_id) : [];
    } else {
      // Visitante
      const { data: visitanteRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'VISITANTE')
        .single();
      
      if (visitanteRole) roleIds = [visitanteRole.id];
    }
    
    if (roleIds.length === 0) {
      return res.status(200).json({ courses: [] });
    }
    
    // Buscar IDs dos cursos visíveis via tags
    const { data: courseTags, error: tagError } = await supabaseAdmin
      .from('course_tags')
      .select('course_id')
      .in('role_id', roleIds);
    
    if (tagError) throw tagError;
    
    const courseIds = courseTags ? [...new Set(courseTags.map(ct => ct.course_id))] : [];
    
    if (courseIds.length === 0) {
      return res.status(200).json({ courses: [] });
    }
    
    // Buscar cursos completos
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select(`
        *,
        course_tags(role_id, roles(name, display_name, color)),
        course_content_tags(tag_id, tags(id, name, slug, description, color)),
        modules(id, title, order_index)
      `)
      .eq('status', 'published')
      .in('id', courseIds)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Ordenar módulos
    courses?.forEach(course => {
      if (course.modules) {
        course.modules.sort((a, b) => a.order_index - b.order_index);
      }
    });
    
    return res.status(200).json({ courses: courses || [] });
    
  } catch (error) {
    console.error('Get courses error:', error);
    return res.status(500).json({ error: 'Erro ao buscar cursos' });
  }
}
