import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { Alert, Button, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useDepartments } from '@/modules/core-hr/hooks/useDepartments'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { PageHeader } from '@/shared/components/PageHeader'
import { StatusChip } from '@/shared/components/StatusChip'
import {
  useAllAttendance,
  useAttendanceSummary,
  useEmployeeAttendance,
  useTimeIn,
  useTimeOut,
  useTodayAttendance,
} from '../hooks/useAttendance'
import type { AttendanceRecord } from '../types'

function MyAttendanceCard() {
  const { user } = useAuth()
  const employeeId = user?.employeeId
  const { data: today } = useTodayAttendance(employeeId)
  const { data: history = [] } = useEmployeeAttendance(employeeId)
  const { data: summary } = useAttendanceSummary(employeeId)
  const timeIn = useTimeIn()
  const timeOut = useTimeOut()
  const [error, setError] = useState<string | null>(null)

  const handleTimeIn = () => {
    if (!employeeId) return
    setError(null)
    timeIn.mutate(employeeId, { onError: (err) => setError(err.message) })
  }

  const handleTimeOut = () => {
    if (!employeeId) return
    setError(null)
    timeOut.mutate(employeeId, { onError: (err) => setError(err.message) })
  }

  return (
    <Paper variant="outlined" className="p-5 rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <Typography variant="subtitle1" className="font-bold">
            My Attendance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {today ? (
              <>
                Time in: <strong>{today.timeIn ?? '—'}</strong> · Time out: <strong>{today.timeOut ?? '—'}</strong>
              </>
            ) : (
              "You haven't timed in today."
            )}
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={handleTimeIn}
            disabled={!!today?.timeIn || timeIn.isPending}
          >
            Time In
          </Button>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleTimeOut}
            disabled={!today?.timeIn || !!today?.timeOut || timeOut.isPending}
          >
            Time Out
          </Button>
        </div>
      </div>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {(['PRESENT', 'LATE', 'UNDERTIME', 'ABSENT'] as const).map((status) => (
          <div key={status} className="border border-black/10 rounded-lg p-3 text-center">
            <Typography variant="h6" className="font-bold">
              {summary?.[status] ?? 0}
            </Typography>
            <StatusChip status={status} />
          </div>
        ))}
      </div>

      <Typography variant="caption" color="text.secondary">
        Recent history
      </Typography>
      <div className="flex flex-col divide-y divide-black/5 mt-1">
        {history.slice(0, 6).map((rec) => (
          <div key={rec.id} className="flex items-center justify-between py-2 text-sm">
            <span>{rec.date}</span>
            <span className="text-neutral-500">
              {rec.timeIn ?? '—'} - {rec.timeOut ?? '—'}
            </span>
            <StatusChip status={rec.status} />
          </div>
        ))}
      </div>
    </Paper>
  )
}

function AttendanceMonitoring() {
  const { data: records = [], isLoading } = useAllAttendance()
  const { data: employees = [] } = useAllEmployees()
  const { data: departments = [] } = useDepartments()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const employeeById = useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees])

  const filtered = useMemo(() => {
    return records.filter((rec) => {
      const emp = employeeById.get(rec.employeeId)
      if (departmentFilter && emp?.departmentId !== departmentFilter) return false
      if (statusFilter && rec.status !== statusFilter) return false
      return true
    })
  }, [records, employeeById, departmentFilter, statusFilter])

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns: DataTableColumn<AttendanceRecord>[] = [
    {
      key: 'employee',
      label: 'Employee',
      render: (row) => {
        const emp = employeeById.get(row.employeeId)
        return emp ? `${emp.firstName} ${emp.lastName}` : row.employeeId
      },
    },
    { key: 'date', label: 'Date', render: (row) => row.date },
    { key: 'timeIn', label: 'Time In', render: (row) => row.timeIn ?? '—' },
    { key: 'timeOut', label: 'Time Out', render: (row) => row.timeOut ?? '—' },
    { key: 'hoursWorked', label: 'Hours', align: 'right', render: (row) => row.hoursWorked.toFixed(1) },
    { key: 'status', label: 'Status', render: (row) => <StatusChip status={row.status} /> },
  ]

  return (
    <Paper variant="outlined" className="p-5 rounded-lg mt-5">
      <Typography variant="subtitle1" className="font-bold mb-3">
        Attendance Monitoring
      </Typography>
      <div className="flex flex-wrap gap-3 mb-4">
        <TextField
          size="small"
          select
          label="Department"
          value={departmentFilter}
          onChange={(e) => {
            setDepartmentFilter(e.target.value)
            setPage(1)
          }}
          className="w-48"
        >
          <MenuItem value="">All departments</MenuItem>
          {departments.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="w-44"
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="PRESENT">Present</MenuItem>
          <MenuItem value="LATE">Late</MenuItem>
          <MenuItem value="UNDERTIME">Undertime</MenuItem>
          <MenuItem value="ABSENT">Absent</MenuItem>
        </TextField>
      </div>
      <DataTable
        columns={columns}
        rows={paged}
        rowKey={(row) => row.id}
        loading={isLoading}
        total={filtered.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
        emptyTitle="No attendance records"
        emptyDescription="Adjust your filters to see more results."
      />
    </Paper>
  )
}

export function AttendancePage() {
  const { user } = useAuth()
  const canMonitor = user?.role !== 'EMPLOYEE'

  return (
    <>
      <PageHeader title="Attendance" subtitle="Time in, time out, and attendance monitoring." />
      <MyAttendanceCard />
      {canMonitor && <AttendanceMonitoring />}
    </>
  )
}
