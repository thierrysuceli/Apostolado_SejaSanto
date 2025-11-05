// =====================================================
// SERVIDOR DE DESENVOLVIMENTO LOCAL
// =====================================================
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Wrapper para adaptar as serverless functions do Vercel para Express
const handler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error('❌ Erro na API:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

// AUTH
app.post('/api/auth/register', handler(require('./api/auth/register')));
app.post('/api/auth/login', handler(require('./api/auth/login')));
app.get('/api/auth/me', handler(require('./api/auth/me')));

// POSTS
app.get('/api/posts', handler(require('./api/posts/index')));
app.post('/api/posts/create', handler(require('./api/posts/create')));
app.get('/api/posts/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/posts/[id]'))(req, res);
});
app.put('/api/posts/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/posts/[id]'))(req, res);
});
app.delete('/api/posts/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/posts/[id]'))(req, res);
});

// COURSES
app.get('/api/courses', handler(require('./api/courses/index')));
app.get('/api/courses/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/courses/[id]'))(req, res);
});
app.put('/api/courses/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/courses/[id]'))(req, res);
});
app.delete('/api/courses/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/courses/[id]'))(req, res);
});

// TOPICS
app.get('/api/topics/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/topics/[id]'))(req, res);
});
app.put('/api/topics/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/topics/[id]'))(req, res);
});

// COMMENTS
app.get('/api/comments', handler(require('./api/comments/index')));
app.post('/api/comments', handler(require('./api/comments/index')));
app.put('/api/comments/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/comments/[id]'))(req, res);
});
app.delete('/api/comments/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/comments/[id]'))(req, res);
});

// EVENTS
app.get('/api/events', handler(require('./api/events/index')));
app.post('/api/events', handler(require('./api/events/index')));
app.get('/api/events/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/events/[id]'))(req, res);
});
app.put('/api/events/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/events/[id]'))(req, res);
});
app.delete('/api/events/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/events/[id]'))(req, res);
});

// ADMIN
app.get('/api/admin/roles', handler(require('./api/admin/roles')));
app.post('/api/admin/roles', handler(require('./api/admin/roles')));
app.get('/api/admin/permissions', handler(require('./api/admin/permissions')));
app.get('/api/admin/users', handler(require('./api/admin/users')));
app.put('/api/admin/users/:id/roles', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/admin/users/[id]/roles'))(req, res);
});

// MODULES
app.post('/api/modules', handler(require('./api/modules/index')));
app.put('/api/modules/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/modules/[id]'))(req, res);
});
app.delete('/api/modules/:id', (req, res) => {
  req.query.id = req.params.id;
  handler(require('./api/modules/[id]'))(req, res);
});

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ================================');
  console.log('🚀 Backend rodando em:');
  console.log(`🚀 http://localhost:${PORT}`);
  console.log('🚀 ================================');
  console.log('');
});
