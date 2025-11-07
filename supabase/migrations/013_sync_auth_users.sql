-- =====================================================
-- SINCRONIZAR auth.users COM users
-- Garante que todo usuário autenticado tenha registro na tabela users
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
