-- =====================================================
-- TRIGGER: Adicionar Admin automaticamente em novas roles
-- =====================================================
-- Este trigger garante que o usuário admin sempre tenha
-- acesso a todas as roles criadas no sistema

-- Função que adiciona TODOS os admins à nova role
CREATE OR REPLACE FUNCTION auto_add_admin_to_new_role()
RETURNS TRIGGER AS $$
DECLARE
  admin_role_id UUID;
  admin_user RECORD;
  admins_added INT := 0;
BEGIN
  -- Se a role criada for a própria ADMIN, não faz nada
  IF NEW.name = 'ADMIN' THEN
    RETURN NEW;
  END IF;

  -- Buscar o ID da role ADMIN
  SELECT id INTO admin_role_id FROM roles WHERE name = 'ADMIN' LIMIT 1;
  
  -- Se não encontrou a role ADMIN, retorna
  IF admin_role_id IS NULL THEN
    RAISE WARNING 'Role ADMIN não encontrada no sistema';
    RETURN NEW;
  END IF;
  
  -- Para CADA usuário que possui a role ADMIN
  FOR admin_user IN 
    SELECT user_id FROM user_roles WHERE role_id = admin_role_id
  LOOP
    -- Adicionar esse admin à nova role criada
    INSERT INTO user_roles (user_id, role_id)
    VALUES (admin_user.user_id, NEW.id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    admins_added := admins_added + 1;
  END LOOP;
  
  RAISE NOTICE '✅ % admin(s) adicionado(s) automaticamente à role: %', admins_added, NEW.name;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar o trigger
DROP TRIGGER IF EXISTS trigger_auto_add_admin_to_role ON roles;
CREATE TRIGGER trigger_auto_add_admin_to_role
  AFTER INSERT ON roles
  FOR EACH ROW
  EXECUTE FUNCTION auto_add_admin_to_new_role();

-- =====================================================
-- Como usar:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Toda nova role criada automaticamente incluirá TODOS os usuários
--    que possuem a role ADMIN
-- 3. Se você adicionar novos admins no futuro, eles também serão
--    incluídos automaticamente em novas roles criadas após isso
-- =====================================================
