import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import type { Applicant } from '../types'

interface ApplicantEvaluationDialogProps {
  open: boolean
  applicant?: Applicant
  onClose: () => void
  onSave: (values: { interviewDate: string; score: number; notes: string }) => void
  isSubmitting?: boolean
}

export function ApplicantEvaluationDialog({ open, applicant, onClose, onSave, isSubmitting }: ApplicantEvaluationDialogProps) {
  const [interviewDate, setInterviewDate] = useState(() => applicant?.interviewDate ?? '')
  const [score, setScore] = useState<number>(() => applicant?.evaluationScore ?? 3)
  const [notes, setNotes] = useState(() => applicant?.evaluationNotes ?? '')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Evaluate {applicant?.name}</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <TextField
          type="date"
          label="Interview date"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />
        <div>
          <Typography variant="caption" color="text.secondary">
            Evaluation score
          </Typography>
          <Rating value={score} onChange={(_, value) => setScore(value ?? 0)} />
        </div>
        <TextField label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline minRows={3} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isSubmitting}
          onClick={() => onSave({ interviewDate, score, notes })}
        >
          {isSubmitting ? 'Saving…' : 'Save evaluation'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
