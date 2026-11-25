import EditIcon from '@mui/icons-material/EditOutlined'
import { Alert, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { PageHeader } from '@/shared/components/PageHeader'
import { SalaryDialog } from '../components/SalaryDialog'
import { useAllSalaryRecords, useEmployeeSalary, useUpdateSalary } from '../hooks/useSalary'
import { compute13thMonthEstimate } from '../utils/payrollCalculator'
import type { SalaryRecord } from '../types'

function peso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function MySalary() {
  const { user } = useAuth()
  const { data: salary, isLoading } = useEmployeeSalary(user?.employeeId)

  if (isLoading || !salary) return null

  const totalAllowances = salary.riceAllowance + salary.transportationAllowance + salary.clothingAllowance

  return (
    <Paper variant="outlined" className="p-5 rounded-lg mb-5">
      <Typography variant="subtitle1" className="font-bold mb-3">
        My Salary
      </Typography>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <Typography variant="caption" color="text.secondary">
            Basic pay
          </Typography>
          <Typography variant="body1" className="font-semibold">
            {peso(salary.basicPay)}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" color="text.secondary">
            Total allowances
          </Typography>
          <Typography variant="body1" className="font-semibold">
            {peso(totalAllowances)}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" color="text.secondary">
            13th-month estimate
          </Typography>
          <Typography variant="body1" className="font-semibold">
            {peso(compute13thMonthEstimate(salary.basicPay))}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" color="text.secondary">
            Effective date
          </Typography>
          <Typography variant="body1" className="font-semibold">
            {salary.effectiveDate}
          </Typography>
        </div>
      </div>
      <Alert severity="info" className="mt-4">
        Figures are demo calculations for prototype purposes only.
      </Alert>
    </Paper>
  )
}

function SalaryTable() {
  const { data: employees = [] } = useAllEmployees()
  const { data: salaries = [], isLoading } = useAllSalaryRecords()
  const updateSalary = useUpdateSalary()
  const [editing, setEditing] = useState<SalaryRecord | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const employeeName = (id: string) => {
    const emp = employees.find((e) => e.id === id)
    return emp ? `${emp.firstName} ${emp.lastName}` : id
  }

  const paged = salaries.slice((page - 1) * pageSize, page * pageSize)

  const columns: DataTableColumn<SalaryRecord>[] = [
    { key: 'employee', label: 'Employee', render: (row) => employeeName(row.employeeId) },
    { key: 'basicPay', label: 'Basic pay', align: 'right', render: (row) => peso(row.basicPay) },
    {
      key: 'allowances',
      label: 'Allowances',
      align: 'right',
      render: (row) => peso(row.riceAllowance + row.transportationAllowance + row.clothingAllowance),
    },
    { key: 'effectiveDate', label: 'Effective', render: (row) => row.effectiveDate },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <Tooltip title="Edit salary">
          <IconButton size="small" onClick={() => setEditing(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Paper variant="outlined" className="p-5 rounded-lg">
      <Typography variant="subtitle1" className="font-bold mb-3">
        Employee Salary Records
      </Typography>
      <DataTable
        columns={columns}
        rows={paged}
        rowKey={(row) => row.id}
        loading={isLoading}
        total={salaries.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      <SalaryDialog
        open={!!editing}
        salary={editing ?? undefined}
        employeeName={editing ? employeeName(editing.employeeId) : undefined}
        onClose={() => setEditing(null)}
        onSubmit={(values) => {
          if (!editing) return
          updateSalary.mutate(
            { employeeId: editing.employeeId, payload: values },
            { onSuccess: () => setEditing(null) },
          )
        }}
        isSubmitting={updateSalary.isPending}
      />
    </Paper>
  )
}

export function SalaryPage() {
  const { can } = useAuth()
  const canManage = can('COMPENSATION', 'UPDATE')

  return (
    <>
      <PageHeader title="Salary" subtitle="Compensation structure and salary records." />
      {canManage ? <SalaryTable /> : <MySalary />}
    </>
  )
}
