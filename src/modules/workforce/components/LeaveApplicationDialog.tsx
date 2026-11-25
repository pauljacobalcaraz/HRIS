import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useLeaveTypes } from '../hooks/useLeave'

const schema = z
  .object({
    leaveTypeId: z.string().min(1, 'Select a leave type'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    reason: z.string().min(1, 'Reason is required'),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  })

export type LeaveApplicationFormValues = z.infer<typeof schema>

interface LeaveApplicationDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: LeaveApplicationFormValues & { days: number }) => void
  isSubmitting?: boolean
}

function countDays(start: string, end: string): number {
  if (!start || !end || end < start) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  return diff + 1
}

export function LeaveApplicationDialog({ open, onClose, onSubmit, isSubmitting }: LeaveApplicationDialogProps) {
  const { data: leaveTypes = [] } = useLeaveTypes()

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeaveApplicationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { leaveTypeId: '', startDate: '', endDate: '', reason: '' },
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const days = countDays(startDate, endDate)

  const handleClose = () => {
    reset()
    onClose()
  }

  const submit = (values: LeaveApplicationFormValues) => {
    onSubmit({ ...values, days })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Apply for leave</DialogTitle>
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="leaveTypeId"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Leave type" error={!!errors.leaveTypeId} helperText={errors.leaveTypeId?.message} fullWidth required>
                {leaveTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" label="Start date" error={!!errors.startDate} helperText={errors.startDate?.message} fullWidth slotProps={{ inputLabel: { shrink: true } }} required />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" label="End date" error={!!errors.endDate} helperText={errors.endDate?.message} fullWidth slotProps={{ inputLabel: { shrink: true } }} required />
              )}
            />
          </div>
          {days > 0 && (
            <Typography variant="body2" color="text.secondary">
              This request covers <strong>{days}</strong> day{days > 1 ? 's' : ''}.
            </Typography>
          )}
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
