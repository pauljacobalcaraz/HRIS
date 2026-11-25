import { Paper, Typography } from '@mui/material'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useColorMode } from '@/app/providers/ThemeProvider'

interface DepartmentHeadcountChartProps {
  data: { name: string; count: number }[]
}

export function DepartmentHeadcountChart({ data }: DepartmentHeadcountChartProps) {
  const { mode } = useColorMode()
  const barColor = mode === 'light' ? '#2a78d6' : '#3987e5'
  const gridColor = mode === 'light' ? '#e1e0d9' : '#2c2c2a'
  const axisColor = mode === 'light' ? '#898781' : '#898781'
  const textColor = mode === 'light' ? '#0b0b0b' : '#ffffff'

  const sorted = [...data].sort((a, b) => b.count - a.count)

  return (
    <Paper variant="outlined" className="p-4 rounded-lg">
      <Typography variant="subtitle2" className="font-bold mb-3">
        Headcount by department
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={sorted} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }} barCategoryGap={10}>
          <CartesianGrid horizontal={false} stroke={gridColor} />
          <XAxis type="number" tick={{ fontSize: 12, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' }}
            contentStyle={{
              background: mode === 'light' ? '#fcfcfb' : '#1a1a19',
              border: `1px solid ${gridColor}`,
              borderRadius: 8,
              fontSize: 12,
              color: textColor,
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {sorted.map((entry) => (
              <Cell key={entry.name} fill={barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  )
}
