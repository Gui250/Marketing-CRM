import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { getApiUrl } from '@/config/api';

export function Settings() {
  // Indica se já existe token salvo no banco (não armazena o valor)
  const [hasFbToken, setHasFbToken] = useState(false);
  const [hasGoogleToken, setHasGoogleToken] = useState(false);
  const [hasGoogleDev, setHasGoogleDev] = useState(false);
  const [hasGoogleCustomer, setHasGoogleCustomer] = useState(false);

  // Campos novos digitados pelo usuário (vazios por padrão)
  const [facebookAdsToken, setFacebookAdsToken] = useState('');
  const [googleAdsToken, setGoogleAdsToken] = useState('');
  const [googleAdsDeveloperToken, setGoogleAdsDeveloperToken] = useState('');
  const [googleAdsCustomerId, setGoogleAdsCustomerId] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(getApiUrl('/api/settings'));
      // Só indicamos se existe — nunca colocamos o valor no input
      setHasFbToken(!!res.data.facebookAdsToken);
      setHasGoogleToken(!!res.data.googleAdsToken);
      setHasGoogleDev(!!res.data.googleAdsDeveloperToken);
      setHasGoogleCustomer(!!res.data.googleAdsCustomerId);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Só envia campos que o usuário preencheu
      const payload: Record<string, string> = {};
      if (facebookAdsToken.trim()) payload.facebookAdsToken = facebookAdsToken.trim();
      if (googleAdsToken.trim()) payload.googleAdsToken = googleAdsToken.trim();
      if (googleAdsDeveloperToken.trim()) payload.googleAdsDeveloperToken = googleAdsDeveloperToken.trim();
      if (googleAdsCustomerId.trim()) payload.googleAdsCustomerId = googleAdsCustomerId.trim();

      if (Object.keys(payload).length === 0) {
        setMessage('Nenhum campo foi alterado.');
        setSaving(false);
        return;
      }

      await axios.post(getApiUrl('/api/settings'), payload);
      setMessage('Configurações salvas com sucesso!');

      // Limpa os campos e atualiza os badges
      setFacebookAdsToken('');
      setGoogleAdsToken('');
      setGoogleAdsDeveloperToken('');
      setGoogleAdsCustomerId('');
      await fetchSettings();
    } catch (err) {
      console.error('Failed to save settings:', err);
      setMessage('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-border shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-semibold text-neutral-900">Configurações de API</h1>
          <p className="text-sm text-neutral-500">
            Configure as integrações com plataformas de anúncios
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-xl mx-auto flex flex-col gap-6 mt-4">

          {/* Facebook Ads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Facebook Ads
                {hasFbToken
                  ? <span className="flex items-center gap-1 text-xs font-normal text-green-600"><CheckCircle2 size={14} /> Configurado</span>
                  : <span className="flex items-center gap-1 text-xs font-normal text-neutral-400"><Circle size={14} /> Não configurado</span>
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-900">
                  {hasFbToken ? 'Novo Access Token (deixe vazio para manter o atual)' : 'Access Token'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={facebookAdsToken}
                    onChange={(e) => setFacebookAdsToken(e.target.value)}
                    placeholder={hasFbToken ? 'Cole aqui para substituir o token atual' : 'Cole seu token de acesso do Facebook Ads'}
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-md text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                  />
                  <Button
                    variant="secondary"
                    disabled={!facebookAdsToken || saving}
                    onClick={async () => {
                      try {
                        const res = await axios.post(getApiUrl('/api/test/facebook'), { token: facebookAdsToken });
                        alert(res.data.message);
                      } catch (err: any) {
                        alert(`Erro: ${err.response?.data?.error || err.message}`);
                      }
                    }}
                  >
                    Testar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Ads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Google Ads
                {hasGoogleToken && hasGoogleDev && hasGoogleCustomer
                  ? <span className="flex items-center gap-1 text-xs font-normal text-green-600"><CheckCircle2 size={14} /> Configurado</span>
                  : <span className="flex items-center gap-1 text-xs font-normal text-neutral-400"><Circle size={14} /> Não configurado</span>
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-900">
                  OAuth2 Access Token {hasGoogleToken && <span className="text-xs text-green-600">(configurado)</span>}
                </label>
                <input
                  type="password"
                  value={googleAdsToken}
                  onChange={(e) => setGoogleAdsToken(e.target.value)}
                  placeholder={hasGoogleToken ? 'Cole aqui para substituir' : 'Bearer token OAuth2'}
                  className="px-3 py-2 border border-neutral-200 rounded-md text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-900">
                  Developer Token {hasGoogleDev && <span className="text-xs text-green-600">(configurado)</span>}
                </label>
                <input
                  type="password"
                  value={googleAdsDeveloperToken}
                  onChange={(e) => setGoogleAdsDeveloperToken(e.target.value)}
                  placeholder={hasGoogleDev ? 'Cole aqui para substituir' : 'Developer token do Google Ads'}
                  className="px-3 py-2 border border-neutral-200 rounded-md text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-900">
                  Customer ID {hasGoogleCustomer && <span className="text-xs text-green-600">(configurado)</span>}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={googleAdsCustomerId}
                    onChange={(e) => setGoogleAdsCustomerId(e.target.value)}
                    placeholder={hasGoogleCustomer ? 'Digite para substituir' : 'Ex: 123-456-7890'}
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-md text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                  />
                  <Button
                    variant="secondary"
                    disabled={!googleAdsToken || !googleAdsDeveloperToken || !googleAdsCustomerId || saving}
                    onClick={async () => {
                      try {
                        const res = await axios.post(getApiUrl('/api/test/google'), {
                          token: googleAdsToken,
                          developerToken: googleAdsDeveloperToken,
                          customerId: googleAdsCustomerId,
                        });
                        alert(res.data.message);
                      } catch (err: any) {
                        alert(`Erro: ${err.response?.data?.error || err.message}`);
                      }
                    }}
                  >
                    Testar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${message.startsWith('Erro') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </span>
            <Button onClick={handleSave} disabled={saving} className="gap-2 self-end">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar Configurações
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
