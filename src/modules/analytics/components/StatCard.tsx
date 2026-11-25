import { Paper, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  accent: string
}

export function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <Paper variant="outlined" className="p-4 rounded-lg flex items-center gap-3">
      <div className="h-11 w-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}1A`, color: accent }}>
        {icon}
      </div>
      <div className="min-w-0">
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6" className="font-bold leading-tight">
          {value}
        </Typography>
      </div>
    </Paper>
  )
}
