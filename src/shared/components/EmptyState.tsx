import InboxIcon from '@mui/icons-material/InboxOutlined'
import { Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <InboxIcon sx={{ fontSize: 48, opacity: 0.4 }} />
      <Typography variant="subtitle1" className="font-medium">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" className="max-w-sm">
          {description}
        </Typography>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
