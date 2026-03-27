import { Area, AreaChart, CartesianGrid, XAxis, YAxis,### Function Size Optimization
- **vercel.json**: Changed the backend entry point to `backend/server.js` and removed the `includeFiles: ["backend/**"]` directive. This prevents Vercel from including the entire backend directory (and its `node_modules`) into the serverless function bundle.
- **schema.prisma**: Explicitly set `binaryTargets = ["native", "rhel-openssl-3.0.x"]`. This ensures only the necessary Prisma engine for Vercel's environment is included, reducing the bundle size.

## Verification Results

### Overall Build Success
I ran the full build from the root directory, which successfully generated the Prisma Client and built the frontend.
 Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface TimeSeriesChartProps {
  data: any[]
  lines: { key: string; label: string; color: string }[]
  height?: number
}

export function TimeSeriesChart({ data, lines, height = 300 }: TimeSeriesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-neutral-400 text-sm" style={{ height }}>
        No chart data available for this period
      </div>
    )
  }

  const formatDate = (dateStr: any) => {
    if (typeof dateStr !== 'string') return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            {lines.map((line) => (
              <linearGradient key={line.key} id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#A3A3A3' }}
            tickFormatter={formatDate}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#A3A3A3' }}
            width={50}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              fontSize: '12px',
              padding: '8px 12px',
            }}
            labelFormatter={formatDate}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }}
          />
          {lines.map((line) => (
            <Area
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              strokeWidth={2}
              fill={`url(#gradient-${line.key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
