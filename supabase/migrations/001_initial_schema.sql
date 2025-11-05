-- =====================================================
-- APOSTOLADO - SCHEMA INICIAL
-- Migrations para Supabase PostgreSQL
-- Data: 02/11/2025
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA: users (Usuários)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Indexes para performance
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- =====================================================
-- TABELA: roles (Roles/Tags de Usuário)
-- =====================================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- VISITANTE, INSCRITO, ADMIN, etc.
  display_name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6b7280', -- Cor hexadecimal para UI
  is_system BOOLEAN DEFAULT FALSE, -- Se é role padrão (não deletável)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT name_uppercase CHECK (name = UPPER(name))
);

CREATE INDEX idx_roles_name ON roles(name);

-- =====================================================
-- TABELA: permissions (Permissões do Sistema)
-- =====================================================
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- VIEW_POSTS, CREATE_COMMENT, etc.
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- CONTENT, INTERACTION, CREATION, ADMIN
  
  CONSTRAINT code_uppercase CHECK (code = UPPER(code)),
  CONSTRAINT category_valid CHECK (category IN ('CONTENT', 'INTERACTION', 'CREATION', 'ADMIN'))
);

CREATE INDEX idx_permissions_code ON permissions(code);
CREATE INDEX idx_permissions_category ON permissions(category);

-- =====================================================
-- TABELA: role_permissions (Permissões por Role)
-- =====================================================
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- =====================================================
-- TABELA: user_roles (Role Atribuída ao Usuário)
-- =====================================================
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- =====================================================
-- TABELA: posts (Posts do Blog)
-- =====================================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- HTML do Quill Editor
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT status_valid CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABELA: post_tags (Visibilidade de Posts)
-- =====================================================
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (post_id, role_id)
);

CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_role ON post_tags(role_id);

-- =====================================================
-- TABELA: courses (Cursos)
-- =====================================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT status_valid CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_status ON courses(status);

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABELA: course_tags (Visibilidade de Cursos)
-- =====================================================
CREATE TABLE course_tags (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (course_id, role_id)
);

CREATE INDEX idx_course_tags_course ON course_tags(course_id);
CREATE INDEX idx_course_tags_role ON course_tags(role_id);

-- =====================================================
-- TABELA: modules (Módulos de Curso)
-- =====================================================
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(course_id, order_index)
);

CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

-- =====================================================
-- TABELA: topics (Tópicos/Aulas)
-- =====================================================
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  content_before TEXT, -- HTML antes do vídeo
  video_url TEXT, -- URL do YouTube
  content_after TEXT, -- HTML depois do vídeo
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(module_id, order_index),
  CONSTRAINT video_url_youtube CHECK (
    video_url IS NULL OR 
    video_url ~* '^(https?://)?(www\.)?(youtube\.com/watch\?v=|youtu\.be/)[a-zA-Z0-9_-]{11}'
  )
);

CREATE INDEX idx_topics_module ON topics(module_id);
CREATE INDEX idx_topics_order ON topics(module_id, order_index);

CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABELA: events (Eventos do Calendário)
-- =====================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  meeting_link TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT end_after_start CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_created_by ON events(created_by);

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABELA: event_tags (Visibilidade de Eventos)
-- =====================================================
CREATE TABLE event_tags (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (event_id, role_id)
);

CREATE INDEX idx_event_tags_event ON event_tags(event_id);
CREATE INDEX idx_event_tags_role ON event_tags(role_id);

-- =====================================================
-- TABELA: comments (Comentários)
-- =====================================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL, -- Texto simples (não HTML)
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Referência ao item comentado (apenas um será preenchido)
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  -- Para respostas (comentários aninhados)
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garantir que apenas um tipo de referência está preenchido
  CONSTRAINT only_one_reference CHECK (
    (post_id IS NOT NULL AND topic_id IS NULL AND event_id IS NULL) OR
    (post_id IS NULL AND topic_id IS NOT NULL AND event_id IS NULL) OR
    (post_id IS NULL AND topic_id IS NULL AND event_id IS NOT NULL)
  )
);

CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_topic ON comments(topic_id);
CREATE INDEX idx_comments_event ON comments(event_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: Usuários com suas roles
CREATE OR REPLACE VIEW users_with_roles AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.avatar_url,
  u.is_active,
  json_agg(json_build_object(
    'id', r.id,
    'name', r.name,
    'display_name', r.display_name,
    'color', r.color
  )) AS roles
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
GROUP BY u.id;

-- View: Roles com permissões
CREATE OR REPLACE VIEW roles_with_permissions AS
SELECT 
  r.id,
  r.name,
  r.display_name,
  r.description,
  r.color,
  r.is_system,
  json_agg(json_build_object(
    'code', p.code,
    'name', p.name,
    'category', p.category
  )) AS permissions
FROM roles r
LEFT JOIN role_permissions rp ON rp.role_id = r.id
LEFT JOIN permissions p ON p.id = rp.permission_id
GROUP BY r.id;

-- =====================================================
-- FUNCTIONS ÚTEIS
-- =====================================================

-- Verificar se usuário tem permissão
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission_code TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = p_user_id
    AND p.code = p_permission_code
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar se usuário tem role
CREATE OR REPLACE FUNCTION user_has_role(
  p_user_id UUID,
  p_role_name TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id
    AND r.name = UPPER(p_role_name)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Obter roles do usuário
CREATE OR REPLACE FUNCTION get_user_role_ids(p_user_id UUID)
RETURNS TABLE(role_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT ur.role_id
  FROM user_roles ur
  WHERE ur.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTÁRIOS DE DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE users IS 'Usuários do sistema';
COMMENT ON TABLE roles IS 'Roles/Tags customizáveis pelo admin';
COMMENT ON TABLE permissions IS 'Permissões granulares do sistema';
COMMENT ON TABLE posts IS 'Posts do blog com conteúdo HTML (Quill)';
COMMENT ON TABLE courses IS 'Cursos de formação';
COMMENT ON TABLE modules IS 'Módulos dentro dos cursos';
COMMENT ON TABLE topics IS 'Tópicos/aulas com vídeos do YouTube';
COMMENT ON TABLE events IS 'Eventos do calendário';
COMMENT ON TABLE comments IS 'Comentários em posts, tópicos e eventos';

-- =====================================================
-- FIM DA MIGRATION 001
-- =====================================================
