import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import { Alert, Button, IconButton, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useDepartments } from '@/modules/core-hr/hooks/useDepartments'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/PageHeader'
import { PayslipDialog } from '../components/PayslipDialog'
import { useAllPayrollRecords, useEmployeePayrollHistory, useGeneratePayroll } from '../hooks/usePayroll'
import type { PayrollRecord } from '../types'

function peso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function currentPeriod(): string {
  return new Date().toISOString().slice(0, 7)
}

function RunPayroll() {
  const { data: employees = [] } = useAllEmployees()
  const { data: departments = [] } = useDepartments()
  const generatePayroll = useGeneratePayroll()
  const [period, setPeriod] = useState(currentPeriod())
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const eligibleEmployees = employees.filter(
    (e) => e.employmentStatus === 'ACTIVE' && (!departmentFilter || e.departmentId === departmentFilter),
  )

  const handleGenerate = () => {
    setResult(null)
    generatePayroll.mutate(
      { period, employeeIds: eligibleEmployees.map((e) => e.id) },
      {
        onSuccess: (records) => setResult(`Generated ${records.length} payslip(s) for ${period}.`),
      },
    )
  }

  return (
    <Paper variant="outlined" className="p-5 rounded-lg mb-5">
      <Typography variant="subtitle1" className="font-bold mb-1">
        Run Payroll
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-4">
        Demo payroll run — computes mock earnings, government contributions, and tax for active employees.
      </Typography>
      <div className="flex flex-wrap items-end gap-3">
        <TextField
          type="month"
          label="Pay period"
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          size="small"
          select
          label="Department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-48"
        >
          <MenuItem value="">All departments</MenuItem>
          {departments.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.name}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleGenerate} disabled={generatePayroll.isPending || !period}>
          {generatePayroll.isPending ? 'Generating…' : `Generate payroll (${eligibleEmployees.length})`}
        </Button>
      </div>
      {result && (
        <Alert severity="success" className="mt-3">
          {result}
        </Alert>
      )}
    </Paper>
  )
}

function PayrollHistoryTable({ records, isLoading }: { records: PayrollRecord[]; isLoading: boolean }) {
  const { data: employees = [] } = useAllEmployees()
  const [viewing, setViewing] = useState<PayrollRecord | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const employeeById = useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees])
  const sorted = [...records].sort((a, b) => (a.period < b.period ? 1 : -1))
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize)

  const columns: DataTableColumn<PayrollRecord>[] = [
    { key: 'period', label: 'Period', render: (row) => row.period },
    {
      key: 'employee',
      label: 'Employee',
      render: (row) => {
        const emp = employeeById.get(row.employeeId)
        return emp ? `${emp.firstName} ${emp.lastName}` : row.employeeId
      },
    },
    { key: 'grossPay', label: 'Gross pay', align: 'right', render: (row) => peso(row.grossPay) },
    { key: 'totalDeductions', label: 'Deductions', align: 'right', render: (row) => peso(row.totalDeductions) },
    { key: 'netPay', label: 'Net pay', align: 'right', render: (row) => peso(row.netPay) },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <Tooltip title="View payslip">
          <IconButton size="small" onClick={() => setViewing(row)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Paper variant="outlined" className="p-5 rounded-lg">
      <Typography variant="subtitle1" className="font-bold mb-3">
        Payroll History
      </Typography>
      {records.length === 0 ? (
        <EmptyState title="No payroll records" description="Generated payslips will appear here." />
      ) : (
        <DataTable
          columns={columns}
          rows={paged}
          rowKey={(row) => row.id}
          loading={isLoading}
          total={sorted.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      )}

      <PayslipDialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        record={viewing ?? undefined}
        employeeName={
          viewing
            ? (() => {
                const emp = employeeById.get(viewing.employeeId)
                return emp ? `${emp.firstName} ${emp.lastName}` : viewing.employeeId
              })()
            : undefined
        }
      />
    </Paper>
  )
}

export function PayrollPage() {
  const { user, can } = useAuth()
  const canGenerate = can('COMPENSATION', 'CREATE')
  const { data: allRecords = [], isLoading: loadingAll } = useAllPayrollRecords()
  const { data: myRecords = [], isLoading: loadingMine } = useEmployeePayrollHistory(canGenerate ? undefined : user?.employeeId)

  return (
    <>
      <PageHeader title="Payroll" subtitle="Run payroll and review payroll history." />
      {canGenerate && <RunPayroll />}
      <PayrollHistoryTable records={canGenerate ? allRecords : myRecords} isLoading={canGenerate ? loadingAll : loadingMine} />
    </>
  )
}
