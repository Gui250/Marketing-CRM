# Deploy na Vercel - Marketing CRM

Este guia explica como fazer o deploy deste projeto na Vercel.

## Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Conta na [GitHub](https://github.com) (para conectar o repositório)
3. Banco de dados PostgreSQL (use uma das opções abaixo):
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Supabase](https://supabase.com)
   - [Neon](https://neon.tech)
   - [Railway](https://railway.app)

## Passos para Deploy

### 1. Preparar o Banco de Dados

Escolha uma das opções acima e crie um banco de dados PostgreSQL. Você precisará da string de conexão no formato:

```
postgresql://username:password@host:port/database
```

### 2. Fazer Push do Código para o GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

### 3. Importar o Projeto na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New Project"
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente (veja seção abaixo)
5. Clique em "Deploy"

### 4. Configurar Variáveis de Ambiente

Na Vercel, adicione as seguintes variáveis de ambiente:

#### Obrigatórias:

- `DATABASE_URL`: String de conexão do PostgreSQL
  ```
  postgresql://username:password@host:port/database
  ```

- `JWT_SECRET`: Uma string secreta aleatória para autenticação JWT
  ```
  Gere uma com: openssl rand -base64 32
  ```

#### Opcionais (podem ser configuradas depois via Settings na aplicação):

- `FACEBOOK_ADS_TOKEN`: Token de acesso do Facebook Ads API
- `GOOGLE_ADS_TOKEN`: Token OAuth2 do Google Ads
- `GOOGLE_ADS_DEVELOPER_TOKEN`: Developer Token do Google Ads
- `GOOGLE_ADS_CUSTOMER_ID`: Customer ID do Google Ads

### 5. Executar Migrations do Prisma

Após o primeiro deploy, você precisa executar as migrations do banco de dados:

1. Vá até o painel da Vercel
2. Acesse a aba "Settings" > "Functions"
3. Use a CLI da Vercel localmente para executar migrations:

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login
vercel login

# Link o projeto
vercel link

# Execute as migrations
vercel env pull .env.production.local
cd backend
npx prisma migrate deploy
```

**OU** configure o Vercel Postgres e use:

```bash
# Se estiver usando Vercel Postgres
npx prisma db push
```

### 6. Estrutura do Projeto

O projeto está configurado com a seguinte estrutura:

```
/
├── backend/           # API Node.js + Express + Prisma
│   ├── server.js      # Servidor principal
│   ├── prisma/        # Schema e migrations
│   └── package.json
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   └── package.json
├── vercel.json        # Configuração de deploy
└── .env.example       # Exemplo de variáveis de ambiente
```

### 7. Configuração Automática

O arquivo `vercel.json` já está configurado para:

- Build automático do frontend e backend
- Roteamento correto das APIs (`/api/*`)
- Servir os arquivos estáticos do frontend
- Executar `prisma generate` durante o build

## Após o Deploy

### Primeira Execução

1. Acesse a URL do seu deploy
2. Crie uma conta de usuário no sistema
3. Vá em Settings e configure seus tokens de API do Facebook e/ou Google Ads

### Verificar Logs

Para verificar erros ou problemas:

1. Acesse o painel da Vercel
2. Vá em "Deployments"
3. Clique no deployment mais recente
4. Verifique as abas "Build Logs" e "Runtime Logs"

## Solução de Problemas

### Erro de Conexão com Banco de Dados

- Verifique se a variável `DATABASE_URL` está correta
- Certifique-se de que o banco de dados aceita conexões externas
- Verifique se executou as migrations

### Erro 404 nas Rotas da API

- Verifique se o `vercel.json` está na raiz do projeto
- Certifique-se de que as rotas começam com `/api/`

### Erro de Build

- Verifique os logs de build no painel da Vercel
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se o `NODE_VERSION` é compatível (use Node 18+)

## Comandos Úteis

```bash
# Desenvolvimento local
npm run dev --prefix frontend   # Frontend na porta 5173
npm run dev --prefix backend    # Backend na porta 3000

# Build local para testar
cd frontend && npm run build
cd backend && npm run build

# Executar migrations
cd backend && npx prisma migrate dev

# Gerar Prisma Client
cd backend && npx prisma generate

# Ver banco de dados
cd backend && npx prisma studio
```

## Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma com Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Express com Vercel](https://vercel.com/guides/using-express-with-vercel)

## Suporte

Se encontrar problemas, verifique:

1. Variáveis de ambiente estão corretas
2. Banco de dados está acessível
3. Migrations foram executadas
4. Logs de erro no painel da Vercel
