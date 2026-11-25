import { employees } from './employees'
import { positions } from './positions'

export interface SalaryRecord {
  id: string
  employeeId: string
  basicPay: number
  riceAllowance: number
  transportationAllowance: number
  clothingAllowance: number
  effectiveDate: string
}

const LEVEL_BASIC_PAY: Record<string, number> = {
  ENTRY: 22000,
  MID: 35000,
  SENIOR: 55000,
  LEAD: 70000,
  MANAGER: 95000,
  EXECUTIVE: 160000,
}

function buildSalaryRecords(): SalaryRecord[] {
  return employees.map((employee, index) => {
    const position = positions.find((p) => p.id === employee.positionId)
    const basicPay = LEVEL_BASIC_PAY[position?.level ?? 'MID']
    return {
      id: `SAL-${String(index + 1).padStart(4, '0')}`,
      employeeId: employee.id,
      basicPay,
      riceAllowance: 2000,
      transportationAllowance: 1500,
      clothingAllowance: 500,
      effectiveDate: employee.dateHired,
    }
  })
}

export const salaryRecords: SalaryRecord[] = buildSalaryRecords()
