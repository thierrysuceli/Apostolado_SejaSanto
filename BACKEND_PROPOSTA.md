# Proposta de Backend - Apostolado Seja Santo

## 🎯 Objetivo
Backend leve e otimizado para hospedagem na Vercel, com foco em performance e baixo custo.

---

## 🏗️ Arquitetura Recomendada

### **Opção 1: Vercel Serverless Functions + PostgreSQL (Recomendado)**

**Stack:**
- **Backend:** Next.js API Routes (Serverless Functions)
- **ORM:** Prisma (otimizado, type-safe)
- **Database:** Vercel Postgres (Neon ou Supabase free tier)
- **Storage:** Vercel Blob Storage (imagens/arquivos)
- **Auth:** NextAuth.js ou JWT custom

**Vantagens:**
- ✅ Totalmente serverless (zero custo fixo)
- ✅ Escala automaticamente
- ✅ Integração nativa com Vercel
- ✅ Cold start < 200ms
- ✅ 100GB bandwidth grátis/mês

**Custos Estimados (Free Tier):**
- Vercel: Grátis até 100GB bandwidth
- Neon Postgres: 512MB storage grátis
- Vercel Blob: 1GB storage grátis

---

### **Opção 2: API REST Simples (Alternativa mais leve)**

**Stack:**
- **Backend:** Node.js + Express (muito leve)
- **ORM:** Prisma ou TypeORM
- **Database:** MongoDB Atlas (free 512MB)
- **Storage:** Cloudinary (free 25GB)
- **Deploy:** Vercel Serverless

**Vantagens:**
- ✅ Extremamente simples
- ✅ MongoDB = schema flexível
- ✅ Cloudinary = CDN integrado
- ✅ Menos dependências

---

## 📊 Estrutura de Dados Proposta

### **Tabelas Principais:**

```prisma
// schema.prisma

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  password      String   // bcrypt hash
  avatar        String?
  roles         String[] // ['Admin', 'Membro', 'Visitante']
  createdAt     DateTime @default(now())
  
  posts         Post[]
  comments      Comment[]
}

model Post {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  category      String
  content       String   @db.Text // HTML do Quill
  excerpt       String?
  coverImage    String?
  authorId      String
  author        User     @relation(fields: [authorId], references: [id])
  requiredRoles String[]
  published     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  attachments   Attachment[]
  comments      Comment[]
}

model Course {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  description   String
  category      String
  coverImage    String
  rating        Float    @default(5)
  reviews       Int      @default(0)
  requiredRoles String[]
  published     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  modules       Module[]
}

model Module {
  id            String   @id @default(cuid())
  title         String
  order         Int
  courseId      String
  course        Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  topics        Topic[]
}

model Topic {
  id              String   @id @default(cuid())
  title           String
  order           Int
  videoUrl        String?
  contentBefore   String?  @db.Text // HTML do Quill
  contentAfter    String?  @db.Text // HTML do Quill
  duration        String?
  moduleId        String
  module          Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  requiredRoles   String[]
  
  attachments     Attachment[]
  comments        Comment[]
}

model Comment {
  id            String   @id @default(cuid())
  content       String   @db.Text // HTML do Quill
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  postId        String?
  post          Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  topicId       String?
  topic         Topic?   @relation(fields: [topicId], references: [id], onDelete: Cascade)
  parentId      String?
  parent        Comment? @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies       Comment[] @relation("CommentReplies")
  createdAt     DateTime @default(now())
}

model Attachment {
  id            String   @id @default(cuid())
  name          String
  url           String
  type          String   // 'image', 'pdf', 'video', etc
  size          Int      // bytes
  postId        String?
  post          Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  topicId       String?
  topic         Topic?   @relation(fields: [topicId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now())
}

model SiteContent {
  id            String   @id @default(cuid())
  section       String   // 'home', 'footer', 'courses', etc
  key           String   // 'hero.title', 'hero.subtitle', etc
  value         String   @db.Text
  updatedAt     DateTime @updatedAt
  
  @@unique([section, key])
}

model Event {
  id            String   @id @default(cuid())
  title         String
  description   String
  date          DateTime
  time          String
  location      String?
  requiredRoles String[]
  published     Boolean  @default(false)
  createdAt     DateTime @default(now())
}
```

---

## 🔐 Sistema de Autenticação

### **Abordagem Recomendada: JWT**

```javascript
// /api/auth/login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Buscar usuário
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Verificar senha
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Gerar token
  const token = jwt.sign(
    { userId: user.id, email: user.email, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      avatar: user.avatar
    }
  });
}
```

### **Middleware de Autenticação:**

```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';

export function authenticate(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
}

export function requireAdmin(handler) {
  return authenticate(async (req, res) => {
    if (!req.user.roles.includes('Admin')) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    return handler(req, res);
  });
}
```

---

## 📡 Endpoints da API

### **Autenticação**
```
POST   /api/auth/register      - Criar conta
POST   /api/auth/login         - Login
POST   /api/auth/logout        - Logout
GET    /api/auth/me            - Dados do usuário logado
PUT    /api/auth/profile       - Atualizar perfil
```

### **Posts**
```
GET    /api/posts              - Listar posts (com filtros)
GET    /api/posts/:slug        - Detalhes do post
POST   /api/posts              - Criar post (admin)
PUT    /api/posts/:id          - Editar post (admin)
DELETE /api/posts/:id          - Deletar post (admin)
POST   /api/posts/:id/publish  - Publicar/despublicar (admin)
```

### **Cursos**
```
GET    /api/courses            - Listar cursos
GET    /api/courses/:slug      - Detalhes do curso
POST   /api/courses            - Criar curso (admin)
PUT    /api/courses/:id        - Editar curso (admin)
DELETE /api/courses/:id        - Deletar curso (admin)

POST   /api/courses/:id/modules          - Criar módulo (admin)
PUT    /api/modules/:id                  - Editar módulo (admin)
DELETE /api/modules/:id                  - Deletar módulo (admin)

POST   /api/modules/:id/topics           - Criar tópico (admin)
PUT    /api/topics/:id                   - Editar tópico (admin)
DELETE /api/topics/:id                   - Deletar tópico (admin)
```

### **Comentários**
```
GET    /api/comments?postId=X              - Comentários de um post
GET    /api/comments?topicId=X             - Comentários de um tópico
POST   /api/comments                       - Criar comentário (auth)
PUT    /api/comments/:id                   - Editar comentário (own/admin)
DELETE /api/comments/:id                   - Deletar comentário (own/admin)
```

### **Upload**
```
POST   /api/upload/image       - Upload de imagem (admin)
POST   /api/upload/file        - Upload de arquivo (admin)
DELETE /api/upload/:id          - Deletar arquivo (admin)
```

### **Site Content (CMS)**
```
GET    /api/content            - Todo conteúdo do site
GET    /api/content/:section   - Conteúdo de uma seção
PUT    /api/content            - Atualizar conteúdo (admin)
```

### **Eventos**
```
GET    /api/events             - Listar eventos
POST   /api/events             - Criar evento (admin)
PUT    /api/events/:id         - Editar evento (admin)
DELETE /api/events/:id         - Deletar evento (admin)
```

---

## 🚀 Otimizações para Vercel

### **1. Caching Agressivo**
```javascript
// Cache de 1 hora para conteúdo público
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Região mais próxima do Brasil
};

export default async function handler(req) {
  const response = await fetch('...');
  
  return new Response(response.body, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### **2. Incremental Static Regeneration (ISR)**
```javascript
// pages/posts/[slug].js
export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);
  
  return {
    props: { post },
    revalidate: 3600, // Revalida a cada 1 hora
  };
}
```

### **3. Lazy Loading de Módulos**
```javascript
// Carregar Prisma apenas quando necessário
let prisma;
export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}
```

### **4. Compressão de Responses**
```javascript
import zlib from 'zlib';

export default async function handler(req, res) {
  const data = await getData();
  const compressed = zlib.gzipSync(JSON.stringify(data));
  
  res.setHeader('Content-Encoding', 'gzip');
  res.send(compressed);
}
```

---

## 📦 Estrutura de Pastas

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── api/
│   ├── auth/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── me.js
│   ├── posts/
│   │   ├── index.js
│   │   ├── [slug].js
│   │   └── create.js
│   ├── courses/
│   ├── comments/
│   ├── upload/
│   └── content/
├── lib/
│   ├── prisma.js
│   ├── auth.js
│   └── storage.js
├── middleware/
│   ├── auth.js
│   └── validation.js
└── utils/
    ├── slugify.js
    └── sanitize.js
```

---

## 🔧 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db"

# Auth
JWT_SECRET="seu_segredo_super_secreto_aqui"

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_token"

# Email (opcional - SendGrid/Resend)
EMAIL_API_KEY="seu_api_key"
EMAIL_FROM="contato@apostolado.com"

# Site
NEXT_PUBLIC_SITE_URL="https://apostolado.vercel.app"
```

---

## 🎨 Upload de Arquivos (Vercel Blob)

```javascript
// /api/upload/image.js
import { put } from '@vercel/blob';
import { requireAdmin } from '@/middleware/auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const file = req.body; // FormData
  const filename = `${Date.now()}-${file.name}`;
  
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  });

  res.status(200).json({ url: blob.url });
}

export default requireAdmin(handler);
```

---

## 📊 Performance Esperada

### **Cold Start:**
- Primeira requisição: ~200-500ms
- Requisições subsequentes: ~50-100ms

### **Database Queries:**
- Leitura simples: ~10-30ms
- Leitura com joins: ~30-80ms
- Escrita: ~20-50ms

### **Total Response Time:**
- GET endpoints: 100-200ms
- POST endpoints: 150-300ms
- Upload de arquivos: 500-1500ms

---

## 💰 Custos Mensais Estimados

### **Vercel (Free Tier):**
- 100GB bandwidth
- Serverless executions ilimitadas
- **Custo: R$ 0,00**

### **Neon Postgres (Free Tier):**
- 512MB storage
- 100 horas compute/mês
- **Custo: R$ 0,00**

### **Vercel Blob (Free):**
- 1GB storage
- 1GB bandwidth
- **Custo: R$ 0,00**

### **Total Free Tier: R$ 0,00/mês**

### **Após Free Tier (estimativa):**
- 1.000 usuários ativos/mês
- ~10GB storage database
- ~50GB bandwidth
- **Custo estimado: R$ 50-100/mês**

---

## 🚦 Próximos Passos

### **Fase 1: Setup Inicial (1-2 dias)**
1. Criar projeto Next.js
2. Configurar Prisma + Database
3. Setup autenticação JWT
4. Criar endpoints básicos (auth, posts, courses)

### **Fase 2: CRUD Completo (2-3 dias)**
5. Implementar todos os endpoints
6. Adicionar validações (Zod)
7. Middleware de autorização
8. Testes básicos

### **Fase 3: Upload & Storage (1 dia)**
9. Integrar Vercel Blob
10. Upload de imagens
11. Upload de arquivos

### **Fase 4: Otimização (1 dia)**
12. Caching estratégico
13. Compressão de responses
14. Rate limiting
15. Error handling

### **Fase 5: Deploy & Monitoramento (1 dia)**
16. Deploy na Vercel
17. Configurar domínio
18. Monitoramento (Vercel Analytics)
19. Testes de carga

---

## ✅ Checklist de Segurança

- [ ] Senhas com bcrypt (10+ rounds)
- [ ] JWT com expiração (7 dias)
- [ ] Rate limiting (100 req/min)
- [ ] CORS configurado
- [ ] Input validation (Zod)
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (sanitização HTML)
- [ ] HTTPS only
- [ ] Secrets em environment variables
- [ ] Logs de ações admin

---

## 📝 Notas Importantes

1. **Prisma é obrigatório** - ORM mais otimizado para Vercel
2. **Edge Functions** - Usar quando possível (mais rápido)
3. **ISR > SSR** - Menos custo, melhor performance
4. **Vercel Blob** - Melhor opção para storage na Vercel
5. **PostgreSQL > MongoDB** - Relações complexas (cursos/módulos/tópicos)

---

## 🎯 Estimativa de Desenvolvimento

**Total: 7-10 dias de desenvolvimento**

- Backend setup: 2 dias
- Endpoints API: 3 dias
- Upload/Storage: 1 dia
- Otimização: 1 dia
- Deploy/Testes: 1 dia
- Buffer: 2 dias

---

## 📚 Tecnologias Recomendadas

### **Obrigatórias:**
- Next.js 14+ (App Router)
- Prisma ORM
- PostgreSQL (Neon/Supabase)
- JWT authentication
- Vercel Blob Storage

### **Opcionais mas Recomendadas:**
- Zod (validação)
- React Query (frontend)
- SWR (caching frontend)
- SendGrid/Resend (email)
- Sentry (error tracking)

---

Aguardando suas regras de negócio e especificações do banco de dados para ajustar a proposta! 🚀
