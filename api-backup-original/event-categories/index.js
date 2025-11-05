// =====================================================
// API - CATEGORIAS DE EVENTOS
// GET/POST /api/event-categories
// =====================================================

import { supabaseAdmin } from '../lib/supabaseServer.js';
import { authenticate, hasRole, hasPermission } from '../middleware/auth.js';

export default async function handler(req, res) {
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  // GET - Listar todas as categorias
  if (req.method === 'GET') {
    try {
      const { data: categories, error } = await supabaseAdmin
        .from('event_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return res.status(200).json({ categories });
      
    } catch (error) {
      console.error('Get event categories error:', error);
      return res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
  }
  
  // POST - Criar nova categoria (apenas admin)
  if (req.method === 'POST') {
    await new Promise((resolve) => hasPermission(req, res, resolve));
    
    if (!req.userPermissions.includes('manage_events')) {
      return res.status(403).json({ error: 'Sem permissão para criar categorias' });
    }
    
    try {
      const { name, description, color, icon } = req.body;
      
      if (!name || !color) {
        return res.status(400).json({ error: 'Nome e cor são obrigatórios' });
      }
      
      const { data: category, error } = await supabaseAdmin
        .from('event_categories')
        .insert({
          name,
          description: description || null,
          color,
          icon: icon || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({ category });
      
    } catch (error) {
      console.error('Create event category error:', error);
      return res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
