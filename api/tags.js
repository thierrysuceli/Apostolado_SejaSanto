// =====================================================
// API - GERENCIAR TAGS TEMÁTICAS
// GET/POST/PUT/DELETE /api/tags
// =====================================================

import { supabaseAdmin } from './lib/supabaseServer.js';
import { authenticate, requireRole } from './middleware/auth.js';

export default async function handler(req, res) {
  // GET - Listar tags (público)
  if (req.method === 'GET') {
    try {
      const { data: tags, error } = await supabaseAdmin
        .from('tags')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return res.status(200).json({ tags: tags || [] });
      
    } catch (error) {
      console.error('Get tags error:', error);
      return res.status(500).json({ error: 'Erro ao buscar tags' });
    }
  }

  // Require authentication for other methods
  await new Promise((resolve) => authenticate(req, res, resolve));
  
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  // Require ADMIN role
  await new Promise((resolve, reject) =>
    requireRole('ADMIN')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    })
  );

  // POST - Criar nova tag
  if (req.method === 'POST') {
    try {
      const { name, description, color } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const { data: tag, error } = await supabaseAdmin
        .from('tags')
        .insert({
          name,
          slug,
          description: description || null,
          color: color || '#6b7280'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({ tag });
      
    } catch (error) {
      console.error('Create tag error:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Já existe uma tag com este nome' });
      }
      return res.status(500).json({ error: 'Erro ao criar tag' });
    }
  }

  // PUT - Atualizar tag
  if (req.method === 'PUT') {
    try {
      const { id } = req.query || {};
      const { name, description, color } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID da tag é obrigatório' });
      }

      const updateData = {};
      if (name) {
        updateData.name = name;
        updateData.slug = name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      if (description !== undefined) updateData.description = description;
      if (color) updateData.color = color;
      
      const { data: tag, error } = await supabaseAdmin
        .from('tags')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(200).json({ tag });
      
    } catch (error) {
      console.error('Update tag error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar tag' });
    }
  }

  // DELETE - Deletar tag
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query || {};
      
      if (!id) {
        return res.status(400).json({ error: 'ID da tag é obrigatório' });
      }
      
      const { error } = await supabaseAdmin
        .from('tags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: 'Tag deletada com sucesso' });
      
    } catch (error) {
      console.error('Delete tag error:', error);
      return res.status(500).json({ error: 'Erro ao deletar tag' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
