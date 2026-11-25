import { MenuItem, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmployeePerformancePanel } from '../components/EmployeePerformancePanel'

export function PerformancePage() {
  const { user, can } = useAuth()
  const { data: employees = [] } = useAllEmployees()
  const canManage = can('TALENT', 'UPDATE')

  const manageable = useMemo(() => {
    if (!canManage || !user) return []
    if (user.role === 'SUPER_ADMIN' || user.role === 'HR_ADMIN') {
      return employees.filter((e) => e.id !== user.employeeId)
    }
    return employees.filter((e) => e.managerId === user.employeeId)
  }, [canManage, employees, user])

  const [selectedId, setSelectedId] = useState('')
  const selectedEmployee = employees.find((e) => e.id === selectedId)

  return (
    <>
      <PageHeader title="Performance" subtitle="Goals, evaluations, and skills development." />

      <Typography variant="subtitle1" className="font-bold mb-3">
        My Performance
      </Typography>
      {user && <EmployeePerformancePanel employeeId={user.employeeId} canManage={false} />}

      {canManage && manageable.length > 0 && (
        <div className="mt-8">
          <Typography variant="subtitle1" className="font-bold mb-3">
            Team Performance
          </Typography>
          <TextField
            select
            size="small"
            label="Select team member"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-64 mb-4"
          >
            {manageable.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </MenuItem>
            ))}
          </TextField>
          {selectedId && (
            <EmployeePerformancePanel
              employeeId={selectedId}
              employeeName={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : undefined}
              canManage
            />
          )}
        </div>
      )}
    </>
  )
}
