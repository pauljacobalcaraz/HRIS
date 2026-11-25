import { Chip, MenuItem, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useDepartments } from '@/modules/core-hr/hooks/useDepartments'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { PageHeader } from '@/shared/components/PageHeader'
import { useShiftAssignments, useShifts, useUpdateShiftAssignment } from '../hooks/useShifts'
import type { Employee } from '@/modules/core-hr/types'

export function ShiftSchedulePage() {
  const { can } = useAuth()
  const canUpdate = can('WORKFORCE', 'UPDATE')
  const { data: employees = [] } = useAllEmployees()
  const { data: departments = [] } = useDepartments()
  const { data: shifts = [] } = useShifts()
  const { data: assignments = [], isLoading } = useShiftAssignments()
  const updateAssignment = useUpdateShiftAssignment()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [departmentFilter, setDepartmentFilter] = useState('')

  const assignmentByEmployee = useMemo(() => new Map(assignments.map((a) => [a.employeeId, a.shiftId])), [assignments])
  const departmentName = (id: string) => departments.find((d) => d.id === id)?.name ?? id
  const shiftName = (id: string) => shifts.find((s) => s.id === id)?.name ?? id

  const filtered = departmentFilter ? employees.filter((e) => e.departmentId === departmentFilter) : employees
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns: DataTableColumn<Employee>[] = [
    { key: 'name', label: 'Employee', render: (row) => `${row.firstName} ${row.lastName}` },
    { key: 'department', label: 'Department', render: (row) => departmentName(row.departmentId) },
    {
      key: 'shift',
      label: 'Shift',
      render: (row) => {
        const shiftId = assignmentByEmployee.get(row.id) ?? shifts[0]?.id
        if (!canUpdate) return <Chip size="small" label={shiftName(shiftId)} />
        return (
          <TextField
            size="small"
            select
            value={shiftId}
            onChange={(e) => updateAssignment.mutate({ employeeId: row.id, shiftId: e.target.value })}
            className="w-48"
          >
            {shifts.map((shift) => (
              <MenuItem key={shift.id} value={shift.id}>
                {shift.name} ({shift.startTime}–{shift.endTime})
              </MenuItem>
            ))}
          </TextField>
        )
      },
    },
  ]

  return (
    <>
      <PageHeader title="Shift Schedule" subtitle="Current shift assignments across the organization." />
      <Typography variant="body2" color="text.secondary" className="mb-3">
        {!canUpdate && 'You have read-only access to shift assignments.'}
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
      />
    </>
  )
}
