-- Migration: Add article_id to comments table
-- Date: 2025-12-17
-- Description: Adiciona suporte para comentários em artigos

-- Adicionar coluna article_id
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS article_id UUID REFERENCES articles(id) ON DELETE CASCADE;

-- Atualizar constraint para incluir article_id
ALTER TABLE comments 
DROP CONSTRAINT IF EXISTS only_one_reference;

ALTER TABLE comments
ADD CONSTRAINT only_one_reference CHECK (
  (
    (post_id IS NOT NULL)::int +
    (topic_id IS NOT NULL)::int +
    (event_id IS NOT NULL)::int +
    (article_id IS NOT NULL)::int
  ) = 1
);

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);

-- RLS Policies para comments em artigos
-- Permitir leitura pública
CREATE POLICY "Comments em artigos são visíveis publicamente"
ON comments FOR SELECT
USING (article_id IS NOT NULL);

-- Permitir criação autenticada
CREATE POLICY "Usuários autenticados podem comentar em artigos"
ON comments FOR INSERT
WITH CHECK (
  article_id IS NOT NULL 
  AND auth.uid() = author_id
);

-- Permitir autor editar próprio comentário
CREATE POLICY "Autor pode editar próprio comentário em artigo"
ON comments FOR UPDATE
USING (
  article_id IS NOT NULL 
  AND auth.uid() = author_id
);

-- Permitir autor ou admin deletar
CREATE POLICY "Autor ou admin pode deletar comentário em artigo"
ON comments FOR DELETE
USING (
  article_id IS NOT NULL 
  AND (
    auth.uid() = author_id 
    OR EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  )
);
