# ✅ SOLUÇÃO DOS 3 PROBLEMAS

## 1. ✅ Vídeos do YouTube - RESOLVIDO!

**Status**: Funcionando após aplicar migration 999

**O que foi feito**:
- Constraint atualizada para aceitar formato `embed/`
- URLs limpas de HTML tags
- Frontend sanitiza automaticamente

**Teste**:
```
✅ Vídeos agora reproduzem sem avisos
✅ URLs são convertidas automaticamente
✅ HTML é removido antes de salvar
```

---

## 2. ❌ Upload de Imagens - FALTA APLICAR

### Erro Atual
```
POST https://...supabase.co/storage/v1/object/apostolado-assets/...png 400 (Bad Request)
Error uploading image: StorageApiError: new row violates row-level security policy
```

### Causa
As políticas RLS do Storage **NÃO foram aplicadas** ainda.

### Solução: Execute o Script BUCKET_E_RLS.sql

**Arquivo**: `migrations/BUCKET_E_RLS.sql`

**Passos**:

1. **Abra Supabase Dashboard** → **Storage**
2. **Veja se existe bucket** `apostolado-assets`
   - ✅ Se SIM: Vá para passo 4
   - ❌ Se NÃO: Vá para passo 3

3. **Criar Bucket** (se não existir):
   - Clique em **"New bucket"**
   - Nome: `apostolado-assets`
   - Public: ✅ **MARCAR COMO PUBLIC**
   - File size limit: 50MB
   - Allowed MIME types: deixe vazio (permite todos)
   - Clique em **"Create bucket"**

4. **Aplicar Políticas RLS**:
   - Vá em **SQL Editor**
   - Copie TODO o conteúdo de `migrations/BUCKET_E_RLS.sql`
   - Cole e clique em **RUN**
   - Aguarde mensagem: `✅ STORAGE CONFIGURADO!`

5. **Verificar**:
   - Deve mostrar: `Bucket existe: ✅ SIM`
   - Deve mostrar: `Políticas RLS: 4 de 4`
   - Se tudo OK: `🎉 TUDO PRONTO! Pode testar o upload de imagens.`

### O Que o Script Faz

**Política 1** - Upload:
```sql
-- Usuários autenticados podem fazer UPLOAD
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'apostolado-assets');
```

**Política 2** - Leitura Pública:
```sql
-- QUALQUER PESSOA pode VER imagens
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'apostolado-assets');
```

**Política 3** - Atualizar:
```sql
-- Usuários autenticados podem ATUALIZAR
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'apostolado-assets');
```

**Política 4** - Deletar:
```sql
-- Usuários autenticados podem DELETAR
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'apostolado-assets');
```

### Testar Depois

1. Vá em **Admin → Criar Novo Curso**
2. Clique em **"Selecionar Arquivo"** na seção de capa
3. Escolha uma imagem (JPG/PNG, menos de 5MB)
4. **Esperado**: 
   - Preview aparece imediatamente
   - NENHUM erro 400 no console
   - URL começa com `https://...supabase.co/storage/v1/object/public/apostolado-assets/...`

---

## 3. ✅ AdminCourseCreate - CORRIGIDO!

### Problemas Identificados

**Antes**:
- ❌ Interface simples demais (só inputs básicos)
- ❌ Não tinha tags temáticas (Mariologia, Matrimônio, etc.)
- ❌ Não dava para criar módulos e tópicos direto
- ❌ Só salvava tags de usuário (VISITANTE/INSCRITO/ADMIN)

**Agora**:
- ✅ Interface COMPLETA igual ao AdminCourseEdit
- ✅ Seleção de tags temáticas com checkboxes
- ✅ Após criar, redireciona para gerenciar módulos/tópicos
- ✅ Mostra todas as roles com cores e badges
- ✅ Upload de capa com preview

### O Que Mudou

#### 1. Tags de Permissão (Quem Pode Ver)

**Antes**:
```jsx
<input type="checkbox" /> VISITANTE
<input type="checkbox" /> INSCRITO  
<input type="checkbox" /> ADMIN
```

**Agora**:
```jsx
{availableRoles.map((role) => (
  <label className="flex items-center p-4 border rounded-lg">
    <input type="checkbox" />
    <span>{role.display_name}</span>
    <span style={{color: role.color}}>{role.name}</span>
  </label>
))}
```

#### 2. Tags Temáticas (Sobre O Que É)

**Antes**: Não existia

**Agora**:
```jsx
{availableThematicTags.map((tag) => (
  <label className="flex items-center p-3 border rounded-lg">
    <input type="checkbox" />
    <span>{tag.name}</span>
    <span style={{backgroundColor: tag.color}} />
  </label>
))}
```

#### 3. Fluxo de Criação

**Antes**:
1. Preencher formulário
2. Adicionar módulos manualmente
3. Salvar
4. Redirecionar para `/courses`
5. ❌ Não dava para editar módulos criados

**Agora**:
1. Preencher informações básicas
2. Selecionar permissões (OBRIGATÓRIO)
3. Selecionar temas (OPCIONAL)
4. Clicar em "Criar Curso"
5. ✅ **Redireciona automático para `/admin/courses/:id/modules`**
6. ✅ **Lá você cria módulos e tópicos com interface completa**

#### 4. Validações

**Antes**:
```javascript
if (!formData.title || !formData.slug || !formData.description) {
  throw new Error('Preencha os campos');
}
```

**Agora**:
```javascript
if (!formData.title || !formData.slug || !formData.description) {
  throw new Error('Preencha todos os campos obrigatórios');
}

if (selectedRoleIds.length === 0) {
  throw new Error('Selecione pelo menos uma permissão de visualização');
}
```

### Como Usar Agora

#### Passo 1: Informações Básicas
- Título: `Introdução à Mariologia`
- Slug: `introducao-mariologia` (auto-gerado)
- Descrição: `Curso sobre a devoção mariana...`
- Capa: Fazer upload de imagem
- Status: `Publicado` ou `Rascunho`

#### Passo 2: Quem Pode Ver
- ✅ VISITANTE (todos)
- ✅ INSCRITO (membros)
- ✅ ADMIN (administradores)

**Dica**: Por padrão, INSCRITO e ADMIN já vêm marcados.

#### Passo 3: Temas do Curso (OPCIONAL)
- ✅ Mariologia
- ✅ Virgem Maria
- ⬜ Matrimônio
- ⬜ Espiritualidade

**Nota**: Se tags temáticas não aparecerem, aplique a migration 006 ou 999.

#### Passo 4: Criar e Continuar
- Clique em **"Criar Curso"**
- Sistema salva o curso com as tags
- **Redireciona automático** para página de módulos
- Lá você adiciona:
  - Módulo 1: Introdução
    - Tópico 1.1: O que é Mariologia?
    - Tópico 1.2: História da devoção
  - Módulo 2: Dogmas Marianos
    - Tópico 2.1: Imaculada Conceição
    - Tópico 2.2: Assunção

### Diferenças: Create vs Edit

| Feature | AdminCourseCreate | AdminCourseEdit |
|---------|-------------------|-----------------|
| Tags de permissão | ✅ Sim | ✅ Sim |
| Tags temáticas | ✅ Sim | ✅ Sim |
| Upload de capa | ✅ Sim | ✅ Sim |
| Criar módulos inline | ❌ Não | ❌ Não |
| Link para módulos | ✅ Redirect auto | ✅ Botão manual |
| Validações | ✅ Completas | ✅ Completas |

**Por que não criar módulos inline?**

A interface de gerenciar módulos (`AdminCourseModules`) é **muito mais poderosa**:
- Drag and drop para reordenar
- Editor Quill para conteúdo rico
- Upload de vídeos do YouTube
- Reordenação de tópicos
- Preview em tempo real

É melhor criar o curso primeiro, depois ir para lá gerenciar o conteúdo.

---

## 🎯 Checklist Final

### Vídeos ✅
- [x] Migration 999 aplicada
- [x] Constraint aceita formato embed
- [x] URLs limpas de HTML
- [x] Frontend sanitiza automaticamente

### Imagens ⏳
- [ ] Criar bucket `apostolado-assets` (se não existir)
- [ ] Marcar bucket como PUBLIC
- [ ] Aplicar script `BUCKET_E_RLS.sql`
- [ ] Testar upload de imagem

### AdminCourseCreate ✅
- [x] Interface completa implementada
- [x] Tags de permissão funcionando
- [x] Tags temáticas funcionando
- [x] Redirect para gerenciar módulos
- [x] Validações implementadas

---

## 🚀 Próximos Passos

### 1. Aplicar Script do Storage (URGENTE)
```
1. Criar bucket apostolado-assets (se não existir)
2. Executar migrations/BUCKET_E_RLS.sql
3. Testar upload
```

### 2. Aplicar Migration 006 (Se tags temáticas não aparecem)
```sql
-- migrations/006_thematic_tags.sql
-- Cria tabela tags e insere 8 tags padrão
-- (Mariologia, Matrimônio, Liturgia, etc.)
```

### 3. Testar Fluxo Completo
```
1. Admin → Criar Novo Curso
2. Preencher informações
3. Selecionar permissões (VISITANTE + INSCRITO)
4. Selecionar temas (Mariologia + Virgem Maria)
5. Fazer upload de capa
6. Criar curso
7. Sistema redireciona para gerenciar módulos
8. Adicionar módulos e tópicos
9. Publicar
10. Ver curso na lista pública
```

---

## ❓ Troubleshooting

### "Tags temáticas não aparecem"
**Causa**: Migration 006 não foi aplicada.

**Solução**: Aplicar `migrations/999_APLICAR_TUDO.sql` (inclui tudo) OU apenas `006_thematic_tags.sql`

### "Erro 400 ao fazer upload"
**Causa**: Políticas RLS do Storage não aplicadas.

**Solução**: Aplicar `migrations/BUCKET_E_RLS.sql`

### "Bucket apostolado-assets does not exist"
**Causa**: Bucket não foi criado.

**Solução**:
1. Supabase Dashboard → Storage
2. Create Bucket
3. Nome: `apostolado-assets`
4. Public: ✅ YES
5. Re-executar script RLS

### "Nenhuma role aparece para selecionar"
**Causa**: API `/api/roles` retornando vazio ou erro.

**Solução**:
1. Verificar se backend está rodando (port 3002)
2. Verificar se migration 003 foi aplicada (seed de roles)
3. Testar: `GET http://localhost:3002/api/roles`

---

✅ **Resumo**: Vídeos funcionando, AdminCourseCreate corrigido, só falta aplicar script do Storage!
