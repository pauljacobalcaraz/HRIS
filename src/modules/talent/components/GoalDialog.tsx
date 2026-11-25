import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Goal } from '../types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  targetDate: z.string().min(1, 'Target date is required'),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
  progress: z.number().min(0).max(100),
})

type GoalFormValues = z.infer<typeof schema>

interface GoalDialogProps {
  open: boolean
  goal?: Goal
  onClose: () => void
  onSubmit: (values: GoalFormValues) => void
  isSubmitting?: boolean
}

export function GoalDialog({ open, goal, onClose, onSubmit, isSubmitting }: GoalDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(schema),
    values: goal
      ? { title: goal.title, description: goal.description, targetDate: goal.targetDate, status: goal.status, progress: goal.progress }
      : { title: '', description: '', targetDate: '', status: 'NOT_STARTED', progress: 0 },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{goal ? 'Edit goal' : 'Add goal'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Goal title" error={!!errors.title} helperText={errors.title?.message} fullWidth required autoFocus />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Description" error={!!errors.description} helperText={errors.description?.message} fullWidth multiline minRows={2} required />
            )}
          />
          <Controller
            name="targetDate"
            control={control}
            render={({ field }) => (
              <TextField {...field} type="date" label="Target date" error={!!errors.targetDate} fullWidth slotProps={{ inputLabel: { shrink: true } }} required />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Status" fullWidth>
                <MenuItem value="NOT_STARTED">Not Started</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </TextField>
            )}
          />
          <Controller
            name="progress"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Progress (%)"
                onChange={(e) => field.onChange(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 0, max: 100 } }}
                fullWidth
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : goal ? 'Save changes' : 'Add goal'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
