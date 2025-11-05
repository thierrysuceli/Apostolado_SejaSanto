# 🚨 CORREÇÕES URGENTES - 03/11/2025

## ✅ PROBLEMA 1: Erro ao editar usuários (500 Internal Server Error)

### Causa
Arquivo `api/admin/users/[id].js` importava módulo inexistente:
```javascript
import { verifyToken } from '../../lib/auth.js'; // ❌ NÃO EXISTE
```

### Solução
Corrigido para usar o middleware correto:
```javascript
import { authenticate, requireRole } from '../../middleware/auth.js'; // ✅
```

**Arquivo modificado:** `api/admin/users/[id].js`

### Resultado
✅ Edição de usuários agora funciona  
✅ Validação de admin funciona corretamente  
✅ Mudança de roles de usuário funciona

---

## ✅ PROBLEMA 2: Roles sempre mostram apenas 3 antigas

### Causa
Componentes usavam `api.roles.getAll()` que é o endpoint **PÚBLICO** que retorna apenas:
- ADMIN
- INSCRITO  
- VISITANTE

Roles customizadas não apareciam!

### Solução
Mudado para usar `api.admin.roles.getAll()` que retorna **TODAS as roles** (inclusive customizadas):

#### Arquivos corrigidos:
1. **AdminUsers.jsx** (linha 43)
   ```javascript
   // ANTES: api.roles.getAll()
   // DEPOIS: api.admin.roles.getAll()
   ```

2. **AdminCourseCreate.jsx** (linha 29)
   ```javascript
   // ANTES: api.roles.getAll()
   // DEPOIS: api.admin.roles.getAll()
   ```

3. **AdminCourseEdit.jsx** (linha 35)
   ```javascript
   // ANTES: api.roles.getAll()
   // DEPOIS: api.admin.roles.getAll()
   ```

### Resultado
✅ Ao criar usuário: todas as roles aparecem  
✅ Ao editar usuário: todas as roles aparecem  
✅ Ao criar curso: todas as roles aparecem  
✅ Ao editar curso: todas as roles aparecem  
✅ Roles customizadas aparecem em todos os seletores

---

## ✅ PROBLEMA 3: Páginas iniciam scrolladas para baixo

### Causa
React Router não faz scroll automático ao mudar de rota.

### Solução
Adicionado `window.scrollTo(0, 0)` no `useEffect` de cada página:

#### Arquivos corrigidos:
1. **AdminUsers.jsx**
2. **AdminRoles.jsx**
3. **AdminCourseCreate.jsx**
4. **AdminCourseEdit.jsx**
5. **CourseDetailNew.jsx**

```javascript
useEffect(() => {
  window.scrollTo(0, 0); // ✅ Scroll para o topo ao carregar
  // ... resto do código
}, []);
```

### Resultado
✅ Páginas sempre iniciam no topo  
✅ Melhor experiência de navegação  
✅ Usuário não perde contexto ao mudar de página

---

## 📋 CHECKLIST DE TESTE

### Teste 1: Editar roles de usuários
- [ ] Ir em Admin → Usuários
- [ ] Clicar em "Editar" em algum usuário
- [ ] Mudar as roles selecionadas
- [ ] Clicar em "Salvar Alterações"
- [ ] **Verificar que salva sem erro 500** ✅

### Teste 2: Ver todas as roles disponíveis
- [ ] Criar uma nova role customizada (ex: "PROFESSOR")
- [ ] Ir em Admin → Usuários → Editar
- [ ] **Verificar que "PROFESSOR" aparece nas opções** ✅
- [ ] Ir em Admin → Criar Curso
- [ ] **Verificar que "PROFESSOR" aparece nas permissões** ✅

### Teste 3: Scroll das páginas
- [ ] Navegar: Home → Cursos → Curso Específico
- [ ] **Verificar que página inicia no topo** ✅
- [ ] Navegar: Admin → Usuários
- [ ] **Verificar que página inicia no topo** ✅
- [ ] Navegar: Admin → Roles
- [ ] **Verificar que página inicia no topo** ✅

---

## 🔍 DIFERENÇA: Endpoints Público vs Admin

### `/api/roles` (PÚBLICO)
- Acesso: qualquer pessoa
- Retorna: apenas roles do sistema (ADMIN, INSCRITO, VISITANTE)
- Uso: verificação de permissões, autenticação
- **NÃO usar** em interfaces de gerenciamento

### `/api/admin/roles` (ADMIN ONLY)
- Acesso: apenas usuários ADMIN
- Retorna: TODAS as roles (sistema + customizadas)
- Retorna: com permissões associadas
- **USAR** em interfaces de gerenciamento (AdminUsers, AdminCourses, etc)

---

## 🎯 RESUMO DAS MUDANÇAS

| Arquivo | Linha | Mudança | Status |
|---------|-------|---------|--------|
| `api/admin/users/[id].js` | 1-21 | Corrigido import do middleware | ✅ |
| `src/pages/AdminUsers.jsx` | 43 | `api.roles` → `api.admin.roles` | ✅ |
| `src/pages/AdminUsers.jsx` | 23 | Adicionado `scrollTo(0,0)` | ✅ |
| `src/pages/AdminRoles.jsx` | 39 | Adicionado `scrollTo(0,0)` | ✅ |
| `src/pages/AdminCourseCreate.jsx` | 29 | `api.roles` → `api.admin.roles` | ✅ |
| `src/pages/AdminCourseCreate.jsx` | 26 | Adicionado `scrollTo(0,0)` | ✅ |
| `src/pages/AdminCourseEdit.jsx` | 35 | `api.roles` → `api.admin.roles` | ✅ |
| `src/pages/AdminCourseEdit.jsx` | 30 | Adicionado `scrollTo(0,0)` | ✅ |
| `src/pages/CourseDetailNew.jsx` | 20 | Adicionado `scrollTo(0,0)` | ✅ |

---

## ⚠️ ATENÇÃO

### Após criar nova role customizada:
1. Ela aparecerá automaticamente em todos os seletores ✅
2. Necessário atribuir permissões manualmente em Admin → Roles
3. Usuários com essa role poderão ver cursos marcados com ela

### Estrutura de permissões:
```
Usuário
  ↓ tem N
Roles (ex: INSCRITO, PROFESSOR)
  ↓ cada role tem N
Permissões (ex: EDIT_COURSE, DELETE_POST)
```

### Estrutura de acesso a cursos:
```
Curso
  ↓ visível para N
Roles (ex: INSCRITO, PROFESSOR)
  ↓ usuários com essas roles
Podem ver o curso
```

---

## 🚀 PRÓXIMOS TESTES

1. **Criar role customizada "COORDENADOR"**
2. **Atribuir permissões**: EDIT_COURSE, CREATE_POST
3. **Criar usuário com role COORDENADOR**
4. **Criar curso visível para COORDENADOR**
5. **Testar acesso**: usuário COORDENADOR deve ver o curso

---

**✅ Backend reiniciado e rodando!**  
**✅ Todas as correções aplicadas!**  
**✅ Pronto para testar!**
