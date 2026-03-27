# 🔧 Troubleshooting - Vercel Deploy

Soluções para problemas comuns ao fazer deploy na Vercel.

## 🚨 Problemas Comuns

### 1. Deploy Falha no Build

**Sintomas:**
- Build logs mostram erro durante `npm install`
- Erro: `Error: Cannot find module 'xyz'`

**Soluções:**

```bash
# 1. Verifique se todas as dependências estão no package.json
cd backend
npm install
cd ../frontend
npm install

# 2. Commit as alterações
git add .
git commit -m "Fix dependencies"
git push

# 3. Redeploy na Vercel
```

---

### 2. Erro de Prisma: "Can't reach database server"

**Sintomas:**
- Runtime error: `PrismaClientInitializationError`
- Erro: `Can't reach database server`

**Soluções:**

1. **Verifique se o Vercel Postgres foi criado:**
   - Vá em **Storage** na Vercel
   - Deve haver um banco Postgres listado

2. **Verifique as variáveis de ambiente:**
   - Vá em **Settings** > **Environment Variables**
   - Deve ter: `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_URL`

3. **Se as variáveis não existem:**
   ```
   1. Vá em Storage > Create Database
   2. Selecione Postgres
   3. As variáveis serão criadas automaticamente
   4. Faça Redeploy
   ```

---

### 3. Erro: "Table 'User' does not exist"

**Sintomas:**
- API retorna erro 500
- Runtime logs mostram: `Table does not exist`

**Solução:**

```bash
# O banco foi criado mas as tabelas não existem
# As migrations devem rodar automaticamente, mas se não rodaram:

# Opção 1: Redeploy (recomendado)
1. Vá em Deployments
2. Clique nos 3 pontos do último deploy
3. Redeploy

# Opção 2: Rodar migrations manualmente
1. Instale Vercel CLI: npm i -g vercel
2. vercel login
3. vercel link
4. vercel env pull .env.production.local
5. cd backend
6. npx prisma db push
```

---

### 4. Erro 404 nas Rotas da API

**Sintomas:**
- `/api/auth/login` retorna 404
- Frontend não consegue se conectar ao backend

**Soluções:**

1. **Verifique se `vercel.json` existe na raiz:**
   ```bash
   ls -la vercel.json
   ```

2. **Verifique o conteúdo de `vercel.json`:**
   - Deve ter roteamento para `/api/*`
   - Deve apontar para `backend/server.js`

3. **Verifique os Runtime Logs:**
   - Vá em **Deployments** > Último deploy > **Runtime Logs**
   - Veja se há erros no servidor

---

### 5. JWT_SECRET não configurado

**Sintomas:**
- Erro ao fazer login/registro
- Logs mostram: `JWT_SECRET is not defined`

**Solução:**

```bash
# 1. Gere um JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 2. Adicione na Vercel
1. Vá em Settings > Environment Variables
2. Adicione: JWT_SECRET = (cole o valor gerado)
3. Redeploy
```

---

### 6. CORS Error no Frontend

**Sintomas:**
- Erro no console: `CORS policy: No 'Access-Control-Allow-Origin'`
- Requisições da API falham

**Solução:**

O projeto já tem CORS configurado, mas se o erro persistir:

1. **Verifique se está usando URLs relativas no frontend:**
   - Deve usar `/api/...` em produção
   - O arquivo `frontend/src/config/api.ts` já faz isso

2. **Limpe o cache do navegador:**
   - Ctrl+Shift+R (ou Cmd+Shift+R no Mac)

---

### 7. Environment Variables não aparecem

**Sintomas:**
- Variáveis configuradas não funcionam
- `process.env.VAR_NAME` retorna `undefined`

**Solução:**

1. **Variáveis de ambiente precisam de redeploy:**
   ```
   1. Adicione/edite a variável
   2. Vá em Deployments
   3. Redeploy o projeto
   ```

2. **No backend, use o formato correto:**
   ```javascript
   // Correto
   const secret = process.env.JWT_SECRET;

   // Incorreto (não funciona na Vercel)
   import { JWT_SECRET } from './config';
   ```

---

### 8. Build Muito Lento ou Timeout

**Sintomas:**
- Build demora mais de 10 minutos
- Build timeout

**Soluções:**

1. **Verifique o plano da Vercel:**
   - Plano gratuito tem limite de tempo
   - Considere upgrade se necessário

2. **Otimize as dependências:**
   ```bash
   # Remova dependências não utilizadas
   npm prune

   # Use dependências de dev apenas onde necessário
   npm install --save-dev nomePacote
   ```

---

### 9. Página em Branco após Deploy

**Sintomas:**
- Deploy completa sem erros
- Mas página mostra tela branca
- Console mostra erros JavaScript

**Soluções:**

1. **Verifique os Console Logs do navegador:**
   - Pressione F12
   - Vá na aba Console
   - Veja os erros

2. **Problemas comuns:**
   ```javascript
   // Erro: Imports incorretos
   // Certifique-se de que os paths estão corretos

   // Erro: Variáveis de ambiente
   // Use import.meta.env.VITE_* no frontend (Vite)
   ```

3. **Teste o build localmente:**
   ```bash
   cd frontend
   npm run build
   npm run preview
   # Acesse http://localhost:4173
   ```

---

### 10. Dados não Persistem entre Deploys

**Sintomas:**
- Dados criados desaparecem
- Usuários registrados somem

**Causa:**
- Você está usando banco de dados local (SQLite)
- Precisa usar Vercel Postgres

**Solução:**

1. **Configure Vercel Postgres:**
   - Vá em **Storage** > **Create Database**
   - Selecione **Postgres**

2. **Verifique o schema.prisma:**
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("POSTGRES_PRISMA_URL")
     directUrl = env("POSTGRES_URL_NON_POOLING")
   }
   ```

---

## 📊 Como Ver os Logs

### Build Logs
```
Vercel Dashboard > Deployments > Último Deploy > Build Logs
```
Mostra erros durante o build (npm install, compilação, etc.)

### Runtime Logs
```
Vercel Dashboard > Deployments > Último Deploy > Runtime Logs
```
Mostra erros durante execução (API calls, database, etc.)

### Browser Console
```
F12 > Console (no seu navegador)
```
Mostra erros JavaScript do frontend

---

## 🆘 Precisa de Mais Ajuda?

1. **Verifique a documentação oficial:**
   - [Vercel Docs](https://vercel.com/docs)
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Prisma Vercel Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

2. **Comunidade:**
   - [Vercel Community](https://github.com/vercel/vercel/discussions)
   - [Prisma Community](https://www.prisma.io/community)

3. **Reset Completo (último recurso):**
   ```bash
   # 1. Delete o projeto na Vercel
   # 2. Delete o Storage (Postgres)
   # 3. Crie tudo novamente seguindo VERCEL_DEPLOY.md
   ```

---

## ✅ Checklist de Verificação

Antes de pedir ajuda, verifique:

- [ ] Vercel Postgres foi criado?
- [ ] Variáveis de ambiente configuradas?
- [ ] `JWT_SECRET` está definido?
- [ ] `vercel.json` está na raiz?
- [ ] Build logs sem erros?
- [ ] Runtime logs sem erros?
- [ ] Tentou fazer redeploy?
- [ ] Limpou cache do navegador?

---

**Última atualização:** 2025-03-27
