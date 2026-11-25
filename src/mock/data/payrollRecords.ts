import { computePayroll } from '@/modules/compensation/utils/payrollCalculator'
import { salaryRecords } from './salaryRecords'

export type PayrollStatus = 'PROCESSED' | 'DRAFT'

export interface PayrollRecord {
  id: string
  employeeId: string
  period: string
  basicPay: number
  allowances: number
  overtimePay: number
  grossPay: number
  sssContribution: number
  philHealthContribution: number
  pagIbigContribution: number
  withholdingTax: number
  totalDeductions: number
  netPay: number
  status: PayrollStatus
  processedOn: string
}

const SAMPLE_EMPLOYEE_IDS = ['EMP-0006', 'EMP-0007', 'EMP-0008', 'EMP-0009', 'EMP-0010']
const PERIODS = ['2026-09', '2026-10', '2026-11']

function buildPayrollRecords(): PayrollRecord[] {
  const records: PayrollRecord[] = []
  let counter = 1

  for (const period of PERIODS) {
    for (const employeeId of SAMPLE_EMPLOYEE_IDS) {
      const salary = salaryRecords.find((s) => s.employeeId === employeeId)
      if (!salary) continue
      const allowances = salary.riceAllowance + salary.transportationAllowance + salary.clothingAllowance
      const result = computePayroll({
        basicPay: salary.basicPay,
        allowances,
        overtimeHours: 0,
        hourlyRate: salary.basicPay / 22 / 8,
      })

      records.push({
        id: `PAY-${String(counter).padStart(4, '0')}`,
        employeeId,
        period,
        ...result,
        status: 'PROCESSED',
        processedOn: `${period}-30`,
      })
      counter++
    }
  }

  return records
}

export const payrollRecords: PayrollRecord[] = buildPayrollRecords()
