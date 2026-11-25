import AddIcon from '@mui/icons-material/Add'
import { Button, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/PageHeader'
import { StatusChip } from '@/shared/components/StatusChip'
import { DocumentRequestDialog } from '../components/DocumentRequestDialog'
import {
  useAllDocumentRequests,
  useCreateDocumentRequest,
  useEmployeeDocumentRequests,
  useUpdateDocumentRequestStatus,
} from '../hooks/useDocumentRequests'
import { DOCUMENT_TYPE_LABELS } from '../services/documentService'
import type { DocumentRequest, DocumentRequestStatus } from '../types'

function MyRequests() {
  const { user } = useAuth()
  const { data: requests = [] } = useEmployeeDocumentRequests(user?.employeeId)
  const createRequest = useCreateDocumentRequest()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Paper variant="outlined" className="p-5 rounded-lg mb-5">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="subtitle1" className="font-bold">
          My Document Requests
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Request document
        </Button>
      </div>
      {requests.length === 0 ? (
        <EmptyState title="No requests yet" description="Request a COE or other document and track its status here." />
      ) : (
        <div className="flex flex-col divide-y divide-black/5">
          {requests.map((req) => (
            <div key={req.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
              <div>
                <span className="font-medium">{DOCUMENT_TYPE_LABELS[req.type]}</span>
                <span className="text-neutral-500 ml-2">
                  {req.purpose} · requested {req.requestedDate}
                </span>
              </div>
              <StatusChip status={req.status} />
            </div>
          ))}
        </div>
      )}

      <DocumentRequestDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(values) => {
          if (!user) return
          createRequest.mutate({ employeeId: user.employeeId, ...values }, { onSuccess: () => setDialogOpen(false) })
        }}
        isSubmitting={createRequest.isPending}
      />
    </Paper>
  )
}

function RequestQueue() {
  const { data: requests = [], isLoading } = useAllDocumentRequests()
  const { data: employees = [] } = useAllEmployees()
  const updateStatus = useUpdateDocumentRequestStatus()

  const employeeName = (id: string) => {
    const emp = employees.find((e) => e.id === id)
    return emp ? `${emp.firstName} ${emp.lastName}` : id
  }

  const columns: DataTableColumn<DocumentRequest>[] = [
    { key: 'employee', label: 'Employee', render: (row) => employeeName(row.employeeId) },
    { key: 'type', label: 'Type', render: (row) => DOCUMENT_TYPE_LABELS[row.type] },
    { key: 'purpose', label: 'Purpose', render: (row) => row.purpose },
    { key: 'requestedDate', label: 'Requested', render: (row) => row.requestedDate },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <TextField
          size="small"
          select
          value={row.status}
          onChange={(e) => updateStatus.mutate({ id: row.id, status: e.target.value as DocumentRequestStatus })}
          className="w-36"
        >
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="PROCESSING">Processing</MenuItem>
          <MenuItem value="RELEASED">Released</MenuItem>
          <MenuItem value="REJECTED">Rejected</MenuItem>
        </TextField>
      ),
    },
  ]

  return (
    <Paper variant="outlined" className="p-5 rounded-lg">
      <Typography variant="subtitle1" className="font-bold mb-3">
        Request Queue
      </Typography>
      <DataTable
        columns={columns}
        rows={requests}
        rowKey={(row) => row.id}
        loading={isLoading}
        total={requests.length}
        page={1}
        pageSize={requests.length || 10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    </Paper>
  )
}

export function DocumentRequestsPage() {
  const { can } = useAuth()
  const canProcess = can('EMPLOYEE_SERVICES', 'APPROVE')

  return (
    <>
      <PageHeader title="Document Requests" subtitle="Request certificates and track processing status." />
      <MyRequests />
      {canProcess && <RequestQueue />}
    </>
  )
}
