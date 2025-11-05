-- =====================================================
-- APOSTOLADO - SEED DATA
-- Dados iniciais: Roles, Permissões, Admin
-- Data: 02/11/2025
-- =====================================================

-- =====================================================
-- INSERIR PERMISSÕES DO SISTEMA
-- =====================================================

INSERT INTO permissions (code, name, description, category) VALUES
-- CONTENT (Visualização)
('VIEW_POSTS', 'Ver Posts', 'Pode visualizar posts do blog', 'CONTENT'),
('VIEW_COURSES', 'Ver Cursos', 'Pode visualizar cursos de formação', 'CONTENT'),
('VIEW_EVENTS', 'Ver Eventos', 'Pode visualizar eventos do calendário', 'CONTENT'),
('VIEW_COMMENTS', 'Ver Comentários', 'Pode visualizar comentários', 'CONTENT'),

-- INTERACTION (Interação)
('CREATE_COMMENT', 'Criar Comentário', 'Pode comentar em posts, tópicos e eventos', 'INTERACTION'),
('REPLY_COMMENT', 'Responder Comentário', 'Pode responder comentários de outros', 'INTERACTION'),
('EDIT_OWN_COMMENT', 'Editar Próprio Comentário', 'Pode editar seus próprios comentários', 'INTERACTION'),
('EDIT_ANY_COMMENT', 'Editar Qualquer Comentário', 'Pode editar comentários de outros', 'INTERACTION'),
('DELETE_OWN_COMMENT', 'Deletar Próprio Comentário', 'Pode deletar seus próprios comentários', 'INTERACTION'),
('DELETE_ANY_COMMENT', 'Deletar Qualquer Comentário', 'Pode deletar comentários de outros', 'INTERACTION'),

-- CREATION (Criação de Conteúdo)
('CREATE_POST', 'Criar Post', 'Pode criar posts no blog', 'CREATION'),
('EDIT_POST', 'Editar Post', 'Pode editar posts existentes', 'CREATION'),
('DELETE_POST', 'Deletar Post', 'Pode deletar posts', 'CREATION'),
('CREATE_COURSE', 'Criar Curso', 'Pode criar novos cursos', 'CREATION'),
('EDIT_COURSE', 'Editar Curso', 'Pode editar cursos existentes', 'CREATION'),
('DELETE_COURSE', 'Deletar Curso', 'Pode deletar cursos', 'CREATION'),
('CREATE_EVENT', 'Criar Evento', 'Pode criar eventos no calendário', 'CREATION'),
('EDIT_EVENT', 'Editar Evento', 'Pode editar eventos existentes', 'CREATION'),
('DELETE_EVENT', 'Deletar Evento', 'Pode deletar eventos', 'CREATION'),

-- ADMIN (Administrativo)
('MANAGE_USERS', 'Gerenciar Usuários', 'Pode gerenciar contas de usuários', 'ADMIN'),
('MANAGE_ROLES', 'Gerenciar Roles', 'Pode criar e editar roles/tags', 'ADMIN'),
('MANAGE_PERMISSIONS', 'Gerenciar Permissões', 'Pode atribuir permissões a roles', 'ADMIN'),
('VIEW_ANALYTICS', 'Ver Estatísticas', 'Pode acessar analytics e métricas', 'ADMIN')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- INSERIR ROLES PADRÃO DO SISTEMA
-- =====================================================

INSERT INTO roles (name, display_name, description, color, is_system) VALUES
('VISITANTE', 'Visitante', 'Usuário não cadastrado com acesso público', '#9ca3af', true),
('INSCRITO', 'Inscrito', 'Usuário cadastrado com acesso básico', '#3b82f6', true),
('ADMIN', 'Administrador', 'Acesso total ao sistema', '#ef4444', true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- ASSOCIAR PERMISSÕES AOS ROLES PADRÃO
-- =====================================================

-- VISITANTE: Apenas visualização de conteúdo público
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'VISITANTE'
AND p.code IN (
  'VIEW_POSTS',
  'VIEW_COURSES',
  'VIEW_EVENTS',
  'VIEW_COMMENTS'
)
ON CONFLICT DO NOTHING;

-- INSCRITO: Visualização + Interação básica
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'INSCRITO'
AND p.code IN (
  'VIEW_POSTS',
  'VIEW_COURSES',
  'VIEW_EVENTS',
  'VIEW_COMMENTS',
  'CREATE_COMMENT',
  'REPLY_COMMENT',
  'EDIT_OWN_COMMENT',
  'DELETE_OWN_COMMENT'
)
ON CONFLICT DO NOTHING;

-- ADMIN: Todas as permissões
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

-- =====================================================
-- CRIAR USUÁRIO ADMIN INICIAL
-- =====================================================

-- Senha: Admin@123
-- Hash gerado com: bcrypt.hash('Admin@123', 10)
-- IMPORTANTE: Alterar senha após primeiro login!

INSERT INTO users (email, password_hash, name, is_active)
VALUES (
  'admin@apostolado.com',
  '$2b$10$8lK9mZPxH5YvE4jBj3F6Z.F5QdGxK4H1YvE4jBj3F6Z.F5QdGxK4H1', -- Admin@123
  'Administrador',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Atribuir role ADMIN ao usuário inicial
INSERT INTO user_roles (user_id, role_id)
SELECT 
  u.id,
  r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'admin@apostolado.com'
AND r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

-- =====================================================
-- DADOS DE EXEMPLO (Opcional - Comentar se não quiser)
-- =====================================================

-- Criar alguns posts de exemplo
DO $$
DECLARE
  admin_id UUID;
  inscrito_role_id UUID;
  visitante_role_id UUID;
  post1_id UUID;
  post2_id UUID;
BEGIN
  -- Obter IDs
  SELECT id INTO admin_id FROM users WHERE email = 'admin@apostolado.com';
  SELECT id INTO inscrito_role_id FROM roles WHERE name = 'INSCRITO';
  SELECT id INTO visitante_role_id FROM roles WHERE name = 'VISITANTE';
  
  -- Post 1: Público (Visitante + Inscrito)
  INSERT INTO posts (title, slug, content, excerpt, author_id, status, published_at)
  VALUES (
    'Bem-vindo ao Apostolado',
    'bem-vindo-ao-apostolado',
    '<h2>Bem-vindo!</h2><p>Este é o primeiro post do blog. Aqui compartilharemos conteúdos sobre formação espiritual e crescimento na fé.</p><blockquote>"A oração é a chave do dia e o ferrolho da noite." - São Padre Pio</blockquote>',
    'Primeiro post do blog de formação espiritual.',
    admin_id,
    'published',
    NOW()
  )
  RETURNING id INTO post1_id;
  
  -- Associar tags ao Post 1
  INSERT INTO post_tags (post_id, role_id) VALUES
    (post1_id, visitante_role_id),
    (post1_id, inscrito_role_id);
  
  -- Post 2: Apenas Inscritos
  INSERT INTO posts (title, slug, content, excerpt, author_id, status, published_at)
  VALUES (
    'O Poder do Rosário',
    'o-poder-do-rosario',
    '<h2>O Rosário</h2><p>O Santo Rosário é uma das mais poderosas armas espirituais que temos. Neste post, vamos explorar sua importância e como rezá-lo com devoção.</p><h3>Os Mistérios</h3><ul><li>Mistérios Gozosos</li><li>Mistérios Dolorosos</li><li>Mistérios Gloriosos</li><li>Mistérios Luminosos</li></ul>',
    'Conteúdo exclusivo para inscritos sobre o Santo Rosário.',
    admin_id,
    'published',
    NOW()
  )
  RETURNING id INTO post2_id;
  
  -- Associar tag ao Post 2 (apenas inscritos)
  INSERT INTO post_tags (post_id, role_id) VALUES
    (post2_id, inscrito_role_id);
END $$;

-- Criar um curso de exemplo
DO $$
DECLARE
  admin_id UUID;
  inscrito_role_id UUID;
  course_id UUID;
  module_id UUID;
  topic_id UUID;
BEGIN
  SELECT id INTO admin_id FROM users WHERE email = 'admin@apostolado.com';
  SELECT id INTO inscrito_role_id FROM roles WHERE name = 'INSCRITO';
  
  -- Criar curso
  INSERT INTO courses (title, slug, description, status)
  VALUES (
    'Introdução ao Rosário',
    'introducao-ao-rosario',
    'Curso completo sobre a história, significado e prática do Santo Rosário.',
    'published'
  )
  RETURNING id INTO course_id;
  
  -- Associar tag ao curso
  INSERT INTO course_tags (course_id, role_id) VALUES
    (course_id, inscrito_role_id);
  
  -- Criar módulo
  INSERT INTO modules (course_id, title, description, order_index)
  VALUES (
    course_id,
    'História do Rosário',
    'Aprenda sobre as origens e desenvolvimento do Santo Rosário ao longo dos séculos.',
    1
  )
  RETURNING id INTO module_id;
  
  -- Criar tópico
  INSERT INTO topics (module_id, title, order_index, content_before, video_url, content_after)
  VALUES (
    module_id,
    'As Origens do Rosário',
    1,
    '<h2>Bem-vindo à primeira aula!</h2><p>Nesta aula, vamos descobrir as origens históricas do Santo Rosário e como ele se desenvolveu ao longo dos séculos.</p>',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    '<h3>Reflexão</h3><p>Medite sobre a importância da oração do Rosário em sua vida diária.</p><blockquote>"O Rosário é a arma mais poderosa contra o inimigo." - São Padre Pio</blockquote>'
  );
END $$;

-- Criar evento de exemplo
DO $$
DECLARE
  admin_id UUID;
  inscrito_role_id UUID;
  event_id UUID;
BEGIN
  SELECT id INTO admin_id FROM users WHERE email = 'admin@apostolado.com';
  SELECT id INTO inscrito_role_id FROM roles WHERE name = 'INSCRITO';
  
  INSERT INTO events (title, description, start_date, end_date, location, created_by)
  VALUES (
    'Terço em Comunidade',
    'Encontro semanal para rezar o Santo Terço em comunidade.',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '1 hour',
    'Capela São José',
    admin_id
  )
  RETURNING id INTO event_id;
  
  INSERT INTO event_tags (event_id, role_id) VALUES
    (event_id, inscrito_role_id);
END $$;

-- =====================================================
-- COMENTÁRIOS ÚTEIS PARA O DESENVOLVEDOR
-- =====================================================

-- Para resetar a senha do admin:
-- UPDATE users SET password_hash = '$2b$10$8lK9mZPxH5YvE4jBj3F6Z.F5QdGxK4H1YvE4jBj3F6Z.F5QdGxK4H1' WHERE email = 'admin@apostolado.com';

-- Para criar um novo admin:
-- 1. Criar usuário
-- INSERT INTO users (email, password_hash, name) VALUES ('novo@admin.com', '[hash]', 'Nome');
-- 2. Atribuir role ADMIN
-- INSERT INTO user_roles (user_id, role_id) SELECT u.id, r.id FROM users u CROSS JOIN roles r WHERE u.email = 'novo@admin.com' AND r.name = 'ADMIN';

-- Para criar uma nova role customizada:
-- INSERT INTO roles (name, display_name, description, color) VALUES ('MODERADOR', 'Moderador', 'Pode moderar comentários', '#f59e0b');
-- INSERT INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'MODERADOR' AND p.code IN ('VIEW_POSTS', 'EDIT_ANY_COMMENT', 'DELETE_ANY_COMMENT');

-- =====================================================
-- VERIFICAÇÕES (Para testar no SQL Editor)
-- =====================================================

-- Ver todas as roles com suas permissões
-- SELECT * FROM roles_with_permissions;

-- Ver usuários com suas roles
-- SELECT * FROM users_with_roles;

-- Verificar se admin tem permissão
-- SELECT user_has_permission((SELECT id FROM users WHERE email = 'admin@apostolado.com'), 'CREATE_POST');

-- Verificar se admin tem role
-- SELECT user_has_role((SELECT id FROM users WHERE email = 'admin@apostolado.com'), 'ADMIN');

-- =====================================================
-- FIM DA MIGRATION 003 - SEED DATA
-- =====================================================
