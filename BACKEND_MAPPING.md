# Mapeamento Completo: Backend Original → Backend Consolidado

## 📊 Overview
- **Backend Original**: 56 arquivos serverless
- **Backend Consolidado**: 12 arquivos serverless
- **Objetivo**: Mapear todas as funcionalidades e identificar inconsistências

---

## 🗂️ CATEGORIA 1: AUTHENTICATION (3 arquivos)

### 1. `/api/auth/login.js` → `/api/auth-consolidated.js`
- **Método**: POST
- **Função**: Autenticar usuário (email + senha)
- **Retorno**: JWT token + user data
- **Status**: ✅ Consolidado

### 2. `/api/auth/register.js` → `/api/auth-consolidated.js`
- **Método**: POST
- **Função**: Registrar novo usuário
- **Retorno**: User data + JWT
- **Status**: ✅ Consolidado

### 3. `/api/auth/me.js` → `/api/auth-consolidated.js`
- **Método**: GET
- **Função**: Obter dados do usuário logado
- **Retorno**: User com roles e permissions
- **Status**: ✅ Consolidado

---

## 🗂️ CATEGORIA 2: ADMIN - USERS (4 arquivos)

### 4. `/api/admin/users.js` → `/api/admin/users-consolidated.js`
- **Método**: GET, POST
- **Função**: Listar usuários / Criar usuário
- **Query**: Nenhum
- **Status**: ✅ Consolidado

### 5. `/api/admin/users/[id].js` → `/api/admin/users-consolidated.js?id=X`
- **Método**: GET, PUT, DELETE
- **Função**: Obter/Editar/Deletar usuário específico
- **Query**: `?id=X`
- **Status**: ✅ Consolidado

### 6. `/api/admin/users/[id]/roles.js` → `/api/admin/users-consolidated.js?id=X&resource=roles`
- **Método**: GET, PUT
- **Função**: Obter/Atualizar roles de um usuário
- **Query**: `?id=X&resource=roles`
- **Body (PUT)**: `{ roles: [role_id1, role_id2] }` (original) ou `{ role_ids: [...] }` (novo)
- **Status**: ⚠️ **INCOMPATIBILIDADE DETECTADA** - Campo diferente

---

## 🗂️ CATEGORIA 3: ADMIN - ROLES (3 arquivos)

### 7. `/api/admin/roles.js` → `/api/admin/roles-consolidated.js`
- **Método**: GET, POST
- **Função**: Listar roles / Criar role
- **Status**: ✅ Consolidado

### 8. `/api/admin/roles/[id].js` → `/api/admin/roles-consolidated.js?id=X`
- **Método**: GET, PUT, DELETE
- **Função**: Obter/Editar/Deletar role
- **Query**: `?id=X`
- **Status**: ✅ Consolidado

### 9. `/api/admin/permissions.js` → `/api/public-data.js?type=permissions`
- **Método**: GET
- **Função**: Listar todas as permissões
- **Query**: `?type=permissions`
- **Status**: ✅ Consolidado

---

## 🗂️ CATEGORIA 4: COURSES (4 arquivos)

### 10. `/api/courses/index.js` → `/api/content.js?type=courses`
- **Método**: GET
- **Função**: Listar cursos (público)
- **Query**: `?type=courses`
- **Status**: ✅ Consolidado

### 11. `/api/courses/create.js` → `/api/content.js?type=courses` (POST)
- **Método**: POST
- **Função**: Criar novo curso
- **Permissão Original**: `EDIT_COURSE` (hasPermission)
- **Permissão Nova**: `MANAGE_CONTENT` ❌
- **Status**: 🔥 **ERRO CRÍTICO** - Permissão errada

### 12. `/api/courses/[id].js` → `/api/content.js?type=courses&id=X`
- **Método**: GET, PUT, DELETE
- **Função**: Obter/Editar/Deletar curso
- **Permissão Original (PUT)**: `EDIT_COURSE` ou `isAdmin`
- **Permissão Nova**: `MANAGE_CONTENT` ❌
- **Status**: 🔥 **ERRO CRÍTICO** - Permissão errada

### 13. `/api/courses/[id]/tags.js` → ❌ **REMOVIDO** (incorreto)
- **Método**: PUT
- **Função**: Atualizar tags do curso
- **Status**: ⚠️ Removido no consolidado (era endpoint incorreto)

---

## 🗂️ CATEGORIA 5: POSTS (4 arquivos)

### 14. `/api/posts/index.js` → `/api/content.js?type=posts`
- **Método**: GET
- **Função**: Listar posts (público)
- **Status**: ✅ Consolidado

### 15. `/api/posts/create.js` → `/api/content.js?type=posts` (POST)
- **Método**: POST
- **Função**: Criar novo post
- **Permissão Original**: `CREATE_POST` ou `isAdmin`
- **Permissão Nova**: `MANAGE_CONTENT` ❌
- **Status**: 🔥 **ERRO CRÍTICO** - Permissão errada

### 16. `/api/posts/[id].js` → `/api/content.js?type=posts&id=X`
- **Método**: GET, PUT, DELETE
- **Função**: Obter/Editar/Deletar post
- **Permissão Original (PUT)**: `EDIT_POST` ou `isAdmin`
- **Permissão Nova**: `MANAGE_CONTENT` ❌
- **Status**: 🔥 **ERRO CRÍTICO** - Permissão errada

### 17. `/api/posts/[id]/tags.js` → ❌ **REMOVIDO** (incorreto)
- **Método**: PUT
- **Função**: Atualizar tags do post
- **Status**: ⚠️ Removido no consolidado

---

## 🗂️ CATEGORIA 6: EVENTS (2 arquivos)

### 18. `/api/events/index.js` → `/api/content.js?type=events`
- **Método**: GET
- **Função**: Listar eventos (público)
- **Status**: ✅ Consolidado

### 19. `/api/events/[id].js` → `/api/content.js?type=events&id=X`
- **Método**: GET, POST, PUT, DELETE
- **Função**: CRUD de eventos
- **Permissão Original**: `CREATE_EVENT`, `EDIT_EVENT`, `DELETE_EVENT` ou `isAdmin`
- **Permissão Nova**: `MANAGE_EVENTS` ❌
- **Status**: 🔥 **ERRO CRÍTICO** - Permissão errada

---

## 🗂️ CATEGORIA 7: MODULES & TOPICS (4 arquivos)

### 20. `/api/modules/index.js` → `/api/public-data.js?type=modules`
- **Método**: GET, POST
- **Função**: Listar/Criar módulos
- **Status**: ✅ Consolidado

### 21. `/api/modules/[id].js` → `/api/public-data.js?type=modules&id=X`
- **Método**: GET, PUT, DELETE
- **Função**: Obter/Editar/Deletar módulo
- **Status**: ✅ Consolidado (com fix de order_index)

### 22. `/api/topics/index.js` → `/api/public-data.js?type=topics`
- **Método**: GET, POST
- **Função**: Listar/Criar tópicos
- **Status**: ✅ Consolidado (com fix de order_index)

### 23. `/api/topics/[id].js` → `/api/public-data.js?type=topics&id=X`
- **Método**: GET, PUT, DELETE
- **Função**: Obter/Editar/Deletar tópico
- **Status**: ✅ Consolidado

---

## 🗂️ CATEGORIA 8: COMMENTS (2 arquivos)

### 24. `/api/comments/index.js` → `/api/public-data.js?type=comments`
- **Método**: GET, POST
- **Função**: Listar/Criar comentários
- **Status**: ✅ Consolidado

### 25. `/api/comments/[id].js` → `/api/public-data.js?type=comments&id=X`
- **Método**: GET, PUT, DELETE
- **Função**: Obter/Editar/Deletar comentário
- **Status**: ✅ Consolidado

---

## 🗂️ CATEGORIA 9: PUBLIC DATA (3 arquivos)

### 26. `/api/roles.js` → `/api/public-data.js?type=roles`
- **Método**: GET
- **Função**: Listar roles públicas
- **Status**: ✅ Consolidado

### 27. `/api/tags.js` → `/api/public-data.js?type=tags`
- **Método**: GET, POST, PUT, DELETE
- **Função**: CRUD de tags temáticas
- **Status**: ✅ Consolidado

### 28. `/api/event-categories/index.js` → `/api/public-data.js?type=event-categories`
- **Método**: GET, POST, PUT, DELETE
- **Função**: CRUD de categorias de eventos
- **Status**: ✅ Consolidado

---

## 🗂️ CATEGORIA 10: CENTRAL - GROUPS (8 arquivos)

### 29. `/api/central/groups.js` → `/api/central/groups-consolidated.js`
- **Método**: GET
- **Função**: Listar grupos do usuário
- **Verificação de acesso**: Verifica se user tem role_id do grupo
- **Status**: ✅ Consolidado

### 30. `/api/central/groups/create.js` → `/api/central/groups-consolidated.js?action=create`
- **Método**: POST
- **Função**: Criar novo grupo (apenas admin)
- **Query**: `?action=create`
- **Status**: ✅ Consolidado (com logs)

### 31. `/api/central/groups/[groupId]/posts.js` → `/api/central/groups-consolidated.js?id=X&resource=posts`
- **Método**: GET, POST
- **Função**: Listar/Criar posts no grupo
- **Query**: `?id=X&resource=posts`
- **Verificação**: Verifica se user pertence ao grupo **ANTES** de permitir acesso
- **Status**: ⚠️ **POSSÍVEL BUG** - Verificação pode estar falhando

### 32. `/api/central/groups/[groupId]/polls.js` → `/api/central/groups-consolidated.js?id=X&resource=polls`
- **Método**: GET, POST
- **Função**: Listar/Criar enquetes no grupo
- **Query**: `?id=X&resource=polls`
- **Verificação**: Mesma do posts
- **Status**: ⚠️ **POSSÍVEL BUG**

### 33. `/api/central/groups/[groupId]/registrations.js` → `/api/central/groups-consolidated.js?id=X&resource=registrations`
- **Método**: GET, POST
- **Função**: Listar/Criar inscrições no grupo
- **Query**: `?id=X&resource=registrations`
- **Status**: ⚠️ **POSSÍVEL BUG**

### 34. `/api/central/groups/[groupId]/approvals.js` → `/api/central/groups-consolidated.js?id=X&resource=approvals`
- **Método**: GET
- **Função**: Listar aprovações pendentes (apenas admin)
- **Query**: `?id=X&resource=approvals`
- **Status**: ⚠️ **POSSÍVEL BUG** - Admin não reconhecido

### 35. `/api/central/groups/[groupId]/members.js` → `/api/central/groups-consolidated.js?id=X&resource=members`
- **Método**: GET
- **Função**: Listar membros do grupo (apenas admin)
- **Query**: `?id=X&resource=members`
- **Status**: ⚠️ **POSSÍVEL BUG** - Admin não reconhecido

---

## 🗂️ CATEGORIA 11: CENTRAL - POSTS (4 arquivos)

### 36. `/api/central/posts/[id]/pin.js` → `/api/central/posts-actions.js?id=X&action=pin`
- **Método**: PUT
- **Função**: Fixar/Desfixar post
- **Query**: `?id=X&action=pin`
- **Permissão Original**: **Apenas admin** (hasRole ADMIN)
- **Permissão Nova**: Verificação de admin
- **Status**: 🔥 **ERRO CRÍTICO** - "Apenas admins podem editar posts"

### 37. `/api/central/posts/[id]/edit.js` → `/api/central/posts-actions.js?id=X&action=edit`
- **Método**: PUT
- **Função**: Editar post
- **Query**: `?id=X&action=edit`
- **Permissão Original**: **Autor OU Admin**
- **Permissão Nova**: **Apenas Admin** ❌
- **Status**: 🔥 **ERRO CRÍTICO** - Verificação muito restritiva

### 38. `/api/central/posts/[id]/delete.js` → `/api/central/posts-actions.js?id=X&action=delete`
- **Método**: DELETE
- **Função**: Deletar post
- **Query**: `?id=X&action=delete`
- **Permissão Original**: **Autor OU Admin**
- **Status**: ⚠️ Verificar se mantém permissão

### 39. `/api/central/posts/[id]/comments.js` → `/api/central/posts-actions.js?id=X`
- **Método**: GET, POST
- **Função**: Listar/Criar comentários em post
- **Query**: `?id=X` (sem action)
- **Status**: ✅ Consolidado

---

## 🗂️ CATEGORIA 12: CENTRAL - POLLS (4 arquivos)

### 40. `/api/central/polls/[id]/vote.js` → `/api/central/polls-actions.js?id=X&action=vote`
- **Método**: POST
- **Função**: Votar em enquete
- **Query**: `?id=X&action=vote`
- **Verificação Original**: User pertence ao grupo
- **Status**: ✅ Corrigido (commit cb84ffd)

### 41. `/api/central/polls/[id]/edit.js` → `/api/central/polls-actions.js?id=X&action=edit`
- **Método**: PUT
- **Função**: Editar enquete
- **Permissão**: Apenas admin
- **Status**: ⚠️ Verificar verificação de admin

### 42. `/api/central/polls/[id]/delete.js` → `/api/central/polls-actions.js?id=X&action=delete`
- **Método**: DELETE
- **Função**: Deletar enquete
- **Permissão**: Apenas admin
- **Status**: ⚠️ Verificar verificação de admin

### 43. `/api/central/polls/[id]/comments.js` → `/api/central/polls-actions.js?id=X`
- **Método**: GET, POST
- **Função**: Listar/Criar comentários em enquete
- **Query**: `?id=X` (sem action)
- **Status**: ✅ Consolidado

---

## 🗂️ CATEGORIA 13: CENTRAL - REGISTRATIONS (4 arquivos)

### 44. `/api/central/registrations/[id]/subscribe.js` → `/api/central/registrations-actions.js?id=X&action=subscribe`
- **Método**: POST
- **Função**: Se inscrever em uma registration
- **Query**: `?id=X&action=subscribe`
- **Status**: ✅ Consolidado (com logs)

### 45. `/api/central/registrations/[id]/edit.js` → `/api/central/registrations-actions.js?id=X&action=edit`
- **Método**: PUT
- **Função**: Editar registration
- **Permissão**: Apenas admin
- **Status**: ⚠️ Verificar verificação de admin

### 46. `/api/central/registrations/[id]/delete.js` → `/api/central/registrations-actions.js?id=X&action=delete`
- **Método**: DELETE
- **Função**: Deletar registration
- **Permissão**: Apenas admin
- **Status**: ⚠️ Verificar verificação de admin

### 47. `/api/central/registrations/[id]/comments.js` → ❌ **NÃO CONSOLIDADO**
- **Método**: GET, POST
- **Função**: Comentários em registration
- **Status**: 🔥 **FALTANDO** - Não foi consolidado

---

## 🗂️ CATEGORIA 14: CENTRAL - MANAGEMENT (2 arquivos)

### 48. `/api/central/members/[memberId]/remove.js` → `/api/central/management.js?id=X&type=member`
- **Método**: DELETE
- **Função**: Remover membro do grupo
- **Query**: `?id=X&type=member`
- **Permissão**: Apenas admin
- **Status**: ✅ Consolidado

### 49. `/api/central/subscriptions/[id]/approve.js` → `/api/central/management.js?id=X&type=subscription`
- **Método**: PUT
- **Função**: Aprovar inscrição pendente
- **Query**: `?id=X&type=subscription`
- **Permissão**: Apenas admin
- **Status**: ✅ Consolidado

---

## 🔥 ERROS CRÍTICOS IDENTIFICADOS

### 1. **hasPermission() está QUEBRADO** (middleware-api/auth.js)
```javascript
// ❌ QUERY INCORRETA - Não funciona
export async function hasPermission(userId, permissionCode) {
  const { data } = await supabaseAdmin
    .from('users')
    .select(`user_roles!user_roles_user_id_fkey (roles (role_permissions (permissions (code))))`);
  return !!data;
}
```

**Correção já aplicada** (commit cb84ffd):
```javascript
// ✅ QUERY CORRIGIDA
export async function hasPermission(userId, permissionCode) {
  const { data: userRoles } = await supabaseAdmin
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId);
  
  const roleIds = userRoles.map(ur => ur.role_id);
  
  const { data: rolePermissions } = await supabaseAdmin
    .from('role_permissions')
    .select(`permissions!inner (code)`)
    .in('role_id', roleIds)
    .eq('permissions.code', permissionCode.toUpperCase());
  
  return rolePermissions && rolePermissions.length > 0;
}
```

### 2. **Permissões erradas em /api/content.js**
- ❌ Usa: `MANAGE_CONTENT`, `MANAGE_EVENTS`
- ✅ Deve usar: `CREATE_COURSE`, `EDIT_COURSE`, `DELETE_COURSE`, etc.

**Correção já aplicada** (commit d7e3d94)

### 3. **Verificação de admin NO CONSOLIDADO está falhando**

**Problema**: `hasRole(userId, 'ADMIN')` retorna `false` mesmo quando usuário É admin

**Causa provável**: Verificação inline vs verificação via middleware

Vou investigar agora...

---

## 📋 PRÓXIMOS PASSOS

1. ✅ Corrigir hasPermission (JÁ FEITO)
2. ✅ Corrigir permissões em content.js (JÁ FEITO)
3. 🔍 Investigar hasRole falhando para admin
4. 🔍 Investigar verificação de acesso a grupos
5. 🔍 Corrigir permissões em central/posts-actions.js
6. 🔍 Adicionar comentários em registrations (FALTANDO)

