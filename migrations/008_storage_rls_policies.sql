-- Supabase Storage: RLS Policies for apostolado-assets bucket
-- Execute este script no Supabase SQL Editor após criar o bucket

-- IMPORTANTE: Primeiro crie o bucket no Dashboard
-- 1. Vá em Storage no Supabase Dashboard
-- 2. Clique em "New bucket"
-- 3. Nome: apostolado-assets
-- 4. Public bucket: SIM (marque a opção "Public bucket")
-- 5. Clique em "Create bucket"

-- Depois execute este SQL:

-- 1. Permitir upload para usuários autenticados (drop if exists first)
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'apostolado-assets');

-- 2. Permitir leitura pública (necessário para exibir imagens)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'apostolado-assets');

-- 3. Permitir atualização para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'apostolado-assets')
WITH CHECK (bucket_id = 'apostolado-assets');

-- 4. Permitir exclusão para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'apostolado-assets');

-- Verificar políticas criadas:
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%apostolado%';

-- Teste de verificação:
-- Após aplicar, teste fazendo upload de uma imagem no admin
-- A URL deve ser algo como:
-- https://[seu-projeto].supabase.co/storage/v1/object/public/apostolado-assets/[nome-do-arquivo]
