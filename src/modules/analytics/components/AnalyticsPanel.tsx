import DownloadIcon from '@mui/icons-material/DownloadOutlined'
import { Button, Paper, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface AnalyticsPanelProps {
  title: string
  subtitle?: string
  onExport?: () => void
  children: ReactNode
}

export function AnalyticsPanel({ title, subtitle, onExport, children }: AnalyticsPanelProps) {
  return (
    <Paper variant="outlined" className="p-4 rounded-lg">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <Typography variant="subtitle2" className="font-bold">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </div>
        {onExport && (
          <Button size="small" startIcon={<DownloadIcon />} onClick={onExport}>
            Export CSV
          </Button>
        )}
      </div>
      {children}
    </Paper>
  )
}
