-- =====================================================
-- STORAGE FIX - FORÇA CRIAÇÃO DO BUCKET E RLS
-- COPIE E COLE TUDO NO SUPABASE SQL EDITOR
-- =====================================================

-- DELETAR tudo relacionado ao storage e recriar do zero
DO $$
BEGIN
  -- Deletar políticas antigas se existirem
  DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  DROP POLICY IF EXISTS "Upload Access" ON storage.objects;
  DROP POLICY IF EXISTS "Update Access" ON storage.objects;
  DROP POLICY IF EXISTS "Delete Access" ON storage.objects;
  
  RAISE NOTICE 'Políticas antigas removidas';
END $$;

-- Criar/Atualizar bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('apostolado-assets', 'apostolado-assets', true, 52428800, NULL)
ON CONFLICT (id) 
DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = NULL;

-- Criar política de UPLOAD (INSERT) - Usuários autenticados
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'apostolado-assets');

-- Criar política de UPLOAD (INSERT) - PÚBLICO (sem autenticação)
CREATE POLICY "Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'apostolado-assets');

-- Criar política de UPDATE - PÚBLICO
CREATE POLICY "Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'apostolado-assets')
WITH CHECK (bucket_id = 'apostolado-assets');

-- Criar política de DELETE - PÚBLICO
CREATE POLICY "Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'apostolado-assets');

-- Verificação final
DO $$
DECLARE
  bucket_count INTEGER;
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO bucket_count FROM storage.buckets WHERE id = 'apostolado-assets';
  SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ STORAGE CONFIGURADO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Bucket criado: % (deve ser 1)', bucket_count;
  RAISE NOTICE 'Políticas RLS: % (deve ser 4)', policy_count;
  
  IF bucket_count = 1 AND policy_count >= 4 THEN
    RAISE NOTICE '🎉 TUDO PRONTO! Teste agora o upload.';
  ELSE
    RAISE NOTICE '⚠️ Algo falhou. Verifique o bucket existe manualmente.';
  END IF;
END $$;
