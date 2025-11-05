-- =====================================================
-- SCRIPT: Corrigir Admin em Todas as Roles
-- =====================================================
-- Este script adiciona o admin manualmente em todas as roles existentes
-- e atualiza o trigger para usar o email correto

-- PASSO 1: Verificar qual usuário tem a role ADMIN
-- Execute esta query primeiro para descobrir o email do admin:
SELECT u.id, u.email, u.name 
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'ADMIN';

-- =====================================================
-- PASSO 2: Atualizar a função do trigger
-- Esta função adiciona TODOS os usuários com role ADMIN
-- automaticamente em qualquer nova role criada
-- =====================================================

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

-- =====================================================
-- PASSO 3: Adicionar TODOS os admins a TODAS as roles existentes
-- Este script busca automaticamente TODOS os usuários com role ADMIN
-- e adiciona cada um deles em TODAS as outras roles
-- =====================================================

DO $$
DECLARE
  admin_role_id UUID;
  admin_user RECORD;
  role_record RECORD;
  total_assignments INT := 0;
  admins_count INT := 0;
BEGIN
  -- Buscar ID da role ADMIN
  SELECT id INTO admin_role_id FROM roles WHERE name = 'ADMIN' LIMIT 1;
  
  IF admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Role ADMIN não encontrada no sistema';
  END IF;
  
  -- Contar quantos admins existem
  SELECT COUNT(*) INTO admins_count 
  FROM user_roles 
  WHERE role_id = admin_role_id;
  
  RAISE NOTICE 'Encontrados % usuário(s) com role ADMIN', admins_count;
  
  -- Para cada usuário que tem a role ADMIN
  FOR admin_user IN 
    SELECT ur.user_id, u.name, u.email
    FROM user_roles ur
    JOIN users u ON ur.user_id = u.id
    WHERE ur.role_id = admin_role_id
  LOOP
    RAISE NOTICE 'Processando admin: % (%)', admin_user.name, admin_user.email;
    
    -- Para cada role (exceto ADMIN), adicionar esse admin
    FOR role_record IN 
      SELECT id, name FROM roles WHERE name != 'ADMIN'
    LOOP
      -- Adicionar admin à role (ignora se já existe)
      INSERT INTO user_roles (user_id, role_id)
      VALUES (admin_user.user_id, role_record.id)
      ON CONFLICT (user_id, role_id) DO NOTHING;
      
      GET DIAGNOSTICS total_assignments = ROW_COUNT;
      
      IF total_assignments > 0 THEN
        RAISE NOTICE '  ✅ Adicionado à role: %', role_record.name;
      END IF;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Processo concluído!';
  RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- PASSO 4: Verificar o resultado
-- Execute esta query para confirmar que TODOS os admins estão em todas as roles
-- =====================================================

SELECT 
  r.name as role_name,
  r.display_name,
  (
    SELECT COUNT(DISTINCT ur.user_id)
    FROM user_roles ur
    WHERE ur.role_id = r.id
    AND ur.user_id IN (
      SELECT user_id FROM user_roles 
      WHERE role_id = (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1)
    )
  ) as admins_incluidos,
  (
    SELECT COUNT(*) FROM user_roles 
    WHERE role_id = (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1)
  ) as total_admins,
  CASE 
    WHEN (
      SELECT COUNT(DISTINCT ur.user_id)
      FROM user_roles ur
      WHERE ur.role_id = r.id
      AND ur.user_id IN (
        SELECT user_id FROM user_roles 
        WHERE role_id = (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1)
      )
    ) = (
      SELECT COUNT(*) FROM user_roles 
      WHERE role_id = (SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1)
    ) OR r.name = 'ADMIN'
    THEN '✅ Todos os admins incluídos'
    ELSE '❌ Faltam admins'
  END as status
FROM roles r
ORDER BY r.name;

-- =====================================================
-- Como usar:
-- 1. Execute PASSO 1 para descobrir quantos admins existem
-- 2. Execute PASSO 2 (atualizar função do trigger)
-- 3. Execute PASSO 3 (adicionar TODOS os admins em roles existentes)
-- 4. Execute PASSO 4 (verificar resultado)
-- 
-- IMPORTANTE: Este script funciona automaticamente para TODOS os usuários
-- que possuem a role ADMIN, sem precisar especificar emails manualmente
-- =====================================================
