import ApartmentIcon from '@mui/icons-material/Apartment'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { CircularProgress, Paper, Typography } from '@mui/material'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useDepartments } from '@/modules/core-hr/hooks/useDepartments'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { PageHeader } from '@/shared/components/PageHeader'
import { ROLE_LABELS } from '@/shared/constants/roles'
import { DepartmentHeadcountChart } from '../components/DepartmentHeadcountChart'
import { StatCard } from '../components/StatCard'
import { StatusBreakdown } from '../components/StatusBreakdown'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: employees, isLoading: loadingEmployees } = useAllEmployees()
  const { data: departments = [], isLoading: loadingDepartments } = useDepartments()

  if (loadingEmployees || loadingDepartments || !employees) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    )
  }

  const activeCount = employees.filter((e) => e.employmentStatus === 'ACTIVE').length
  const onLeaveCount = employees.filter((e) => e.employmentStatus === 'ON_LEAVE').length
  const recentHires = [...employees].sort((a, b) => (a.dateHired < b.dateHired ? 1 : -1)).slice(0, 5)

  const statusCounts = employees.reduce<Record<string, number>>((acc, emp) => {
    acc[emp.employmentStatus] = (acc[emp.employmentStatus] ?? 0) + 1
    return acc
  }, {})

  const departmentData = departments.map((dept) => ({
    name: dept.name,
    count: employees.filter((e) => e.departmentId === dept.id).length,
  }))

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.displayName.split(' ')[0] ?? ''}`}
        subtitle={user ? `${ROLE_LABELS[user.role]} overview` : undefined}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total employees" value={employees.length} icon={<GroupsIcon />} accent="#2a78d6" />
        <StatCard label="Active" value={activeCount} icon={<PersonAddAlt1Icon />} accent="#0ca30c" />
        <StatCard label="On leave" value={onLeaveCount} icon={<EventBusyIcon />} accent="#fab219" />
        <StatCard label="Departments" value={departments.length} icon={<ApartmentIcon />} accent="#4a3aa7" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DepartmentHeadcountChart data={departmentData} />
        </div>
        <StatusBreakdown counts={statusCounts} total={employees.length} />
      </div>

      <Paper variant="outlined" className="p-4 rounded-lg mt-4">
        <Typography variant="subtitle2" className="font-bold mb-3">
          Recently hired
        </Typography>
        <div className="flex flex-col divide-y divide-black/5">
          {recentHires.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium">
                {emp.firstName} {emp.lastName}
              </span>
              <span className="text-neutral-500">{emp.dateHired}</span>
            </div>
          ))}
        </div>
      </Paper>
    </>
  )
}
