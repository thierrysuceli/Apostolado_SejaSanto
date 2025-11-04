// =====================================================
// API - GERENCIAR MÓDULOS
// POST /api/modules - Criar módulo
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { sanitizeHTML, sanitizeText } from '../lib/sanitize.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  
  await new Promise((resolve, reject) =>
    requireRole('ADMIN')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    })
  );
  
  try {
    const { course_id, title, description, order_index } = req.body;
    
    if (!course_id || !title) {
      return res.status(400).json({ error: 'course_id e title são obrigatórios' });
    }
    
    // Verificar se o curso existe
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', course_id)
      .single();
    
    if (courseError || !course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }
    
    // Sanitizar dados
    const cleanTitle = sanitizeText(title);
    const cleanDescription = description ? sanitizeHTML(description) : null;
    
    // Definir order_index
    let finalOrderIndex = order_index;
    
    if (!finalOrderIndex && finalOrderIndex !== 0) {
      const { data: lastModule } = await supabaseAdmin
        .from('modules')
        .select('order_index')
        .eq('course_id', course_id)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();
      
      finalOrderIndex = lastModule ? lastModule.order_index + 1 : 0;
    }
    
    // Criar módulo
    const { data: module, error } = await supabaseAdmin
      .from('modules')
      .insert({
        course_id,
        title: cleanTitle,
        description: cleanDescription,
        order_index: finalOrderIndex
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(201).json({ module });
    
  } catch (error) {
    console.error('Create module error:', error);
    return res.status(500).json({ error: 'Erro ao criar módulo' });
  }
}
