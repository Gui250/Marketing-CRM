import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET ?? 'smart_crm_secret_key';
const DB_URL = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ Erro: DATABASE_URL não encontrada. Certifique-se de configurar as variáveis de ambiente.');
  process.exit(1);
}
const adapter = new PrismaPg({ connectionString: DB_URL });
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// ─── Auth ──────────────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('📝 Tentativa de registro:', { name, email });

  if (!name || !email || !password) {
    console.log('❌ Dados faltando');
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    console.log('🔍 Verificando se email já existe...');
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('⚠️  Email já cadastrado:', email);
      return res.status(409).json({ error: 'Este email já está cadastrado.' });
    }

    console.log('🔐 Hasheando senha...');
    const hashed = await bcrypt.hash(password, 10);

    console.log('💾 Criando usuário no banco...');
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    console.log('✅ Usuário criado com sucesso:', { id: user.id, name: user.name, email: user.email });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou senha incorretos.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// ─── Helper: get singleton config from DB ─────────────────────────────────────
async function getConfig() {
  let config = await prisma.apiConfig.findUnique({ where: { id: 'default' } });
  if (!config) {
    config = await prisma.apiConfig.create({ data: { id: 'default' } });
  }
  return config;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

app.get('/api/settings', async (req, res) => {
  try {
    const config = await getConfig();
    res.json({
      facebookAdsToken: config.facebookAdsToken || '',
      googleAdsToken: config.googleAdsToken || '',
      googleAdsDeveloperToken: config.googleAdsDeveloperToken || '',
      googleAdsCustomerId: config.googleAdsCustomerId || '',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { facebookAdsToken, googleAdsToken, googleAdsDeveloperToken, googleAdsCustomerId } = req.body;
    await prisma.apiConfig.upsert({
      where: { id: 'default' },
      update: {
        ...(facebookAdsToken?.trim() && { facebookAdsToken: facebookAdsToken.trim() }),
        ...(googleAdsToken?.trim() && { googleAdsToken: googleAdsToken.trim() }),
        ...(googleAdsDeveloperToken?.trim() && { googleAdsDeveloperToken: googleAdsDeveloperToken.trim() }),
        ...(googleAdsCustomerId?.trim() && { googleAdsCustomerId: googleAdsCustomerId.trim() }),
      },
      create: {
        id: 'default',
        facebookAdsToken: facebookAdsToken || '',
        googleAdsToken: googleAdsToken || '',
        googleAdsDeveloperToken: googleAdsDeveloperToken || '',
        googleAdsCustomerId: googleAdsCustomerId || '',
      },
    });
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// ─── Google Ads ───────────────────────────────────────────────────────────────

app.get('/api/metrics/google', async (req, res) => {
  try {
    const config = await getConfig();
    const { googleAdsToken, googleAdsDeveloperToken, googleAdsCustomerId } = config;

    if (!googleAdsToken || !googleAdsDeveloperToken || !googleAdsCustomerId) {
      return res.json({ hasToken: false });
    }

    const cleanCustomerId = googleAdsCustomerId.replace(/-/g, '');
    const dateRange = req.query.dateRange || 'LAST_7_DAYS';

    const query = `
      SELECT
        campaign.name,
        campaign.status,
        metrics.cost_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date DURING ${dateRange}
      ORDER BY metrics.cost_micros DESC
      LIMIT 50
    `;

    const response = await axios.post(
      `https://googleads.googleapis.com/v18/customers/${cleanCustomerId}/googleAds:searchStream`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${googleAdsToken}`,
          'developer-token': googleAdsDeveloperToken,
          'Content-Type': 'application/json',
        },
      }
    );

    const results = response.data.flatMap((batch) => batch.results || []);

    let totalCost = 0, totalImpressions = 0, totalClicks = 0, totalConversions = 0;
    const campaigns = [];

    for (const row of results) {
      const cost = Number(row.metrics?.costMicros || 0) / 1_000_000;
      totalCost += cost;
      totalImpressions += Number(row.metrics?.impressions || 0);
      totalClicks += Number(row.metrics?.clicks || 0);
      totalConversions += Number(row.metrics?.conversions || 0);

      campaigns.push({
        name: row.campaign?.name || '',
        meta: `${row.campaign?.status} · R$ ${cost.toFixed(2)} gasto`,
        status: row.campaign?.status === 'ENABLED' ? 'Active' : 'Paused',
      });
    }

    // Daily chart: separate query with date segmentation
    const chartQuery = `
      SELECT
        segments.date,
        metrics.cost_micros,
        metrics.clicks,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date DURING ${dateRange}
      ORDER BY segments.date ASC
    `;

    const chartResponse = await axios.post(
      `https://googleads.googleapis.com/v18/customers/${cleanCustomerId}/googleAds:searchStream`,
      { query: chartQuery },
      {
        headers: {
          Authorization: `Bearer ${googleAdsToken}`,
          'developer-token': googleAdsDeveloperToken,
          'Content-Type': 'application/json',
        },
      }
    );

    // Aggregate by date
    const chartByDate = {};
    for (const batch of chartResponse.data) {
      for (const row of batch.results || []) {
        const date = row.segments?.date;
        if (!date) continue;
        if (!chartByDate[date]) chartByDate[date] = { date, cost: 0, clicks: 0, cpc: 0, count: 0 };
        chartByDate[date].cost += Number(row.metrics?.costMicros || 0) / 1_000_000;
        chartByDate[date].clicks += Number(row.metrics?.clicks || 0);
        chartByDate[date].cpc += Number(row.metrics?.averageCpc || 0) / 1_000_000;
        chartByDate[date].count++;
      }
    }

    const chartData = Object.values(chartByDate).map((d) => ({
      date: d.date,
      spend: parseFloat(d.cost.toFixed(2)),
      clicks: d.clicks,
      cpc: d.count > 0 ? parseFloat((d.cpc / d.count).toFixed(2)) : 0,
    }));

    res.json({
      hasToken: true,
      kpis: [
        { label: 'Total Gasto', value: `R$ ${totalCost.toFixed(2)}`, change: '', positive: true },
        { label: 'Impressões', value: totalImpressions.toLocaleString('pt-BR'), change: '', positive: true },
        { label: 'Cliques', value: totalClicks.toLocaleString('pt-BR'), change: '', positive: true },
        { label: 'Conversões', value: totalConversions.toLocaleString('pt-BR'), change: '', positive: true },
      ],
      chartData,
      campaigns,
    });
  } catch (err) {
    console.error('Google Ads API error:', err.response?.data || err.message);
    res.status(500).json({
      hasToken: true,
      error: 'Falha ao buscar dados do Google Ads',
      details: err.response?.data?.error?.message || err.message,
    });
  }
});

// ─── Facebook Ads - List accounts ─────────────────────────────────────────────

app.get('/api/facebook/accounts', async (req, res) => {
  try {
    const config = await getConfig();
    const fbToken = config.facebookAdsToken;
    if (!fbToken) return res.json({ accounts: [] });

    const accountRes = await axios.get(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_status&access_token=${fbToken}`
    );
    res.json({ accounts: accountRes.data.data || [] });
  } catch (err) {
    console.error('Error fetching accounts:', err.response?.data || err.message);
    res.json({ accounts: [] });
  }
});

// ─── Facebook Ads - Real metrics ──────────────────────────────────────────────

app.get('/api/metrics/facebook', async (req, res) => {
  try {
    const config = await getConfig();
    const fbToken = config.facebookAdsToken;

    if (!fbToken) {
      return res.json({ hasToken: false });
    }

    const { accountId, dateRange = 'last_7d' } = req.query;

    // Resolve target account
    let targetAccountId = accountId && accountId !== 'all' ? accountId : null;
    if (!targetAccountId) {
      const accountsRes = await axios.get(
        `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name&access_token=${fbToken}`
      );
      const accounts = accountsRes.data.data || [];
      if (accounts.length === 0) {
        return res.json({ hasToken: true, summary: null, chartData: [], campaigns: [] });
      }
      targetAccountId = accounts[0].id;
    }

    // Summary insights
    const [insightsRes, chartRes, campaignsRes] = await Promise.all([
      axios.get(`https://graph.facebook.com/v19.0/${targetAccountId}/insights`, {
        params: {
          fields: 'spend,impressions,clicks,cpc,cpm,actions',
          date_preset: dateRange,
          access_token: fbToken,
        },
      }),
      // Daily breakdown for chart
      axios.get(`https://graph.facebook.com/v19.0/${targetAccountId}/insights`, {
        params: {
          fields: 'spend,impressions,clicks,cpc',
          date_preset: dateRange,
          time_increment: 1,
          access_token: fbToken,
        },
      }),
      // Campaigns
      axios.get(`https://graph.facebook.com/v19.0/${targetAccountId}/campaigns`, {
        params: {
          fields: 'name,status,objective',
          limit: 50,
          access_token: fbToken,
        },
      }),
    ]);

    const insightData = insightsRes.data.data?.[0] || {};
    const actions = insightData.actions || [];
    const linkClicksAction = actions.find((a) => a.action_type === 'link_click');
    const purchaseAction = actions.find((a) => a.action_type === 'purchase');

    const totalSpend = parseFloat(insightData.spend || '0');
    const purchaseValue = purchaseAction ? parseFloat(purchaseAction.value || '0') : 0;
    const roas = totalSpend > 0 && purchaseValue > 0 ? purchaseValue / totalSpend : 0;

    const chartData = (chartRes.data.data || []).map((d) => ({
      date: d.date_start,
      spend: parseFloat(d.spend || '0'),
      impressions: parseInt(d.impressions || '0'),
      clicks: parseInt(d.clicks || '0'),
      cpc: parseFloat(d.cpc || '0'),
    }));

    const campaigns = (campaignsRes.data.data || []).map((c) => ({
      name: c.name,
      meta: `${c.objective || ''} · ${targetAccountId}`,
      status: c.status === 'ACTIVE' ? 'Active' : 'Paused',
    }));

    res.json({
      hasToken: true,
      summary: {
        gastosAnuncios: totalSpend,
        cpc: parseFloat(insightData.cpc || '0'),
        cpm: parseFloat(insightData.cpm || '0'),
        impressions: parseInt(insightData.impressions || '0'),
        clicks: parseInt(insightData.clicks || '0'),
        linkClicks: linkClicksAction ? parseInt(linkClicksAction.value || '0') : parseInt(insightData.clicks || '0'),
        roas: parseFloat(roas.toFixed(2)),
      },
      chartData,
      campaigns,
    });
  } catch (err) {
    console.error('Facebook Ads API error:', err.response?.data || err.message);
    const fbError = err.response?.data?.error;
    // Token inválido ou expirado → tratar como sem token
    if (fbError?.type === 'OAuthException') {
      return res.json({
        hasToken: false,
        tokenExpired: true,
        details: fbError.message,
      });
    }
    res.status(500).json({
      hasToken: true,
      error: 'Falha ao buscar dados do Facebook Ads',
      details: fbError?.message || err.message,
    });
  }
});

// ─── Test tokens ──────────────────────────────────────────────────────────────

app.post('/api/test/facebook', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token obrigatório' });

  try {
    const accountRes = await axios.get(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name&access_token=${token}`
    );
    if (!accountRes.data.data || accountRes.data.data.length === 0) {
      return res.status(400).json({ error: 'Nenhuma conta de anúncio encontrada para este token' });
    }

    let totalCampaigns = 0;
    const accountNames = [];
    for (const account of accountRes.data.data) {
      accountNames.push(`${account.name} (${account.id})`);
      const campaignsRes = await axios.get(
        `https://graph.facebook.com/v19.0/${account.id}/campaigns?fields=name,status&limit=100&access_token=${token}`
      );
      totalCampaigns += campaignsRes.data.data.length;
    }

    res.json({
      success: true,
      message: `Token válido! ${accountRes.data.data.length} conta(s): ${accountNames.join(', ')}. Total: ${totalCampaigns} campanhas.`,
    });
  } catch (err) {
    res.status(400).json({ error: err.response?.data?.error?.message || err.message });
  }
});

app.post('/api/test/google', async (req, res) => {
  const { token, developerToken, customerId } = req.body;
  if (!token || !developerToken || !customerId) {
    return res.status(400).json({ error: 'Token OAuth2, developer token e customer ID são obrigatórios' });
  }

  try {
    const cleanCustomerId = customerId.replace(/-/g, '');
    const response = await axios.post(
      `https://googleads.googleapis.com/v18/customers/${cleanCustomerId}/googleAds:searchStream`,
      { query: 'SELECT customer.id, customer.descriptive_name FROM customer LIMIT 1' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json',
        },
      }
    );

    const results = response.data.flatMap((b) => b.results || []);
    const customerName = results[0]?.customer?.descriptiveName || cleanCustomerId;

    res.json({ success: true, message: `Token válido! Conta Google Ads: ${customerName} (${cleanCustomerId})` });
  } catch (err) {
    res.status(400).json({ error: err.response?.data?.error?.message || err.message });
  }
});

// ─── Multi-client Analytics (real Facebook Ads data) ──────────────────────────

app.get('/api/analytics/all-clients', async (req, res) => {
  try {
    const config = await getConfig();
    const fbToken = config.facebookAdsToken;

    if (!fbToken) {
      return res.json({ hasToken: false, clients: [] });
    }

    const dateRange = req.query.dateRange || 'last_30d';

    // 1. Fetch all ad accounts
    const accountsRes = await axios.get(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_status&access_token=${fbToken}`
    );
    const accounts = accountsRes.data.data || [];

    if (accounts.length === 0) {
      return res.json({ hasToken: true, clients: [] });
    }

    // 2. For each account, fetch campaign insights in parallel
    const clients = await Promise.all(
      accounts.map(async (account) => {
        try {
          // Campaign-level insights
          const insightsRes = await axios.get(
            `https://graph.facebook.com/v19.0/${account.id}/insights`,
            {
              params: {
                level: 'campaign',
                fields: 'campaign_id,campaign_name,spend,impressions,clicks,cpc,actions',
                date_preset: dateRange,
                limit: 100,
                access_token: fbToken,
              },
            }
          );

          const rows = insightsRes.data.data || [];

          const campaigns = rows.map((row) => {
            const spend = parseFloat(row.spend || '0');
            const clicks = parseInt(row.clicks || '0');
            const impressions = parseInt(row.impressions || '0');
            const cpc = parseFloat(row.cpc || '0');
            const purchaseAction = (row.actions || []).find((a) => a.action_type === 'purchase');
            const purchaseValue = purchaseAction ? parseFloat(purchaseAction.value || '0') : 0;
            const roas = spend > 0 && purchaseValue > 0 ? purchaseValue / spend : 0;

            return {
              id: row.campaign_id,
              name: row.campaign_name,
              spend,
              clicks,
              impressions,
              cpc,
              roas: parseFloat(roas.toFixed(2)),
              status: 'Active', // insights only returns active campaigns
            };
          });

          // Also fetch paused campaigns that have no recent insights
          const campaignsRes = await axios.get(
            `https://graph.facebook.com/v19.0/${account.id}/campaigns`,
            {
              params: {
                fields: 'id,name,status',
                limit: 100,
                access_token: fbToken,
              },
            }
          );

          const insightIds = new Set(campaigns.map((c) => c.id));
          for (const c of campaignsRes.data.data || []) {
            if (!insightIds.has(c.id)) {
              campaigns.push({
                id: c.id,
                name: c.name,
                spend: 0,
                clicks: 0,
                impressions: 0,
                cpc: 0,
                roas: 0,
                status: c.status === 'ACTIVE' ? 'Active' : 'Paused',
              });
            }
          }

          const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
          const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);

          return {
            id: account.id,
            name: account.name,
            metrics: { totalSpend, totalClicks },
            campaigns,
          };
        } catch (err) {
          console.error(`Error fetching data for account ${account.id}:`, err.response?.data || err.message);
          return {
            id: account.id,
            name: account.name,
            metrics: { totalSpend: 0, totalClicks: 0 },
            campaigns: [],
          };
        }
      })
    );

    res.json({ hasToken: true, clients });
  } catch (err) {
    console.error('Analytics error:', err.response?.data || err.message);
    const fbError = err.response?.data?.error;
    if (fbError?.type === 'OAuthException') {
      return res.json({ hasToken: false, tokenExpired: true, details: fbError.message });
    }
    res.status(500).json({
      hasToken: true,
      error: 'Falha ao buscar analytics',
      details: fbError?.message || err.message,
    });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
