// =====================================================
// API - EDITAR/DELETAR MÓDULO
// PUT/DELETE /api/modules/:id
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { sanitizeHTML, sanitizeText } from '../lib/sanitize.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function handler(req, res) {
  const id = req.query?.id || req._expressParams?.id;
  
  if (!id) {
    return res.status(400).json({ error: 'ID do módulo é obrigatório' });
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
  
  // PUT - Editar módulo
  if (req.method === 'PUT') {
    try {
      const { title, description, order_index } = req.body;
      
      const updates = {};
      
      if (title !== undefined) {
        updates.title = sanitizeText(title);
      }
      
      if (description !== undefined) {
        updates.description = description ? sanitizeHTML(description) : null;
      }
      
      if (order_index !== undefined) {
        updates.order_index = order_index;
      }
      
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' });
      }
      
      const { data: module, error } = await supabaseAdmin
        .from('modules')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          topics(*)
        `)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Módulo não encontrado' });
        }
        throw error;
      }
      
      return res.status(200).json({ module });
      
    } catch (error) {
      console.error('Update module error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar módulo' });
    }
  }
  
  // DELETE - Deletar módulo
  if (req.method === 'DELETE') {
    try {
      const { error } = await supabaseAdmin
        .from('modules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: 'Módulo deletado com sucesso' });
      
    } catch (error) {
      console.error('Delete module error:', error);
      return res.status(500).json({ error: 'Erro ao deletar módulo' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
