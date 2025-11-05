-- =====================================================
-- MIGRATION: Adicionar categorias e melhorias em eventos
-- =====================================================

-- Criar tabela de categorias de eventos
CREATE TABLE event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6b7280', -- Cor hex para exibição
  icon TEXT, -- Nome do ícone (opcional)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_categories_name ON event_categories(name);

CREATE TRIGGER update_event_categories_updated_at
  BEFORE UPDATE ON event_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar tabela de relacionamento entre eventos e categorias (muitos-para-muitos)
CREATE TABLE event_category_tags (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  category_id UUID REFERENCES event_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, category_id)
);

CREATE INDEX idx_event_category_tags_event ON event_category_tags(event_id);
CREATE INDEX idx_event_category_tags_category ON event_category_tags(category_id);

-- Adicionar campos extras em events para FullCalendar
ALTER TABLE events
ADD COLUMN color TEXT, -- Cor customizada do evento
ADD COLUMN all_day BOOLEAN DEFAULT false, -- Evento de dia inteiro
ADD COLUMN recurrence_rule TEXT; -- Regra de recorrência (RRULE format)

-- Inserir categorias padrão
INSERT INTO event_categories (name, description, color, icon) VALUES
('Formação', 'Aulas e cursos de formação católica', '#f59e0b', 'book'),
('Missa', 'Celebrações eucarísticas', '#8b5cf6', 'church'),
('Retiro', 'Retiros espirituais e encontros', '#10b981', 'mountain'),
('Reunião', 'Reuniões administrativas e de equipe', '#3b82f6', 'users'),
('Evento Social', 'Eventos sociais e confraternizações', '#ec4899', 'heart'),
('Adoração', 'Adoração ao Santíssimo Sacramento', '#fbbf24', 'candle'),
('Terço', 'Orações do Santo Rosário', '#6366f1', 'rosary'),
('Outro', 'Outros tipos de eventos', '#6b7280', 'calendar');

COMMENT ON TABLE event_categories IS 'Categorias para classificar eventos (formação, missa, retiro, etc)';
COMMENT ON TABLE event_category_tags IS 'Relacionamento N:N entre eventos e categorias';
COMMENT ON COLUMN events.color IS 'Cor customizada para exibição no calendário (sobrescreve cor da categoria)';
COMMENT ON COLUMN events.all_day IS 'Indica se o evento é de dia inteiro (sem horário específico)';
COMMENT ON COLUMN events.recurrence_rule IS 'Regra de recorrência no formato RRULE (RFC 5545) para eventos repetidos';
