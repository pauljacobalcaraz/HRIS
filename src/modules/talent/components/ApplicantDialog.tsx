import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { JobVacancy } from '../types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  vacancyId: z.string().min(1, 'Select a vacancy'),
})

type ApplicantFormValues = z.infer<typeof schema>

interface ApplicantDialogProps {
  open: boolean
  vacancies: JobVacancy[]
  onClose: () => void
  onSubmit: (values: ApplicantFormValues) => void
  isSubmitting?: boolean
}

export function ApplicantDialog({ open, vacancies, onClose, onSubmit, isSubmitting }: ApplicantDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', vacancyId: '' },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add applicant</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Full name" error={!!errors.name} helperText={errors.name?.message} fullWidth required autoFocus />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Email" error={!!errors.email} helperText={errors.email?.message} fullWidth required />
            )}
          />
          <Controller
            name="vacancyId"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Applying for" error={!!errors.vacancyId} helperText={errors.vacancyId?.message} fullWidth required>
                {vacancies.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.title}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Adding…' : 'Add applicant'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
