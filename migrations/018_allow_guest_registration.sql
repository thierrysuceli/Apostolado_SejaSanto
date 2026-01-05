-- =====================================================
-- Migration 018: Permitir inscrições de convidados
-- =====================================================

-- Adicionar flag para permitir inscrições sem login
ALTER TABLE central_registrations
ADD COLUMN IF NOT EXISTS allow_guest_registration BOOLEAN DEFAULT FALSE;

-- Adicionar campo para nome do convidado nas participações
ALTER TABLE central_registration_participants
ADD COLUMN IF NOT EXISTS guest_name TEXT;

-- Permitir user_id ser 'guest' para visitantes (ao invés de NULL)
-- Não precisa alterar constraint, apenas usar 'guest' como valor padrão no código

COMMENT ON COLUMN central_registrations.allow_guest_registration IS 'Permite inscrições de pessoas não logadas';
COMMENT ON COLUMN central_registration_participants.guest_name IS 'Nome do convidado (quando user_id é "guest")';
