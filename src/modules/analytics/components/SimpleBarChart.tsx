import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useColorMode } from '@/app/providers/ThemeProvider'

interface SimpleBarChartProps {
  data: { name: string; value: number }[]
  height?: number
  color?: { light: string; dark: string }
  valueFormatter?: (value: number) => string
}

export function SimpleBarChart({ data, height = 240, color, valueFormatter }: SimpleBarChartProps) {
  const { mode } = useColorMode()
  const barColor = mode === 'light' ? color?.light ?? '#2a78d6' : color?.dark ?? '#3987e5'
  const gridColor = mode === 'light' ? '#e1e0d9' : '#2c2c2a'
  const axisColor = '#898781'
  const textColor = mode === 'light' ? '#0b0b0b' : '#ffffff'

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }} barCategoryGap={10}>
        <CartesianGrid horizontal={false} stroke={gridColor} />
        <XAxis type="number" tick={{ fontSize: 12, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12, fill: textColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
        <Tooltip
          cursor={{ fill: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }}
          formatter={(value) => (valueFormatter ? valueFormatter(Number(value)) : Number(value))}
          contentStyle={{
            background: mode === 'light' ? '#fcfcfb' : '#1a1a19',
            border: `1px solid ${gridColor}`,
            borderRadius: 8,
            fontSize: 12,
            color: textColor,
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={barColor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
