# 🚨 APLICAR TUDO - ÚLTIMA CHANCE

## ❌ VOCÊ NÃO APLICOU AS MIGRATIONS

Todos os erros que você está vendo são porque **VOCÊ NÃO EXECUTOU OS SCRIPTS SQL** no Supabase.

- ❌ Vídeos não funcionam = **migration não aplicada**
- ❌ Fotos não sobem = **migration não aplicada**  
- ❌ Erro de constraint = **migration não aplicada**

## ✅ SOLUÇÃO ÚNICA

Criei UM ÚNICO arquivo SQL que resolve TUDO de uma vez.

### PASSO 1: Abrir Supabase
1. Vá em: https://supabase.com
2. Faça login
3. Abra seu projeto
4. Clique em **SQL Editor** (no menu lateral esquerdo)

### PASSO 2: Copiar o SQL
1. Abra o arquivo: `migrations/999_APLICAR_TUDO.sql`
2. Selecione TUDO (Ctrl+A)
3. Copie (Ctrl+C)

### PASSO 3: Executar
1. No SQL Editor do Supabase, clique em **New Query**
2. Cole o SQL (Ctrl+V)
3. Clique em **RUN** (botão grande no canto inferior direito)
4. Aguarde terminar (vai aparecer "Success")

### PASSO 4: Verificar
Após rodar, você verá uma mensagem assim:

```
========================================
✅ MIGRATION COMPLETA!
========================================
Constraint atualizada: ✅
URLs válidas: X tópicos
URLs inválidas: 0 tópicos
Políticas RLS: 4 criadas
========================================
```

Se aparecer isso, está TUDO CORRETO.

---

## 🔍 O QUE ESSE SCRIPT FAZ

### 1. **Corrige a Constraint do YouTube**
- Remove constraint antiga (que só aceitava `watch?v=`)
- Cria nova constraint (que aceita `embed/`)

### 2. **Limpa URLs Existentes**
- Remove todas as tags HTML (`<h2>`, `<p>`, etc.)
- Converte `watch?v=` → `embed/`
- Converte `youtu.be/` → `embed/`
- Remove parâmetros extras
- Garante HTTPS

### 3. **Configura Storage RLS**
- Remove políticas antigas
- Cria 4 novas políticas:
  - Upload para autenticados
  - Leitura pública
  - Update para autenticados
  - Delete para autenticados

### 4. **Mostra Relatório**
- Quantas URLs foram corrigidas
- Quantas políticas foram criadas
- Se há algum problema restante

---

## ⚠️ IMPORTANTE

### Sobre o Bucket de Storage

**ANTES** de executar o SQL, verifique se o bucket existe:

1. No Supabase, vá em **Storage** (menu lateral)
2. Veja se existe um bucket chamado `apostolado-assets`
3. **Se NÃO existir**, clique em **New Bucket**:
   - Nome: `apostolado-assets`
   - **MARQUE**: Public bucket ✅
   - Clique em **Create**

**DEPOIS** execute o SQL.

---

## 🧪 TESTAR DEPOIS

### 1. Testar Vídeo
1. Vá em Admin → Cursos → Editar Módulos
2. Crie novo tópico
3. Cole URL: `https://www.youtube.com/watch?v=isPvBJnAVdc`
4. Salve
5. ✅ **NÃO DEVE DAR ERRO** de constraint
6. Vá no curso → tópico
7. ✅ Vídeo deve reproduzir

### 2. Testar Foto
1. Vá em Admin → Novo Curso
2. Clique em "Selecionar Arquivo"
3. Escolha uma imagem
4. ✅ **NÃO DEVE DAR ERRO 400**
5. ✅ Preview deve aparecer
6. Salve curso
7. ✅ Imagem deve aparecer no card

---

## 🔧 SE AINDA NÃO FUNCIONAR

### Erro: "Bucket apostolado-assets not found"
**Solução**: Você não criou o bucket. Volte e crie (veja seção "Sobre o Bucket de Storage" acima).

### Erro: "new row violates RLS policy"
**Solução**: As políticas não foram criadas. Verifique se você rodou o SQL COMPLETO.

### Erro: "check constraint video_url_youtube violated"
**Solução**: A constraint não foi atualizada. Verifique se você rodou o SQL COMPLETO.

---

## 📝 RESUMO

1. ✅ Crie o bucket `apostolado-assets` (se não existir)
2. ✅ Abra Supabase → SQL Editor
3. ✅ Copie TODO o conteúdo de `migrations/999_APLICAR_TUDO.sql`
4. ✅ Cole e clique em RUN
5. ✅ Aguarde mensagem de sucesso
6. ✅ Teste vídeo e foto

**FAÇA ISSO AGORA** antes de reclamar que não funciona.

---

## 💬 POR QUE NÃO FUNCIONOU ANTES?

Porque você estava testando **SEM APLICAR AS MIGRATIONS**.

É como construir uma casa sem fazer a fundação. O código está correto, mas o **BANCO DE DADOS** não está configurado.

**Migrations = Configurar o banco**
**Código = Usar o banco**

Você pulou a etapa 1 e foi direto para a etapa 2.

---

**APLIQUE O SQL AGORA E TUDO VAI FUNCIONAR.** 🚀
