-- =====================================================
-- MIGRATION 016: Sistema de Perguntas para Inscrições
-- =====================================================

-- TABELA: central_registration_questions
-- Perguntas do formulário de cada inscrição
CREATE TABLE IF NOT EXISTS central_registration_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES central_registrations(id) ON DELETE CASCADE,
  
  -- Pergunta
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('text', 'single_choice', 'multiple_choice')),
  
  -- Opções (apenas para single_choice e multiple_choice)
  options JSONB DEFAULT '[]'::jsonb, -- Array de strings: ["Opção 1", "Opção 2"]
  
  -- Ordem de exibição
  order_index INTEGER DEFAULT 0,
  
  -- Obrigatória?
  required BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_reg_questions_registration ON central_registration_questions(registration_id);
CREATE INDEX idx_reg_questions_order ON central_registration_questions(registration_id, order_index);

-- =====================================================
-- Atualizar tabela de participantes para incluir respostas
-- =====================================================

-- Adicionar coluna form_responses se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'central_registration_participants' 
    AND column_name = 'form_responses'
  ) THEN
    ALTER TABLE central_registration_participants
    ADD COLUMN form_responses JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- form_responses será um objeto JSON:
-- {
--   "question_id_1": "resposta texto" ou ["opção1", "opção2"],
--   "question_id_2": "outra resposta"
-- }

COMMENT ON COLUMN central_registration_participants.form_responses IS 'Respostas do formulário de inscrição (chave: question_id, valor: resposta)';

-- =====================================================
-- RLS Policies
-- =====================================================

-- Perguntas: público pode ler, apenas admin pode criar/editar/deletar
ALTER TABLE central_registration_questions ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ler as perguntas (necessário para exibir o formulário)
CREATE POLICY "Anyone can read registration questions"
  ON central_registration_questions
  FOR SELECT
  USING (true);

-- Apenas admin pode criar/editar/deletar
CREATE POLICY "Only admins can manage registration questions"
  ON central_registration_questions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- =====================================================
-- Comentários
-- =====================================================

COMMENT ON TABLE central_registration_questions IS 'Perguntas do formulário de cada inscrição';
COMMENT ON COLUMN central_registration_questions.question_type IS 'Tipo: text (texto livre), single_choice (apenas 1), multiple_choice (várias)';
COMMENT ON COLUMN central_registration_questions.options IS 'Array de opções para single_choice e multiple_choice';
COMMENT ON COLUMN central_registration_questions.order_index IS 'Ordem de exibição das perguntas';
