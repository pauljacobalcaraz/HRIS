import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { TrainingProgram } from '../types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  provider: z.string().min(1, 'Provider is required'),
  category: z.string().min(1, 'Category is required'),
  durationHours: z.number().min(1, 'Must be at least 1 hour'),
})

type TrainingProgramFormValues = z.infer<typeof schema>

interface TrainingProgramDialogProps {
  open: boolean
  program?: TrainingProgram
  onClose: () => void
  onSubmit: (values: TrainingProgramFormValues) => void
  isSubmitting?: boolean
}

export function TrainingProgramDialog({ open, program, onClose, onSubmit, isSubmitting }: TrainingProgramDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrainingProgramFormValues>({
    resolver: zodResolver(schema),
    values: program ?? { title: '', provider: '', category: '', durationHours: 8 },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{program ? 'Edit training program' : 'Add training program'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Title" error={!!errors.title} helperText={errors.title?.message} fullWidth required autoFocus />
            )}
          />
          <Controller
            name="provider"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Provider" error={!!errors.provider} helperText={errors.provider?.message} fullWidth required />
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Category" error={!!errors.category} helperText={errors.category?.message} fullWidth required />
            )}
          />
          <Controller
            name="durationHours"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Duration (hours)"
                error={!!errors.durationHours}
                onChange={(e) => field.onChange(Number(e.target.value))}
                fullWidth
                required
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : program ? 'Save changes' : 'Add program'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
