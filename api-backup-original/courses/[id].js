// =====================================================
// API - DETALHES DO CURSO
// GET/PUT/DELETE /api/courses/:id
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, hasRole, hasPermission } from '../middleware/auth.js';
import { generateSlug } from '../lib/sanitize.js';

export default async function handler(req, res) {
  const id = req.query?.id || req._expressParams?.id;
  
  if (!id) {
    return res.status(400).json({ error: 'ID do curso é obrigatório' });
  }
  
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  // GET - Detalhes do curso com módulos e tópicos
  if (req.method === 'GET') {
    try {
      let course;
      
      if (req.user) {
        const isAdmin = await hasRole(req.user.id, 'ADMIN');
        
        if (isAdmin) {
          const { data, error } = await supabaseAdmin
            .from('courses')
            .select(`
              *,
              course_tags(role_id, roles(name, display_name, color)),
              course_content_tags(tag_id, tags(id, name, slug, description, color)),
              modules(
                *,
                topics(*)
              )
            `)
            .eq('id', id)
            .single();
          
          if (error) throw error;
          course = data;
        } else {
          const { data: userRoles } = await supabaseAdmin
            .from('user_roles')
            .select('role_id')
            .eq('user_id', req.user.id);
          
          const roleIds = userRoles ? userRoles.map(ur => ur.role_id) : [];
          
          const { data, error } = await supabaseAdmin
            .from('courses')
            .select(`
              *,
              course_tags!inner(role_id, roles(name, display_name, color)),
              course_content_tags(tag_id, tags(id, name, slug, description, color)),
              modules(
                *,
                topics(*)
              )
            `)
            .eq('id', id)
            .eq('status', 'published')
            .in('course_tags.role_id', roleIds)
            .single();
          
          if (error) throw error;
          course = data;
        }
      } else {
        const { data: visitanteRole } = await supabaseAdmin
          .from('roles')
          .select('id')
          .eq('name', 'VISITANTE')
          .single();
        
        const { data, error } = await supabaseAdmin
          .from('courses')
          .select(`
            *,
            course_tags!inner(role_id, roles(name, display_name, color)),
            course_content_tags(tag_id, tags(id, name, slug, description, color)),
            modules(
              *,
              topics(*)
            )
          `)
          .eq('id', id)
          .eq('status', 'published')
          .eq('course_tags.role_id', visitanteRole.id)
          .single();
        
        if (error) throw error;
        course = data;
      }
      
      if (!course) {
        return res.status(404).json({ error: 'Curso não encontrado ou sem acesso' });
      }
      
      // Ordenar módulos e tópicos
      if (course.modules) {
        course.modules.sort((a, b) => a.order_index - b.order_index);
        course.modules.forEach(module => {
          if (module.topics) {
            module.topics.sort((a, b) => a.order_index - b.order_index);
          }
        });
      }
      
      return res.status(200).json({ course });
      
    } catch (error) {
      console.error('Get course error:', error);
      return res.status(500).json({ error: 'Erro ao buscar curso' });
    }
  }
  
  // PUT - Editar curso
  if (req.method === 'PUT') {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
      }
      
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      const hasEditPermission = await hasPermission(req.user.id, 'EDIT_COURSE');
      
      if (!isAdmin && !hasEditPermission) {
        return res.status(403).json({ error: 'Sem permissão para editar cursos' });
      }
      
      const { title, description, cover_image_url, status, tags, thematicTags } = req.body;
      
      const updateData = {};
      if (title) {
        updateData.title = title;
        updateData.slug = generateSlug(title);
      }
      if (description !== undefined) updateData.description = description;
      if (cover_image_url !== undefined) updateData.cover_image_url = cover_image_url;
      if (status) updateData.status = status;
      updateData.updated_at = new Date().toISOString();
      
      const { data: updatedCourse, error } = await supabaseAdmin
        .from('courses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar tags de permissão (quem pode ver)
      if (tags && Array.isArray(tags)) {
        await supabaseAdmin
          .from('course_tags')
          .delete()
          .eq('course_id', id);
        
        if (tags.length > 0) {
          const courseTags = tags.map(roleId => ({
            course_id: id,
            role_id: roleId
          }));
          
          await supabaseAdmin
            .from('course_tags')
            .insert(courseTags);
        }
      }

      // Atualizar tags temáticas (sobre o que é)
      if (thematicTags && Array.isArray(thematicTags)) {
        await supabaseAdmin
          .from('course_content_tags')
          .delete()
          .eq('course_id', id);
        
        if (thematicTags.length > 0) {
          const contentTags = thematicTags.map(tagId => ({
            course_id: id,
            tag_id: tagId
          }));
          
          await supabaseAdmin
            .from('course_content_tags')
            .insert(contentTags);
        }
      }
      
      return res.status(200).json({ course: updatedCourse });
      
    } catch (error) {
      console.error('Update course error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar curso' });
    }
  }
  
  // DELETE - Deletar curso
  if (req.method === 'DELETE') {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
      }
      
      const isAdmin = await hasRole(req.user.id, 'ADMIN');
      const hasDeletePermission = await hasPermission(req.user.id, 'DELETE_COURSE');
      
      if (!isAdmin && !hasDeletePermission) {
        return res.status(403).json({ error: 'Sem permissão para deletar cursos' });
      }
      
      const { error } = await supabaseAdmin
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: 'Curso deletado com sucesso' });
      
    } catch (error) {
      console.error('Delete course error:', error);
      return res.status(500).json({ error: 'Erro ao deletar curso' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
