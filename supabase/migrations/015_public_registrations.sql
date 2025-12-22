-- Migration: Suporte para inscrições públicas (sem grupo)
-- Data: 2025-12-22
-- Descrição: Permite inscrições independentes do sistema de grupos do Central

-- 1. Tornar group_id opcional para permitir inscrições públicas
ALTER TABLE central_registrations 
ALTER COLUMN group_id DROP NOT NULL;

-- 2. Adicionar campo de imagem de capa
ALTER TABLE central_registrations
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- 3. Adicionar slug para URLs amigáveis
ALTER TABLE central_registrations
ADD COLUMN IF NOT EXISTS slug TEXT;

-- 4. Criar índice para slug
CREATE INDEX IF NOT EXISTS idx_central_registrations_slug ON central_registrations(slug);

-- 5. Atualizar constraint de check para permitir group_id NULL
-- Inscrições podem ser públicas (group_id NULL) ou vinculadas a grupo
-- Se group_id for NULL, a inscrição aparece na aba pública de Inscrições
-- Se group_id for preenchido, aparece dentro do grupo no Central

COMMENT ON COLUMN central_registrations.group_id IS 'NULL = Inscrição pública (aparece na aba Inscrições), UUID = Inscrição do grupo (aparece no Central)';
COMMENT ON COLUMN central_registrations.cover_image_url IS 'Imagem de capa opcional para a inscrição';
COMMENT ON COLUMN central_registrations.slug IS 'Slug para URL amigável (gerado automaticamente a partir do título)';

-- 6. Adicionar RLS policies para inscrições públicas
-- Permitir leitura pública de inscrições sem grupo
CREATE POLICY "Inscrições públicas são visíveis para todos"
ON central_registrations FOR SELECT
USING (group_id IS NULL OR is_active = true);

-- Permitir admins criar inscrições públicas
CREATE POLICY "Admins podem criar inscrições públicas"
ON central_registrations FOR INSERT
WITH CHECK (
  group_id IS NULL AND
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Permitir admins editar inscrições públicas
CREATE POLICY "Admins podem editar inscrições públicas"
ON central_registrations FOR UPDATE
USING (
  group_id IS NULL AND
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Permitir admins deletar inscrições públicas
CREATE POLICY "Admins podem deletar inscrições públicas"
ON central_registrations FOR DELETE
USING (
  group_id IS NULL AND
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);
