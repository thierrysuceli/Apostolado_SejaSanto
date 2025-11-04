// =====================================================
// API - GERENCIAR TÓPICOS (AULAS)
// POST /api/topics - Criar tópico
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
    const { module_id, title, content_before, video_url, content_after, duration, order_index } = req.body;
    
    if (!module_id || !title) {
      return res.status(400).json({ error: 'module_id e title são obrigatórios' });
    }
    
    // Verificar se o módulo existe
    const { data: module, error: moduleError } = await supabaseAdmin
      .from('modules')
      .select('id')
      .eq('id', module_id)
      .single();
    
    if (moduleError || !module) {
      return res.status(404).json({ error: 'Módulo não encontrado' });
    }
    
    // Sanitizar dados
    const cleanTitle = sanitizeText(title);
    const cleanContentBefore = content_before ? sanitizeHTML(content_before) : null;
    const cleanContentAfter = content_after ? sanitizeHTML(content_after) : null;
    
    // Validar e extrair video ID do YouTube (converter para formato embed)
    let cleanVideoUrl = null;
    if (video_url) {
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = video_url.match(youtubeRegex);
      if (match && match[1]) {
        cleanVideoUrl = `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    // Definir order_index
    let finalOrderIndex = order_index;
    
    if (!finalOrderIndex && finalOrderIndex !== 0) {
      const { data: lastTopic } = await supabaseAdmin
        .from('topics')
        .select('order_index')
        .eq('module_id', module_id)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();
      
      finalOrderIndex = lastTopic ? lastTopic.order_index + 1 : 0;
    }
    
    // Criar tópico
    const { data: topic, error } = await supabaseAdmin
      .from('topics')
      .insert({
        module_id,
        title: cleanTitle,
        content_before: cleanContentBefore,
        video_url: cleanVideoUrl,
        content_after: cleanContentAfter,
        duration: duration || null,
        order_index: finalOrderIndex
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return res.status(201).json({ topic });
    
  } catch (error) {
    console.error('Create topic error:', error);
    return res.status(500).json({ error: 'Erro ao criar tópico' });
  }
}
