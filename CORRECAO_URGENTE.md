# 🚨 CORREÇÃO URGENTE - Site em Branco

## ❌ Erros Identificados

### 1. **ApiContext não exportado**
```
does not provide an export named 'ApiContext'
```
**Status**: ✅ CORRIGIDO

### 2. **Constraint do banco desatualizada**
```
new row violates check constraint "video_url_youtube"
```
**Status**: ✅ MIGRATION CRIADA

---

## ✅ CORREÇÕES APLICADAS

### 1. Export do ApiContext
**Arquivo**: `src/contexts/ApiContext.jsx`

**Mudança**:
```javascript
// ❌ ANTES
const ApiContext = createContext(null);

// ✅ AGORA
export const ApiContext = createContext(null);
```

### 2. Constraint do Banco de Dados
A constraint antiga só aceitava:
- `youtube.com/watch?v=ABC123`
- `youtu.be/ABC123`

Mas agora salvamos no formato:
- `youtube.com/embed/ABC123`

**Solução**: Nova migração `010_update_youtube_constraint.sql`

---

## 🚀 AÇÕES URGENTES

### 1️⃣ Recarregar Frontend (IMEDIATO)
```powershell
# No terminal do frontend, pressione Ctrl+C
# Depois execute:
npm run dev
```

### 2️⃣ Atualizar Constraint do Banco (OBRIGATÓRIO)
Execute no Supabase SQL Editor:
```sql
-- Abra e execute: migrations/010_update_youtube_constraint.sql
```

### 3️⃣ Limpar URLs Existentes (RECOMENDADO)
Se o script acima mostrar URLs inválidas, execute:
```sql
-- Abra e execute: migrations/009_clean_video_urls.sql
```

---

## 🧪 TESTE RÁPIDO

Após aplicar as correções:

1. ✅ Frontend deve carregar (não mais em branco)
2. ✅ Pode acessar `/admin/users`
3. ✅ Pode acessar `/admin/roles`
4. ✅ Pode criar/editar tópicos com vídeos

---

## 📋 ORDEM DE EXECUÇÃO

### Backend (Banco de Dados)
1. Execute `migrations/010_update_youtube_constraint.sql` ← **OBRIGATÓRIO**
2. Execute `migrations/009_clean_video_urls.sql` ← Se houver URLs inválidas

### Frontend
1. Pressione `Ctrl+C` no terminal
2. Execute `npm run dev`
3. Acesse `http://localhost:5173`

---

## 🔍 VERIFICAÇÃO

### Frontend OK?
```
✅ Site carrega (não mais em branco)
✅ Console sem erros de import
✅ Páginas Admin funcionam
```

### Banco OK?
```sql
-- Teste se constraint está correta
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'video_url_youtube';
```

Deve retornar algo como:
```
video_url ~* '^https?://(www\.)?youtube\.com/embed/...'
```

---

## ⚠️ POR QUE ISSO ACONTECEU?

### Problema 1: ApiContext
O `ApiContext` não estava sendo **exportado** do arquivo, apenas o `ApiProvider` e o hook `useApi`. As páginas AdminUsers e AdminRoles precisam importar o contexto diretamente para usar `useContext(ApiContext)`.

### Problema 2: Constraint
A migração inicial (`001_initial_schema.sql`) criou a constraint aceitando apenas formatos `watch?v=` e `youtu.be/`. Mas implementamos conversão automática para `embed/`, que é o formato correto para iframes. A constraint precisa ser atualizada.

---

## 📄 RESUMO

| Problema | Arquivo | Ação | Status |
|----------|---------|------|--------|
| Export faltando | ApiContext.jsx | Adicionado `export` | ✅ |
| Constraint antiga | Banco de Dados | Migration 010 | ✅ Criada |
| Frontend em branco | - | Recarregar | 🔄 Pendente |

---

**Execute a migration 010 e recarregue o frontend!** 🚀
