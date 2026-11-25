import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  hours: z.number().min(0.5, 'Enter at least 0.5 hours').max(12, 'Maximum 12 hours'),
  reason: z.string().min(1, 'Reason is required'),
})

export type OvertimeFormValues = z.infer<typeof schema>

interface OvertimeRequestDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: OvertimeFormValues) => void
  isSubmitting?: boolean
}

export function OvertimeRequestDialog({ open, onClose, onSubmit, isSubmitting }: OvertimeRequestDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OvertimeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { date: '', hours: 2, reason: '' },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Request overtime</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField {...field} type="date" label="Date" error={!!errors.date} helperText={errors.date?.message} fullWidth slotProps={{ inputLabel: { shrink: true } }} required />
            )}
          />
          <Controller
            name="hours"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Hours"
                error={!!errors.hours}
                helperText={errors.hours?.message}
                fullWidth
                required
                onChange={(e) => field.onChange(Number(e.target.value))}
                slotProps={{ htmlInput: { step: 0.5 } }}
              />
            )}
          />
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Reason" error={!!errors.reason} helperText={errors.reason?.message} fullWidth multiline minRows={2} required />
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
