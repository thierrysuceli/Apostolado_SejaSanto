# 🚀 Guia Rápido de Instalação da Bíblia

## ✅ PASSO 1: Executar o Schema

Acesse o **SQL Editor** do Supabase e execute:

```
supabase/migrations/011_biblia_schema.sql
```

✅ Isso cria as 3 tabelas: `bible_books`, `bible_chapters`, `bible_verses`

---

## 🔥 PASSO 2: Importar os Dados (ESCOLHA UMA OPÇÃO)

### 📋 OPÇÃO A: Arquivo Único (RECOMENDADO para SQL Editor)

Execute o arquivo combinado no **SQL Editor** do Supabase:

```
supabase/migrations/biblia-inserts/011_biblia_COMBINED_ALL.sql
```

**⚠️ ATENÇÃO**: Este arquivo tem 7.41 MB e pode demorar ou dar timeout no SQL Editor web. Se der erro, use a **OPÇÃO B**.

---

### 🤖 OPÇÃO B: Importação Automática via Script (MAIS RÁPIDO)

Este método usa a API do Supabase diretamente via Node.js e é **muito mais rápido e confiável**.

#### 1. Configure as credenciais do Supabase

**PowerShell:**
```powershell
$env:SUPABASE_URL="https://SEU-PROJETO.supabase.co"
$env:SUPABASE_SERVICE_KEY="SUA_SERVICE_KEY_AQUI"
```

**Onde encontrar:**
- `SUPABASE_URL`: Settings → API → Project URL
- `SUPABASE_SERVICE_KEY`: Settings → API → service_role (secret)

#### 2. Execute o script de importação

```powershell
node scripts/import-biblia-to-supabase.js
```

✅ **Pronto!** O script importa automaticamente:
- 73 livros
- 1.334 capítulos  
- 35.450 versículos

**Vantagens:**
- ✅ Mais rápido (usa API direta)
- ✅ Não dá timeout
- ✅ Mostra progresso em tempo real
- ✅ Limpa dados antigos automaticamente

---

## 📊 PASSO 3: Verificar Importação

Execute no **SQL Editor**:

```sql
-- Deve retornar 73
SELECT COUNT(*) FROM bible_books;

-- Deve retornar 1334
SELECT COUNT(*) FROM bible_chapters;

-- Deve retornar 35450
SELECT COUNT(*) FROM bible_verses;

-- Testar um versículo (João 3:16)
SELECT bv.verse_number, bv.text 
FROM bible_verses bv
JOIN bible_chapters bc ON bv.chapter_id = bc.id
JOIN bible_books bb ON bc.book_id = bb.id
WHERE bb.abbrev = 'jo' AND bc.chapter_number = 3 AND bv.verse_number = 16;
```

---

## 🎯 PASSO 4: Testar no Site

Acesse: `https://seu-site.vercel.app/biblia`

**Deve funcionar:**
- ✅ Carregar automaticamente João 3
- ✅ Menu de livros (modal compacto)
- ✅ Navegação entre capítulos
- ✅ Leitura fluida dos versículos

---

## 🐛 Problemas Comuns

### ❌ "Request Entity Too Large" no SQL Editor
**Solução:** Use a **OPÇÃO B** (script automático)

### ❌ "Timeout" no SQL Editor
**Solução:** Use a **OPÇÃO B** (script automático)

### ❌ "value too long for type character varying(10)"
**Solução:** Execute novamente o `011_biblia_schema.sql` (já foi corrigido para VARCHAR(20))

### ❌ Script diz "SUA_URL_AQUI"
**Solução:** Configure as variáveis de ambiente antes de executar

---

## 📝 Resumo

| Método | Velocidade | Confiabilidade | Facilidade |
|--------|-----------|----------------|-----------|
| **SQL Editor** (arquivo único) | Lento | Médio (pode dar timeout) | Fácil (copiar/colar) |
| **Script Node.js** (automático) | **Rápido** | **Alta** | Médio (precisa configurar) |

**Recomendação:** Use o **Script Node.js** se você tem as credenciais do Supabase. É muito mais rápido!

---

## ✅ Checklist Final

- [ ] Schema executado (011_biblia_schema.sql)
- [ ] Dados importados (uma das opções acima)
- [ ] Contagens verificadas (73 / 1334 / 35450)
- [ ] Testado João 3:16 no SQL
- [ ] Testado /biblia no site
- [ ] ✨ Funciona perfeitamente!
