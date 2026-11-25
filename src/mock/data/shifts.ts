export interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
}

export const shifts: Shift[] = [
  { id: 'SHIFT-DAY', name: 'Day Shift', startTime: '08:00', endTime: '17:00' },
  { id: 'SHIFT-MORNING', name: 'Morning Shift', startTime: '06:00', endTime: '15:00' },
  { id: 'SHIFT-NIGHT', name: 'Night Shift', startTime: '22:00', endTime: '07:00' },
]

export interface ShiftAssignment {
  id: string
  employeeId: string
  shiftId: string
}

const NIGHT_SHIFT_EMPLOYEES = ['EMP-0011', 'EMP-0015']
const MORNING_SHIFT_EMPLOYEES = ['EMP-0007', 'EMP-0012']

function buildAssignments(): ShiftAssignment[] {
  const assignments: ShiftAssignment[] = []
  for (let i = 1; i <= 50; i++) {
    const employeeId = `EMP-${String(i).padStart(4, '0')}`
    let shiftId = 'SHIFT-DAY'
    if (NIGHT_SHIFT_EMPLOYEES.includes(employeeId)) shiftId = 'SHIFT-NIGHT'
    else if (MORNING_SHIFT_EMPLOYEES.includes(employeeId)) shiftId = 'SHIFT-MORNING'
    assignments.push({ id: employeeId, employeeId, shiftId })
  }
  return assignments
}

export const shiftAssignments: ShiftAssignment[] = buildAssignments()
