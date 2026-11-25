import { Alert, Dialog, DialogContent, DialogTitle, Divider, Typography } from '@mui/material'
import type { PayrollRecord } from '../types'

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <span className={bold ? 'font-semibold' : 'text-neutral-500'}>{label}</span>
      <span className={bold ? 'font-semibold' : ''}>{value}</span>
    </div>
  )
}

function peso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface PayslipDialogProps {
  open: boolean
  onClose: () => void
  record?: PayrollRecord
  employeeName?: string
}

export function PayslipDialog({ open, onClose, record, employeeName }: PayslipDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Payslip — {record?.period}</DialogTitle>
      <DialogContent>
        {record && (
          <>
            <Alert severity="warning" className="mb-3">
              Demo calculation only. Not an official payslip or tax document.
            </Alert>
            <Typography variant="subtitle2" className="font-bold mb-2">
              {employeeName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Earnings
            </Typography>
            <Row label="Basic pay" value={peso(record.basicPay)} />
            <Row label="Allowances" value={peso(record.allowances)} />
            <Row label="Overtime pay" value={peso(record.overtimePay)} />
            <Row label="Gross pay" value={peso(record.grossPay)} bold />
            <Divider className="my-2" />
            <Typography variant="caption" color="text.secondary">
              Deductions
            </Typography>
            <Row label="SSS contribution" value={peso(record.sssContribution)} />
            <Row label="PhilHealth contribution" value={peso(record.philHealthContribution)} />
            <Row label="Pag-IBIG contribution" value={peso(record.pagIbigContribution)} />
            <Row label="Withholding tax" value={peso(record.withholdingTax)} />
            <Row label="Total deductions" value={peso(record.totalDeductions)} bold />
            <Divider className="my-2" />
            <Row label="Net pay" value={peso(record.netPay)} bold />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
