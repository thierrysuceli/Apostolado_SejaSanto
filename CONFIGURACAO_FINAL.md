# 🔧 Instruções de Configuração Final

## ⚠️ AÇÕES OBRIGATÓRIAS - Execute ANTES de testar

### 1. 📦 Aplicar Migração de Tags Temáticas

A migração `006_thematic_tags.sql` ainda NÃO foi aplicada no banco. **Execute agora**:

1. Abra o Supabase Dashboard
2. Vá em **SQL Editor**
3. Abra o arquivo `migrations/006_thematic_tags.sql`
4. Copie TODO o conteúdo
5. Cole no SQL Editor
6. Clique em **Run**
7. Verifique sucesso: `SELECT COUNT(*) FROM tags;` deve retornar **8**

### 2. 🖼️ Configurar Supabase Storage (CORRIGIR RLS)

**Problema**: Uploads de imagem estão falhando com erro de RLS policy.

**Solução**:

#### Passo 1: Criar/Verificar Bucket
1. Supabase Dashboard → **Storage**
2. Se não existir bucket `apostolado-assets`, clique em **New bucket**
3. Nome: `apostolado-assets`
4. **Marque**: Public bucket ✅
5. Clique em **Create bucket**

#### Passo 2: Aplicar Políticas RLS
1. Vá em **SQL Editor**
2. Copie e cole este SQL:

```sql
-- Permitir uploads de usuários autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'apostolado-assets');

-- Permitir leitura pública
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'apostolado-assets');

-- Permitir atualizações de usuários autenticados
CREATE POLICY "Authenticated users can update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'apostolado-assets')
WITH CHECK (bucket_id = 'apostolado-assets');

-- Permitir exclusão de usuários autenticados
CREATE POLICY "Authenticated users can delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'apostolado-assets');
```

3. Clique em **Run**

#### Verificar Configuração
```sql
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%apostolado%';
```

Deve retornar **4 políticas**.

### 3. 🎬 Corrigir URLs Antigas do YouTube

URLs antigas ainda estão no formato `watch?v=` ao invés de `embed/`.

**Execute este script no SQL Editor**:

```sql
-- Converter youtube.com/watch?v= para embed
UPDATE topics
SET video_url = REPLACE(
  video_url,
  'youtube.com/watch?v=',
  'youtube.com/embed/'
)
WHERE video_url LIKE '%youtube.com/watch?v=%'
AND video_url NOT LIKE '%youtube.com/embed/%';

-- Converter youtu.be/ para embed
UPDATE topics
SET video_url = REPLACE(
  video_url,
  'youtu.be/',
  'youtube.com/embed/'
)
WHERE video_url LIKE '%youtu.be/%'
AND video_url NOT LIKE '%youtube.com/embed/%';

-- Remover parâmetros extras
UPDATE topics
SET video_url = SUBSTRING(video_url FROM 1 FOR POSITION('&' IN video_url) - 1)
WHERE video_url LIKE '%youtube.com/embed/%&%';

-- Garantir HTTPS
UPDATE topics
SET video_url = REPLACE(video_url, 'http://', 'https://')
WHERE video_url LIKE 'http://%youtube%';
```

**OU** aplique a migração completa:
1. Abra `migrations/007_fix_youtube_urls.sql`
2. Copie e execute no SQL Editor

---

## ✅ Novas Funcionalidades Implementadas

### 1. 🎬 Conversão Automática de URLs do YouTube

**Antes**: URLs do YouTube não funcionavam (formato errado)
**Agora**: 
- Cole qualquer URL do YouTube (watch?v= ou youtu.be/)
- Sistema converte automaticamente para formato embed
- Conversão ocorre ao sair do campo (onBlur) E ao salvar
- URLs antigas corrigidas pela migração

**Como usar**:
1. Vá em Admin → Cursos → Editar Módulos
2. Ao criar/editar tópico, cole URL normal do YouTube
3. Sistema converte automaticamente
4. Vídeo funcionará corretamente no TopicDetail

### 2. 🖼️ Upload de Imagens para Supabase Storage

**Antes**: Apenas URLs de imagens externas
**Agora**:
- Upload direto de arquivos
- Validação: máx 5MB, apenas imagens
- Preview antes de salvar
- Nomes únicos (timestamp + hash)
- URLs públicas automáticas

**Onde está**:
- ✅ AdminCourseCreate (capa do curso)
- ✅ AdminCourseEdit (editar capa)
- ✅ AdminPostCreate (imagem destacada)
- ✅ AdminEventCreate (imagem do evento)

### 3. 🏷️ Sistema de Tags Temáticas (WHAT = conteúdo sobre o quê)

**Antes**: Apenas tags de permissão (WHO pode ver)
**Agora**: Dois sistemas independentes:

#### A. Tags de Permissão (quem vê)
- VISITANTE, INSCRITO, ADMIN
- Controla acesso ao conteúdo

#### B. Tags Temáticas (sobre o quê)
- Mariologia, Matrimônio, Eucaristia, Oração, etc.
- Organiza conteúdo por tema
- Cada tag tem cor personalizada
- Filtros na página de Cursos

**Gerenciar Tags**:
- Admin → **Tags Temáticas** (`/admin/tags`)
- Criar, editar, deletar tags
- Color picker com cores predefinidas
- Preview em tempo real

**Usar Tags**:
- Ao criar/editar curso: checkboxes de tags temáticas
- Tags aparecem em CourseCard (3 primeiras + contador)
- Tags aparecem em CourseDetail (todas com cores)
- Filtros na página Courses

### 4. 👥 Gerenciamento de Usuários

**NOVO**: Página completa de gerenciamento de usuários

**Acesso**: Admin → **Usuários** (`/admin/users`)

**Funcionalidades**:
- ✅ Listar todos usuários com suas roles
- ✅ Criar novo usuário (nome, email, senha)
- ✅ Atribuir múltiplas roles a cada usuário
- ✅ Editar roles de usuários existentes
- ✅ Deletar usuários
- ✅ Badges coloridos mostrando roles
- ✅ Interface modal responsiva

**Como criar usuário**:
1. Admin → Usuários → **+ Novo Usuário**
2. Preencha: Nome, Email, Senha
3. Selecione uma ou mais roles (checkboxes)
4. Clique em **Criar Usuário**

### 5. 🎭 Gerenciamento de Roles

**NOVO**: Página completa de gerenciamento de roles e cores

**Acesso**: Admin → **Roles & Permissões** (`/admin/roles`)

**Funcionalidades**:
- ✅ Listar todas as roles do sistema
- ✅ Criar novas roles personalizadas
- ✅ Editar nome de exibição e descrição
- ✅ Color picker com 10 cores predefinidas
- ✅ Seletor de cor personalizada (HEX)
- ✅ Preview em tempo real
- ✅ Contador de usuários por role
- ✅ Proteção: não pode deletar ADMIN e VISITANTE
- ✅ Grid responsivo com cards coloridos

**Como criar role**:
1. Admin → Roles & Permissões → **+ Nova Role**
2. Nome interno: MAIÚSCULAS sem espaços (ex: PROFESSOR)
3. Nome de exibição: Como aparece na UI (ex: Professor)
4. Descrição: Breve explicação
5. Escolha cor (predefinida ou personalizada)
6. Preview e clique em **Criar Role**

**Como editar cores**:
1. Clique em **Editar** no card da role
2. Escolha nova cor
3. Veja preview em tempo real
4. Salve alterações

---

## 🗂️ Estrutura de Arquivos Novos/Modificados

### Componentes Criados
- `src/components/ImageUploader.jsx` - Upload de imagens
- `src/components/ThematicTagBadge.jsx` - Badge de tag temática

### Páginas Criadas
- `src/pages/AdminTags.jsx` - Gerenciar tags temáticas
- `src/pages/AdminUsers.jsx` - Gerenciar usuários
- `src/pages/AdminRoles.jsx` - Gerenciar roles e cores

### Páginas Modificadas
- `src/pages/AdminCourseEdit.jsx` - Adicionado ImageUploader e tags temáticas
- `src/pages/AdminCourseCreate.jsx` - Adicionado ImageUploader
- `src/pages/AdminCourseModules.jsx` - Conversão automática de URLs do YouTube
- `src/pages/TopicDetail.jsx` - Validação de URLs de vídeo
- `src/pages/Courses.jsx` - Filtros de tags temáticas
- `src/pages/CourseCard.jsx` - Exibição de tags temáticas
- `src/pages/CourseDetail.jsx` - Exibição de todas as tags
- `src/pages/Admin.jsx` - Novos atalhos no dashboard

### API Endpoints Modificados
- `api/admin/users.js` - Adicionado POST para criar usuários
- `api/admin/users/[id].js` - PUT e DELETE de usuários
- `api/admin/roles.js` - CRUD completo de roles
- `api/admin/roles/[id].js` - PUT e DELETE de roles

### Contextos Modificados
- `src/contexts/ApiContext.jsx` - Métodos de users e roles admin

### Rotas Adicionadas
- `/admin/users` - Gerenciar usuários
- `/admin/roles` - Gerenciar roles
- `/admin/tags` - Gerenciar tags temáticas (já existia)

### Migrações Criadas
- `migrations/006_thematic_tags.sql` - Sistema de tags temáticas
- `migrations/007_fix_youtube_urls.sql` - Corrigir URLs antigas
- `migrations/008_storage_rls_policies.sql` - Políticas de Storage

---

## 🧪 Como Testar

### 1. Testar Tags Temáticas
1. ✅ Aplicou migração 006? Se não, **APLIQUE AGORA**
2. Login como ADMIN
3. Vá em Admin → Tags Temáticas
4. Crie uma nova tag (ex: "Liturgia", cor azul)
5. Vá em Admin → Cursos → Editar curso
6. Marque algumas tags temáticas
7. Salve
8. Vá em /courses
9. Veja tags no card do curso
10. Clique em tag para filtrar
11. Entre no curso, veja todas as tags no header

### 2. Testar Upload de Imagens
1. ✅ Aplicou políticas RLS do Storage? Se não, **APLIQUE AGORA**
2. ✅ Bucket `apostolado-assets` existe e é público?
3. Login como ADMIN
4. Vá em Admin → Novo Curso
5. Clique em "Selecionar Arquivo" na capa
6. Escolha uma imagem (< 5MB)
7. Veja preview
8. Salve curso
9. Vá em /courses
10. Imagem deve aparecer no card

### 3. Testar Conversão de URLs do YouTube
1. ✅ Aplicou migração 007 para corrigir URLs antigas?
2. Login como ADMIN
3. Vá em Admin → Cursos → Editar Módulos
4. Crie/edite um tópico
5. Cole URL normal do YouTube: `https://www.youtube.com/watch?v=ABC123`
6. Saia do campo (click fora ou Tab)
7. URL deve mudar para: `https://www.youtube.com/embed/ABC123`
8. Salve
9. Vá no curso → tópico
10. Vídeo deve reproduzir corretamente

### 4. Testar Gerenciamento de Usuários
1. Login como ADMIN
2. Vá em Admin → Usuários
3. Clique em **+ Novo Usuário**
4. Preencha dados e selecione roles
5. Crie usuário
6. Veja na lista
7. Edite usuário (mude roles)
8. Logout e login com novo usuário
9. Verifique permissões

### 5. Testar Gerenciamento de Roles
1. Login como ADMIN
2. Vá em Admin → Roles & Permissões
3. Clique em **+ Nova Role**
4. Crie role "PROFESSOR" com cor verde
5. Salve
6. Vá em Admin → Usuários
7. Atribua role PROFESSOR a um usuário
8. Edite a role PROFESSOR (mude cor)
9. Veja badges atualizarem

---

## 🐛 Troubleshooting

### "Tags não aparecem na edição de curso"
❌ **Causa**: Migração 006 não foi aplicada
✅ **Solução**: Execute `migrations/006_thematic_tags.sql` no SQL Editor

### "Erro ao fazer upload de imagem: RLS policy violation"
❌ **Causa**: Bucket não existe ou políticas RLS faltando
✅ **Solução**: Siga passos da seção "2. Configurar Supabase Storage"

### "Vídeos do YouTube não reproduzem"
❌ **Causa**: URLs antigas no formato `watch?v=`
✅ **Solução**: Execute `migrations/007_fix_youtube_urls.sql`

### "Não consigo criar usuário"
❌ **Causa**: Endpoint não registrado no servidor
✅ **Solução**: Verifique se `api/admin/users.js` está registrado em `server-dev-new.js`

### "Roles não carregam na página de usuários"
❌ **Causa**: Endpoint `/api/admin/roles` não disponível
✅ **Solução**: Verifique console do navegador e logs do servidor

---

## 📋 Checklist Final

Antes de considerar tudo funcionando, verifique:

- [ ] Migração 006 aplicada (`SELECT COUNT(*) FROM tags;` retorna 8)
- [ ] Bucket `apostolado-assets` existe e é público
- [ ] 4 políticas RLS criadas para Storage
- [ ] Migração 007 aplicada (URLs antigas corrigidas)
- [ ] Backend rodando na porta 3002
- [ ] Frontend rodando na porta 5173
- [ ] Consegue fazer login como ADMIN
- [ ] Tags temáticas aparecem no admin de cursos
- [ ] Upload de imagem funciona (sem erro de RLS)
- [ ] Vídeos do YouTube reproduzem corretamente
- [ ] Consegue criar novo usuário
- [ ] Consegue criar nova role com cor
- [ ] Badges de roles mostram cores corretas

---

## 🎯 Resumo das Correções

### Problema 1: Vídeos não reproduzem ✅ CORRIGIDO
- **Antes**: URLs em formato `watch?v=`
- **Agora**: Conversão automática para `embed/` (onBlur + onSave)
- **Plus**: Script para corrigir URLs antigas

### Problema 2: Imagens não importam ✅ INSTRUÇÕES FORNECIDAS
- **Causa**: RLS policies bloqueando
- **Solução**: SQL completo fornecido em `migrations/008_storage_rls_policies.sql`
- **Plus**: Validação de bucket público

### Problema 3: Não dá para criar usuários ✅ IMPLEMENTADO
- **Antes**: Funcionalidade não existia
- **Agora**: Página completa `/admin/users` com CRUD
- **Plus**: Atribuição de múltiplas roles

### Problema 4: Não dá para editar roles/cores ✅ IMPLEMENTADO
- **Antes**: Funcionalidade não existia
- **Agora**: Página completa `/admin/roles` com color picker
- **Plus**: 10 cores predefinidas + personalizada

---

## 🚀 Próximos Passos

Após aplicar as 3 ações obrigatórias acima:

1. Reinicie o backend se necessário
2. Recarregue o frontend (Ctrl+R)
3. Teste cada funcionalidade seguindo a seção "Como Testar"
4. Se alguma coisa não funcionar, consulte "Troubleshooting"
5. Todos os recursos devem estar 100% funcionais

**Importante**: As 3 ações da seção "AÇÕES OBRIGATÓRIAS" são pré-requisitos. Sem elas, as funcionalidades não funcionarão.
