-- =====================================================
-- CRIAR BUCKET E POLÍTICAS RLS - APENAS STORAGE
-- Execute DEPOIS da migration 999 se upload ainda falhar
-- =====================================================

-- PARTE 1: CRIAR BUCKET (se não existir)
-- Execute no Supabase Dashboard → Storage → Create Bucket
-- Nome: apostolado-assets
-- Public: YES (marcar checkbox)
-- =====================================================

-- OU execute este INSERT (pode dar erro se já existir, ignore):
INSERT INTO storage.buckets (id, name, public)
VALUES ('apostolado-assets', 'apostolado-assets', true)
ON CONFLICT (id) DO NOTHING;

-- PARTE 2: REMOVER POLÍTICAS ANTIGAS
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- PARTE 3: CRIAR POLÍTICAS RLS
-- =====================================================

-- Política 1: Qualquer usuário autenticado pode fazer UPLOAD
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'apostolado-assets');

-- Política 2: QUALQUER PESSOA pode VER (leitura pública)
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'apostolado-assets');

-- Política 3: Usuários autenticados podem ATUALIZAR
CREATE POLICY "Authenticated users can update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'apostolado-assets')
WITH CHECK (bucket_id = 'apostolado-assets');

-- Política 4: Usuários autenticados podem DELETAR
CREATE POLICY "Authenticated users can delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'apostolado-assets');

-- PARTE 4: VERIFICAÇÃO
-- =====================================================

-- Ver bucket
SELECT id, name, public FROM storage.buckets WHERE name = 'apostolado-assets';

-- Ver políticas
SELECT 
  policyname,
  cmd,
  roles::text,
  CASE 
    WHEN qual IS NOT NULL THEN 'WITH CHECK/USING definido'
    ELSE 'Sem restrições'
  END as restrictions
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%upload%' OR policyname LIKE '%read%' OR policyname LIKE '%update%' OR policyname LIKE '%delete%'
ORDER BY policyname;

-- Mensagem final
DO $$
DECLARE
  bucket_exists BOOLEAN;
  policy_count INTEGER;
BEGIN
  SELECT EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'apostolado-assets') INTO bucket_exists;
  
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND (
    policyname = 'Authenticated users can upload' OR
    policyname = 'Public read access' OR
    policyname = 'Authenticated users can update' OR
    policyname = 'Authenticated users can delete'
  );
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ STORAGE CONFIGURADO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Bucket existe: %', CASE WHEN bucket_exists THEN '✅ SIM' ELSE '❌ NÃO' END;
  RAISE NOTICE 'Políticas RLS: % de 4', policy_count;
  RAISE NOTICE '========================================';
  
  IF NOT bucket_exists THEN
    RAISE NOTICE '⚠️ ATENÇÃO: Bucket não encontrado!';
    RAISE NOTICE 'Vá em Supabase Dashboard → Storage → Create Bucket';
    RAISE NOTICE 'Nome: apostolado-assets';
    RAISE NOTICE 'Public: ✅ YES';
  END IF;
  
  IF policy_count < 4 THEN
    RAISE NOTICE '⚠️ ATENÇÃO: Políticas incompletas (%/4)', policy_count;
    RAISE NOTICE 'Verifique se o bucket existe antes de criar as políticas.';
  END IF;
  
  IF bucket_exists AND policy_count = 4 THEN
    RAISE NOTICE '🎉 TUDO PRONTO! Pode testar o upload de imagens.';
  END IF;
END $$;
