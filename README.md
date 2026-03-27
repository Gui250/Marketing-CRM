# Marketing CRM - Dashboard de Anúncios

Sistema completo de gerenciamento de campanhas de marketing digital integrado com Facebook Ads e Google Ads.

## 🚀 Funcionalidades

- ✅ Autenticação de usuários (registro e login)
- 📊 Dashboard com métricas em tempo real
- 📈 Gráficos interativos de desempenho
- 🎯 Gerenciamento de campanhas multi-cliente
- 🔗 Integração com Facebook Ads API
- 🔗 Integração com Google Ads API
- ⚙️ Configurações centralizadas de tokens API
- 📱 Interface responsiva e moderna

## 🛠️ Tecnologias

### Frontend
- React 19 + TypeScript
- Vite
- TailwindCSS
- Recharts (gráficos)
- Axios
- React Router DOM

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs

## 📦 Instalação Local

### Pré-requisitos

- Node.js 18+ e npm
- PostgreSQL 14+
- Git

### Passo 1: Clone o repositório

```bash
git clone <seu-repositorio>
cd Marketing-CRM-main
```

### Passo 2: Instale as dependências

```bash
# Instalar dependências do backend e frontend
npm run install:all
```

### Passo 3: Configure as variáveis de ambiente

```bash
# Copie o arquivo .env.example para .env
cp .env.example backend/.env

# Edite o arquivo backend/.env com suas configurações
```

Variáveis obrigatórias:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=seu_secret_jwt_aqui
```

### Passo 4: Configure o banco de dados

```bash
cd backend
npx prisma migrate dev
npx prisma generate
cd ..
```

### Passo 5: Inicie o servidor de desenvolvimento

```bash
# Em um terminal, inicie o backend
npm run dev:backend

# Em outro terminal, inicie o frontend
npm run dev:frontend

# OU use concurrently para iniciar ambos
npm run dev
```

O frontend estará em `http://localhost:5173` e o backend em `http://localhost:3000`.

## 🌐 Deploy na Vercel

> ✅ **Este projeto está 100% pronto para deploy!** Veja o resumo completo: [DEPLOY_SUMMARY.md](./DEPLOY_SUMMARY.md)

### 🚀 Quick Start (3 passos)

Veja o guia rápido: [QUICK_START.md](./QUICK_START.md)

### 📘 Guia Completo com Vercel Postgres (Recomendado)

Para deploy completo usando Vercel Postgres: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

### 📙 Deploy Alternativo

Para deploy com outros bancos de dados PostgreSQL: [DEPLOY.md](./DEPLOY.md)

### 📚 Índice Completo de Documentação

Veja todos os guias disponíveis: [DOCS_INDEX.md](./DOCS_INDEX.md)

## 📁 Estrutura do Projeto

```
Marketing-CRM-main/
├── backend/              # API Node.js
│   ├── server.js        # Servidor Express
│   ├── prisma/          # Schema e migrations
│   └── package.json
├── frontend/            # Aplicação React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── config/      # Configurações
│   │   └── lib/         # Utilitários
│   └── package.json
├── vercel.json          # Configuração Vercel
├── .env.example         # Exemplo de variáveis
├── DEPLOY.md            # Guia de deploy
└── package.json         # Scripts raiz
```

## 🔑 Configuração de APIs

### Facebook Ads API

1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Crie um app e obtenha um token de acesso
3. Configure o token na página de Settings da aplicação

### Google Ads API

1. Acesse [Google Ads API](https://developers.google.com/google-ads/api/docs/start)
2. Obtenha:
   - OAuth2 Token
   - Developer Token
   - Customer ID
3. Configure na página de Settings da aplicação

## 🧪 Scripts Disponíveis

```bash
# Instalar todas as dependências
npm run install:all

# Desenvolvimento
npm run dev              # Inicia backend + frontend
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend

# Build de produção
npm run build            # Build backend + frontend

# Backend específico
cd backend
npm run dev              # Desenvolvimento
npm start                # Produção
npx prisma studio        # Visualizar banco de dados
npx prisma migrate dev   # Criar migration

# Frontend específico
cd frontend
npm run dev              # Desenvolvimento
npm run build            # Build produção
npm run preview          # Preview do build
```

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login

### Settings
- `GET /api/settings` - Obter configurações
- `POST /api/settings` - Salvar configurações

### Métricas
- `GET /api/metrics/facebook` - Métricas Facebook Ads
- `GET /api/metrics/google` - Métricas Google Ads
- `GET /api/analytics/all-clients` - Analytics multi-cliente

### Testes
- `POST /api/test/facebook` - Testar token Facebook
- `POST /api/test/google` - Testar token Google

## 🔒 Segurança

- Senhas criptografadas com bcryptjs
- Autenticação JWT
- Variáveis de ambiente protegidas
- Validação de dados nas APIs

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

## 📞 Suporte

Para problemas ou dúvidas:
- 🔧 **Problemas de Deploy?** Consulte [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 📖 **Guias de Deploy:**
  - [Quick Start](./QUICK_START.md)
  - [Deploy Vercel Postgres](./VERCEL_DEPLOY.md)
  - [Deploy Alternativo](./DEPLOY.md)
- 🐛 **Bugs:** Abra uma issue no GitHub

## 🎯 Roadmap

- [ ] Suporte a mais plataformas de anúncios
- [ ] Relatórios em PDF
- [ ] Notificações em tempo real
- [ ] Dashboard personalizável
- [ ] API RESTful documentada com Swagger
- [ ] Testes automatizados
