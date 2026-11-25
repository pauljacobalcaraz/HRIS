import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { DOCUMENT_TYPE_LABELS } from '../services/documentService'

const schema = z.object({
  type: z.enum(['COE', 'CERTIFICATE_OF_CLEARANCE', 'PAYSLIP_COPY', 'EMPLOYMENT_VERIFICATION']),
  purpose: z.string().min(1, 'Purpose is required'),
})

type DocumentRequestFormValues = z.infer<typeof schema>

interface DocumentRequestDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: DocumentRequestFormValues) => void
  isSubmitting?: boolean
}

export function DocumentRequestDialog({ open, onClose, onSubmit, isSubmitting }: DocumentRequestDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentRequestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'COE', purpose: '' },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Request a document</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Document type" fullWidth required>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="purpose"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Purpose" error={!!errors.purpose} helperText={errors.purpose?.message} fullWidth multiline minRows={2} required />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
