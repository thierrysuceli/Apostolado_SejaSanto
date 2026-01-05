-- =====================================================
-- Migration 018 FIX: Permitir user_id NULL para guests
-- =====================================================

-- Remover NOT NULL constraint de user_id
ALTER TABLE central_registration_participants
ALTER COLUMN user_id DROP NOT NULL;

-- Adicionar índice para melhorar performance em queries com user_id
CREATE INDEX IF NOT EXISTS idx_participants_user_id 
ON central_registration_participants(user_id) 
WHERE user_id IS NOT NULL;

COMMENT ON COLUMN central_registration_participants.user_id IS 'ID do usuário (NULL para visitantes sem cadastro)';
