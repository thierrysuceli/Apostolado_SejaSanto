-- =====================================================
-- MIGRATION: Corrigir schema de events
-- =====================================================

-- Adicionar campos faltantes em events (se não existirem)
DO $$ 
BEGIN
  -- Adicionar slug se não existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'slug'
  ) THEN
    ALTER TABLE events ADD COLUMN slug TEXT;
    CREATE UNIQUE INDEX idx_events_slug ON events(slug);
  END IF;

  -- Adicionar status se não existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'status'
  ) THEN
    ALTER TABLE events ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
    CREATE INDEX idx_events_status ON events(status);
  END IF;
END $$;

COMMENT ON COLUMN events.slug IS 'URL amigável gerada a partir do título';
COMMENT ON COLUMN events.status IS 'Status do evento: draft, published ou archived';
