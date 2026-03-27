# ✅ Checklist Pré-Deploy

Use esta lista para verificar se tudo está pronto antes de fazer deploy.

## 📋 Verificações Obrigatórias

### Git & Repositório
- [ ] Todo código commitado (`git status` deve estar limpo)
- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub (`git push` completo)
- [ ] Branch principal é `main` ou `master`

### Arquivos de Configuração
- [ ] `vercel.json` existe na raiz
- [ ] `.env.example` existe e está atualizado
- [ ] `.gitignore` existe e ignora arquivos sensíveis
- [ ] `package.json` (raiz) existe
- [ ] `backend/package.json` contém todas as dependências
- [ ] `frontend/package.json` contém todas as dependências

### Backend
- [ ] `backend/prisma/schema.prisma` configurado para Vercel Postgres
- [ ] Script `vercel-build` existe em `backend/package.json`
- [ ] Script `postinstall` existe em `backend/package.json`
- [ ] Arquivo `backend/.env` **NÃO** commitado (deve estar no `.gitignore`)

### Frontend
- [ ] Configuração de API centralizada existe (`frontend/src/config/api.ts`)
- [ ] Todos os componentes usam `getApiUrl()` para chamadas de API
- [ ] Build local funciona (`cd frontend && npm run build`)
- [ ] Não há URLs hardcoded de `localhost:3000`

## 🔍 Verificações de Código

### Imports e Dependências
```bash
# Teste se todos os imports estão corretos
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```
- [ ] `npm install` no backend completa sem erros
- [ ] `npm install` no frontend completa sem erros

### Build Local
```bash
# Teste o build localmente
cd frontend && npm run build
```
- [ ] Build completa sem erros
- [ ] Build completa sem warnings críticos
- [ ] Pasta `frontend/dist` é criada

### TypeScript
```bash
# Verifique erros de tipo
cd frontend && npm run build
```
- [ ] Compilação TypeScript sem erros
- [ ] Apenas warnings aceitáveis (se houver)

## 📚 Documentação

- [ ] `README.md` atualizado
- [ ] `QUICK_START.md` revisado
- [ ] `VERCEL_DEPLOY.md` revisado
- [ ] `DEPLOY_SUMMARY.md` revisado

## 🔐 Segurança

- [ ] Arquivo `.env` **NÃO** está no Git
- [ ] Arquivo `.env.example` **SIM** está no Git
- [ ] Nenhum token ou senha hardcoded no código
- [ ] `.gitignore` ignora arquivos sensíveis:
  - `node_modules/`
  - `.env`
  - `.env.local`
  - `*.log`

## 🧪 Testes Locais (Opcional mas Recomendado)

```bash
# 1. Configure .env local
cp .env.example backend/.env
# Edite backend/.env com suas credenciais locais

# 2. Rode as migrations
cd backend && npx prisma db push && cd ..

# 3. Inicie o projeto
npm run dev

# 4. Teste no navegador
# - Registro: http://localhost:5173/register
# - Login: http://localhost:5173/login
# - Dashboard: http://localhost:5173/dashboard
```

- [ ] Aplicação inicia sem erros
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] APIs respondem

## 🚀 Pronto para Deploy?

Se todos os itens acima estão marcados, você está pronto!

### Próximo Passo:

Escolha um guia:
- **Rápido (5 min)**: [QUICK_START.md](./QUICK_START.md)
- **Completo (15 min)**: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

---

## ⚠️ Avisos Importantes

### Antes de Fazer Deploy:

1. **Não commite arquivos `.env`**
   ```bash
   # Verifique:
   git status
   # Se .env aparecer, adicione ao .gitignore!
   ```

2. **Certifique-se de usar Vercel Postgres**
   - Outras soluções de banco podem funcionar
   - Mas Vercel Postgres é a mais fácil e integrada

3. **Prepare-se para configurar JWT_SECRET**
   - Você precisará gerar e adicionar após o primeiro deploy
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. **Primeiro deploy pode falhar**
   - Isso é normal!
   - Você precisa configurar banco e env vars
   - Depois é só fazer redeploy

---

## 🎯 Workflow Recomendado

```
1. ✅ Marque todos os itens deste checklist
2. 📤 git push (envie código para GitHub)
3. 🚀 Importe projeto na Vercel
4. ⚙️  Configure Vercel Postgres
5. 🔑 Adicione JWT_SECRET
6. 🔄 Redeploy
7. ✨ Teste a aplicação online!
```

---

## 📞 Se Algo Der Errado

- 🔧 **Problemas?** Consulte [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 📖 **Dúvidas?** Veja [DOCS_INDEX.md](./DOCS_INDEX.md)

---

**Boa sorte com seu deploy! 🎉**
