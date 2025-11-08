-- =====================================================
-- APLICAR TODAS AS MIGRATIONS DE UMA VEZ
-- Copie e cole no SQL Editor do Supabase Dashboard
-- =====================================================

-- MIGRATION 013: Sincronizar auth.users com users
-- =====================================================

-- Função para sincronizar usuário do auth para a tabela users
CREATE OR REPLACE FUNCTION sync_auth_user_to_users()
RETURNS TRIGGER AS $$
DECLARE
  default_role_id UUID;
BEGIN
  -- Buscar role VISITANTE (padrão para novos usuários)
  SELECT id INTO default_role_id FROM roles WHERE name = 'VISITANTE' LIMIT 1;
  
  -- Inserir na tabela users se não existir
  INSERT INTO users (id, email, name, avatar_url, created_at, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url);
  
  -- Atribuir role padrão se não tiver nenhuma
  IF default_role_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role_id)
    VALUES (NEW.id, default_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que executa após inserção em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_auth_user_to_users();

-- Sincronizar usuários existentes que não estão na tabela users
INSERT INTO users (id, email, name, avatar_url, created_at, is_active)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  au.raw_user_meta_data->>'avatar_url',
  au.created_at,
  TRUE
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Atribuir role VISITANTE para usuários sem role
DO $$
DECLARE
  default_role_id UUID;
BEGIN
  SELECT id INTO default_role_id FROM roles WHERE name = 'VISITANTE' LIMIT 1;
  
  IF default_role_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role_id)
    SELECT u.id, default_role_id
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    WHERE ur.user_id IS NULL
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- MIGRATION 014: Fix datas de inscrições
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

-- =====================================================
-- PRONTO! Todas as migrations aplicadas
-- =====================================================
