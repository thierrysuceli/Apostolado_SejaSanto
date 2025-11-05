# 🚀 Guia de Execução - Migrations Supabase

## 📋 Passo a Passo

### 1️⃣ **Acessar o Supabase Dashboard**

1. Vá para: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione seu projeto (ou crie um novo)

---

### 2️⃣ **Abrir o SQL Editor**

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**

---

### 3️⃣ **Executar Migration 001 - Schema Inicial**

1. Abra o arquivo: `supabase/migrations/001_initial_schema.sql`
2. **Copie TODO o conteúdo** do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. **Aguarde** a execução (pode levar 10-20 segundos)
6. Verifique se apareceu **"Success. No rows returned"** ou mensagem similar

**O que essa migration faz:**
- ✅ Cria 14 tabelas (users, roles, permissions, posts, courses, modules, topics, events, comments, etc.)
- ✅ Cria indexes para performance
- ✅ Cria triggers para atualizar `updated_at` automaticamente
- ✅ Cria views úteis (`users_with_roles`, `roles_with_permissions`)
- ✅ Cria functions (`user_has_permission`, `user_has_role`, `get_user_role_ids`)

---

### 4️⃣ **Executar Migration 002 - Row Level Security**

1. **Nova Query** no SQL Editor
2. Abra o arquivo: `supabase/migrations/002_rls_policies.sql`
3. **Copie TODO o conteúdo**
4. Cole no SQL Editor
5. Clique em **Run**
6. **Aguarde** (pode levar 20-30 segundos)
7. Verifique sucesso

**O que essa migration faz:**
- ✅ Habilita RLS em todas as tabelas
- ✅ Cria 50+ políticas de segurança
- ✅ Garante que usuários só veem conteúdo permitido
- ✅ Admin tem acesso total, Inscrito tem acesso limitado, Visitante tem acesso público

---

### 5️⃣ **Executar Migration 003 - Seed Data**

1. **Nova Query** no SQL Editor
2. Abra o arquivo: `supabase/migrations/003_seed_data.sql`
3. **Copie TODO o conteúdo**
4. Cole no SQL Editor
5. Clique em **Run**
6. **Aguarde** (pode levar 10-15 segundos)
7. Verifique sucesso

**O que essa migration faz:**
- ✅ Insere 23 permissões do sistema
- ✅ Cria 3 roles padrão (VISITANTE, INSCRITO, ADMIN)
- ✅ Associa permissões aos roles
- ✅ Cria usuário admin inicial:
  - **Email:** `admin@apostolado.com`
  - **Senha:** `Admin@123`
  - **⚠️ ALTERAR SENHA APÓS PRIMEIRO LOGIN!**
- ✅ Insere dados de exemplo (2 posts, 1 curso, 1 evento)

---

### 6️⃣ **Verificar se Tudo Funcionou**

Execute essas queries no SQL Editor para testar:

#### **Ver todas as tabelas criadas:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Resultado esperado:** 14 tabelas listadas

#### **Ver roles criados:**
```sql
SELECT * FROM roles;
```

**Resultado esperado:** 3 roles (VISITANTE, INSCRITO, ADMIN)

#### **Ver permissões criadas:**
```sql
SELECT * FROM permissions ORDER BY category, code;
```

**Resultado esperado:** 23 permissões

#### **Ver usuário admin:**
```sql
SELECT * FROM users_with_roles WHERE email = 'admin@apostolado.com';
```

**Resultado esperado:** 1 usuário com role ADMIN

#### **Ver posts de exemplo:**
```sql
SELECT id, title, slug, status FROM posts;
```

**Resultado esperado:** 2 posts publicados

#### **Testar função de permissão:**
```sql
SELECT user_has_permission(
  (SELECT id FROM users WHERE email = 'admin@apostolado.com'),
  'CREATE_POST'
);
```

**Resultado esperado:** `true`

---

### 7️⃣ **Configurar Supabase Storage (para uploads de imagens)**

1. No menu lateral, clique em **Storage**
2. Clique em **New Bucket**
3. Configure:
   - **Name:** `images`
   - **Public:** ✅ Marcado (para URLs públicas)
4. Clique em **Create Bucket**
5. Acesse o bucket `images`
6. Clique em **Policies** (ícone de cadeado)
7. Crie política de upload:

```sql
-- Política para upload (apenas autenticados)
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Política para visualização (público)
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Política para deletar (apenas próprios uploads ou admin)
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

### 8️⃣ **Obter Service Role Key (para backend)**

1. No menu lateral, clique em **Settings** (⚙️)
2. Clique em **API**
3. Na seção **Project API keys**, copie:
   - ✅ **URL:** `https://aywgkvyabjcnnmiwihim.supabase.co` (você já tem)
   - ✅ **anon public:** `eyJhbGc...` (você já tem)
   - ✅ **service_role:** (copie a chave **service_role** - **NUNCA exponha no frontend!**)

---

## ✅ Checklist de Verificação

Marque após executar cada etapa:

- [ ] Migration 001 executada com sucesso
- [ ] Migration 002 executada com sucesso
- [ ] Migration 003 executada com sucesso
- [ ] 14 tabelas criadas
- [ ] 3 roles criados (VISITANTE, INSCRITO, ADMIN)
- [ ] 23 permissões criadas
- [ ] Usuário admin criado (`admin@apostolado.com`)
- [ ] RLS habilitado em todas as tabelas
- [ ] Bucket `images` criado no Storage
- [ ] Políticas de Storage configuradas
- [ ] Service Role Key copiada

---

## 🔐 Credenciais do Sistema

### **Supabase**
```
URL: https://aywgkvyabjcnnmiwihim.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5d2drdnlhYmpjbm5taXdpaGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzMxNDMsImV4cCI6MjA3NzYwOTE0M30.bGaAo5tCkEPxvXVe8Atdnj6TZjG09FUw5Vp2XQVUWfA
Service Role: [copiar do dashboard]
```

### **Admin Inicial**
```
Email: admin@apostolado.com
Senha: Admin@123
⚠️ ALTERAR SENHA APÓS PRIMEIRO LOGIN!
```

---

## 🐛 Troubleshooting

### **Erro: "relation already exists"**
- Você já executou essa migration antes
- Para reexecutar: delete as tabelas e rode novamente
- Ou use `DROP TABLE IF EXISTS [nome] CASCADE;` antes

### **Erro: "permission denied"**
- Verifique se você está usando o projeto correto
- Certifique-se de ter permissões de admin no projeto

### **Erro: "syntax error"**
- Verifique se copiou TODO o conteúdo do arquivo
- Não edite o SQL manualmente

### **Dados de exemplo não aparecem**
- Normal se você comentou a seção de exemplo no `003_seed_data.sql`
- Para inserir, execute o bloco `DO $$` novamente

---

## 📝 Próximos Passos

Após executar as migrations com sucesso:

1. ✅ Criar arquivo `.env.local` no projeto
2. ✅ Instalar dependências do backend
3. ✅ Implementar API Routes
4. ✅ Conectar frontend ao backend

---

**Status:** 🟢 Pronto para executar  
**Tempo estimado:** 5-10 minutos  
**Dificuldade:** Fácil (copiar e colar)
