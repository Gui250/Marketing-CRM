import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface CpcChartProps {
  data: any[]
  dataKey: string
}

export function CpcChart({ data, dataKey }: CpcChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-neutral-400 text-sm">
        No chart data available
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A3A3A3' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A3A3A3' }} dx={-10} tickFormatter={(val: number | string) => `$${val}`} />
          <Tooltip cursor={{ fill: '#F5F5F5' }} itemStyle={{ color: '#171717', fontWeight: 500 }} />
          <Bar dataKey={dataKey} fill="#171717" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
