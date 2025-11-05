# 🔍 PROBLEMA REAL IDENTIFICADO

## ❌ O Erro

```
ERROR: 23514: check constraint "video_url_youtube" of relation "topics" is violated by some row
```

## 🧠 Análise da Causa Raiz

### Migration Original (001_initial_schema.sql - linha 237)

```sql
CONSTRAINT video_url_youtube CHECK (
  video_url IS NULL OR 
  video_url ~* '^(https?://)?(www\.)?(youtube\.com/watch\?v=|youtu\.be/)[a-zA-Z0-9_-]{11}'
)
```

**PROBLEMA**: O regex **NÃO termina com `$`**!

### O que isso significa?

- ✅ **Aceita**: `https://youtube.com/watch?v=abc123def45`
- ✅ **Aceita também**: `https://youtube.com/watch?v=abc123def45<h2>LIXO</h2><p>mais lixo</p>`

O regex encontra um match no INÍCIO da string e considera válido, mesmo com lixo no final.

### Migration 999 (versão antiga)

```sql
-- PARTE 1: Atualizava a constraint PRIMEIRO
ALTER TABLE topics
ADD CONSTRAINT video_url_youtube CHECK (
  video_url ~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$'
);

-- PARTE 2: Tentava limpar URLs DEPOIS
UPDATE topics...
```

**PROBLEMA**: A nova constraint **TERMINA com `$`**, então rejeita URLs com lixo!

Quando tentamos adicionar a constraint, o PostgreSQL verifica TODAS as linhas existentes. Se alguma linha tem:
```
https://youtube.com/watch?v=abc123def45<h2>LIXO</h2>
```

A nova constraint rejeita porque espera que a string termine em `[a-zA-Z0-9_-]{11}$`.

## ✅ A Solução

### Ordem Correta (Migration 999 corrigida):

1. **PARTE 1**: Remove constraint antiga (permite qualquer coisa temporariamente)
2. **PARTE 2**: Limpa TODAS as URLs existentes (remove HTML, converte formato)
3. **PARTE 3**: Adiciona constraint nova (agora todas as URLs estão corretas)
4. **PARTE 4**: Cria políticas RLS
5. **PARTE 5**: Verifica e reporta

## 🎯 Por que funcionou antes?

O código do frontend estava salvando URLs como:
```
<h2>https://youtube.com/watch?v=isPvBJnAVdc</h2>
```

A constraint antiga ACEITAVA isso porque:
- Regex: `youtube\.com/watch\?v=[a-zA-Z0-9_-]{11}`
- Match: `youtube.com/watch?v=isPvBJnAVdc` ✅
- Ignora: `<h2>` no início e `</h2>` no final

Mas quando tentamos converter para embed (`youtube.com/embed/...`), a constraint antiga rejeitava!

E quando tentamos adicionar constraint nova (que termina com `$`), ela rejeitava as URLs com HTML!

## 📋 O que a Migration 999 Corrigida Faz

### Passo 1: Remove Constraint
```sql
ALTER TABLE topics DROP CONSTRAINT IF EXISTS video_url_youtube;
```
Agora o banco não valida mais URLs (temporariamente).

### Passo 2: Limpa Tudo
```sql
-- Remove tags HTML
UPDATE topics SET video_url = REGEXP_REPLACE(video_url, '<[^>]*>', '', 'g')...

-- Converte watch?v= → embed/
UPDATE topics SET video_url = REPLACE(video_url, 'youtube.com/watch?v=', 'youtube.com/embed/')...

-- Remove parâmetros (&t=123)
-- Garante HTTPS
-- Remove vazias
```

### Passo 3: Adiciona Constraint Correta
```sql
ALTER TABLE topics
ADD CONSTRAINT video_url_youtube CHECK (
  video_url IS NULL OR
  video_url = '' OR
  video_url ~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$'
);
```

Agora TODAS as URLs estão no formato correto, então a constraint não rejeita nada!

## 🚀 Como Aplicar

1. **Abra Supabase Dashboard** → SQL Editor
2. **Cole o conteúdo** de `migrations/999_APLICAR_TUDO.sql`
3. **Execute** (RUN)
4. **Aguarde** a mensagem de sucesso

### O que você vai ver:

```
✅ MIGRATION COMPLETA!
========================================
Constraint atualizada: ✅
URLs válidas: X tópicos
URLs inválidas: 0 tópicos
Políticas RLS: 4 criadas
========================================
```

## 🧪 Testar Depois

### Teste 1: Salvar URL com HTML
1. Vá em Admin → Courses → Edit → Modules
2. Cole: `<h2>https://youtube.com/watch?v=isPvBJnAVdc</h2>`
3. Salve o tópico
4. **Esperado**: Salva corretamente (frontend remove HTML automaticamente)
5. **No banco**: URL fica como `https://youtube.com/embed/isPvBJnAVdc`

### Teste 2: Salvar URL normal
1. Cole: `https://youtube.com/watch?v=isPvBJnAVdc`
2. Salve
3. **Esperado**: Converte para `https://youtube.com/embed/isPvBJnAVdc`

### Teste 3: Visualizar vídeo
1. Navegue até o curso → módulo → tópico
2. **Esperado**: Vídeo reproduz sem aviso de URL inválida

## 💡 Lições Aprendidas

### Regex com Anchors

**❌ Errado**:
```sql
video_url ~* 'youtube\.com/watch\?v=[a-zA-Z0-9_-]{11}'
```
Aceita: `lixo_antes_youtube.com/watch?v=abc123def45_lixo_depois`

**✅ Correto**:
```sql
video_url ~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$'
```
Aceita APENAS: `https://youtube.com/embed/abc123def45`

### Ordem de Migrations

**❌ Errado**:
1. Adicionar constraint rígida
2. Limpar dados

**✅ Correto**:
1. Remover constraint
2. Limpar dados
3. Adicionar constraint rígida

## 📞 Se Ainda Não Funcionar

### Erro: "constraint ... is violated"
**Causa**: Alguma URL não foi limpa corretamente.

**Solução**:
```sql
-- Ver URLs problemáticas
SELECT id, title, video_url 
FROM topics 
WHERE video_url IS NOT NULL 
  AND video_url != ''
  AND video_url !~* '^https?://(www\.)?youtube\.com/embed/[a-zA-Z0-9_-]{11}$';

-- Corrigir manualmente se necessário
UPDATE topics SET video_url = 'https://youtube.com/embed/VIDEO_ID' WHERE id = '...';
```

### Erro: "bucket apostolado-assets does not exist"
**Causa**: Bucket não criado.

**Solução**:
1. Supabase Dashboard → Storage
2. Create Bucket
3. Nome: `apostolado-assets`
4. Public: ✅ SIM
5. Re-executar migration 999

---

✅ **Migration 999 foi corrigida e está pronta para aplicar!**
