import { useState, useEffect, useCallback } from 'react'
import { Loader2, ChevronDown, Info, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TimeSeriesChart } from '@/components/TimeSeriesChart'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface AdAccount {
  id: string
  name: string
  account_status: number
}

const DATE_RANGES = [
  { label: 'Últimos 7 dias', value: 'last_7d' },
  { label: 'Últimos 14 dias', value: 'last_14d' },
  { label: 'Últimos 30 dias', value: 'last_30d' },
]

const PLATFORMS = [
  { label: 'Qualquer', value: 'all' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
]

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function FilterSelect({ label, value, options, onChange }: {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
      <span className="text-xs text-neutral-400 font-medium">{label}</span>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white hover:border-neutral-300 transition-colors"
        >
          <span className="truncate">{options.find(o => o.value === value)?.label}</span>
          <ChevronDown size={14} className={cn('text-neutral-400 transition-transform ml-2 shrink-0', open && 'rotate-180')} />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-lg z-50 py-1 max-h-48 overflow-auto">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 transition-colors',
                  value === opt.value && 'bg-neutral-100 font-medium'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value, color, large }: {
  label: string
  value: string
  color?: string
  large?: boolean
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className={cn('text-sm text-neutral-500 font-medium', color && `text-${color}-600`)}>{label}</span>
            <span className={cn(
              'font-bold tracking-tight',
              large ? 'text-2xl' : 'text-xl',
              color === 'green' ? 'text-green-700' : 'text-neutral-900'
            )}>
              {value}
            </span>
          </div>
          <button className="p-1 rounded-full hover:bg-neutral-100 transition-colors">
            <Info size={14} className="text-neutral-300" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

function TokenRequiredScreen({ expired, onSuccess }: { expired: boolean; onSuccess: () => void }) {
  const [token, setToken] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!token.trim()) return
    setSaving(true)
    setError('')
    try {
      await axios.post('http://localhost:3000/api/settings', { facebookAdsToken: token.trim() })
      onSuccess()
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#fafafa] px-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="text-center flex flex-col gap-1">
          {expired
            ? <span className="font-semibold text-amber-600 text-base">Token do Facebook Ads expirado</span>
            : <span className="font-semibold text-neutral-700 text-base">Token do Facebook Ads não configurado</span>
          }
          <span className="text-sm text-neutral-500">Cole o novo token abaixo para continuar</span>
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Cole seu Access Token aqui"
            className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <Button
            onClick={handleSave}
            disabled={!token.trim() || saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : 'Salvar'}
          </Button>
        </div>
        {error && <span className="text-xs text-red-500 text-center">{error}</span>}
        <span className="text-xs text-neutral-400 text-center">
          Gere um token em{' '}
          <a
            href="https://developers.facebook.com/tools/explorer/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-500 underline"
          >
            Facebook Graph Explorer
          </a>
        </span>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fbAccounts, setFbAccounts] = useState<AdAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>('all')
  const [dateRange, setDateRange] = useState('last_30d')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [activeChart, setActiveChart] = useState('spend')

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/facebook/accounts')
      setFbAccounts(res.data.accounts || [])
    } catch (e) { console.error(e) }
  }, [])

  useEffect(() => { fetchAccounts() }, [fetchAccounts])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedAccount && selectedAccount !== 'all') params.set('accountId', selectedAccount)
      params.set('dateRange', dateRange)

      const res = await axios.get(`http://localhost:3000/api/metrics/facebook?${params.toString()}`)
      setData(res.data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedAccount, dateRange])

  useEffect(() => { fetchData() }, [fetchData])

  const accountOptions = [
    { label: 'Todas', value: 'all' },
    ...fbAccounts.map(a => ({ label: a.name, value: a.id }))
  ]

  const timeSinceUpdate = lastUpdated
    ? `Atualizado há ${Math.max(1, Math.round((Date.now() - lastUpdated.getTime()) / 60000))} minuto(s)`
    : ''

  const chartMetrics = [
    { key: 'spend', label: 'Gastos (R$)', color: '#6366f1' },
    { key: 'clicks', label: 'Cliques', color: '#10b981' },
    { key: 'impressions', label: 'Impressões', color: '#f59e0b' },
    { key: 'cpc', label: 'CPC (R$)', color: '#ef4444' },
  ]

  if (loading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-[#fafafa]">
        <Loader2 className="animate-spin text-neutral-400" size={28} />
      </div>
    )
  }

  if (!data?.hasToken) {
    return (
      <TokenRequiredScreen
        expired={!!data?.tokenExpired}
        onSuccess={() => { fetchAccounts(); fetchData() }}
      />
    )
  }

  if (data?.error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#fafafa] text-neutral-500 text-sm gap-2">
        <span className="font-medium text-red-500">Erro ao buscar dados do Facebook Ads.</span>
        <span className="text-xs text-neutral-400 max-w-sm text-center">{data.details}</span>
      </div>
    )
  }

  if (!data.summary) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#fafafa] text-neutral-500 text-sm gap-2">
        <span>Nenhum dado disponível para o período selecionado.</span>
      </div>
    )
  }

  const s = data.summary

  return (
    <div className="flex flex-col h-full w-full bg-[#fafafa]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200 shrink-0">
        <h1 className="text-lg font-semibold text-neutral-900">Dashboard - Principal</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 hidden sm:block">{timeSinceUpdate}</span>

          {/* Seletor de conta */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wide">Conta de Anúncio</span>
            <div className="relative">
              <select
                value={selectedAccount}
                onChange={e => setSelectedAccount(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-neutral-200 rounded-lg bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 cursor-pointer min-w-[180px]"
              >
                {accountOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Seletor de período */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wide">Período</span>
            <div className="relative">
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-neutral-200 rounded-lg bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 cursor-pointer"
              >
                {DATE_RANGES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <Button
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 self-end"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Atualizar
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-6 flex flex-col gap-6">
          {/* Marketing KPIs - Primary Row */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard label="Gastos com anúncios" value={formatCurrency(s?.gastosAnuncios || 0)} large />
            <MetricCard label="ROAS" value={String(s?.roas || '0.00')} large />
            <MetricCard label="CPC" value={formatCurrency(s?.cpc || 0)} large />
            <MetricCard label="CPM" value={formatCurrency(s?.cpm || 0)} large />
          </div>

          {/* Marketing KPIs - Secondary Row */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard label="Impressões" value={(s?.impressions || 0).toLocaleString()} />
            <MetricCard label="Cliques (Todos)" value={(s?.clicks || 0).toLocaleString()} />
            <MetricCard label="Cliques no Link" value={(s?.linkClicks || 0).toLocaleString()} />
          </div>

          {/* Time Series Chart */}
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-neutral-900">Performance ao Longo do Tempo</h3>
                <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
                  {chartMetrics.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setActiveChart(m.key)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                        activeChart === m.key ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <TimeSeriesChart
                data={data.chartData || []}
                lines={[chartMetrics.find(m => m.key === activeChart)!]}
                height={260}
              />
            </CardContent>
          </Card>

          {/* Campaigns */}
          <Card>
            <CardContent className="pt-5 pb-5">
              <h3 className="text-base font-semibold text-neutral-900 mb-4">
                Campanhas ({data.campaigns?.length || 0})
              </h3>
              <div className="divide-y divide-neutral-100">
                {(!data.campaigns || data.campaigns.length === 0) && (
                  <p className="text-sm text-neutral-400 text-center py-6">Nenhuma campanha encontrada</p>
                )}
                {data.campaigns?.map((c: any, i: number) => (
                  <div key={c.name + i} className="flex items-center justify-between py-3">
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="text-sm font-medium text-neutral-900 truncate">{c.name}</span>
                      <span className="text-xs text-neutral-500 truncate">{c.meta}</span>
                    </div>
                    <span className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3',
                      c.status === 'Active'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    )}>
                      {c.status === 'Active' ? 'Ativo' : 'Pausado'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
