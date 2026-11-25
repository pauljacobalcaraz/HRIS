import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import type { Kpi } from '../types'

interface EvaluationDialogProps {
  open: boolean
  employeeName?: string
  kpis: Kpi[]
  onClose: () => void
  onSubmit: (values: { scores: Record<string, number>; comments: string; period: string }) => void
  isSubmitting?: boolean
}

function currentQuarter(): string {
  const now = new Date()
  const quarter = Math.floor(now.getMonth() / 3) + 1
  return `${now.getFullYear()}-Q${quarter}`
}

export function EvaluationDialog({ open, employeeName, kpis, onClose, onSubmit, isSubmitting }: EvaluationDialogProps) {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comments, setComments] = useState('')

  const handleSubmit = () => {
    const filled = kpis.reduce<Record<string, number>>((acc, kpi) => {
      acc[kpi.id] = scores[kpi.id] ?? 3
      return acc
    }, {})
    onSubmit({ scores: filled, comments, period: currentQuarter() })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Evaluate {employeeName}</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="flex items-center justify-between">
            <Typography variant="body2">{kpi.name}</Typography>
            <Rating value={scores[kpi.id] ?? 3} onChange={(_, value) => setScores((prev) => ({ ...prev, [kpi.id]: value ?? 0 }))} />
          </div>
        ))}
        <TextField label="Comments" value={comments} onChange={(e) => setComments(e.target.value)} fullWidth multiline minRows={3} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit evaluation'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
