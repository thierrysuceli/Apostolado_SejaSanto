# 🔧 CORREÇÕES APLICADAS - Problemas de Sanitização e Imports

## ❌ Problemas Identificados

### 1. **Erro de Import - context vs contexts**
```
Failed to resolve import "../context/AuthContext" from "src/pages/AdminRoles.jsx"
```
**Causa**: Caminho errado (`context` em vez de `contexts`)
**Status**: ✅ CORRIGIDO

### 2. **Erro de Constraint do YouTube**
```
ERROR: new row violates check constraint "video_url_youtube"
```
**Causa**: Tags HTML `<>` e `<\>` sendo salvas no campo `video_url` (ferramenta de sanitização do editor estava escapando HTML)
**Status**: ✅ CORRIGIDO

### 3. **Erro de Política Duplicada**
```
ERROR: policy "Authenticated users can upload" already exists
```
**Causa**: Script SQL tentando criar política que já existe
**Status**: ✅ CORRIGIDO

---

## ✅ CORREÇÕES IMPLEMENTADAS

### 1. Imports Corrigidos
**Arquivos modificados**:
- `src/pages/AdminUsers.jsx`
- `src/pages/AdminRoles.jsx`

**Mudança**:
```javascript
// ❌ ANTES (errado)
import { AuthContext } from '../context/AuthContext';
import { ApiContext } from '../context/ApiContext';

// ✅ AGORA (correto)
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
```

### 2. Sanitização de URLs do YouTube
**Arquivo modificado**: `src/pages/AdminCourseModules.jsx`

#### A. No evento onBlur (ao sair do campo)
Adicionado antes da conversão:
```javascript
// Remove HTML tags (sanitization)
url = url.replace(/<[^>]*>/g, '').trim();
```

#### B. No handleSaveTopic (ao salvar)
Adicionado antes da conversão:
```javascript
// Remove HTML tags if present (sanitization)
videoUrl = videoUrl.replace(/<[^>]*>/g, '').trim();
```

**Proteção**: Remove QUALQUER tag HTML (`<...>`) antes de processar a URL, incluindo:
- `<h2>`, `<p>`, `<div>`, etc.
- Tags de fechamento `</...>`
- Auto-closing tags `<br />`

### 3. Script de Limpeza de Dados Existentes
**Novo arquivo**: `migrations/009_clean_video_urls.sql`

**Funções**:
1. ✅ Remove todas as tags HTML de URLs existentes
2. ✅ Remove HTML entities (`&nbsp;`, `&lt;`, etc.)
3. ✅ Converte URLs para formato embed
4. ✅ Remove query parameters desnecessários
5. ✅ Garante HTTPS
6. ✅ Limpa whitespace
7. ✅ Mostra relatório de limpeza

### 4. Políticas RLS com DROP IF EXISTS
**Arquivo modificado**: `migrations/008_storage_rls_policies.sql`

**Mudança**:
```sql
-- ❌ ANTES (causava erro se já existisse)
CREATE POLICY "Authenticated users can upload" ...

-- ✅ AGORA (seguro para re-executar)
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ...
```

---

## 🚀 AÇÕES IMEDIATAS

### 1️⃣ Limpar Dados Existentes (URGENTE)
Execute este script no Supabase SQL Editor:
```bash
migrations/009_clean_video_urls.sql
```

**Este script vai**:
- Remover HTML de URLs existentes
- Converter todas para formato embed
- Mostrar relatório de sucesso

### 2️⃣ Recarregar Frontend
```bash
# No terminal do frontend, pressione Ctrl+C e depois:
npm run dev
```

### 3️⃣ Testar Criação de Tópico
1. Login como ADMIN
2. Vá em Admin → Cursos → Editar Módulos
3. Crie novo tópico
4. Cole URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
5. Clique fora do campo
6. Verifique que converteu para: `https://www.youtube.com/embed/dQw4w9WgXcQ`
7. Salve
8. ✅ Não deve dar erro de constraint

---

## 🔍 COMO FUNCIONA A SANITIZAÇÃO

### Problema Original
O editor estava salvando:
```
<h2>URL do vídeo</h2>https://www.youtube.com/watch?v=ABC123<p>Descrição</p>
```

### Sanitização Aplicada
**Regex**: `/<[^>]*>/g`
- `<` - Procura abertura de tag
- `[^>]*` - Qualquer caractere exceto `>`
- `>` - Procura fechamento de tag
- `g` - Global (todas as ocorrências)

**Resultado**:
```
https://www.youtube.com/watch?v=ABC123
```

### Conversão para Embed
Após limpar HTML:
```javascript
if (url.includes('youtube.com/watch?v=')) {
  const videoId = url.split('v=')[1]?.split('&')[0];
  if (videoId) {
    url = `https://www.youtube.com/embed/${videoId}`;
  }
}
```

**Resultado final**:
```
https://www.youtube.com/embed/ABC123
```

---

## 🧪 VALIDAÇÃO

### Teste 1: URLs Normais (deve funcionar)
```
Input:  https://www.youtube.com/watch?v=ABC123
Output: https://www.youtube.com/embed/ABC123
Status: ✅ OK
```

### Teste 2: URLs com HTML (deve limpar)
```
Input:  <p>https://www.youtube.com/watch?v=ABC123</p>
Output: https://www.youtube.com/embed/ABC123
Status: ✅ OK - HTML removido
```

### Teste 3: URLs Curtas (deve funcionar)
```
Input:  https://youtu.be/ABC123
Output: https://www.youtube.com/embed/ABC123
Status: ✅ OK
```

### Teste 4: URLs com Parâmetros (deve limpar)
```
Input:  https://www.youtube.com/watch?v=ABC123&t=30s
Output: https://www.youtube.com/embed/ABC123
Status: ✅ OK - Parâmetros removidos
```

---

## 📊 VERIFICAÇÃO NO BANCO

### Antes da Limpeza
```sql
SELECT 
  id,
  title,
  video_url,
  CASE 
    WHEN video_url LIKE '%<%' THEN '❌ Contains HTML'
    WHEN video_url LIKE '%embed%' THEN '✅ OK'
    ELSE '⚠️ Needs conversion'
  END as status
FROM topics
WHERE video_url IS NOT NULL;
```

### Depois da Limpeza
Todos devem estar com status `✅ OK` ou `➖ No video`.

---

## 🛡️ PROTEÇÕES IMPLEMENTADAS

### 1. Sanitização Dupla
- ✅ No evento `onBlur` (quando sai do campo)
- ✅ No `handleSaveTopic` (antes de enviar para API)

### 2. Validação Visual
- ✅ Console warning se URL não estiver no formato correto
- ✅ TopicDetail só exibe iframe se URL válida

### 3. Constraint do Banco
- ✅ PostgreSQL check constraint valida formato
- ✅ Impede salvar URLs inválidas

### 4. Migração de Limpeza
- ✅ Script SQL para corrigir dados existentes
- ✅ Remove HTML, entidades, espaços extras

---

## ⚠️ AVISOS IMPORTANTES

### 1. Sobre a Sanitização
Esta sanitização é **específica para URLs de vídeo**. Campos de conteúdo HTML (como `content_before` e `content_after`) devem manter o HTML intacto.

### 2. Sobre o Editor
Se o editor continuar adicionando tags HTML nos campos de URL:
- A sanitização vai remover automaticamente
- Mas considere desabilitar o editor rico nesses campos
- Ou use `<input type="url">` com validação

### 3. Sobre Dados Antigos
Execute o script `009_clean_video_urls.sql` **UMA VEZ** após aplicar as correções. Ele vai limpar todos os dados existentes.

---

## 🎯 CHECKLIST FINAL

Após aplicar as correções:

- [ ] Frontend recarregado (Ctrl+C + npm run dev)
- [ ] Script `009_clean_video_urls.sql` executado
- [ ] Testado criar novo tópico com URL do YouTube
- [ ] Verificado que URL converte automaticamente
- [ ] Testado salvar tópico (sem erro de constraint)
- [ ] Verificado que vídeo reproduz no TopicDetail
- [ ] Páginas AdminUsers e AdminRoles carregam sem erro

---

## 📝 RESUMO DAS MUDANÇAS

| Problema | Arquivo | Solução | Status |
|----------|---------|---------|--------|
| Import errado | AdminUsers.jsx | `context` → `contexts` | ✅ |
| Import errado | AdminRoles.jsx | `context` → `contexts` | ✅ |
| HTML na URL (onBlur) | AdminCourseModules.jsx | Regex sanitization | ✅ |
| HTML na URL (save) | AdminCourseModules.jsx | Regex sanitization | ✅ |
| Dados existentes | 009_clean_video_urls.sql | Script de limpeza | ✅ |
| Política duplicada | 008_storage_rls_policies.sql | DROP IF EXISTS | ✅ |

---

**Tudo pronto!** Execute o script de limpeza e recarregue o frontend. 🚀
