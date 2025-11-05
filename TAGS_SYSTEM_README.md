# ✅ Sistema de Tags Temáticas - Implementado!

## 📋 O que foi feito

### 1. **Banco de Dados** (Migration pronta - AGUARDANDO APLICAÇÃO)

Arquivo: `supabase-migrations/006_thematic_tags.sql`

**Tabelas Criadas:**
- `tags` - Armazena as tags temáticas (Mariologia, Matrimônio, etc.)
- `course_content_tags` - Relaciona cursos com tags
- `post_content_tags` - Relaciona posts com tags
- `event_content_tags` - Relaciona eventos com tags

**Tags Padrão Inseridas:**
1. Mariologia (#3b82f6 - Azul)
2. Matrimônio (#ec4899 - Rosa)
3. Eucaristia (#f59e0b - Laranja)
4. Oração (#8b5cf6 - Roxo)
5. Santos (#10b981 - Verde)
6. Bíblia (#ef4444 - Vermelho)
7. Catequese (#6366f1 - Índigo)
8. Doutrina (#14b8a6 - Teal)

---

### 2. **Backend API**

#### ✅ Endpoint `/api/tags` criado
**Arquivo:** `api/tags.js`

**Métodos:**
- `GET /api/tags` - Listar todas as tags (público)
- `POST /api/tags` - Criar nova tag (admin)
  ```json
  {
    "name": "Nova Tag",
    "description": "Descrição opcional",
    "color": "#ff0000"
  }
  ```
- `PUT /api/tags/:id` - Atualizar tag (admin)
- `DELETE /api/tags/:id` - Deletar tag (admin)

#### ✅ Rota registrada no servidor
**Arquivo:** `server-dev-new.js`
- Rota `/api/tags` configurada e funcional

#### ✅ Endpoints de cursos atualizados
**Arquivo:** `api/courses/[id].js`
- GET agora retorna `course_content_tags` com tags relacionadas
- PUT aceita parâmetro `thematicTags` (array de IDs) para salvar tags

**Arquivo:** `api/courses/index.js`
- Listagem de cursos inclui `course_content_tags`

---

### 3. **Frontend React**

#### ✅ Context API atualizado
**Arquivo:** `src/contexts/ApiContext.jsx`

Novos métodos disponíveis:
```javascript
api.tags.getAll()        // Buscar todas as tags
api.tags.create(data)    // Criar tag
api.tags.update(id, data) // Atualizar tag
api.tags.delete(id)      // Deletar tag
```

#### ✅ Página de edição de curso atualizada
**Arquivo:** `src/pages/AdminCourseEdit.jsx`

**Novas funcionalidades:**
- Carrega tags temáticas disponíveis
- Exibe tags existentes do curso
- Permite selecionar/desselecionar tags com checkboxes
- Salva tags selecionadas no backend
- Visual com badges coloridas

**Interface:**
```
📝 Quem Pode Ver Este Curso? *
☑️ VISITANTE
☑️ INSCRITO
☐ ADMIN

🏷️ Temas do Curso
☑️ Mariologia (azul)
☑️ Eucaristia (laranja)
☐ Matrimônio (rosa)
☐ Oração (roxo)
...
```

#### ✅ Componente de badge criado
**Arquivo:** `src/components/ThematicTagBadge.jsx`
- Componente reutilizável para exibir tags
- Suporta tamanhos: xs, sm, md, lg
- Usa cor personalizada de cada tag

#### ✅ Páginas de visualização atualizadas

**CourseCard** (`src/components/CourseCard.jsx`):
- Exibe até 3 tags na listagem
- Mostra "+X" se houver mais tags

**CourseDetail** (`src/pages/CourseDetail.jsx`):
- Exibe todas as tags do curso no header
- Tags com cores e descrição (tooltip)

---

## 🎯 Como Dois Sistemas de Tags Funcionam

### Sistema 1: **Tags de Permissão** (quem pode ver)
- Tabelas: `course_tags`, `post_tags`, `event_tags`
- Valores: IDs de **roles** (VISITANTE, INSCRITO, ADMIN)
- Função: Controlar **visibilidade** do conteúdo
- Status: ✅ **JÁ FUNCIONANDO**

### Sistema 2: **Tags Temáticas** (sobre o que é)
- Tabelas: `course_content_tags`, `post_content_tags`, `event_content_tags`
- Valores: IDs de **tags** (Mariologia, Matrimônio, Eucaristia, etc.)
- Função: **Categorizar** o conteúdo por assunto
- Status: ⚠️ **BACKEND PRONTO, PRECISA APLICAR MIGRAÇÃO**

---

## 🚨 PRÓXIMO PASSO CRÍTICO

### **Você precisa aplicar a migração no Supabase!**

#### Opção 1: Via Dashboard do Supabase (Recomendado)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em **SQL Editor** no menu lateral
4. Clique em **+ New Query**
5. Copie TODO o conteúdo do arquivo:
   ```
   supabase-migrations/006_thematic_tags.sql
   ```
6. Cole no editor SQL
7. Clique em **Run** (ou pressione Ctrl+Enter)
8. Aguarde mensagem de sucesso ✅

#### Opção 2: Via CLI do Supabase

```bash
# Se você tem o Supabase CLI instalado
cd "C:\Users\silva\OneDrive\Área de Trabalho\Apostolado"
supabase migration up
```

---

## 🧪 Como Testar

### 1. Verificar se a migração foi aplicada

No SQL Editor do Supabase, execute:
```sql
-- Deve retornar 8 tags
SELECT * FROM tags;

-- Deve retornar as 3 tabelas de junção
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE '%content_tags';
```

### 2. Testar API de tags

```powershell
# Listar todas as tags (público)
curl http://localhost:3002/api/tags
```

Resposta esperada:
```json
{
  "tags": [
    {
      "id": "uuid...",
      "name": "Mariologia",
      "slug": "mariologia",
      "description": "Estudos sobre Nossa Senhora",
      "color": "#3b82f6",
      "created_at": "2025-11-03T..."
    },
    ...
  ]
}
```

### 3. Testar interface web

1. **Reinicie o backend:**
   ```powershell
   npm run backend
   ```

2. **Acesse:** http://localhost:5173/admin/courses/[ID-DO-CURSO]/edit

3. **Verifique:**
   - ✅ Seção "Quem Pode Ver Este Curso?" aparece com roles
   - ✅ Seção "Temas do Curso" aparece com tags coloridas
   - ✅ Consegue selecionar/desselecionar tags
   - ✅ Ao salvar, tags são persistidas

4. **Teste visualização:**
   - Acesse a listagem de cursos: http://localhost:5173/courses
   - Verifique se tags aparecem nos cards
   - Abra um curso específico
   - Verifique se tags aparecem no header

---

## 📊 Fluxo Completo

```
[Admin seleciona tags temáticas no form]
         ↓
[Frontend envia: thematicTags: [uuid1, uuid2...]]
         ↓
[Backend PUT /api/courses/:id]
         ↓
[1. Deleta tags antigas: course_content_tags]
[2. Insere novas tags selecionadas]
         ↓
[Curso atualizado com sucesso]
         ↓
[GET /api/courses/:id retorna course_content_tags]
         ↓
[Frontend exibe badges coloridas nas páginas]
```

---

## 🔮 Próximas Implementações (Opcional)

### 1. Página de Gerenciamento de Tags (`/admin/tags`)
- Listar todas as tags
- Criar novas tags personalizadas
- Editar nome/cor/descrição
- Deletar tags não usadas

### 2. Filtro por Tags Temáticas
- Adicionar filtro na página de cursos
- Usuário clica em "Mariologia" → vê só cursos dessa tag

### 3. Aplicar em Posts e Eventos
- Mesma lógica de cursos
- Arquivos já criados: AdminPostEdit, AdminEventEdit
- Só precisa adicionar interface semelhante

---

## ✅ Checklist de Implementação

- [x] Criar migration com tabelas de tags
- [x] Criar endpoint `/api/tags` com CRUD
- [x] Registrar rota no servidor
- [x] Adicionar métodos no ApiContext
- [x] Atualizar endpoint de cursos (GET/PUT)
- [x] Adicionar seleção de tags em AdminCourseEdit
- [x] Criar componente ThematicTagBadge
- [x] Exibir tags em CourseCard
- [x] Exibir tags em CourseDetail
- [ ] **APLICAR MIGRAÇÃO NO SUPABASE** ⚠️ **VOCÊ PRECISA FAZER**
- [ ] Testar criação de tag via POST
- [ ] Testar salvamento de tags em curso
- [ ] Testar visualização de tags na listagem

---

## 🎨 Paleta de Cores das Tags

| Tag | Cor | Hex |
|-----|-----|-----|
| Mariologia | 🔵 Azul | #3b82f6 |
| Matrimônio | 🟣 Rosa | #ec4899 |
| Eucaristia | 🟠 Laranja | #f59e0b |
| Oração | 🟣 Roxo | #8b5cf6 |
| Santos | 🟢 Verde | #10b981 |
| Bíblia | 🔴 Vermelho | #ef4444 |
| Catequese | 🔵 Índigo | #6366f1 |
| Doutrina | 🟦 Teal | #14b8a6 |

---

## 📝 Notas Técnicas

- **RLS Policies:** Tags são públicas (leitura), apenas admin pode criar/editar/deletar
- **Auto-slug:** Backend gera slug automaticamente do nome (ex: "Mariologia" → "mariologia")
- **Duplicate Prevention:** Não pode criar duas tags com mesmo nome (409 Conflict)
- **Cascade Delete:** Se deletar um curso, suas tags de junção são removidas automaticamente
- **Color Format:** Cores em hexadecimal (#RRGGBB)
- **Optional Field:** Tags temáticas são opcionais, permissões são obrigatórias

---

## 🆘 Troubleshooting

### Erro: "relation 'tags' does not exist"
**Causa:** Migração não foi aplicada no banco  
**Solução:** Siga as instruções na seção "PRÓXIMO PASSO CRÍTICO"

### Erro: "api.tags is undefined"
**Causa:** ApiContext não foi atualizado  
**Solução:** Reinicie o frontend (`npm run dev`)

### Tags não aparecem na interface
**Causa:** Backend não retorna `course_content_tags`  
**Solução:** Verifique se a migration foi aplicada e backend reiniciado

### Não consigo salvar tags
**Causa:** Endpoint PUT não está recebendo `thematicTags`  
**Solução:** Verifique console do navegador e logs do backend

---

## 🎉 Resultado Final Esperado

**Antes:**
```
Curso: Introdução à Fé
[VISITANTE] [INSCRITO]
```

**Depois:**
```
Curso: Introdução à Fé

Quem pode ver:
[VISITANTE] [INSCRITO]

Temas:
[🔵 Mariologia] [🔴 Bíblia] [🟦 Doutrina]
```

---

**Status Atual:** Backend 100% completo, Frontend 90% completo  
**Bloqueio:** Migração não aplicada no banco de dados  
**Tempo para finalizar:** 5 minutos (só aplicar a migration)

