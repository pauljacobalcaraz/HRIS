export type AttendanceStatus = 'PRESENT' | 'LATE' | 'UNDERTIME' | 'ABSENT'

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  timeIn: string | null
  timeOut: string | null
  status: AttendanceStatus
  hoursWorked: number
}

const SAMPLE_EMPLOYEE_IDS = [
  'EMP-0006', 'EMP-0007', 'EMP-0008', 'EMP-0009', 'EMP-0010',
  'EMP-0011', 'EMP-0012', 'EMP-0013', 'EMP-0014', 'EMP-0015',
]

function lastWorkdays(count: number): string[] {
  const days: string[] = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() - 1)
  while (days.length < count) {
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) {
      days.push(cursor.toISOString().slice(0, 10))
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return days.reverse()
}

function buildAttendance(): AttendanceRecord[] {
  const workdays = lastWorkdays(6)
  const records: AttendanceRecord[] = []
  let counter = 1

  for (const employeeId of SAMPLE_EMPLOYEE_IDS) {
    for (const date of workdays) {
      const variant = (counter + employeeId.length) % 10
      let status: AttendanceStatus = 'PRESENT'
      let timeIn = '08:00'
      let timeOut = '17:00'
      let hoursWorked = 9

      if (variant === 0) {
        status = 'ABSENT'
        timeIn = null as unknown as string
        timeOut = null as unknown as string
        hoursWorked = 0
      } else if (variant === 1 || variant === 2) {
        status = 'LATE'
        timeIn = '08:35'
        timeOut = '17:00'
        hoursWorked = 8.4
      } else if (variant === 3) {
        status = 'UNDERTIME'
        timeIn = '08:00'
        timeOut = '15:30'
        hoursWorked = 7.5
      }

      records.push({
        id: `ATT-${String(counter).padStart(4, '0')}`,
        employeeId,
        date,
        timeIn,
        timeOut,
        status,
        hoursWorked,
      })
      counter++
    }
  }

  return records
}

export const attendanceRecords: AttendanceRecord[] = buildAttendance()
