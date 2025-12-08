# 🔐 Guia de Verificação DNS - Google Search Console

## ✅ Código de Verificação Recebido

```
google-site-verification=uuzFn_fYTdegmnmUi228QlFWUz_-bIYz7GsKz68mR2U
```

---

## 📝 Como Adicionar no DNS (GoDaddy/Namecheap/Registro.br)

### **OPÇÃO 1: Registro TXT (RECOMENDADO)**

1. **Acesse o painel do seu provedor de domínio** (onde você comprou apostoladosejasanto.com.br)

2. **Vá em: DNS Management / Gerenciar DNS / Zona DNS**

3. **Adicione um novo registro TXT**:
   - **Tipo**: TXT
   - **Nome/Host**: `@` (ou deixe vazio, ou `apostoladosejasanto.com.br`)
   - **Valor/Conteúdo**: `google-site-verification=uuzFn_fYTdegmnmUi228QlFWUz_-bIYz7GsKz68mR2U`
   - **TTL**: 3600 (ou padrão)

4. **Salve as alterações**

5. **Aguarde**: DNS pode levar de 5 minutos a 24 horas para propagar

6. **Volte ao Google Search Console e clique em "Verificar"**

---

### **OPÇÃO 2: Meta Tag HTML (MAIS RÁPIDO)**

Se você não tem acesso ao DNS, use a meta tag no site:

1. **Abra o arquivo**: `index.html`

2. **Adicione dentro de `<head>`**:
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- ADICIONAR ESTA LINHA -->
  <meta name="google-site-verification" content="uuzFn_fYTdegmnmUi228QlFWUz_-bIYz7GsKz68mR2U" />
  
  <title>Apostolado Seja Santo</title>
  <!-- resto do código -->
</head>
```

3. **Faça build e deploy**:
```bash
npm run build
git add -A
git commit -m "feat: add Google Search Console verification meta tag"
git push origin main
```

4. **Aguarde 2-3 minutos** (deploy da Vercel)

5. **Volte ao Google Search Console e clique em "Verificar"**

---

## 🔍 Verificar se DNS está configurado

### Testar online:
- Acesse: https://toolbox.googleapps.com/apps/dig/#TXT/apostoladosejasanto.com.br
- Procure por: `google-site-verification`

### Testar no PowerShell:
```powershell
nslookup -type=TXT apostoladosejasanto.com.br
```

---

## ⚡ Qual método escolher?

| Método | Vantagem | Desvantagem | Tempo |
|--------|----------|-------------|-------|
| **DNS TXT** | Não precisa modificar código | Precisa acesso ao DNS | 5min-24h |
| **Meta Tag HTML** | Mais rápido, sem DNS | Precisa fazer deploy | 2-5 minutos |

---

## 🎯 Recomendação

**Use a Meta Tag HTML** - É mais rápido e você já tem acesso ao código!

Vou adicionar para você agora no index.html.

---

## ❓ Troubleshooting

### "Verificação falhou"
- Aguarde mais tempo (DNS leva até 24h)
- Teste se o registro está visível com nslookup
- Tente a meta tag HTML

### "Não consigo acessar DNS"
- Entre em contato com quem gerencia o domínio
- Use a meta tag HTML como alternativa

### "DNS está correto mas não verifica"
- Limpe cache do DNS local: `ipconfig /flushdns`
- Aguarde propagação global (24-48h)
- Use ferramenta: https://www.whatsmydns.net/

---

**Escolha um método e me avise que eu te ajudo!** 🚀
