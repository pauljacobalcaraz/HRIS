import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Button, IconButton, LinearProgress, Paper, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/PageHeader'
import { ReasonDialog } from '@/shared/components/ReasonDialog'
import { StatusChip } from '@/shared/components/StatusChip'
import { LeaveApplicationDialog, type LeaveApplicationFormValues } from '../components/LeaveApplicationDialog'
import {
  useApproveLeave,
  useCreateLeaveApplication,
  useEmployeeLeaveApplications,
  useLeaveBalances,
  useLeaveTypes,
  usePendingLeaveApprovals,
  useRejectLeave,
} from '../hooks/useLeave'
import type { LeaveApplication } from '../types'

function MyLeave() {
  const { user } = useAuth()
  const employeeId = user?.employeeId
  const { data: balances = [] } = useLeaveBalances(employeeId)
  const { data: applications = [] } = useEmployeeLeaveApplications(employeeId)
  const createApplication = useCreateLeaveApplication()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmit = (values: LeaveApplicationFormValues & { days: number }) => {
    if (!employeeId) return
    createApplication.mutate(
      { employeeId, ...values },
      { onSuccess: () => setDialogOpen(false) },
    )
  }

  return (
    <>
      <Paper variant="outlined" className="p-5 rounded-lg mb-5">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="subtitle1" className="font-bold">
            My Leave Balances
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Apply for leave
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {balances.map((balance) => (
            <div key={balance.leaveTypeId} className="border border-black/10 rounded-lg p-3">
              <Typography variant="body2" className="font-medium mb-1">
                {balance.leaveTypeName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {balance.remaining} of {balance.allocated} days left
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(balance.used / balance.allocated) * 100}
                className="mt-2 rounded-full"
                sx={{ height: 6 }}
              />
            </div>
          ))}
        </div>
      </Paper>

      <Paper variant="outlined" className="p-5 rounded-lg mb-5">
        <Typography variant="subtitle1" className="font-bold mb-3">
          My Applications
        </Typography>
        {applications.length === 0 ? (
          <EmptyState title="No leave applications yet" description="Your submitted requests will appear here." />
        ) : (
          <div className="flex flex-col divide-y divide-black/5">
            {applications.map((app) => (
              <div key={app.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <div>
                  <span className="font-medium">
                    {app.startDate} → {app.endDate}
                  </span>
                  <span className="text-neutral-500 ml-2">({app.days}d) {app.reason}</span>
                </div>
                <StatusChip status={app.status} />
              </div>
            ))}
          </div>
        )}
      </Paper>

      <LeaveApplicationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createApplication.isPending}
      />
    </>
  )
}

function LeaveApprovals() {
  const { data: pending = [], isLoading } = usePendingLeaveApprovals()
  const { data: employees = [] } = useAllEmployees()
  const { data: leaveTypes = [] } = useLeaveTypes()
  const approveLeave = useApproveLeave()
  const rejectLeave = useRejectLeave()
  const [rejectTarget, setRejectTarget] = useState<LeaveApplication | null>(null)

  const employeeName = (id: string) => {
    const emp = employees.find((e) => e.id === id)
    return emp ? `${emp.firstName} ${emp.lastName}` : id
  }
  const leaveTypeName = (id: string) => leaveTypes.find((t) => t.id === id)?.name ?? id

  const columns: DataTableColumn<LeaveApplication>[] = [
    { key: 'employee', label: 'Employee', render: (row) => employeeName(row.employeeId) },
    { key: 'type', label: 'Type', render: (row) => leaveTypeName(row.leaveTypeId) },
    { key: 'dates', label: 'Dates', render: (row) => `${row.startDate} → ${row.endDate}` },
    { key: 'days', label: 'Days', align: 'right', render: (row) => row.days },
    { key: 'reason', label: 'Reason', render: (row) => row.reason },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Tooltip title="Approve">
            <IconButton size="small" color="success" onClick={() => approveLeave.mutate(row.id)}>
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton size="small" color="error" onClick={() => setRejectTarget(row)}>
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
        Pending Approvals
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
        emptyTitle="No pending leave requests"
        emptyDescription="New requests from your team will show up here."
      />

      <ReasonDialog
        open={!!rejectTarget}
        title="Reject leave request"
        description="Provide a reason for the employee."
        confirmLabel="Reject"
        loading={rejectLeave.isPending}
        onCancel={() => setRejectTarget(null)}
        onConfirm={(reason) => {
          if (!rejectTarget) return
          rejectLeave.mutate({ id: rejectTarget.id, note: reason }, { onSuccess: () => setRejectTarget(null) })
        }}
      />
    </Paper>
  )
}

export function LeavePage() {
  const { can } = useAuth()
  const canApprove = can('WORKFORCE', 'APPROVE')

  return (
    <>
      <PageHeader title="Leave Management" subtitle="Apply for leave and track approvals." />
      <MyLeave />
      {canApprove && <LeaveApprovals />}
    </>
  )
}
