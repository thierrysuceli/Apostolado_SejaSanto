# 🚀 Deploy Apostolado Seja Santo na Vercel

## 📋 Pré-requisitos

- ✅ Conta no GitHub (usuário: thierrysuceli)
- ✅ Conta na Vercel Hobby Plan
- ✅ Repositório: https://github.com/thierrysuceli/Apostolado_SejaSanto
- ✅ Supabase configurado

---

## 🎯 Arquitetura do Deploy

### Frontend (React + Vite)
- Build automático pela Vercel
- Output: [`dist/`](dist/ )
- Framework: Vite (detectado automaticamente)

### Backend (Serverless Functions)
- Rotas em [`/api/*`](/api/* ) convertidas para Serverless Functions
- Cada arquivo `.js` em [`api/`](api/ ) vira uma function
- Suporta rotas dinâmicas: `[id].js`

### Desenvolvimento Local
- ✅ Servidor Express mantido em `server-local-backup.js`
- ✅ Não afeta o deploy (ignorado pelo `.vercelignore`)
- ✅ Continue usando: `npm run backend` e `npm run dev`

---

## 📝 Passo a Passo - Deploy via GitHub

### 1️⃣ Configurar Git (se necessário)

```bash
# Verificar se está no repositório correto
git remote -v

# Deve mostrar:
# origin  https://github.com/thierrysuceli/Apostolado_SejaSanto.git
```

### 2️⃣ Commit e Push das Mudanças

```bash
# Adicionar todos os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "🚀 Setup Vercel: serverless functions + production config"

# Push para o GitHub
git push origin main
```

### 3️⃣ Conectar Vercel ao GitHub

1. Acesse: https://vercel.com/login
2. Login com GitHub (thierrysuceli)
3. Clique em "Add New..." > "Project"
4. Procure: **Apostolado_SejaSanto**
5. Clique em "Import"

### 4️⃣ Configurar Environment Variables

**CRÍTICO:** Antes de fazer o deploy, configure as variáveis de ambiente:

Na tela de import do projeto, clique em "Environment Variables" e adicione:

#### Backend (Serverless Functions):
```
SUPABASE_URL=https://sua-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

#### Frontend (Vite):
```
VITE_SUPABASE_URL=https://sua-url.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

**💡 Dica:** Copie os valores de [``.env.local``](.env.local ) (NÃO commit esse arquivo!)

### 5️⃣ Configurações do Build

A Vercel detecta automaticamente, mas confirme:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 6️⃣ Deploy!

1. Clique em "Deploy"
2. Aguarde o build (~2-3 minutos)
3. ✅ Deploy concluído!

---

## 🔍 Verificar Deploy

Após o deploy, a Vercel fornecerá uma URL:
```
https://apostolado-seja-santo.vercel.app
```

### Testar Funcionalidades:

1. **Frontend:**
   - ✅ Página inicial carrega
   - ✅ Navegação funciona
   - ✅ Dark mode alterna

2. **API:**
   - ✅ Login funciona
   - ✅ Registro funciona
   - ✅ Central carrega grupos
   - ✅ Posts/Enquetes/Inscrições funcionam

3. **Admin:**
   - ✅ Painel admin acessível
   - ✅ CRUD de usuários
   - ✅ Gerenciamento de roles

---

## 🐛 Troubleshooting

### Erro: "Função não encontrada"
**Causa:** Environment variables não configuradas

**Solução:**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto
3. Settings > Environment Variables
4. Adicione todas as variáveis listadas acima
5. Redeploy: Deployments > Latest > ... > Redeploy

### Erro: "CORS"
**Causa:** Headers CORS não configurados

**Solução:** Já configurado em [`vercel.json`](vercel.json ). Se persistir:
1. Verifique se o [`vercel.json`](vercel.json ) foi commitado
2. Faça redeploy

### Erro: "Cannot find module"
**Causa:** Imports não resolvidos em produção

**Solução:**
1. Verifique se todos os imports usam extensão `.js`
2. Confirme que `type: "module"` está em [`package.json`](package.json )

### API retorna 404
**Causa:** Rota não exporta `default function`

**Solução:**
Todas as rotas em [`api/`](api/ ) devem ter:
```javascript
export default async function handler(req, res) {
  // ...
}
```

---

## 🔄 Deployments Automáticos (CI/CD)

Após a conexão com GitHub, **cada push** na branch `main` triggera deploy automático!

```bash
# Fluxo de trabalho:
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Vercel detecta push e faz deploy automaticamente ✨
```

### Branches de Preview

Pushes em outras branches criam **preview deployments**:

```bash
# Criar branch de feature
git checkout -b feature/nova-funcionalidade

# ... fazer mudanças ...

git push origin feature/nova-funcionalidade

# Vercel cria URL de preview única!
```

---

## 📊 Monitoramento

### Dashboard da Vercel

Acesse: https://vercel.com/dashboard

**Métricas disponíveis:**
- ✅ Tempo de build
- ✅ Tempo de resposta das functions
- ✅ Uso de bandwidth
- ✅ Logs de erros

### Logs em Tempo Real

1. Acesse o projeto na Vercel
2. Clique em "Functions"
3. Selecione uma function
4. Veja logs em tempo real

### Alertas

Configure em: Settings > Notifications
- ✅ Deploy failures
- ✅ Function errors
- ✅ Performance issues

---

## 🔐 Segurança

### Environment Variables

- ✅ **NUNCA** commite `.env.local` ou `.env.production`
- ✅ Use apenas o dashboard da Vercel para configurar
- ✅ Revogue e regenere keys se expostas

### Supabase RLS

- ✅ Row Level Security ativado em todas as tabelas
- ✅ Policies configuradas corretamente
- ✅ Service Role Key protegida (backend only)

---

## 💰 Custos (Hobby Plan)

**Incluído:**
- ✅ Deploy ilimitados
- ✅ 100GB bandwidth/mês
- ✅ Serverless Functions: 100 GB-hours/mês
- ✅ Build time: 6,000 minutos/mês
- ✅ Domínio custom (1)

**Monitorar:**
- Uso de functions (cold starts consomem mais)
- Bandwidth (imagens devem estar otimizadas)

---

## 🎉 Próximos Passos

1. ✅ **Domínio Custom**
   - Settings > Domains > Add
   - Configure DNS (A record ou CNAME)

2. ✅ **Analytics**
   - Settings > Analytics > Enable
   - Monitore visitas e performance

3. ✅ **Edge Functions** (Opcional)
   - Converter functions críticas para Edge
   - Latência ultra-baixa global

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Supabase + Vercel](https://supabase.com/docs/guides/getting-started/tutorials/with-vercel)

---

## 🆘 Suporte

**Problemas?**
- Vercel Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

**Documentação do Projeto:**
- README principal: [`README.md`](README.md )
- Instruções locais: [`server-local-backup.js`](server-local-backup.js ) (comentários)

---

✨ **Feito com ❤️ para Apostolado Seja Santo**
