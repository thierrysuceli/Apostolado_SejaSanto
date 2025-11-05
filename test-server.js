// Teste básico de Express
import express from 'express';

const app = express();
const PORT = 3002;

app.get('/', (req, res) => {
  console.log('📨 Requisição recebida na raiz');
  res.json({ message: 'Funcionando!' });
});

app.get('/test', (req, res) => {
  console.log('📨 Requisição recebida em /test');
  res.json({ test: 'ok' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor de teste rodando em http://localhost:${PORT}`);
  console.log('📍 Endereço:', server.address());
});

server.on('error', (err) => {
  console.error('❌ Erro no servidor:', err);
});
