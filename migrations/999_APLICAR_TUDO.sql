-- =====================================================
-- MIGRATION COMPLETA - RESOLVER TODOS OS PROBLEMAS
-- Execute este arquivo INTEIRO no Supabase SQL Editor
-- =====================================================

-- PARTE 1: REMOVER CONSTRAINT ANTIGA
-- Precisamos remover ANTES de limpar as URLs
-- =====================================================

ALTER TABLE topics
DROP CONSTRAINT IF EXISTS video_url_youtube;

-- PARTE 2: LIMPAR URLs EXISTENTES
-- Remove HTML e converte para formato embed
-- IMPORTANTE: Fazemos isso SEM constraint ativa!
-- =====================================================

-- Remover HTML tags
UPDATE topics
SET video_url = REGEXP_REPLACE(video_url, '<[^>]*>', '', 'g')
WHERE video_url LIKE '%<%';

-- Remover HTML entities
UPDATE topics
SET video_url = REGEXP_REPLACE(video_url, '&[a-z]+;', '', 'gi')
WHERE video_url LIKE '%&%' AND video_url NOT LIKE '%youtube.com/watch?v=%';

-- Trim whitespace
UPDATE topics
SET video_url = TRIM(video_url)
WHERE video_url != TRIM(video_url);

-- Converter watch?v= para embed
UPDATE topics
SET video_url = REPLACE(
  video_url,
  'youtube.com/watch?v=',
  'youtube.com/embed/'
)
WHERE video_url LIKE '%youtube.com/watch?v=%'
AND video_url NOT LIKE '%youtube.com/embed/%';

-- Converter youtu.be/ para embed
UPDATE topics
SET video_url = REPLACE(
  video_url,
  'youtu.be/',
  'youtube.com/embed/'
)
WHERE video_url LIKE '%youtu.be/%'
AND video_url NOT LIKE '%youtube.com/embed/%';

-- Remover query parameters
UPDATE topics
SET video_url = SUBSTRING(video_url FROM 1 FOR POSITION('&' IN video_url) - 1)
WHERE video_url LIKE '%youtube.com/embed/%&%';

-- Garantir HTTPS
UPDATE topics
SET video_url = REPLACE(video_url, 'http://', 'https://')
WHERE video_url LIKE 'http://%youtube%';

-- Limpar vazias
UPDATE topics
SET video_url = NULL
WHERE video_url = '' OR LENGTH(TRIM(video_url)) = 0;

-- PARTE 3: ADICIONAR CONSTRAINT NOVA
-- Agora que as URLs estão limpas, podemos adicionar a constraint
-- =====================================================

ALTER TABLE topics
ADD CONSTRAINT video_url_youtube CHECK (
  video_url IS NULL OR
  video_url = '' OR
  video_url ~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$'
);

-- PARTE 4: POLÍTICAS RLS DO STORAGE
-- Permite uploads e leitura de imagens
-- =====================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Criar novas políticas
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'apostolado-assets');

CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'apostolado-assets');

CREATE POLICY "Authenticated users can update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'apostolado-assets')
WITH CHECK (bucket_id = 'apostolado-assets');

CREATE POLICY "Authenticated users can delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'apostolado-assets');

-- PARTE 5: VERIFICAÇÃO E RELATÓRIO
-- Mostra o resultado das correções
-- =====================================================

-- Verificar constraint
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'video_url_youtube';

-- Verificar URLs corrigidas
SELECT 
  id,
  title,
  video_url,
  CASE 
    WHEN video_url IS NULL OR video_url = '' THEN '➖ Empty'
    WHEN video_url ~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$' THEN '✅ Valid'
    ELSE '❌ Invalid'
  END as status
FROM topics
ORDER BY status DESC;

-- Verificar políticas RLS
SELECT 
  policyname,
  cmd,
  roles::text
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%apostolado%';

-- Mensagem final
DO $$
DECLARE
  valid_count INTEGER;
  invalid_count INTEGER;
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO valid_count 
  FROM topics 
  WHERE video_url ~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$';
  
  SELECT COUNT(*) INTO invalid_count 
  FROM topics 
  WHERE video_url IS NOT NULL 
    AND video_url != '' 
    AND video_url !~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$';
  
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname LIKE '%apostolado%';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MIGRATION COMPLETA!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Constraint atualizada: ✅';
  RAISE NOTICE 'URLs válidas: % tópicos', valid_count;
  RAISE NOTICE 'URLs inválidas: % tópicos', invalid_count;
  RAISE NOTICE 'Políticas RLS: % criadas', policy_count;
  RAISE NOTICE '========================================';
  
  IF invalid_count > 0 THEN
    RAISE NOTICE '⚠️ ATENÇÃO: Alguns tópicos ainda têm URLs inválidas.';
    RAISE NOTICE 'Verifique a tabela acima e corrija manualmente.';
  END IF;
  
  IF policy_count < 4 THEN
    RAISE NOTICE '⚠️ ATENÇÃO: Políticas RLS incompletas.';
    RAISE NOTICE 'Verifique se o bucket "apostolado-assets" existe.';
  END IF;
END $$;
