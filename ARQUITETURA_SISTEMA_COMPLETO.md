# 🏗️ Arquitetura Completa - Sistema Apostolado

**Data:** 02/11/2025  
**Status:** Em Planejamento  
**Backend:** Vercel (Next.js API Routes)  
**Database:** Supabase PostgreSQL  
**Storage:** Supabase Storage  
**Frontend:** React + Vite

---

## 📋 Índice

1. [Credenciais e Configuração](#credenciais)
2. [Levantamento de Requisitos](#requisitos)
3. [Modelo de Dados (Schema SQL)](#modelo-dados)
4. [Sistema de Permissões (RBAC Dinâmico)](#permissoes)
5. [Arquitetura Backend](#backend)
6. [Segurança e Sanitização](#seguranca)
7. [Fluxos de Funcionalidades](#fluxos)
8. [Adaptações no Frontend](#frontend)
9. [Estratégia de Implementação](#estrategia)
10. [Checklist de Segurança](#checklist)

---

## 🔐 Credenciais e Configuração {#credenciais}

### Supabase

```env
VITE_SUPABASE_URL=https://aywgkvyabjcnnmiwihim.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5d2drdnlhYmpjbm5taXdpaGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzMxNDMsImV4cCI6MjA3NzYwOTE0M30.bGaAo5tCkEPxvXVe8Atdnj6TZjG09FUw5Vp2XQVUWfA
SUPABASE_SERVICE_ROLE_KEY=[obtido do dashboard - NÃO expor no frontend]
```

### Estrutura de Arquivos

```
Apostolado/
├── src/                     # Frontend React
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   └── lib/
│       └── supabaseClient.js  # Cliente Supabase
├── api/                     # Backend (Vercel Serverless)
│   ├── auth/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── me.js
│   ├── posts/
│   │   ├── index.js         # GET /api/posts
│   │   ├── [id].js          # GET/PUT/DELETE /api/posts/:id
│   │   └── create.js        # POST /api/posts
│   ├── courses/
│   ├── comments/
│   ├── events/
│   ├── admin/
│   │   ├── roles.js
│   │   ├── permissions.js
│   │   └── users.js
│   └── middleware/
│       ├── auth.js          # Verificar JWT
│       ├── permissions.js   # Verificar permissões
│       └── sanitize.js      # Sanitização de inputs
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       └── 003_seed_data.sql
├── .env.local               # Variáveis de ambiente
└── vercel.json              # Configuração Vercel
```

---

## 📊 Levantamento de Requisitos {#requisitos}

### 1. Tipos de Usuários (Roles/Tags)

#### **Roles Padrão:**
- `VISITANTE` - Não cadastrado (apenas leitura de conteúdo público)
- `INSCRITO` - Cadastrado (acesso a conteúdo de inscritos)
- `ADMIN` - Administrador principal (acesso total)

#### **Roles Customizáveis:**
- Admin pode criar novas tags: `SUB_ADMIN`, `MODERADOR`, `MENTOR`, etc.
- Cada tag tem permissões customizadas

### 2. Sistema de Permissões Granulares

#### **Permissões de Conteúdo:**
- `VIEW_POSTS` - Ver posts
- `VIEW_COURSES` - Ver cursos
- `VIEW_EVENTS` - Ver eventos do calendário
- `VIEW_COMMENTS` - Ver comentários

#### **Permissões de Interação:**
- `CREATE_COMMENT` - Comentar
- `REPLY_COMMENT` - Responder comentários
- `EDIT_OWN_COMMENT` - Editar próprios comentários
- `EDIT_ANY_COMMENT` - Editar comentários de outros
- `DELETE_OWN_COMMENT` - Deletar próprios comentários
- `DELETE_ANY_COMMENT` - Deletar comentários de outros

#### **Permissões de Criação:**
- `CREATE_POST` - Criar posts
- `CREATE_COURSE` - Criar cursos
- `CREATE_EVENT` - Criar eventos

#### **Permissões de Edição:**
- `EDIT_POST` - Editar posts
- `EDIT_COURSE` - Editar cursos
- `EDIT_EVENT` - Editar eventos
- `DELETE_POST` - Deletar posts
- `DELETE_COURSE` - Deletar cursos
- `DELETE_EVENT` - Deletar eventos

#### **Permissões Administrativas:**
- `MANAGE_USERS` - Gerenciar usuários
- `MANAGE_ROLES` - Criar/editar roles
- `MANAGE_PERMISSIONS` - Atribuir permissões
- `VIEW_ANALYTICS` - Ver estatísticas

### 3. Entidades do Sistema

#### **Usuários**
- ID, nome, email, senha (hash), avatar
- Role/Tag atribuída
- Data de criação, último acesso

#### **Roles/Tags**
- ID, nome, descrição, cor (visual)
- Permissões associadas
- Customizável pelo admin

#### **Posts**
- ID, título, slug, conteúdo HTML (Quill)
- Autor, data de criação, última edição
- Tags de visibilidade (quem pode ver)
- Imagem de capa (Supabase Storage)
- Status (rascunho, publicado, arquivado)

#### **Cursos**
- ID, título, slug, descrição, imagem
- Tags de visibilidade
- Status

#### **Módulos**
- ID, nome, descrição, ordem
- Pertence a um curso

#### **Tópicos**
- ID, título, ordem
- Pertence a um módulo
- Conteúdo antes do vídeo (HTML)
- URL do vídeo (YouTube iframe)
- Conteúdo depois do vídeo (HTML)

#### **Eventos (Calendário)**
- ID, título, descrição, data/hora
- Tags de visibilidade
- Local, link de reunião

#### **Comentários**
- ID, conteúdo (text, não HTML)
- Autor, data
- Referência (post_id, topic_id, event_id)
- Comentário pai (para respostas)

### 4. Regras de Negócio

#### **Visibilidade de Conteúdo:**
- Conteúdo só aparece se o usuário tiver a tag necessária
- Admin vê tudo sempre
- Visitante vê apenas conteúdo público

#### **Filtros Automáticos:**
- Home: posts visíveis para a tag do usuário
- Cursos: cursos visíveis para a tag do usuário
- Calendário: eventos visíveis para a tag do usuário
- **Não mostrar "Acesso Restrito"** - simplesmente não listar

#### **Interconexão:**
- Se o usuário é INSCRITO, só vê:
  - Posts marcados como INSCRITO ou VISITANTE
  - Cursos marcados como INSCRITO ou VISITANTE
  - Eventos marcados como INSCRITO ou VISITANTE

#### **Comentários:**
- Só aparecem se o usuário tiver permissão `VIEW_COMMENTS`
- Só pode comentar se tiver `CREATE_COMMENT`
- Só pode responder se tiver `REPLY_COMMENT`

#### **Edição e Exclusão:**
- Usuário comum: edita/deleta apenas seus próprios comentários
- Admin: edita/deleta qualquer conteúdo

---

## 🗄️ Modelo de Dados (Schema SQL) {#modelo-dados}

### Diagrama de Entidades

```
users (1) ────< (N) user_roles (N) ────> (1) roles
roles (1) ────< (N) role_permissions (N) ────> (1) permissions

posts (1) ────< (N) post_tags (N) ────> (1) roles
courses (1) ────< (N) course_tags (N) ────> (1) roles
events (1) ────< (N) event_tags (N) ────> (1) roles

courses (1) ────< (N) modules (1) ────< (N) topics

posts (1) ────< (N) comments
topics (1) ────< (N) comments
events (1) ────< (N) comments
comments (1) ────< (N) comments (respostas)
```

### Tabelas SQL

#### **1. users** (Usuários)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);
```

#### **2. roles** (Roles/Tags)
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- VISITANTE, INSCRITO, ADMIN, etc.
  display_name TEXT NOT NULL,
  description TEXT,
  color TEXT, -- Para UI (ex: #f59e0b)
  is_system BOOLEAN DEFAULT FALSE, -- Se é role padrão (não deletável)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **3. permissions** (Permissões)
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- VIEW_POSTS, CREATE_COMMENT, etc.
  name TEXT NOT NULL,
  description TEXT,
  category TEXT -- CONTENT, INTERACTION, ADMIN
);
```

#### **4. role_permissions** (Permissões por Role)
```sql
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);
```

#### **5. user_roles** (Role do Usuário)
```sql
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  PRIMARY KEY (user_id, role_id)
);
```

#### **6. posts** (Posts do Blog)
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- HTML do Quill
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **7. post_tags** (Visibilidade de Posts)
```sql
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, role_id)
);
```

#### **8. courses** (Cursos)
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **9. course_tags** (Visibilidade de Cursos)
```sql
CREATE TABLE course_tags (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, role_id)
);
```

#### **10. modules** (Módulos de Curso)
```sql
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **11. topics** (Tópicos/Aulas)
```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  content_before TEXT, -- HTML antes do vídeo
  video_url TEXT, -- URL do YouTube
  content_after TEXT, -- HTML depois do vídeo
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **12. events** (Eventos do Calendário)
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  meeting_link TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **13. event_tags** (Visibilidade de Eventos)
```sql
CREATE TABLE event_tags (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, role_id)
);
```

#### **14. comments** (Comentários)
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL, -- Texto simples (não HTML)
  author_id UUID REFERENCES users(id),
  
  -- Referência ao item comentado (apenas um será preenchido)
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  -- Para respostas
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (
    (post_id IS NOT NULL AND topic_id IS NULL AND event_id IS NULL) OR
    (post_id IS NULL AND topic_id IS NOT NULL AND event_id IS NULL) OR
    (post_id IS NULL AND topic_id IS NULL AND event_id IS NOT NULL)
  )
);
```

---

## 🔐 Sistema de Permissões (RBAC Dinâmico) {#permissoes}

### Lógica de Verificação

#### **No Backend (API):**

```javascript
// Verificar se usuário tem permissão
async function hasPermission(userId, permissionCode) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      user_roles!inner (
        roles!inner (
          role_permissions!inner (
            permissions!inner (code)
          )
        )
      )
    `)
    .eq('id', userId)
    .eq('user_roles.roles.role_permissions.permissions.code', permissionCode)
    .single();
  
  return !!data;
}

// Verificar se usuário pode ver conteúdo
async function canViewPost(userId, postId) {
  // Admin vê tudo
  const isAdmin = await hasRole(userId, 'ADMIN');
  if (isAdmin) return true;
  
  // Verificar se post tem tag do usuário
  const { data } = await supabase
    .from('posts')
    .select(`
      post_tags!inner (
        role_id
      )
    `)
    .eq('id', postId)
    .in('post_tags.role_id', await getUserRoleIds(userId));
  
  return data && data.length > 0;
}
```

### Row Level Security (RLS)

#### **Política para Posts:**
```sql
-- Usuários só veem posts com tags compatíveis
CREATE POLICY "users_view_own_role_posts" ON posts
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
  -- Usuário vê posts com suas tags
  EXISTS (
    SELECT 1 FROM post_tags pt
    JOIN user_roles ur ON ur.role_id = pt.role_id
    WHERE pt.post_id = posts.id
    AND ur.user_id = auth.uid()
  )
);
```

#### **Política para Comentários:**
```sql
-- Usuários editam apenas próprios comentários
CREATE POLICY "users_edit_own_comments" ON comments
FOR UPDATE
USING (
  author_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    JOIN role_permissions rp ON rp.role_id = r.id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid()
    AND p.code = 'EDIT_ANY_COMMENT'
  )
);
```

---

## 🖥️ Arquitetura Backend {#backend}

### Estrutura de API Routes (Vercel)

#### **1. Autenticação**

**`/api/auth/register.js`**
```javascript
import { supabase } from '@/lib/supabaseServerClient';
import { hash } from 'bcrypt';
import { sanitizeEmail, sanitizeName } from '@/lib/sanitize';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { email, password, name } = req.body;
    
    // Sanitização
    const cleanEmail = sanitizeEmail(email);
    const cleanName = sanitizeName(name);
    
    // Validação
    if (!cleanEmail || !cleanName || !password) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
    
    // Hash da senha
    const passwordHash = await hash(password, 10);
    
    // Criar usuário
    const { data: user, error } = await supabase
      .from('users')
      .insert({ email: cleanEmail, name: cleanName, password_hash: passwordHash })
      .select()
      .single();
    
    if (error) throw error;
    
    // Atribuir role padrão (INSCRITO)
    const { data: inscritoRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'INSCRITO')
      .single();
    
    await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role_id: inscritoRole.id });
    
    // Gerar JWT
    const token = generateJWT(user.id);
    
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**`/api/auth/login.js`**
```javascript
import { supabase } from '@/lib/supabaseServerClient';
import { compare } from 'bcrypt';
import { generateJWT } from '@/lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { email, password } = req.body;
    
    // Buscar usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('*, user_roles(roles(*))')
      .eq('email', email)
      .eq('is_active', true)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    const valid = await compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    // Atualizar último login
    await supabase
      .from('users')
      .update({ last_login: new Date() })
      .eq('id', user.id);
    
    // Gerar JWT
    const token = generateJWT(user.id);
    
    // Não enviar password_hash
    delete user.password_hash;
    
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### **2. Posts**

**`/api/posts/index.js`** (GET - Listar posts visíveis)
```javascript
import { authenticate } from '@/middleware/auth';
import { supabase } from '@/lib/supabaseServerClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  
  try {
    const user = await authenticate(req);
    
    // Se não autenticado, buscar role VISITANTE
    let roleIds = [];
    if (user) {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id);
      roleIds = userRoles.map(ur => ur.role_id);
    } else {
      const { data: visitanteRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'VISITANTE')
        .single();
      roleIds = [visitanteRole.id];
    }
    
    // Buscar posts visíveis
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!author_id(name, avatar_url),
        post_tags!inner(role_id)
      `)
      .eq('status', 'published')
      .in('post_tags.role_id', roleIds)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**`/api/posts/create.js`** (POST - Criar post)
```javascript
import { authenticate, requirePermission } from '@/middleware/auth';
import { sanitizeHTML } from '@/lib/sanitize';
import { supabase } from '@/lib/supabaseServerClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const user = await authenticate(req);
    if (!user) return res.status(401).json({ error: 'Não autenticado' });
    
    // Verificar permissão
    const hasPermission = await requirePermission(user.id, 'CREATE_POST');
    if (!hasPermission) {
      return res.status(403).json({ error: 'Sem permissão' });
    }
    
    const { title, content, tags, coverImage } = req.body;
    
    // Sanitizar HTML do Quill
    const cleanContent = sanitizeHTML(content);
    const slug = generateSlug(title);
    
    // Criar post
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        content: cleanContent,
        cover_image_url: coverImage,
        author_id: user.id,
        status: 'published',
        published_at: new Date()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Associar tags
    const postTags = tags.map(roleId => ({
      post_id: post.id,
      role_id: roleId
    }));
    
    await supabase.from('post_tags').insert(postTags);
    
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### **3. Admin - Gerenciar Roles**

**`/api/admin/roles.js`**
```javascript
import { authenticate, requirePermission } from '@/middleware/auth';
import { supabase } from '@/lib/supabaseServerClient';

export default async function handler(req, res) {
  const user = await authenticate(req);
  if (!user) return res.status(401).json({ error: 'Não autenticado' });
  
  const hasPermission = await requirePermission(user.id, 'MANAGE_ROLES');
  if (!hasPermission) {
    return res.status(403).json({ error: 'Sem permissão' });
  }
  
  // GET - Listar roles
  if (req.method === 'GET') {
    const { data: roles, error } = await supabase
      .from('roles')
      .select(`
        *,
        role_permissions(permissions(*))
      `);
    
    return res.status(200).json({ roles });
  }
  
  // POST - Criar nova role
  if (req.method === 'POST') {
    const { name, displayName, description, color, permissions } = req.body;
    
    const { data: role, error } = await supabase
      .from('roles')
      .insert({
        name: name.toUpperCase(),
        display_name: displayName,
        description,
        color,
        is_system: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Associar permissões
    const rolePermissions = permissions.map(permId => ({
      role_id: role.id,
      permission_id: permId
    }));
    
    await supabase.from('role_permissions').insert(rolePermissions);
    
    return res.status(201).json({ role });
  }
  
  return res.status(405).end();
}
```

---

## 🛡️ Segurança e Sanitização {#seguranca}

### 1. Sanitização de HTML (DOMPurify)

```javascript
// lib/sanitize.js
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'img', 'video', 'iframe'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height', 'class', 'style'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
  });
}

export function sanitizeText(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeEmail(email) {
  return email.toLowerCase().trim();
}

export function sanitizeName(name) {
  return name.trim().replace(/[<>]/g, '');
}
```

### 2. Validação de YouTube URLs

```javascript
export function validateYouTubeUrl(url) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
  return regex.test(url);
}

export function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
```

### 3. Rate Limiting

```javascript
// middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições
  message: 'Muitas requisições, tente novamente mais tarde.'
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentativas de login
  message: 'Muitas tentativas de login, tente novamente mais tarde.'
});
```

### 4. JWT Seguro

```javascript
// lib/jwt.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Gerado com crypto.randomBytes(64).toString('hex')
const JWT_EXPIRATION = '7d';

export function generateJWT(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
```

### 5. Middleware de Autenticação

```javascript
// middleware/auth.js
import { verifyJWT } from '@/lib/jwt';
import { supabase } from '@/lib/supabaseServerClient';

export async function authenticate(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  
  const payload = verifyJWT(token);
  if (!payload) return null;
  
  const { data: user } = await supabase
    .from('users')
    .select('*, user_roles(roles(*))')
    .eq('id', payload.userId)
    .eq('is_active', true)
    .single();
  
  return user;
}

export async function requirePermission(userId, permissionCode) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      user_roles!inner (
        roles!inner (
          role_permissions!inner (
            permissions!inner (code)
          )
        )
      )
    `)
    .eq('id', userId)
    .eq('user_roles.roles.role_permissions.permissions.code', permissionCode)
    .single();
  
  return !!data;
}
```

---

## 🔄 Fluxos de Funcionalidades {#fluxos}

### 1. Fluxo de Registro

```
1. Usuário preenche formulário
2. Frontend valida (email, senha forte)
3. POST /api/auth/register
4. Backend sanitiza inputs
5. Backend hash senha (bcrypt)
6. Backend cria user no Supabase
7. Backend atribui role INSCRITO
8. Backend gera JWT
9. Frontend salva token
10. Redireciona para home
```

### 2. Fluxo de Login

```
1. Usuário preenche email/senha
2. POST /api/auth/login
3. Backend busca user
4. Backend compara hash
5. Backend atualiza last_login
6. Backend gera JWT
7. Frontend salva token
8. Frontend carrega permissões
9. Redireciona para home
```

### 3. Fluxo de Visualização de Posts

```
1. Usuário acessa /posts
2. Frontend: GET /api/posts (com token)
3. Backend identifica role do usuário
4. Backend busca posts com tags compatíveis
5. Backend aplica RLS
6. Frontend renderiza lista
7. Usuário não vê posts restritos
```

### 4. Fluxo de Criação de Post (Admin)

```
1. Admin acessa /admin/posts/new
2. Admin escreve no Quill
3. Admin seleciona tags de visibilidade
4. Admin faz upload de imagem
5. POST /api/posts/create
6. Backend verifica permissão CREATE_POST
7. Backend sanitiza HTML
8. Backend salva post
9. Backend associa tags
10. Frontend redireciona para post
```

### 5. Fluxo de Comentário

```
1. Usuário vê seção de comentários
2. Backend verifica VIEW_COMMENTS
3. Usuário clica em "Comentar"
4. Backend verifica CREATE_COMMENT
5. Usuário escreve comentário
6. POST /api/comments
7. Backend sanitiza texto (não HTML!)
8. Backend salva comentário
9. Frontend atualiza lista em tempo real
```

### 6. Fluxo de Upload de Imagem

```
1. Admin seleciona imagem
2. Frontend valida (tipo, tamanho)
3. POST /api/upload
4. Backend verifica autenticação
5. Backend valida novamente
6. Backend faz upload para Supabase Storage
7. Backend gera URL pública
8. Backend retorna URL
9. Frontend insere no Quill
```

---

## 🎨 Adaptações no Frontend {#frontend}

### 1. Remover Mock Data

**Arquivos a deletar:**
- `src/data/mockDatabase.js`
- `src/data/mockDatabaseExtended.js`

### 2. Criar Cliente Supabase

**`src/lib/supabaseClient.js`**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Criar Context de API

**`src/contexts/ApiContext.jsx`**
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  
  useEffect(() => {
    // Carregar usuário do token
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);
  
  async function fetchUser(token) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data.user);
      setPermissions(data.permissions);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }
  
  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) throw new Error('Login falhou');
    
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  }
  
  async function logout() {
    localStorage.removeItem('token');
    setUser(null);
    setPermissions([]);
  }
  
  function hasPermission(code) {
    return permissions.includes(code);
  }
  
  return (
    <ApiContext.Provider value={{ user, loading, login, logout, hasPermission, permissions }}>
      {children}
    </ApiContext.Provider>
  );
}

export const useApi = () => useContext(ApiContext);
```

### 4. Adaptar Páginas

**Exemplo: `src/pages/Posts.jsx`**
```javascript
import { useState, useEffect } from 'react';
import { useApi } from '@/contexts/ApiContext';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApi();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  async function fetchPosts() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/posts', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 5. Componentes com Permissões

**`src/components/Protected.jsx`**
```javascript
import { useApi } from '@/contexts/ApiContext';

export function Protected({ permission, children, fallback = null }) {
  const { hasPermission } = useApi();
  
  if (!hasPermission(permission)) return fallback;
  
  return children;
}

// Uso:
<Protected permission="CREATE_POST">
  <button>Criar Post</button>
</Protected>
```

---

## 📐 Estratégia de Implementação {#estrategia}

### Fase 1: Setup Inicial (Dia 1)
1. ✅ Criar arquivo `.env.local` com credenciais
2. ✅ Instalar dependências:
   ```bash
   npm install @supabase/supabase-js bcrypt jsonwebtoken isomorphic-dompurify
   ```
3. ✅ Criar estrutura de pastas `/api`
4. ✅ Criar `supabaseClient.js` e `supabaseServerClient.js`

### Fase 2: Database (Dias 1-2)
1. ✅ Criar migration `001_initial_schema.sql`
2. ✅ Executar no Supabase SQL Editor
3. ✅ Criar policies RLS `002_rls_policies.sql`
4. ✅ Seed data inicial `003_seed_data.sql`:
   - Roles padrão (VISITANTE, INSCRITO, ADMIN)
   - Permissões básicas
   - Usuário admin inicial

### Fase 3: Backend Core (Dias 2-3)
1. ✅ Implementar autenticação:
   - `/api/auth/register.js`
   - `/api/auth/login.js`
   - `/api/auth/me.js`
2. ✅ Criar middlewares:
   - `authenticate()`
   - `requirePermission()`
   - `sanitize()`
3. ✅ Implementar JWT

### Fase 4: Backend CRUD (Dias 3-5)
1. ✅ Posts:
   - GET `/api/posts` (listar visíveis)
   - GET `/api/posts/[id]` (detalhes)
   - POST `/api/posts` (criar)
   - PUT `/api/posts/[id]` (editar)
   - DELETE `/api/posts/[id]` (deletar)
2. ✅ Courses (mesma estrutura)
3. ✅ Modules, Topics
4. ✅ Comments
5. ✅ Events

### Fase 5: Backend Admin (Dia 5)
1. ✅ `/api/admin/roles` (CRUD roles)
2. ✅ `/api/admin/permissions` (atribuir)
3. ✅ `/api/admin/users` (gerenciar)

### Fase 6: Upload de Imagens (Dia 6)
1. ✅ Criar bucket no Supabase Storage
2. ✅ Configurar políticas públicas
3. ✅ Implementar `/api/upload`
4. ✅ Integrar com Quill

### Fase 7: Frontend (Dias 6-8)
1. ✅ Remover mock data
2. ✅ Criar `ApiContext`
3. ✅ Adaptar todas as páginas
4. ✅ Implementar loading states
5. ✅ Implementar error handling
6. ✅ Criar componentes de permissão

### Fase 8: Admin Interface (Dias 8-9)
1. ✅ Tela de gerenciar roles
2. ✅ Tela de atribuir permissões
3. ✅ Tela de criar posts/cursos
4. ✅ Tela de gerenciar usuários

### Fase 9: Testes e Segurança (Dia 10)
1. ✅ Testar todos os fluxos
2. ✅ Testar permissões
3. ✅ Testar RLS
4. ✅ Testar sanitização
5. ✅ Audit de segurança

### Fase 10: Deploy (Dia 10)
1. ✅ Configurar Vercel
2. ✅ Variáveis de ambiente
3. ✅ Build e deploy
4. ✅ Testes em produção

---

## ✅ Checklist de Segurança {#checklist}

### Backend
- [ ] Todas as senhas com bcrypt (salt rounds >= 10)
- [ ] JWT com secret forte (64+ chars)
- [ ] Todos os inputs sanitizados
- [ ] HTML com DOMPurify
- [ ] Validação de YouTube URLs
- [ ] Rate limiting em todas as rotas
- [ ] CORS configurado corretamente
- [ ] Service Role Key NUNCA exposta no frontend
- [ ] Todas as queries com prepared statements
- [ ] RLS ativado em todas as tabelas

### Frontend
- [ ] Token armazenado de forma segura
- [ ] Sanitização client-side (defesa em profundidade)
- [ ] Validação de formulários
- [ ] HTTPS obrigatório
- [ ] Content Security Policy configurada
- [ ] XSS protection headers
- [ ] Nenhuma lógica crítica no frontend

### Database
- [ ] RLS policies testadas
- [ ] Permissões de roles corretas
- [ ] Backups automáticos configurados
- [ ] Indexes otimizados
- [ ] Foreign keys com ON DELETE CASCADE

---

## 🎯 Próximos Passos Imediatos

1. **Criar arquivo `.env.local`** com credenciais
2. **Instalar dependências** backend
3. **Criar migrations SQL** completas
4. **Implementar autenticação** básica
5. **Testar login/registro** antes de continuar

---

**Status:** 📝 Documento de Arquitetura Completo  
**Próxima Ação:** Criar migrations SQL e começar implementação

