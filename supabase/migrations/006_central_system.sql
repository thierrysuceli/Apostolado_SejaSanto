-- =====================================================
-- MIGRATION 006: SISTEMA DE CENTRAL (Discord-like)
-- Sistema de grupos por role com posts, notas, enquetes e inscrições
-- =====================================================

-- =====================================================
-- TABELA: central_groups (Grupos da Central - um por role)
-- =====================================================
CREATE TABLE IF NOT EXISTS central_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Emoji ou ícone do grupo
  color TEXT DEFAULT '#f59e0b',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(role_id)
);

CREATE INDEX idx_central_groups_role ON central_groups(role_id);
CREATE INDEX idx_central_groups_active ON central_groups(is_active);

-- =====================================================
-- TABELA: central_posts (Posts na Central)
-- =====================================================
CREATE TABLE IF NOT EXISTS central_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES central_groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'post' CHECK (type IN ('post', 'note', 'announcement', 'update')),
  
  -- Fixação
  is_pinned BOOLEAN DEFAULT false,
  pinned_until TIMESTAMPTZ, -- NULL = permanente
  pinned_at TIMESTAMPTZ,
  pinned_by UUID REFERENCES users(id),
  
  -- Metadados
  attachments JSONB DEFAULT '[]'::jsonb, -- Array de URLs de arquivos
  metadata JSONB DEFAULT '{}'::jsonb, -- Dados extras (ex: link para evento, curso, etc)
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_central_posts_group ON central_posts(group_id);
CREATE INDEX idx_central_posts_author ON central_posts(author_id);
CREATE INDEX idx_central_posts_pinned ON central_posts(is_pinned, pinned_until);
CREATE INDEX idx_central_posts_created ON central_posts(created_at DESC);

-- =====================================================
-- TABELA: central_polls (Enquetes na Central)
-- =====================================================
CREATE TABLE IF NOT EXISTS central_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES central_groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  description TEXT,
  options JSONB NOT NULL, -- Array de opções: [{id, text, votes: []}]
  
  -- Configurações
  allow_multiple BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  
  -- Fixação
  is_pinned BOOLEAN DEFAULT false,
  pinned_until TIMESTAMPTZ,
  pinned_at TIMESTAMPTZ,
  pinned_by UUID REFERENCES users(id),
  
  -- Período
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_central_polls_group ON central_polls(group_id);
CREATE INDEX idx_central_polls_author ON central_polls(author_id);
CREATE INDEX idx_central_polls_pinned ON central_polls(is_pinned, pinned_until);
CREATE INDEX idx_central_polls_active ON central_polls(starts_at, ends_at);

-- =====================================================
-- TABELA: central_poll_votes (Votos em Enquetes)
-- =====================================================
CREATE TABLE IF NOT EXISTS central_poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES central_polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  option_ids TEXT[] NOT NULL, -- Array de IDs das opções votadas
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(poll_id, user_id)
);

CREATE INDEX idx_central_poll_votes_poll ON central_poll_votes(poll_id);
CREATE INDEX idx_central_poll_votes_user ON central_poll_votes(user_id);

-- =====================================================
-- TABELA: central_registrations (Inscrições para ganhar role)
-- =====================================================
CREATE TABLE IF NOT EXISTS central_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES central_groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Informações
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  role_to_grant UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE, -- Role que será dada aos inscritos
  
  -- Configurações
  max_participants INTEGER, -- NULL = ilimitado
  approval_type TEXT DEFAULT 'automatic' CHECK (approval_type IN ('automatic', 'manual')),
  
  -- Período de inscrição
  registration_starts TIMESTAMPTZ DEFAULT NOW(),
  registration_ends TIMESTAMPTZ NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Fixação
  is_pinned BOOLEAN DEFAULT false,
  pinned_until TIMESTAMPTZ,
  pinned_at TIMESTAMPTZ,
  pinned_by UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_central_registrations_group ON central_registrations(group_id);
CREATE INDEX idx_central_registrations_author ON central_registrations(author_id);
CREATE INDEX idx_central_registrations_role ON central_registrations(role_to_grant);
CREATE INDEX idx_central_registrations_active ON central_registrations(is_active);
CREATE INDEX idx_central_registrations_period ON central_registrations(registration_starts, registration_ends);

-- =====================================================
-- TABELA: central_registration_participants (Participantes das Inscrições)
-- =====================================================
CREATE TABLE IF NOT EXISTS central_registration_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES central_registrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  
  -- Dados
  registration_data JSONB DEFAULT '{}'::jsonb, -- Dados extras do formulário
  
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(registration_id, user_id)
);

CREATE INDEX idx_central_reg_participants_registration ON central_registration_participants(registration_id);
CREATE INDEX idx_central_reg_participants_user ON central_registration_participants(user_id);
CREATE INDEX idx_central_reg_participants_status ON central_registration_participants(status);

-- =====================================================
-- TABELA: central_comments (Comentários em posts/enquetes)
-- =====================================================
CREATE TABLE IF NOT EXISTS central_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES central_posts(id) ON DELETE CASCADE,
  poll_id UUID REFERENCES central_polls(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES central_registrations(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (
    (post_id IS NOT NULL AND poll_id IS NULL AND registration_id IS NULL) OR
    (post_id IS NULL AND poll_id IS NOT NULL AND registration_id IS NULL) OR
    (post_id IS NULL AND poll_id IS NULL AND registration_id IS NOT NULL)
  )
);

CREATE INDEX idx_central_comments_post ON central_comments(post_id);
CREATE INDEX idx_central_comments_poll ON central_comments(poll_id);
CREATE INDEX idx_central_comments_registration ON central_comments(registration_id);
CREATE INDEX idx_central_comments_author ON central_comments(author_id);
CREATE INDEX idx_central_comments_created ON central_comments(created_at DESC);

-- =====================================================
-- TABELA: central_notifications (Notificações automáticas)
-- =====================================================
CREATE TABLE IF NOT EXISTS central_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES central_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_event', 'new_course', 'new_post', 'new_module', 'other')),
  link TEXT, -- URL para a página relevante
  icon TEXT, -- Ícone ou emoji
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Fixação
  is_pinned BOOLEAN DEFAULT false,
  pinned_until TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_central_notifications_group ON central_notifications(group_id);
CREATE INDEX idx_central_notifications_type ON central_notifications(type);
CREATE INDEX idx_central_notifications_pinned ON central_notifications(is_pinned, pinned_until);
CREATE INDEX idx_central_notifications_created ON central_notifications(created_at DESC);

-- =====================================================
-- FUNÇÃO: Criar grupo automaticamente ao criar role
-- =====================================================
CREATE OR REPLACE FUNCTION create_central_group_for_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO central_groups (role_id, name, description, color, icon)
  VALUES (
    NEW.id,
    NEW.display_name,
    COALESCE(NEW.description, 'Grupo da role ' || NEW.display_name),
    COALESCE(NEW.color, '#f59e0b'),
    '👥' -- Ícone padrão
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar grupo ao criar role
DROP TRIGGER IF EXISTS trigger_create_central_group ON roles;
CREATE TRIGGER trigger_create_central_group
AFTER INSERT ON roles
FOR EACH ROW
EXECUTE FUNCTION create_central_group_for_role();

-- =====================================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_central_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS trigger_central_groups_updated_at ON central_groups;
CREATE TRIGGER trigger_central_groups_updated_at
BEFORE UPDATE ON central_groups
FOR EACH ROW
EXECUTE FUNCTION update_central_updated_at();

DROP TRIGGER IF EXISTS trigger_central_posts_updated_at ON central_posts;
CREATE TRIGGER trigger_central_posts_updated_at
BEFORE UPDATE ON central_posts
FOR EACH ROW
EXECUTE FUNCTION update_central_updated_at();

DROP TRIGGER IF EXISTS trigger_central_polls_updated_at ON central_polls;
CREATE TRIGGER trigger_central_polls_updated_at
BEFORE UPDATE ON central_polls
FOR EACH ROW
EXECUTE FUNCTION update_central_updated_at();

DROP TRIGGER IF EXISTS trigger_central_registrations_updated_at ON central_registrations;
CREATE TRIGGER trigger_central_registrations_updated_at
BEFORE UPDATE ON central_registrations
FOR EACH ROW
EXECUTE FUNCTION update_central_updated_at();

-- =====================================================
-- POPULAR: Criar grupos para roles existentes
-- =====================================================
INSERT INTO central_groups (role_id, name, description, color, icon)
SELECT 
  r.id,
  r.display_name,
  COALESCE(r.description, 'Grupo da role ' || r.display_name),
  COALESCE(r.color, '#f59e0b'),
  CASE 
    WHEN r.name = 'ADMIN' THEN '👑'
    WHEN r.name = 'INSCRITO' THEN '📚'
    WHEN r.name = 'VISITANTE' THEN '👤'
    ELSE '👥'
  END
FROM roles r
WHERE NOT EXISTS (
  SELECT 1 FROM central_groups cg WHERE cg.role_id = r.id
);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================
COMMENT ON TABLE central_groups IS 'Grupos da Central - um para cada role';
COMMENT ON TABLE central_posts IS 'Posts, notas e anúncios na Central';
COMMENT ON TABLE central_polls IS 'Enquetes criadas na Central';
COMMENT ON TABLE central_poll_votes IS 'Votos dos usuários em enquetes';
COMMENT ON TABLE central_registrations IS 'Inscrições para ganhar roles automaticamente';
COMMENT ON TABLE central_registration_participants IS 'Usuários inscritos em inscrições';
COMMENT ON TABLE central_comments IS 'Comentários em posts, enquetes e inscrições';
COMMENT ON TABLE central_notifications IS 'Notificações automáticas de eventos, cursos, etc';
