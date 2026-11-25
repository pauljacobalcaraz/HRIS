import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useState } from 'react'

interface ReasonDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function ReasonDialog({ open, title, description, confirmLabel = 'Confirm', loading, onConfirm, onCancel }: ReasonDialogProps) {
  const [reason, setReason] = useState('')

  const handleCancel = () => {
    setReason('')
    onCancel()
  }

  const handleConfirm = () => {
    onConfirm(reason)
    setReason('')
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText className="mb-3">{description}</DialogContentText>
        <TextField
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={loading || !reason.trim()}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
