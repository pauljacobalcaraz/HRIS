import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Avatar, Button, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useDepartments } from '@/modules/core-hr/hooks/useDepartments'
import { useEmployee, useUpdateEmployee } from '@/modules/core-hr/hooks/useEmployees'
import { usePositions } from '@/modules/core-hr/hooks/usePositions'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { PageHeader } from '@/shared/components/PageHeader'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
})

type ProfileFormValues = z.infer<typeof schema>

export function MyProfilePage() {
  const { user } = useAuth()
  const { data: employee, isLoading } = useEmployee(user?.employeeId)
  const { data: departments = [] } = useDepartments()
  const { data: positions = [] } = usePositions()
  const updateEmployee = useUpdateEmployee()
  const [saved, setSaved] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    values: employee ? { email: employee.email, phone: employee.phone, address: employee.address } : undefined,
  })

  if (isLoading || !employee) return null

  const department = departments.find((d) => d.id === employee.departmentId)
  const position = positions.find((p) => p.id === employee.positionId)

  const onSubmit = (values: ProfileFormValues) => {
    setSaved(false)
    updateEmployee.mutate(
      { id: employee.id, payload: values },
      { onSuccess: () => setSaved(true) },
    )
  }

  return (
    <>
      <PageHeader title="My Profile" subtitle="Update your personal contact information." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Paper variant="outlined" className="p-5 rounded-lg md:col-span-1 flex flex-col items-center text-center gap-2">
          <Avatar sx={{ width: 72, height: 72, bgcolor: employee.avatarColor, fontSize: 24 }}>
            {employee.firstName[0]}
            {employee.lastName[0]}
          </Avatar>
          <Typography variant="h6" className="font-bold">
            {employee.firstName} {employee.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {position?.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {department?.name} · {employee.id}
          </Typography>
        </Paper>

        <Paper variant="outlined" className="p-5 rounded-lg md:col-span-2">
          <Typography variant="subtitle2" className="font-bold mb-3">
            Contact Information
          </Typography>
          {saved && (
            <Alert severity="success" className="mb-3" onClose={() => setSaved(false)}>
              Profile updated successfully.
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              name="address"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Address" error={!!errors.address} helperText={errors.address?.message} fullWidth multiline minRows={2} required />
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" variant="contained" disabled={updateEmployee.isPending}>
                {updateEmployee.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </>
  )
}
