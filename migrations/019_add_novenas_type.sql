-- =====================================================
-- Migration 019: Adicionar tipo 'novenas' ao sistema de conteúdo
-- =====================================================

-- Novenas usam a mesma tabela 'content' que artigos e notícias
-- Apenas adiciona o tipo 'novenas' como válido

-- Verificar se já existe algum content do tipo 'novenas'
-- (esta migration é idempotente)

COMMENT ON COLUMN content.type IS 'Tipo de conteúdo: articles, news ou novenas';

-- Criar índice para melhorar performance de queries por tipo
CREATE INDEX IF NOT EXISTS idx_content_type_published 
ON content(type, published_at DESC) 
WHERE published_at IS NOT NULL;

-- Adicionar permissões RLS para novenas (mesmo schema que articles)
-- (RLS policies já existentes cobrem 'novenas' automaticamente)
