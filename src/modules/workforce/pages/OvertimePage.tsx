import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Button, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/PageHeader'
import { StatusChip } from '@/shared/components/StatusChip'
import { OvertimeRequestDialog, type OvertimeFormValues } from '../components/OvertimeRequestDialog'
import {
  useAllOvertimeRequests,
  useApproveOvertime,
  useCreateOvertimeRequest,
  useEmployeeOvertimeRequests,
  useRejectOvertime,
} from '../hooks/useOvertime'
import type { OvertimeRequest } from '../types'

function MyOvertime() {
  const { user } = useAuth()
  const employeeId = user?.employeeId
  const { data: requests = [] } = useEmployeeOvertimeRequests(employeeId)
  const createRequest = useCreateOvertimeRequest()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmit = (values: OvertimeFormValues) => {
    if (!employeeId) return
    createRequest.mutate({ employeeId, ...values }, { onSuccess: () => setDialogOpen(false) })
  }

  return (
    <Paper variant="outlined" className="p-5 rounded-lg mb-5">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="subtitle1" className="font-bold">
          My Overtime Requests
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Request overtime
        </Button>
      </div>
      {requests.length === 0 ? (
        <EmptyState title="No overtime requests" description="Requests you submit will appear here." />
      ) : (
        <div className="flex flex-col divide-y divide-black/5">
          {requests.map((req) => (
            <div key={req.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
              <div>
                <span className="font-medium">{req.date}</span>
                <span className="text-neutral-500 ml-2">
                  {req.hours}h · {req.reason}
                </span>
              </div>
              <StatusChip status={req.status} />
            </div>
          ))}
        </div>
      )}

      <OvertimeRequestDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createRequest.isPending}
      />
    </Paper>
  )
}

function OvertimeApprovals() {
  const { data: all = [], isLoading } = useAllOvertimeRequests()
  const { data: employees = [] } = useAllEmployees()
  const approve = useApproveOvertime()
  const reject = useRejectOvertime()
  const pending = all.filter((r) => r.status === 'PENDING')

  const employeeName = (id: string) => {
    const emp = employees.find((e) => e.id === id)
    return emp ? `${emp.firstName} ${emp.lastName}` : id
  }

  const columns: DataTableColumn<OvertimeRequest>[] = [
    { key: 'employee', label: 'Employee', render: (row) => employeeName(row.employeeId) },
    { key: 'date', label: 'Date', render: (row) => row.date },
    { key: 'hours', label: 'Hours', align: 'right', render: (row) => row.hours },
    { key: 'reason', label: 'Reason', render: (row) => row.reason },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Tooltip title="Approve">
            <IconButton size="small" color="success" onClick={() => approve.mutate(row.id)}>
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton size="small" color="error" onClick={() => reject.mutate(row.id)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <Paper variant="outlined" className="p-5 rounded-lg">
      <Typography variant="subtitle1" className="font-bold mb-3">
        Pending Overtime Approvals
      </Typography>
      <DataTable
        columns={columns}
        rows={pending}
        rowKey={(row) => row.id}
        loading={isLoading}
        total={pending.length}
        page={1}
        pageSize={pending.length || 10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        emptyTitle="No pending overtime requests"
        emptyDescription="New requests from your team will show up here."
      />
    </Paper>
  )
}

export function OvertimePage() {
  const { can } = useAuth()
  const canApprove = can('WORKFORCE', 'APPROVE')

  return (
    <>
      <PageHeader title="Overtime" subtitle="Request and approve overtime work." />
      <MyOvertime />
      {canApprove && <OvertimeApprovals />}
    </>
  )
}
