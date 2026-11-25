import { Paper, Typography } from '@mui/material'

const STATUS_META: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: '#0ca30c' },
  ON_LEAVE: { label: 'On Leave', color: '#fab219' },
  INACTIVE: { label: 'Inactive', color: '#898781' },
  TERMINATED: { label: 'Terminated', color: '#d03b3b' },
}

interface StatusBreakdownProps {
  counts: Record<string, number>
  total: number
}

export function StatusBreakdown({ counts, total }: StatusBreakdownProps) {
  return (
    <Paper variant="outlined" className="p-4 rounded-lg">
      <Typography variant="subtitle2" className="font-bold mb-3">
        Employment status
      </Typography>
      <div className="flex flex-col gap-3">
        {Object.entries(STATUS_META).map(([key, meta]) => {
          const count = counts[key] ?? 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                  {meta.label}
                </span>
                <span className="text-neutral-500">
                  {count} ({pct}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </Paper>
  )
}
