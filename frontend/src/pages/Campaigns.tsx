import { useState, useEffect } from 'react'
import { Loader2, Megaphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { getApiUrl } from '@/config/api'

interface Campaign {
  id: string
  name: string
  status: string
  objective: string
  spend: number
  impressions: number
  clicks: number
  cpc: number
}

interface Account {
  id: string
  name: string
  campaigns: Campaign[]
}

const DATE_RANGES = [
  { label: 'Últimos 7 dias', value: 'last_7d' },
  { label: 'Últimos 14 dias', value: 'last_14d' },
  { label: 'Últimos 30 dias', value: 'last_30d' },
]

export function Campaigns() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [hasToken, setHasToken] = useState(true)
  const [dateRange, setDateRange] = useState('last_7d')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await axios.get(getApiUrl(`/api/analytics/all-clients?dateRange=${dateRange}`))
        setHasToken(res.data.hasToken !== false)
        const clients = res.data.clients || []
        setAccounts(clients.map((c: any) => ({
          id: c.id,
          name: c.name,
          campaigns: c.campaigns,
        })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-[#fafafa]">
        <Loader2 className="animate-spin text-neutral-400" size={28} />
      </div>
    )
  }

  if (!hasToken) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#fafafa] text-neutral-500 text-sm gap-2">
        <span>Nenhum token do Facebook Ads configurado.</span>
        <span>Vá em Configurações para conectar sua conta.</span>
      </div>
    )
  }

  const allCampaigns = accounts.flatMap(a =>
    a.campaigns.map(c => ({ ...c, accountName: a.name }))
  )

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa]">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200 shrink-0">
        <h1 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <Megaphone size={20} className="text-indigo-600" />
          Campanhas
        </h1>
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:border-neutral-400"
        >
          {DATE_RANGES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {accounts.map(account => (
            <Card key={account.id}>
              <CardHeader className="pb-3 border-b border-neutral-100 bg-neutral-50/50">
                <CardTitle className="text-base font-semibold text-neutral-900">
                  {account.name}
                  <span className="ml-2 text-xs font-normal text-neutral-400">
                    {account.campaigns.length} campanhas
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {account.campaigns.length === 0 ? (
                  <p className="text-sm text-neutral-400 text-center py-6">Nenhuma campanha encontrada</p>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 border-b border-neutral-100 bg-white">
                      <tr>
                        <th className="px-6 py-3">Campanha</th>
                        <th className="px-6 py-3">Objetivo</th>
                        <th className="px-6 py-3">Impressões</th>
                        <th className="px-6 py-3">Cliques</th>
                        <th className="px-6 py-3">CPC</th>
                        <th className="px-6 py-3 text-right">Gasto</th>
                        <th className="px-6 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {account.campaigns.map(c => (
                        <tr key={c.id} className="hover:bg-neutral-50/40 transition-colors">
                          <td className="px-6 py-3 font-medium text-neutral-800 max-w-xs truncate">{c.name}</td>
                          <td className="px-6 py-3 text-neutral-500 text-xs">{c.objective || '—'}</td>
                          <td className="px-6 py-3 text-neutral-600">{(c.impressions || 0).toLocaleString('pt-BR')}</td>
                          <td className="px-6 py-3 text-neutral-600">{(c.clicks || 0).toLocaleString('pt-BR')}</td>
                          <td className="px-6 py-3 font-semibold text-neutral-700">
                            {c.cpc > 0 ? `R$ ${c.cpc.toFixed(2)}` : '—'}
                          </td>
                          <td className="px-6 py-3 text-right text-neutral-600">
                            {c.spend > 0
                              ? c.spend.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                              : '—'}
                          </td>
                          <td className="px-6 py-3 text-right">
                            <span className={cn(
                              'text-xs font-medium px-2.5 py-1 rounded-full',
                              c.status === 'Active'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-neutral-100 text-neutral-500'
                            )}>
                              {c.status === 'Active' ? 'Ativo' : 'Pausado'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          ))}

          {accounts.length === 0 && (
            <div className="text-center text-neutral-400 text-sm py-12">
              Nenhuma conta de anúncio encontrada.
            </div>
          )}

          {/* Totalizador geral */}
          {allCampaigns.length > 0 && (
            <Card className="border-neutral-200 bg-neutral-50">
              <CardContent className="pt-4 pb-4">
                <div className="grid grid-cols-4 gap-6 text-sm">
                  <div>
                    <span className="text-xs text-neutral-400 block mb-1">Total campanhas</span>
                    <span className="font-bold text-neutral-900">{allCampaigns.length}</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block mb-1">Total impressões</span>
                    <span className="font-bold text-neutral-900">
                      {allCampaigns.reduce((s, c) => s + (c.impressions || 0), 0).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block mb-1">Total cliques</span>
                    <span className="font-bold text-neutral-900">
                      {allCampaigns.reduce((s, c) => s + (c.clicks || 0), 0).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block mb-1">Gasto total</span>
                    <span className="font-bold text-neutral-900">
                      {allCampaigns.reduce((s, c) => s + (c.spend || 0), 0)
                        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
