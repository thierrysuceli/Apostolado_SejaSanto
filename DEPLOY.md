# 🚀 Deploy na Vercel - Guia Rápido

## Pré-requisitos
- Conta na Vercel (https://vercel.com)
- Repositório no GitHub (✅ já feito!)

## Passos para Deploy

### 1. Acesse a Vercel
1. Vá para https://vercel.com
2. Faça login com sua conta GitHub

### 2. Importe o Projeto
1. Clique em **"Add New..."** → **"Project"**
2. Selecione o repositório: **`Apostolado_SejaSanto`**
3. Clique em **"Import"**

### 3. Configure o Projeto
A Vercel vai detectar automaticamente:
- ✅ **Framework Preset**: Vite
- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `dist`
- ✅ **Install Command**: `npm install`

**NÃO PRECISA MUDAR NADA!** A Vercel já reconhece tudo sozinha.

### 4. Deploy
1. Clique em **"Deploy"**
2. Aguarde ~1-2 minutos
3. Pronto! 🎉

## 🔧 Configurações Importantes

### vercel.json (já está configurado!)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**O que isso faz:**
- Garante que todas as rotas da SPA funcionem corretamente
- Redireciona todas as URLs para `index.html` (padrão de SPA)

## 📝 Comandos Importantes

### Build Local (testar antes de deploy)
```bash
npm run build
```

### Preview Build Localmente
```bash
npm run preview
```

## 🌐 Domínio

Após o deploy, você receberá URLs como:
- **Production**: `https://apostolado-seja-santo.vercel.app`
- **Preview**: `https://apostolado-seja-santo-git-main-thierrysuceli.vercel.app`

### Domínio Personalizado (opcional)
Se você tiver um domínio próprio:
1. Vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruções

## 🔄 Deploy Automático

**Cada push no GitHub vai fazer deploy automático!**
- Push na branch `main` → Deploy em produção
- Push em outras branches → Deploy de preview

## ⚠️ Troubleshooting

### Build falhou?
Verifique se roda localmente:
```bash
npm run build
```

### Página em branco?
Verifique se o `vercel.json` está presente (já está!)

### Imagens não carregam?
- Imagens na pasta `public/` são servidas na raiz
- Use caminhos absolutos: `/Apostolado_PNG.png`

## 📊 Variáveis de Ambiente (se necessário)

Se no futuro você adicionar API keys ou variáveis de ambiente:
1. Vá em **Settings** → **Environment Variables**
2. Adicione as variáveis necessárias
3. Faça redeploy

## ✅ Checklist Final

- [x] Repositório no GitHub criado
- [x] `vercel.json` configurado
- [x] Build local funciona (`npm run build`)
- [x] Pronto para deploy na Vercel!

## 🎯 Próximos Passos

1. Acesse https://vercel.com
2. Importe o projeto `Apostolado_SejaSanto`
3. Clique em "Deploy"
4. Compartilhe o link! 🎉

---

**Links Úteis:**
- Documentação Vercel: https://vercel.com/docs
- Suporte Vite: https://vitejs.dev/guide/static-deploy.html
- Repositório: https://github.com/thierrysuceli/Apostolado_SejaSanto
