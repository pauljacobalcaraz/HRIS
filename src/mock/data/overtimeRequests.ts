export type OvertimeStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface OvertimeRequest {
  id: string
  employeeId: string
  date: string
  hours: number
  reason: string
  status: OvertimeStatus
}

const EMPLOYEE_IDS = [
  'EMP-0006', 'EMP-0007', 'EMP-0008', 'EMP-0009', 'EMP-0010',
  'EMP-0011', 'EMP-0012', 'EMP-0013',
]
const STATUS_CYCLE: OvertimeStatus[] = ['APPROVED', 'PENDING', 'APPROVED', 'REJECTED']
const REASONS = ['Month-end close', 'Production incident', 'Client deadline', 'System migration']

function buildOvertimeRequests(): OvertimeRequest[] {
  const list: OvertimeRequest[] = []
  for (let i = 1; i <= 10; i++) {
    const day = String(1 + (i % 25)).padStart(2, '0')
    list.push({
      id: `OT-${String(i).padStart(4, '0')}`,
      employeeId: EMPLOYEE_IDS[i % EMPLOYEE_IDS.length],
      date: `2026-11-${day}`,
      hours: 2 + (i % 3),
      reason: REASONS[i % REASONS.length],
      status: STATUS_CYCLE[i % STATUS_CYCLE.length],
    })
  }
  return list
}

export const overtimeRequests: OvertimeRequest[] = buildOvertimeRequests()
