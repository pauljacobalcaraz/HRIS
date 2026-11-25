import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import { Avatar, Button, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { PageHeader } from '@/shared/components/PageHeader'
import { StatusChip } from '@/shared/components/StatusChip'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { useDepartments } from '../hooks/useDepartments'
import { useDeleteEmployee, useEmployees } from '../hooks/useEmployees'
import { usePositions } from '../hooks/usePositions'
import type { Employee } from '../types'

export function EmployeeListPage() {
  const navigate = useNavigate()
  const { can } = useAuth()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState<string>('lastName')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null)

  const { data: departments = [] } = useDepartments()
  const { data: positions = [] } = usePositions()
  const { data, isLoading, isFetching } = useEmployees({
    page,
    pageSize,
    search,
    sortBy,
    sortDir,
    filters: { departmentId: departmentFilter, employmentStatus: statusFilter },
  })
  const deleteEmployee = useDeleteEmployee()

  const canCreate = can('CORE_HR', 'CREATE')
  const canUpdate = can('CORE_HR', 'UPDATE')
  const canDelete = can('CORE_HR', 'DELETE')

  const departmentName = (id: string) => departments.find((d) => d.id === id)?.name ?? id
  const positionTitle = (id: string) => positions.find((p) => p.id === id)?.title ?? id

  const columns: DataTableColumn<Employee>[] = [
    {
      key: 'name',
      label: 'Employee',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar sx={{ width: 32, height: 32, bgcolor: row.avatarColor, fontSize: 13 }}>
            {row.firstName[0]}
            {row.lastName[0]}
          </Avatar>
          <div className="min-w-0">
            <Typography variant="body2" className="font-medium leading-tight">
              {row.firstName} {row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.id}
            </Typography>
          </div>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: (row) => row.email },
    { key: 'departmentId', label: 'Department', sortable: true, render: (row) => departmentName(row.departmentId) },
    { key: 'positionId', label: 'Position', render: (row) => positionTitle(row.positionId) },
    {
      key: 'employmentStatus',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusChip status={row.employmentStatus} />,
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Tooltip title="View">
            <IconButton size="small" onClick={() => navigate(`/core-hr/employees/${row.id}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {canUpdate && (
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => navigate(`/core-hr/employees/${row.id}/edit`)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canDelete && (
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => setPendingDelete(row)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Employees"
        subtitle={`${data?.total ?? 0} employee records`}
        actions={
          canCreate && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/core-hr/employees/new')}>
              Add employee
            </Button>
          )
        }
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <TextField
          size="small"
          placeholder="Search by name, email, ID…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-64"
        />
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
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>
              {dept.name}
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
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="ON_LEAVE">On Leave</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
          <MenuItem value="TERMINATED">Terminated</MenuItem>
        </TextField>
      </div>

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(row) => row.id}
        loading={isLoading || isFetching}
        total={data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={(key, dir) => {
          setSortBy(key)
          setSortDir(dir)
        }}
        emptyTitle="No employees found"
        emptyDescription="Try a different search term or clear your filters."
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete employee"
        description={`Are you sure you want to delete ${pendingDelete?.firstName} ${pendingDelete?.lastName}? This cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleteEmployee.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteEmployee.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </>
  )
}
