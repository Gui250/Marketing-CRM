import axios from 'axios';
import fs from 'fs';

const currentConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const fbToken = currentConfig.facebookAdsToken;

async function testFacebook() {
  try {
    // 1. Check token info
    console.log('--- Checking Token Info ---');
    const debugRes = await axios.get(`https://graph.facebook.com/debug_token?input_token=${fbToken}&access_token=${fbToken}`);
    console.log('Token Info:', JSON.stringify(debugRes.data, null, 2));

    // 2. List ad accounts
    console.log('\n--- Fetching Ad Accounts ---');
    const accountRes = await axios.get(`https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_status&access_token=${fbToken}`);
    console.log('Ad Accounts:', JSON.stringify(accountRes.data.data, null, 2));

    if (accountRes.data.data && accountRes.data.data.length > 0) {
      for (const account of accountRes.data.data) {
        const actId = account.id;
        console.log(`\n--- Campaigns for ${actId} (${account.name}) ---`);
        
        // 3. Get ALL campaigns (including paused/archived)
        const campaignsRes = await axios.get(`https://graph.facebook.com/v19.0/${actId}/campaigns?fields=name,status,objective,effective_status&limit=100&access_token=${fbToken}`);
        console.log('Campaigns:', JSON.stringify(campaignsRes.data.data, null, 2));
        console.log(`Total: ${campaignsRes.data.data.length} campaigns`);

        // 4. Insights
        console.log(`\n--- Insights for ${actId} ---`);
        const insightsRes = await axios.get(`https://graph.facebook.com/v19.0/${actId}/insights?fields=spend,impressions,clicks,cpc,cpm,actions&date_preset=last_30d&access_token=${fbToken}`);
        console.log('Insights:', JSON.stringify(insightsRes.data.data, null, 2));

        // 5. Daily breakdown for chart
        console.log(`\n--- Daily insights for ${actId} ---`);
        const dailyRes = await axios.get(`https://graph.facebook.com/v19.0/${actId}/insights?fields=spend,impressions,clicks&date_preset=last_7d&time_increment=1&access_token=${fbToken}`);
        console.log('Daily:', JSON.stringify(dailyRes.data.data, null, 2));
      }
    }
  } catch (err) {
    console.error('Error:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
}

testFacebook();
