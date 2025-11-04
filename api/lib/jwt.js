// =====================================================
// JWT UTILITIES
// Geração e verificação de tokens JWT
// =====================================================

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '7d'; // 7 dias

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurado');
}

/**
 * Gerar token JWT
 * @param {string} userId - ID do usuário
 * @param {object} payload - Dados adicionais
 * @returns {string} Token JWT
 */
export function generateJWT(userId, payload = {}) {
  return jwt.sign(
    { 
      userId,
      ...payload,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
}

/**
 * Verificar e decodificar token JWT
 * @param {string} token - Token JWT
 * @returns {object|null} Payload decodificado ou null se inválido
 */
export function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

/**
 * Extrair token do header Authorization
 * @param {object} req - Request object
 * @returns {string|null} Token ou null
 */
export function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}
