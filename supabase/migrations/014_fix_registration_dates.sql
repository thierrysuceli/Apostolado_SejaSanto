-- =====================================================
-- FIX DATAS DE INSCRIÇÕES ENCERRADAS
-- Atualiza inscrições sem data de término ou com data passada
-- =====================================================

-- Atualizar inscrições sem registration_ends ou com data passada
UPDATE central_registrations
SET 
  registration_ends = NOW() + INTERVAL '30 days',
  registration_starts = COALESCE(registration_starts, NOW())
WHERE 
  registration_ends IS NULL 
  OR registration_ends < NOW();

-- Adicionar constraint para garantir que ends > starts
ALTER TABLE central_registrations
DROP CONSTRAINT IF EXISTS registration_dates_valid;

ALTER TABLE central_registrations
ADD CONSTRAINT registration_dates_valid 
CHECK (registration_ends > registration_starts);

-- Atualizar migration para adicionar default de 30 dias
ALTER TABLE central_registrations
ALTER COLUMN registration_ends SET DEFAULT (NOW() + INTERVAL '30 days');
