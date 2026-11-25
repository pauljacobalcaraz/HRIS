import EditIcon from '@mui/icons-material/EditOutlined'
import { Avatar, Button, Chip, Divider, Paper, Skeleton, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'
import { StatusChip } from '@/shared/components/StatusChip'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { useDepartments } from '../hooks/useDepartments'
import { useAllEmployees, useEmployee } from '../hooks/useEmployees'
import { usePositions } from '../hooks/usePositions'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" className="font-medium">
        {value}
      </Typography>
    </div>
  )
}

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { can } = useAuth()
  const { data: employee, isLoading } = useEmployee(id)
  const { data: departments = [] } = useDepartments()
  const { data: positions = [] } = usePositions()
  const { data: employees = [] } = useAllEmployees()

  if (isLoading) return <Skeleton variant="rounded" height={320} />
  if (!employee) return <Typography>Employee not found.</Typography>

  const department = departments.find((d) => d.id === employee.departmentId)
  const position = positions.find((p) => p.id === employee.positionId)
  const manager = employees.find((e) => e.id === employee.managerId)

  return (
    <>
      <PageHeader
        title={`${employee.firstName} ${employee.lastName}`}
        subtitle={employee.id}
        actions={
          can('CORE_HR', 'UPDATE') && (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/core-hr/employees/${employee.id}/edit`)}>
              Edit
            </Button>
          )
        }
      />

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
          <StatusChip status={employee.employmentStatus} />
          <Chip size="small" variant="outlined" label={employee.employmentType.replace('_', ' ')} className="mt-1" />
        </Paper>

        <Paper variant="outlined" className="p-5 rounded-lg md:col-span-2">
          <Typography variant="subtitle2" className="font-bold mb-3">
            Employment information
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Department" value={department?.name ?? '—'} />
            <Field label="Position" value={position?.title ?? '—'} />
            <Field label="Manager" value={manager ? `${manager.firstName} ${manager.lastName}` : 'No manager'} />
            <Field label="Date hired" value={employee.dateHired} />
          </div>
          <Divider className="my-4" />
          <Typography variant="subtitle2" className="font-bold mb-3">
            Personal information
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" value={employee.email} />
            <Field label="Phone" value={employee.phone} />
            <Field label="Date of birth" value={employee.dateOfBirth} />
            <Field label="Address" value={employee.address} />
          </div>
        </Paper>
      </div>
    </>
  )
}
