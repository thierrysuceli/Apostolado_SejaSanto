// =====================================================
// SANITIZAÇÃO E VALIDAÇÃO
// Funções para limpar e validar inputs
// =====================================================

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizar HTML (para conteúdo do Quill)
 * @param {string} html - HTML a ser sanitizado
 * @returns {string} HTML limpo
 */
export function sanitizeHTML(html) {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'strike', 'del',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre',
      'ul', 'ol', 'li',
      'a', 'img',
      'span', 'div'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height',
      'class', 'style', 'target', 'rel'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitizar texto simples (comentários)
 * @param {string} text - Texto a ser sanitizado
 * @returns {string} Texto limpo
 */
export function sanitizeText(text) {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizar email
 * @param {string} email - Email a ser sanitizado
 * @returns {string} Email limpo
 */
export function sanitizeEmail(email) {
  if (!email) return '';
  return email.toLowerCase().trim();
}

/**
 * Sanitizar nome
 * @param {string} name - Nome a ser sanitizado
 * @returns {string} Nome limpo
 */
export function sanitizeName(name) {
  if (!name) return '';
  return name.trim().replace(/[<>]/g, '');
}

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} Válido ou não
 */
export function isValidEmail(email) {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return regex.test(email);
}

/**
 * Validar URL do YouTube
 * @param {string} url - URL a validar
 * @returns {boolean} Válido ou não
 */
export function isValidYouTubeUrl(url) {
  if (!url) return true; // Vídeo é opcional
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return regex.test(url);
}

/**
 * Extrair ID do vídeo do YouTube
 * @param {string} url - URL do YouTube
 * @returns {string|null} ID do vídeo ou null
 */
export function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * Validar senha forte
 * @param {string} password - Senha a validar
 * @returns {object} { valid: boolean, message: string }
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: 'Senha é obrigatória' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Senha deve ter no mínimo 8 caracteres' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Senha deve conter ao menos uma letra maiúscula' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Senha deve conter ao menos uma letra minúscula' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Senha deve conter ao menos um número' };
  }
  
  return { valid: true, message: 'Senha válida' };
}

/**
 * Gerar slug a partir de título
 * @param {string} title - Título
 * @returns {string} Slug
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}
