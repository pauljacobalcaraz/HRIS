import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Department } from '../types'
import { useAllEmployees } from '../hooks/useEmployees'

const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or fewer'),
  managerId: z.string().nullable(),
  description: z.string().min(1, 'Description is required'),
})

type DepartmentFormValues = z.infer<typeof departmentSchema>

interface DepartmentDialogProps {
  open: boolean
  department?: Department
  onClose: () => void
  onSubmit: (values: DepartmentFormValues) => void
  isSubmitting?: boolean
}

export function DepartmentDialog({ open, department, onClose, onSubmit, isSubmitting }: DepartmentDialogProps) {
  const { data: employees = [] } = useAllEmployees()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    values: department
      ? { name: department.name, code: department.code, managerId: department.managerId, description: department.description }
      : { name: '', code: '', managerId: null, description: '' },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{department ? 'Edit department' : 'Add department'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Department name" error={!!errors.name} helperText={errors.name?.message} fullWidth required autoFocus />
            )}
          />
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Code" error={!!errors.code} helperText={errors.code?.message} fullWidth required />
            )}
          />
          <Controller
            name="managerId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                select
                label="Manager"
                fullWidth
              >
                <MenuItem value="">No manager assigned</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
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
            {isSubmitting ? 'Saving…' : department ? 'Save changes' : 'Create department'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
