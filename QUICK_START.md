# 🚀 Quick Start - Deploy na Vercel

## Deploy em 3 Passos

### 1️⃣ Push para GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

### 2️⃣ Importar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte sua conta do GitHub
3. Selecione o repositório
4. Clique em **Deploy**

### 3️⃣ Configurar Banco de Dados

**No painel da Vercel:**

1. Vá em **Storage** → **Create Database**
2. Selecione **Postgres** → **Create**
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   ```
   JWT_SECRET = (gere com: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
   ```
5. Vá em **Deployments** → **Redeploy**

---

## ✅ Pronto!

Seu projeto está no ar em: `https://seu-projeto.vercel.app`

---

## 📖 Guias Detalhados

- **Deploy Completo**: Veja [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
- **Documentação Full**: Veja [README.md](./README.md)
- **Deploy Alternativo**: Veja [DEPLOY.md](./DEPLOY.md)

---

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm run install:all

# Configurar .env
cp .env.example backend/.env
# Edite backend/.env com suas credenciais

# Executar migrations
cd backend && npx prisma db push && cd ..

# Iniciar dev
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

---

## 🐛 Problemas?

1. **Deploy falhou?** → Verifique os Build Logs na Vercel
2. **Erro de DB?** → Certifique-se que criou o Vercel Postgres
3. **404 nas APIs?** → Verifique se `vercel.json` está na raiz
4. **Precisa de ajuda?** → Consulte [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
