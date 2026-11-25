import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Holiday } from '../types'

const schema = z.object({
  name: z.string().min(1, 'Holiday name is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['REGULAR', 'SPECIAL']),
})

type HolidayFormValues = z.infer<typeof schema>

interface HolidayDialogProps {
  open: boolean
  holiday?: Holiday
  onClose: () => void
  onSubmit: (values: HolidayFormValues) => void
  isSubmitting?: boolean
}

export function HolidayDialog({ open, holiday, onClose, onSubmit, isSubmitting }: HolidayDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HolidayFormValues>({
    resolver: zodResolver(schema),
    values: holiday ? { name: holiday.name, date: holiday.date, type: holiday.type } : { name: '', date: '', type: 'REGULAR' },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{holiday ? 'Edit holiday' : 'Add holiday'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Holiday name" error={!!errors.name} helperText={errors.name?.message} fullWidth required autoFocus />
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField {...field} type="date" label="Date" error={!!errors.date} helperText={errors.date?.message} fullWidth slotProps={{ inputLabel: { shrink: true } }} required />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Type" fullWidth>
                <MenuItem value="REGULAR">Regular Holiday</MenuItem>
                <MenuItem value="SPECIAL">Special Holiday</MenuItem>
              </TextField>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : holiday ? 'Save changes' : 'Create holiday'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
