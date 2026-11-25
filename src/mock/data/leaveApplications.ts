export type LeaveApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface LeaveApplication {
  id: string
  employeeId: string
  leaveTypeId: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveApplicationStatus
  appliedOn: string
  decisionNote?: string
}

const EMPLOYEE_IDS = [
  'EMP-0006', 'EMP-0007', 'EMP-0008', 'EMP-0009', 'EMP-0010',
  'EMP-0011', 'EMP-0012', 'EMP-0013', 'EMP-0014', 'EMP-0015',
]
const LEAVE_TYPE_IDS = ['LT-VAC', 'LT-SICK', 'LT-EMERG', 'LT-BEREAVE']
const STATUS_CYCLE: LeaveApplicationStatus[] = ['APPROVED', 'APPROVED', 'PENDING', 'REJECTED', 'APPROVED']
const REASONS = [
  'Family trip',
  'Medical appointment',
  'Feeling unwell',
  'Personal matters',
  'Attending a family event',
]

function buildLeaveApplications(): LeaveApplication[] {
  const list: LeaveApplication[] = []
  for (let i = 1; i <= 20; i++) {
    const employeeId = EMPLOYEE_IDS[i % EMPLOYEE_IDS.length]
    const leaveTypeId = LEAVE_TYPE_IDS[i % LEAVE_TYPE_IDS.length]
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length]
    const days = 1 + (i % 4)
    const monthOffset = i % 11
    const startDay = 3 + (i % 20)
    const month = String(1 + monthOffset).padStart(2, '0')
    const startDate = `2026-${month}-${String(startDay).padStart(2, '0')}`
    const endDay = Math.min(startDay + days - 1, 28)
    const endDate = `2026-${month}-${String(endDay).padStart(2, '0')}`

    list.push({
      id: `LV-${String(i).padStart(4, '0')}`,
      employeeId,
      leaveTypeId,
      startDate,
      endDate,
      days,
      reason: REASONS[i % REASONS.length],
      status,
      appliedOn: `2026-${month}-01`,
      decisionNote: status === 'REJECTED' ? 'Insufficient leave balance for requested dates.' : undefined,
    })
  }
  return list
}

export const leaveApplications: LeaveApplication[] = buildLeaveApplications()
