import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useDepartments } from '@/modules/core-hr/hooks/useDepartments'
import { usePositions } from '@/modules/core-hr/hooks/usePositions'
import type { JobVacancy } from '../types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  departmentId: z.string().min(1, 'Select a department'),
  positionId: z.string().min(1, 'Select a position'),
  openings: z.number().min(1, 'At least 1 opening'),
  status: z.enum(['OPEN', 'ON_HOLD', 'CLOSED']),
  description: z.string().min(1, 'Description is required'),
  postedDate: z.string().min(1),
})

type VacancyFormValues = z.infer<typeof schema>

interface VacancyDialogProps {
  open: boolean
  vacancy?: JobVacancy
  onClose: () => void
  onSubmit: (values: VacancyFormValues) => void
  isSubmitting?: boolean
}

export function VacancyDialog({ open, vacancy, onClose, onSubmit, isSubmitting }: VacancyDialogProps) {
  const { data: departments = [] } = useDepartments()
  const { data: positions = [] } = usePositions()

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<VacancyFormValues>({
    resolver: zodResolver(schema),
    values: vacancy
      ? { ...vacancy }
      : {
          title: '',
          departmentId: '',
          positionId: '',
          openings: 1,
          status: 'OPEN',
          description: '',
          postedDate: new Date().toISOString().slice(0, 10),
        },
  })

  const departmentId = watch('departmentId')
  const filteredPositions = positions.filter((p) => p.departmentId === departmentId)

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{vacancy ? 'Edit vacancy' : 'Post a vacancy'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Job title" error={!!errors.title} helperText={errors.title?.message} fullWidth required autoFocus />
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="departmentId"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Department" error={!!errors.departmentId} fullWidth required>
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="positionId"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Position" error={!!errors.positionId} fullWidth required disabled={!departmentId}>
                  {filteredPositions.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="openings"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Openings"
                  error={!!errors.openings}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  fullWidth
                  required
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Status" fullWidth>
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="ON_HOLD">On Hold</MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
                </TextField>
              )}
            />
          </div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Description" error={!!errors.description} helperText={errors.description?.message} fullWidth multiline minRows={2} required />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : vacancy ? 'Save changes' : 'Post vacancy'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
