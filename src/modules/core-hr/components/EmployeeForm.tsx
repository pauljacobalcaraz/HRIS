import { zodResolver } from '@hookform/resolvers/zod'
import { Button, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { usePositions } from '../hooks/usePositions'
import { useDepartments } from '../hooks/useDepartments'
import { useAllEmployees } from '../hooks/useEmployees'
import { EMPLOYEE_FORM_DEFAULTS, employeeSchema, type EmployeeFormValues } from './employeeSchema'

interface EmployeeFormProps {
  defaultValues?: EmployeeFormValues
  submitLabel: string
  onSubmit: (values: EmployeeFormValues) => void
  isSubmitting?: boolean
  excludeEmployeeId?: string
}

export function EmployeeForm({
  defaultValues = EMPLOYEE_FORM_DEFAULTS,
  submitLabel,
  onSubmit,
  isSubmitting,
  excludeEmployeeId,
}: EmployeeFormProps) {
  const { data: departments = [] } = useDepartments()
  const { data: positions = [] } = usePositions()
  const { data: employees = [] } = useAllEmployees()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })

  const selectedDepartmentId = watch('departmentId')
  const filteredPositions = positions.filter((p) => p.departmentId === selectedDepartmentId)
  const potentialManagers = employees.filter((e) => e.id !== excludeEmployeeId)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="First name" error={!!errors.firstName} helperText={errors.firstName?.message} fullWidth required />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Last name" error={!!errors.lastName} helperText={errors.lastName?.message} fullWidth required />
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
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Phone" error={!!errors.phone} helperText={errors.phone?.message} fullWidth required />
          )}
        />
        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Department" error={!!errors.departmentId} helperText={errors.departmentId?.message} fullWidth required>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="positionId"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Position" error={!!errors.positionId} helperText={errors.positionId?.message} fullWidth required disabled={!selectedDepartmentId}>
              {filteredPositions.map((pos) => (
                <MenuItem key={pos.id} value={pos.id}>
                  {pos.title}
                </MenuItem>
              ))}
            </TextField>
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
              <MenuItem value="">No manager</MenuItem>
              {potentialManagers.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="employmentStatus"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Employment status" fullWidth>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="ON_LEAVE">On Leave</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="TERMINATED">Terminated</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="employmentType"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Employment type" fullWidth>
              <MenuItem value="REGULAR">Regular</MenuItem>
              <MenuItem value="PROBATIONARY">Probationary</MenuItem>
              <MenuItem value="CONTRACTUAL">Contractual</MenuItem>
              <MenuItem value="PART_TIME">Part-time</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="dateHired"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="date" label="Date hired" error={!!errors.dateHired} helperText={errors.dateHired?.message} fullWidth slotProps={{ inputLabel: { shrink: true } }} required />
          )}
        />
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <TextField {...field} type="date" label="Date of birth" error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} fullWidth slotProps={{ inputLabel: { shrink: true } }} required />
          )}
        />
      </div>
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Address" error={!!errors.address} helperText={errors.address?.message} fullWidth multiline minRows={2} required />
        )}
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
