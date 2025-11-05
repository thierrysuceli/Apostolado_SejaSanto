-- =====================================================
-- APOSTOLADO - ROW LEVEL SECURITY (RLS)
-- Políticas de segurança para controle de acesso
-- Data: 02/11/2025
-- =====================================================

-- =====================================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES: users
-- =====================================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "users_view_own_profile" ON users
FOR SELECT
USING (id = auth.uid());

-- Admins podem ver todos os usuários
CREATE POLICY "admins_view_all_users" ON users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Usuários podem atualizar seu próprio perfil (exceto senha via API)
CREATE POLICY "users_update_own_profile" ON users
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admins podem atualizar qualquer usuário
CREATE POLICY "admins_update_users" ON users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- =====================================================
-- POLICIES: roles
-- =====================================================

-- Todos podem ver roles (para listar no cadastro)
CREATE POLICY "anyone_view_roles" ON roles
FOR SELECT
USING (true);

-- Apenas admins podem criar roles
CREATE POLICY "admins_create_roles" ON roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Apenas admins podem editar roles não-system
CREATE POLICY "admins_update_roles" ON roles
FOR UPDATE
USING (
  is_system = false
  AND EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
)
WITH CHECK (is_system = false);

-- Apenas admins podem deletar roles não-system
CREATE POLICY "admins_delete_roles" ON roles
FOR DELETE
USING (
  is_system = false
  AND EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- =====================================================
-- POLICIES: permissions
-- =====================================================

-- Todos podem ver permissões (para UI de admin)
CREATE POLICY "anyone_view_permissions" ON permissions
FOR SELECT
USING (true);

-- Permissões são fixas, apenas admins podem adicionar via migrations

-- =====================================================
-- POLICIES: role_permissions
-- =====================================================

-- Todos podem ver associações role-permission
CREATE POLICY "anyone_view_role_permissions" ON role_permissions
FOR SELECT
USING (true);

-- Apenas admins podem modificar permissões de roles
CREATE POLICY "admins_manage_role_permissions" ON role_permissions
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
-- POLICIES: user_roles
-- =====================================================

-- Usuários podem ver suas próprias roles
CREATE POLICY "users_view_own_roles" ON user_roles
FOR SELECT
USING (user_id = auth.uid());

-- Admins podem ver roles de todos
CREATE POLICY "admins_view_all_user_roles" ON user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Apenas admins podem atribuir roles
CREATE POLICY "admins_manage_user_roles" ON user_roles
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
-- POLICIES: posts
-- =====================================================

-- Usuários veem posts compatíveis com suas roles
CREATE POLICY "users_view_role_compatible_posts" ON posts
FOR SELECT
USING (
  -- Admin vê tudo
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
  OR
  -- Posts publicados com tags do usuário
  (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM post_tags pt
      WHERE pt.post_id = posts.id
      AND pt.role_id IN (
        SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = auth.uid()
      )
    )
  )
  OR
  -- Visitante vê posts públicos (sem autenticação)
  (
    status = 'published'
    AND auth.uid() IS NULL
    AND EXISTS (
      SELECT 1 FROM post_tags pt
      JOIN roles r ON r.id = pt.role_id
      WHERE pt.post_id = posts.id
      AND r.name = 'VISITANTE'
    )
  )
);

-- Usuários com permissão CREATE_POST podem criar
CREATE POLICY "users_create_posts_with_permission" ON posts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid()
    AND p.code = 'CREATE_POST'
  )
);

-- Autores podem editar próprios posts OU admins editam tudo
CREATE POLICY "authors_edit_own_posts" ON posts
FOR UPDATE
USING (
  author_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Autores podem deletar próprios posts OU admins deletam tudo
CREATE POLICY "authors_delete_own_posts" ON posts
FOR DELETE
USING (
  author_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- =====================================================
-- POLICIES: post_tags
-- =====================================================

-- Todos podem ver tags de posts (para filtros)
CREATE POLICY "anyone_view_post_tags" ON post_tags
FOR SELECT
USING (true);

-- Apenas criadores de posts podem adicionar tags
CREATE POLICY "post_authors_manage_tags" ON post_tags
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM posts p
    WHERE p.id = post_tags.post_id
    AND (
      p.author_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
        AND r.name = 'ADMIN'
      )
    )
  )
);

-- =====================================================
-- POLICIES: courses
-- =====================================================

-- Usuários veem cursos compatíveis com suas roles
CREATE POLICY "users_view_role_compatible_courses" ON courses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
  OR
  (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM course_tags ct
      WHERE ct.course_id = courses.id
      AND ct.role_id IN (
        SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = auth.uid()
      )
    )
  )
  OR
  (
    status = 'published'
    AND auth.uid() IS NULL
    AND EXISTS (
      SELECT 1 FROM course_tags ct
      JOIN roles r ON r.id = ct.role_id
      WHERE ct.course_id = courses.id
      AND r.name = 'VISITANTE'
    )
  )
);

-- Apenas admins criam cursos
CREATE POLICY "admins_create_courses" ON courses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Apenas admins editam/deletam cursos
CREATE POLICY "admins_manage_courses" ON courses
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
-- POLICIES: course_tags
-- =====================================================

CREATE POLICY "anyone_view_course_tags" ON course_tags
FOR SELECT
USING (true);

CREATE POLICY "admins_manage_course_tags" ON course_tags
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
-- POLICIES: modules
-- =====================================================

-- Usuários veem módulos de cursos que podem acessar
CREATE POLICY "users_view_course_modules" ON modules
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = modules.course_id
    AND (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
        AND r.name = 'ADMIN'
      )
      OR
      (
        c.status = 'published'
        AND EXISTS (
          SELECT 1 FROM course_tags ct
          WHERE ct.course_id = c.id
          AND ct.role_id IN (
            SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = auth.uid()
          )
        )
      )
    )
  )
);

-- Apenas admins gerenciam módulos
CREATE POLICY "admins_manage_modules" ON modules
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
-- POLICIES: topics
-- =====================================================

-- Usuários veem tópicos de módulos que podem acessar
CREATE POLICY "users_view_module_topics" ON topics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM modules m
    JOIN courses c ON c.id = m.course_id
    WHERE m.id = topics.module_id
    AND (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
        AND r.name = 'ADMIN'
      )
      OR
      (
        c.status = 'published'
        AND EXISTS (
          SELECT 1 FROM course_tags ct
          WHERE ct.course_id = c.id
          AND ct.role_id IN (
            SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = auth.uid()
          )
        )
      )
    )
  )
);

-- Apenas admins gerenciam tópicos
CREATE POLICY "admins_manage_topics" ON topics
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
-- POLICIES: events
-- =====================================================

-- Usuários veem eventos compatíveis com suas roles
CREATE POLICY "users_view_role_compatible_events" ON events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
  OR
  EXISTS (
    SELECT 1 FROM event_tags et
    WHERE et.event_id = events.id
    AND et.role_id IN (
      SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = auth.uid()
    )
  )
  OR
  (
    auth.uid() IS NULL
    AND EXISTS (
      SELECT 1 FROM event_tags et
      JOIN roles r ON r.id = et.role_id
      WHERE et.event_id = events.id
      AND r.name = 'VISITANTE'
    )
  )
);

-- Usuários com permissão CREATE_EVENT podem criar
CREATE POLICY "users_create_events_with_permission" ON events
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid()
    AND p.code = 'CREATE_EVENT'
  )
);

-- Criadores podem editar próprios eventos OU admins editam tudo
CREATE POLICY "creators_edit_own_events" ON events
FOR UPDATE
USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- =====================================================
-- POLICIES: event_tags
-- =====================================================

CREATE POLICY "anyone_view_event_tags" ON event_tags
FOR SELECT
USING (true);

CREATE POLICY "event_creators_manage_tags" ON event_tags
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM events e
    WHERE e.id = event_tags.event_id
    AND (
      e.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = auth.uid()
        AND r.name = 'ADMIN'
      )
    )
  )
);

-- =====================================================
-- POLICIES: comments
-- =====================================================

-- Usuários veem comentários de conteúdo que podem acessar
CREATE POLICY "users_view_comments_on_accessible_content" ON comments
FOR SELECT
USING (
  -- Comentários em posts visíveis
  (
    post_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = comments.post_id
      AND (
        EXISTS (
          SELECT 1 FROM user_roles ur
          JOIN roles r ON r.id = ur.role_id
          WHERE ur.user_id = auth.uid()
          AND r.name = 'ADMIN'
        )
        OR
        (
          p.status = 'published'
          AND EXISTS (
            SELECT 1 FROM post_tags pt
            WHERE pt.post_id = p.id
            AND pt.role_id IN (
              SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = auth.uid()
            )
          )
        )
      )
    )
  )
  OR
  -- Comentários em tópicos visíveis
  (
    topic_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM topics t
      JOIN modules m ON m.id = t.module_id
      JOIN courses c ON c.id = m.course_id
      WHERE t.id = comments.topic_id
      AND (
        EXISTS (
          SELECT 1 FROM user_roles ur
          JOIN roles r ON r.id = ur.role_id
          WHERE ur.user_id = auth.uid()
          AND r.name = 'ADMIN'
        )
        OR
        (
          c.status = 'published'
          AND EXISTS (
            SELECT 1 FROM course_tags ct
            WHERE ct.course_id = c.id
            AND ct.role_id IN (
              SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = auth.uid()
            )
          )
        )
      )
    )
  )
  OR
  -- Comentários em eventos visíveis
  (
    event_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM events ev
      WHERE ev.id = comments.event_id
      AND (
        EXISTS (
          SELECT 1 FROM user_roles ur
          JOIN roles r ON r.id = ur.role_id
          WHERE ur.user_id = auth.uid()
          AND r.name = 'ADMIN'
        )
        OR
        EXISTS (
          SELECT 1 FROM event_tags et
          WHERE et.event_id = ev.id
          AND et.role_id IN (
            SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = auth.uid()
          )
        )
      )
    )
  )
);

-- Usuários com permissão CREATE_COMMENT podem comentar
CREATE POLICY "users_create_comments_with_permission" ON comments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid()
    AND p.code = 'CREATE_COMMENT'
  )
);

-- Autores editam próprios comentários OU admins editam qualquer um
CREATE POLICY "authors_edit_own_comments" ON comments
FOR UPDATE
USING (
  author_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid()
    AND p.code = 'EDIT_ANY_COMMENT'
  )
);

-- Autores deletam próprios comentários OU admins deletam qualquer um
CREATE POLICY "authors_delete_own_comments" ON comments
FOR DELETE
USING (
  author_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid()
    AND p.code = 'DELETE_ANY_COMMENT'
  )
);

-- =====================================================
-- FIM DA MIGRATION 002 - RLS
-- =====================================================
