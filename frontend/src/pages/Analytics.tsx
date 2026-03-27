import { useState, useEffect } from 'react'
import { Loader2, TrendingUp, Award, Building2, Target, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface Campaign {
  id: string
  name: string
  spend: number
  clicks: number
  cpc: number
  impressions: number
  status: string
  clientName?: string
}

interface Client {
  id: string
  name: string
  metrics: {
    totalSpend: number
    totalClicks: number
  }
  campaigns: Campaign[]
  sortedCampaigns?: Campaign[]
}

const DATE_RANGES = [
  { label: 'Últimos 7 dias', value: 'last_7d' },
  { label: 'Últimos 14 dias', value: 'last_14d' },
  { label: 'Últimos 30 dias', value: 'last_30d' },
]

export function Analytics() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [hasToken, setHasToken] = useState(true)
  const [dateRange, setDateRange] = useState('last_30d')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await axios.get(`http://localhost:3000/api/analytics/all-clients?dateRange=${dateRange}`)
        setHasToken(res.data.hasToken !== false)
        setClients(res.data.clients || [])
      } catch (e) {
        console.error('Error fetching analytics:', e)
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

  // Calculate Rankings based on CPC (Menor é melhor)
  const allCampaigns = clients.flatMap(c => c.campaigns.map(camp => ({ ...camp, clientName: c.name })))
  // Sort by CPC ascending
  const bestCPCOverall = [...allCampaigns].sort((a, b) => a.cpc - b.cpc)[0]

  const clientRankings = clients.map(client => {
    // Sort by CPC ascending
    const sortedCampaigns = [...client.campaigns].sort((a, b) => a.cpc - b.cpc)
    return { ...client, sortedCampaigns }
  })

  // Aggregate results by company for the Global Summary
  const companySummaries = clients.map(client => {
    const totalSpend = client.campaigns.reduce((acc, curr) => acc + curr.spend, 0)
    const totalClicks = client.campaigns.reduce((acc, curr) => acc + curr.clicks, 0)
    const totalImpressions = client.campaigns.reduce((acc, curr) => acc + curr.impressions, 0)
    const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0
    
    return {
      name: client.name,
      campaignCount: client.campaigns.length,
      totalSpend,
      totalClicks,
      totalImpressions,
      avgCPC
    }
  }).sort((a, b) => a.avgCPC - b.avgCPC)

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa]">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200 shrink-0">
        <h1 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-600" />
          Analytics Hub - Indicadores Meta
        </h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:border-neutral-400"
        >
          {DATE_RANGES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* TOP RANKING CPC GERAL */}
          {bestCPCOverall && (
            <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-emerald-600 p-6 flex flex-col items-center justify-center text-white md:w-64 shrink-0">
                  <Award size={48} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">MELHOR_CPC</span>
                  <span className="text-2xl font-black mt-1">#1 RANK</span>
                </div>
                <CardContent className="p-6 flex-1">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Campanha com Melhor CPC Geral</h2>
                      <div className="flex items-center gap-3">
                        <Target className="text-neutral-400" size={24} />
                        <h3 className="text-2xl font-bold text-neutral-900">{bestCPCOverall.name}</h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-emerald-100">
                      <div>
                        <span className="text-xs text-neutral-500 block mb-1">EMPRESA</span>
                        <span className="font-semibold flex items-center gap-1.5">
                          <Building2 size={14} className="text-emerald-500" />
                          {bestCPCOverall.clientName}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-500 block mb-1">CPC ATUAL</span>
                        <span className="text-xl font-bold text-emerald-600">
                          R$ {bestCPCOverall.cpc.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-500 block mb-1">CLIQUES</span>
                        <span className="font-semibold text-neutral-800">{bestCPCOverall.clicks.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-500 block mb-1">INVESTIMENTO</span>
                        <span className="font-semibold text-neutral-800">
                          {bestCPCOverall.spend.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}

          {/* RANKING POR EMPRESA */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-neutral-500" />
              Ranking de Campanhas por CPC (Eficiência)
            </h2>
            
            <div className="grid grid-cols-1 gap-8">
              {clientRankings.map(client => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow border-neutral-200">
                  <CardHeader className="pb-3 border-b border-neutral-50 bg-neutral-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <CardTitle className="text-lg font-bold text-neutral-900">{client.name}</CardTitle>
                        <div className="flex items-center gap-6 text-xs font-medium text-neutral-500">
                          <span>Gasto Total: {client.metrics.totalSpend.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          <span>Cliques Totais: {client.metrics.totalClicks.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-neutral-100 shadow-sm">
                        <Building2 size={20} className="text-neutral-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white text-neutral-400 text-[10px] uppercase font-bold tracking-widest border-b border-neutral-100">
                          <tr>
                            <th className="px-6 py-3 w-16">Rank</th>
                            <th className="px-6 py-3">Campanha</th>
                            <th className="px-6 py-3">Impressões</th>
                            <th className="px-6 py-3">Cliques</th>
                            <th className="px-6 py-3 font-bold text-emerald-600">CPC</th>
                            <th className="px-6 py-3 text-right">Investimento</th>
                            <th className="px-6 py-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                          {client.sortedCampaigns?.map((camp, idx) => (
                            <tr key={camp.id} className="hover:bg-neutral-50/30 transition-colors">
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold",
                                  idx === 0 ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-600"
                                )}>
                                  #{idx + 1}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-neutral-800">{camp.name}</td>
                              <td className="px-6 py-4 text-neutral-600">{camp.impressions.toLocaleString()}</td>
                              <td className="px-6 py-4 text-neutral-600">{camp.clicks.toLocaleString()}</td>
                              <td className="px-6 py-4 font-bold text-emerald-600">R$ {camp.cpc?.toFixed(2)}</td>
                              <td className="px-6 py-4 text-right text-neutral-600">
                                {camp.spend.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className={cn(
                                  "inline-block w-2 h-2 rounded-full mr-2",
                                  camp.status === 'Active' ? "bg-green-500" : "bg-neutral-300"
                                )}/>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase">{camp.status === 'Active' ? 'Ativo' : 'Off'}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* RESUMO POR EMPRESA (AGRUPADO) */}
          <Card className="border-neutral-200">
            <CardHeader className="bg-neutral-50/30">
              <CardTitle className="text-base font-bold">Resumo por Empresa (Performance Integrada)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 text-neutral-500 text-[10px] uppercase font-bold tracking-widest border-y border-neutral-100">
                  <tr>
                    <th className="px-6 py-4 w-16">Pos</th>
                    <th className="px-6 py-4">EMPRESA</th>
                    <th className="px-6 py-4 text-center">CAMPANHAS</th>
                    <th className="px-6 py-4">TOTAL IMPRESSÕES</th>
                    <th className="px-6 py-4">TOTAL CLIQUES</th>
                    <th className="px-6 py-4 text-emerald-600 font-black">MÉDIA CPC</th>
                    <th className="px-6 py-4 text-right">Gasto TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {companySummaries.map((company, idx) => (
                    <tr key={company.name} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-neutral-400 font-mono text-xs">{(idx + 1).toString().padStart(2, '0')}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm text-neutral-900">{company.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                          {company.campaignCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{company.totalImpressions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{company.totalClicks.toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600 text-sm">R$ {company.avgCPC.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-bold text-neutral-900 text-sm">
                        {company.totalSpend.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
