// =====================================================
// SERVIDOR DE DESENVOLVIMENTO LOCAL - ES MODULES
// =====================================================
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config({ path: '.env.local' });

const app = express();
const PORT = 3002;

// CORS configurado para desenvolvimento
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Helper para carregar handlers
const loadHandler = async (path) => {
  const module = await import(path);
  return module.default;
};

// Wrapper de erro
const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error(`\n❌ ERRO ${req.method} ${req.path}:`, error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Adapter: Workaround para req.query read-only
// Adiciona uma propriedade _merged que handlers podem usar
const withId = (fn) => asyncHandler(async (req, res) => {
  // Guardar os params em um local acessível
  req._expressParams = req.params;
  await fn(req, res);
});

// ============ AUTH ============
app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/auth/register.js');
  await handler(req, res);
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/auth/login.js');
  await handler(req, res);
}));

app.get('/api/auth/me', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/auth/me.js');
  await handler(req, res);
}));

// ============ POSTS ============
app.get('/api/posts', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/posts/index.js');
  await handler(req, res);
}));

app.post('/api/posts/create', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/posts/create.js');
  await handler(req, res);
}));

app.get('/api/posts/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/posts/[id].js');
  await handler(req, res);
}));

app.post('/api/posts/:id/tags', withId(async (req, res) => {
  const handler = await loadHandler('./api/posts/[id]/tags.js');
  await handler(req, res);
}));

app.put('/api/posts/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/posts/[id].js');
  await handler(req, res);
}));

app.delete('/api/posts/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/posts/[id].js');
  await handler(req, res);
}));

// ============ COURSES ============
app.get('/api/courses', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/courses/index.js');
  await handler(req, res);
}));

app.post('/api/courses/create', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/courses/create.js');
  await handler(req, res);
}));

app.get('/api/courses/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/courses/[id].js');
  await handler(req, res);
}));

app.post('/api/courses/:id/tags', withId(async (req, res) => {
  const handler = await loadHandler('./api/courses/[id]/tags.js');
  await handler(req, res);
}));

app.put('/api/courses/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/courses/[id].js');
  await handler(req, res);
}));

app.delete('/api/courses/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/courses/[id].js');
  await handler(req, res);
}));

// ============ TOPICS ============
app.post('/api/topics', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/topics/index.js');
  await handler(req, res);
}));

app.get('/api/topics/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/topics/[id].js');
  await handler(req, res);
}));

app.put('/api/topics/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/topics/[id].js');
  await handler(req, res);
}));

app.delete('/api/topics/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/topics/[id].js');
  await handler(req, res);
}));

// ============ COMMENTS ============
app.get('/api/comments', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/comments/index.js');
  await handler(req, res);
}));

app.post('/api/comments', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/comments/index.js');
  await handler(req, res);
}));

app.put('/api/comments/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/comments/[id].js');
  await handler(req, res);
}));

app.delete('/api/comments/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/comments/[id].js');
  await handler(req, res);
}));

// ============ EVENTS ============
app.get('/api/events', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/events/index.js');
  await handler(req, res);
}));

app.post('/api/events', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/events/index.js');
  await handler(req, res);
}));

app.get('/api/events/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/events/[id].js');
  await handler(req, res);
}));

app.put('/api/events/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/events/[id].js');
  await handler(req, res);
}));

app.delete('/api/events/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/events/[id].js');
  await handler(req, res);
}));

// ============ ROLES (PÚBLICAS) ============
app.get('/api/roles', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/roles.js');
  await handler(req, res);
}));

// ============ TAGS (THEMATIC) ============
app.get('/api/tags', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/tags.js');
  await handler(req, res);
}));

app.post('/api/tags', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/tags.js');
  await handler(req, res);
}));

app.put('/api/tags/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/tags.js');
  await handler(req, res);
}));

app.delete('/api/tags/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/tags.js');
  await handler(req, res);
}));

// ============ EVENT CATEGORIES ============
app.get('/api/event-categories', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/event-categories/index.js');
  await handler(req, res);
}));

app.post('/api/event-categories', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/event-categories/index.js');
  await handler(req, res);
}));

// ============ ADMIN ============
app.get('/api/admin/roles', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/admin/roles.js');
  await handler(req, res);
}));

app.post('/api/admin/roles', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/admin/roles.js');
  await handler(req, res);
}));

app.put('/api/admin/roles/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/admin/roles.js');
  await handler(req, res);
}));

app.delete('/api/admin/roles/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/admin/roles.js');
  await handler(req, res);
}));

app.get('/api/admin/permissions', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/admin/permissions.js');
  await handler(req, res);
}));

app.get('/api/admin/users', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/admin/users.js');
  await handler(req, res);
}));

app.post('/api/admin/users', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/admin/users.js');
  await handler(req, res);
}));

app.put('/api/admin/users/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/admin/users/[id].js');
  await handler(req, res);
}));

app.delete('/api/admin/users/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/admin/users/[id].js');
  await handler(req, res);
}));

app.put('/api/admin/users/:id/roles', withId(async (req, res) => {
  const handler = await loadHandler('./api/admin/users/[id]/roles.js');
  await handler(req, res);
}));

// ============ MODULES ============
app.post('/api/modules', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/modules/index.js');
  await handler(req, res);
}));

app.put('/api/modules/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/modules/[id].js');
  await handler(req, res);
}));

app.delete('/api/modules/:id', withId(async (req, res) => {
  const handler = await loadHandler('./api/modules/[id].js');
  await handler(req, res);
}));

// ============ CENTRAL ============

// Groups
app.get('/api/central/groups', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/central/groups.js');
  await handler(req, res);
}));

app.post('/api/central/groups/create', asyncHandler(async (req, res) => {
  const handler = await loadHandler('./api/central/groups/create.js');
  await handler(req, res);
}));

// Posts
app.get('/api/central/groups/:groupId/posts', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/groups/[groupId]/posts.js');
  await handler(req, res);
}));

app.post('/api/central/groups/:groupId/posts', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/groups/[groupId]/posts.js');
  await handler(req, res);
}));

app.put('/api/central/posts/:id/pin', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/posts/[id]/pin.js');
  await handler(req, res);
}));

app.delete('/api/central/posts/:id/delete', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/posts/[id]/delete.js');
  await handler(req, res);
}));

app.put('/api/central/posts/:id/edit', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/posts/[id]/edit.js');
  await handler(req, res);
}));

app.get('/api/central/posts/:id/comments', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/posts/[id]/comments.js');
  await handler(req, res);
}));

app.post('/api/central/posts/:id/comments', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/posts/[id]/comments.js');
  await handler(req, res);
}));

// Polls
app.get('/api/central/groups/:groupId/polls', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/groups/[groupId]/polls.js');
  await handler(req, res);
}));

app.post('/api/central/groups/:groupId/polls', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/groups/[groupId]/polls.js');
  await handler(req, res);
}));

app.post('/api/central/polls/:id/vote', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/polls/[id]/vote.js');
  await handler(req, res);
}));

app.delete('/api/central/polls/:id/delete', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/polls/[id]/delete.js');
  await handler(req, res);
}));

app.put('/api/central/polls/:id/edit', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/polls/[id]/edit.js');
  await handler(req, res);
}));

app.get('/api/central/polls/:id/comments', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/polls/[id]/comments.js');
  await handler(req, res);
}));

app.post('/api/central/polls/:id/comments', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/polls/[id]/comments.js');
  await handler(req, res);
}));

// Registrations
app.get('/api/central/groups/:groupId/registrations', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/groups/[groupId]/registrations.js');
  await handler(req, res);
}));

app.post('/api/central/groups/:groupId/registrations', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/groups/[groupId]/registrations.js');
  await handler(req, res);
}));

app.get('/api/central/groups/:groupId/approvals', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/groups/[groupId]/approvals.js');
  await handler(req, res);
}));

app.get('/api/central/groups/:groupId/members', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/groups/[groupId]/members.js');
  await handler(req, res);
}));

app.delete('/api/central/members/:memberId/remove', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/members/[memberId]/remove.js');
  await handler(req, res);
}));

app.post('/api/central/registrations/:id/subscribe', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/registrations/[id]/subscribe.js');
  await handler(req, res);
}));

app.delete('/api/central/registrations/:id/delete', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/registrations/[id]/delete.js');
  await handler(req, res);
}));

app.put('/api/central/registrations/:id/edit', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/registrations/[id]/edit.js');
  await handler(req, res);
}));

app.put('/api/central/subscriptions/:id/approve', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/subscriptions/[id]/approve.js');
  await handler(req, res);
}));

app.get('/api/central/registrations/:id/comments', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/registrations/[id]/comments.js');
  await handler(req, res);
}));

app.post('/api/central/registrations/:id/comments', withId(async (req, res) => {
  const handler = await loadHandler('./api/central/registrations/[id]/comments.js');
  await handler(req, res);
}));

// Iniciar servidor
app.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('🚀 ================================');
  console.log('🚀 Backend API rodando em:');
  console.log(`🚀 http://localhost:${PORT}`);
  console.log('🚀 ================================');
  console.log('');
}).on('error', (err) => {
  console.error('❌ Erro ao iniciar servidor:', err.message);
  process.exit(1);
});
