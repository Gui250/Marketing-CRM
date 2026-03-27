# Deploy Rápido na Vercel com Vercel Postgres

Guia simplificado para fazer deploy completo do projeto na Vercel usando Vercel Postgres.

## 🚀 Deploy em 5 Minutos

### 1. Preparar o Código

```bash
# Certifique-se de estar na raiz do projeto
cd Marketing-CRM-main

# Faça commit de todas as alterações
git add .
git commit -m "Ready for Vercel deployment"

# Se ainda não tem repositório no GitHub, crie:
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

### 2. Criar Projeto na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe seu repositório do GitHub
4. Mantenha as configurações padrão e clique em **"Deploy"**

**⚠️ IMPORTANTE**: O primeiro deploy vai falhar - isso é esperado! Precisamos configurar o banco de dados primeiro.

### 3. Configurar Vercel Postgres

#### No Painel da Vercel:

1. Vá para seu projeto
2. Clique na aba **"Storage"**
3. Clique em **"Create Database"**
4. Selecione **"Postgres"**
5. Escolha **"Serverless SQL"** (Vercel Postgres)
6. Aceite os termos e clique em **"Create"**

O Vercel vai criar automaticamente as seguintes variáveis de ambiente:
- `POSTGRES_URL` - URL de conexão direta
- `POSTGRES_URL_NON_POOLING` - URL sem pooling (para migrations)
- `POSTGRES_PRISMA_URL` - URL com pooling (para Prisma)
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 4. Configurar Variáveis de Ambiente Adicionais

1. No painel da Vercel, vá em **Settings** > **Environment Variables**
2. Adicione estas variáveis:

```env
# JWT Secret (gere um token seguro)
JWT_SECRET=your_secure_random_string_here

# Opcional - Configure depois via Settings da aplicação
FACEBOOK_ADS_TOKEN=
GOOGLE_ADS_TOKEN=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CUSTOMER_ID=
```

**Para gerar um JWT_SECRET seguro:**
```bash
# No seu terminal local
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Re-deploy

1. Vá para a aba **"Deployments"**
2. Clique nos três pontos do último deploy
3. Clique em **"Redeploy"**
4. Aguarde o deploy completar (1-3 minutos)

✅ **Pronto! Seu projeto está no ar!**

## 🔍 Verificar se está Funcionando

Após o deploy:

1. Clique no link do seu projeto (ex: `seu-projeto.vercel.app`)
2. Você deve ver a página de landing
3. Teste criar uma conta em `/register`
4. Faça login em `/login`
5. Acesse o dashboard

## 📊 Configurar APIs de Anúncios (Opcional)

Depois do deploy, você pode configurar as APIs de anúncios:

1. Acesse seu projeto deployado
2. Faça login
3. Vá em **Settings**
4. Configure seus tokens:
   - Facebook Ads Token
   - Google Ads OAuth2 Token
   - Google Ads Developer Token
   - Google Ads Customer ID

## 🔧 Estrutura do Projeto

O Vercel reconhece automaticamente:

```
Marketing-CRM-main/
├── backend/              → API serverless
│   ├── server.js        → Handler principal
│   └── prisma/          → Database schema
└── frontend/            → Static site
    └── dist/            → Build output
```

## 📝 Variáveis de Ambiente Necessárias

### Obrigatórias (Criadas Automaticamente pelo Vercel Postgres):
- ✅ `POSTGRES_PRISMA_URL`
- ✅ `POSTGRES_URL_NON_POOLING`
- ✅ `POSTGRES_URL`

### Obrigatórias (Você Precisa Adicionar):
- ⚠️ `JWT_SECRET` - Para autenticação JWT

### Opcionais (Configure depois):
- 🔹 `FACEBOOK_ADS_TOKEN`
- 🔹 `GOOGLE_ADS_TOKEN`
- 🔹 `GOOGLE_ADS_DEVELOPER_TOKEN`
- 🔹 `GOOGLE_ADS_CUSTOMER_ID`

## 🐛 Solução de Problemas

### Deploy Falha no Build

**Problema**: Erro durante `npm install` ou `prisma generate`

**Solução**:
1. Verifique os logs em **Deployments** > Último deploy > **Build Logs**
2. Certifique-se de que o `package.json` está correto
3. Tente fazer redeploy

### Erro de Conexão com Banco de Dados

**Problema**: `PrismaClientInitializationError`

**Solução**:
1. Verifique se o Vercel Postgres foi criado
2. Confirme que as variáveis `POSTGRES_*` existem em **Settings** > **Environment Variables**
3. Faça um redeploy

### Rotas da API retornam 404

**Problema**: `/api/*` não funciona

**Solução**:
1. Verifique se o arquivo `vercel.json` está na raiz
2. Confirme que as rotas começam com `/api/`
3. Verifique os **Runtime Logs**

### Erro "Module not found"

**Problema**: Imports não encontrados

**Solução**:
1. Certifique-se de que todas as dependências estão no `package.json`
2. Delete `node_modules` e `.vercel` localmente
3. Faça novo commit e push

## 🎯 URLs Importantes

Após deploy, suas URLs serão:

- **Frontend**: `https://seu-projeto.vercel.app`
- **API**: `https://seu-projeto.vercel.app/api/*`
- **Login**: `https://seu-projeto.vercel.app/login`
- **Dashboard**: `https://seu-projeto.vercel.app/dashboard`

## 🔄 Atualizações Futuras

Para atualizar o projeto:

```bash
# Faça suas alterações
git add .
git commit -m "Descrição das alterações"
git push

# O Vercel faz deploy automaticamente!
```

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma com Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

## ✅ Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Projeto importado na Vercel
- [ ] Vercel Postgres criado
- [ ] `JWT_SECRET` configurado
- [ ] Primeiro deploy concluído
- [ ] Teste de criação de conta funcionando
- [ ] Teste de login funcionando
- [ ] Dashboard acessível

---

**🎉 Parabéns! Seu projeto está online!**

Se precisar de ajuda, consulte os logs de erro em:
- **Build Logs**: Erros durante build
- **Runtime Logs**: Erros durante execução
