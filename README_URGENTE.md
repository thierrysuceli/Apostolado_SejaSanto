# 🎯 AÇÃO URGENTE - CORRIGIR UPLOAD DE IMAGENS

## ✅ O Que Já Funciona

1. **Vídeos do YouTube** - Reproduzindo perfeitamente
2. **AdminCourseCreate** - Interface completa com tags

## ❌ O Que Falta

**Upload de imagens retornando 400 (Bad Request)**

## 🔧 Solução em 3 Passos

### PASSO 1: Criar Bucket (2 minutos)

1. Abra **Supabase Dashboard**
2. Vá em **Storage** (menu lateral)
3. Veja se existe bucket **`apostolado-assets`**

**Se NÃO existir**:
- Clique em **"New bucket"**
- Nome: `apostolado-assets`
- Public: ✅ **MARCAR ESTA OPÇÃO**
- Clique em **"Create bucket"**

**Se JÁ existir**:
- Clique no bucket
- Configurações → **Marcar como Public**

### PASSO 2: Executar SQL (1 minuto)

1. Vá em **SQL Editor** no Supabase
2. Clique em **"New query"**
3. Copie TODO o arquivo: `migrations/BUCKET_E_RLS.sql`
4. Cole e clique em **RUN**
5. Aguarde mensagem: **`✅ STORAGE CONFIGURADO!`**

### PASSO 3: Testar (30 segundos)

1. Vá em **Admin → Criar Novo Curso**
2. Seção "Imagem de Capa"
3. Clique em **"Selecionar Arquivo"**
4. Escolha uma imagem (JPG/PNG)
5. **Esperado**: Preview aparece, sem erros no console

## 📋 O Que o Script Faz

Cria 4 políticas de segurança:
- ✅ Usuários autenticados podem **fazer upload**
- ✅ Qualquer pessoa pode **ver** (público)
- ✅ Usuários autenticados podem **atualizar**
- ✅ Usuários autenticados podem **deletar**

## 🎉 Resultado Final

Depois de aplicar:
- ✅ Upload de imagens funciona
- ✅ Capas dos cursos aparecem
- ✅ Sem erro 400
- ✅ Todos os 3 problemas resolvidos!

---

**Tempo total**: ~4 minutos

**Arquivos**:
- `migrations/BUCKET_E_RLS.sql` ← Execute este
- `SOLUCAO_3_PROBLEMAS.md` ← Documentação completa
- `PROBLEMA_IDENTIFICADO.md` ← Análise técnica dos vídeos

---

💡 **Dica**: Se tiver dúvida, leia `SOLUCAO_3_PROBLEMAS.md` para explicação detalhada!
