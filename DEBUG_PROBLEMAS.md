# 🔍 DEBUG: Capa não aparece e páginas em branco

## Problema 1: Capa mostra /placeholder-course.jpg

### Causa
Você está vendo uma imagem diferente do esperado. Isso significa:
1. O curso FOI criado mas SEM a capa (antes do fix do storage)
2. Algum componente antigo está sendo renderizado

### Solução Rápida - Criar Novo Curso
1. Vá em **Admin → Criar Novo Curso**
2. Preencha título, descrição
3. **Faça upload da capa** (agora funciona!)
4. Salve
5. A nova capa vai aparecer no card

### Se Quiser Atualizar Curso Existente
1. Vá em **Cursos**
2. Clique no curso
3. Clique em **"Editar"** (se admin)
4. Faça upload de uma nova capa
5. Salve

### Por que /placeholder-course.jpg?

Você está provavelmente vendo a página **CourseDetailNew.jsx** (não o card), que tem:
```jsx
src={course.image || '/placeholder-course.jpg'}
```

Enquanto **CourseCard.jsx** tem:
```jsx
src={course.cover_image_url || course.image || '/Apostolado_PNG.png'}
```

---

## Problema 2: AdminUsers e AdminRoles - Página em Branco

### Correções Aplicadas

**1. Validação de Admin Corrigida**
```javascript
// ANTES (errado)
if (user.role !== 'ADMIN') navigate('/');

// DEPOIS (correto)
const isAdmin = user.roles?.some(r => r.name === 'ADMIN');
if (!isAdmin) navigate('/');
```

**2. Formato da API Corrigido**
```javascript
// api.users.getAll() retorna: { users: [...] }
// api.roles.getAll() retorna: { roles: [...] }

setUsers(usersData.users || usersData || []);
setRoles(rolesData.roles || rolesData || []);
```

**3. Console.log Adicionado**
Agora mostra no console:
- `Users data:` - O que a API retornou
- `Roles data:` - O que a API retornou

### Como Testar

1. **Abra o DevTools** (F12)
2. **Vá na aba Console**
3. **Acesse**: http://localhost:5173/admin/users
4. **Veja no console**:
   - Se aparecer `Users data:` e `Roles data:` → API funcionou
   - Se aparecer erro → Me envie o erro completo

### Se Ainda Estiver em Branco

**Verifique se você é ADMIN**:
1. Abra o console (F12)
2. Digite: `JSON.parse(localStorage.getItem('auth_token'))`
3. Veja se tem:
   ```json
   {
     "roles": [
       { "name": "ADMIN", ... }
     ]
   }
   ```
4. Se NÃO tiver ADMIN → Faça login com conta admin

---

## 🚀 Passos para Testar Tudo

### 1. Reiniciar Backend (IMPORTANTE!)
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
npm run backend
```

### 2. Recarregar Frontend
Pressione **Ctrl+Shift+R** (hard refresh) no browser

### 3. Testar AdminUsers
1. http://localhost:5173/admin/users
2. Deve aparecer lista de usuários
3. Se branco → Abra console (F12) e veja o erro

### 4. Testar AdminRoles
1. http://localhost:5173/admin/roles
2. Deve aparecer lista de roles
3. Se branco → Abra console (F12) e veja o erro

### 5. Testar Upload de Capa
1. Admin → Criar Curso
2. Upload imagem
3. Salvar
4. Voltar em Cursos
5. **Capa deve aparecer no card**

---

## 📊 Checklist de Verificação

- [ ] Reiniciei o backend
- [ ] Recarreguei o frontend (Ctrl+Shift+R)
- [ ] Sou ADMIN (roles no localStorage)
- [ ] AdminUsers mostra console.log
- [ ] AdminRoles mostra console.log
- [ ] Criei novo curso com capa
- [ ] Capa aparece no card

---

## 🆘 Se Ainda Não Funcionar

**Me envie**:
1. Screenshot do console (F12) em /admin/users
2. Resposta de: `localStorage.getItem('auth_token')`
3. Qual erro aparece (se algum)

---

✅ **Resumo**: 
- Páginas AdminUsers/Roles foram corrigidas (validação + formato API)
- Capa não aparece porque curso foi criado SEM capa (antes do fix)
- Crie NOVO curso com upload de capa
- Reinicie backend para pegar as rotas novas
