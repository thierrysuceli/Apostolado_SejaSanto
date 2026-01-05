-- =====================================================
-- Migration 017: Adicionar mensagem de boas-vindas
-- =====================================================

-- Adicionar coluna welcome_message em central_registrations
ALTER TABLE central_registrations
ADD COLUMN welcome_message TEXT;

COMMENT ON COLUMN central_registrations.welcome_message IS 'Mensagem exibida após inscrição (modal automático ou botão Descrição)';
