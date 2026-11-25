import { attendanceRecords, type AttendanceRecord, type AttendanceStatus } from '@/mock/data/attendance'
import { MockStore, delay } from '@/services/mock/mockClient'

const store = new MockStore<AttendanceRecord>('attendance', attendanceRecords)

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function nextId(existing: AttendanceRecord[]): string {
  const maxNum = existing.reduce((max, rec) => {
    const num = Number(rec.id.replace('ATT-', ''))
    return Number.isFinite(num) ? Math.max(max, num) : max
  }, 0)
  return `ATT-${String(maxNum + 1).padStart(4, '0')}`
}

function computeStatus(timeIn: string, timeOut: string | null): { status: AttendanceStatus; hoursWorked: number } {
  const isLate = timeIn > '08:15'
  if (!timeOut) {
    return { status: isLate ? 'LATE' : 'PRESENT', hoursWorked: 0 }
  }
  const [inH, inM] = timeIn.split(':').map(Number)
  const [outH, outM] = timeOut.split(':').map(Number)
  const hours = Math.max(0, outH + outM / 60 - (inH + inM / 60))
  if (hours < 8) return { status: 'UNDERTIME', hoursWorked: Math.round(hours * 10) / 10 }
  return { status: isLate ? 'LATE' : 'PRESENT', hoursWorked: Math.round(hours * 10) / 10 }
}

export const attendanceService = {
  async getAll(): Promise<AttendanceRecord[]> {
    return store.getAll()
  },

  async getByEmployee(employeeId: string): Promise<AttendanceRecord[]> {
    const all = await store.getAll()
    return all.filter((r) => r.employeeId === employeeId).sort((a, b) => (a.date < b.date ? 1 : -1))
  },

  async getTodayRecord(employeeId: string): Promise<AttendanceRecord | undefined> {
    const all = await store.getAll()
    return all.find((r) => r.employeeId === employeeId && r.date === todayISO())
  },

  async timeIn(employeeId: string): Promise<AttendanceRecord> {
    const all = await store.getAll()
    const existing = all.find((r) => r.employeeId === employeeId && r.date === todayISO())
    const now = new Date()
    const timeIn = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    if (existing) {
      if (existing.timeIn) return delay(existing)
      const { status, hoursWorked } = computeStatus(timeIn, existing.timeOut)
      return store.update(existing.id, { timeIn, status, hoursWorked })
    }

    const { status, hoursWorked } = computeStatus(timeIn, null)
    const record: AttendanceRecord = {
      id: nextId(all),
      employeeId,
      date: todayISO(),
      timeIn,
      timeOut: null,
      status,
      hoursWorked,
    }
    return store.create(record)
  },

  async timeOut(employeeId: string): Promise<AttendanceRecord> {
    const all = await store.getAll()
    const existing = all.find((r) => r.employeeId === employeeId && r.date === todayISO())
    if (!existing || !existing.timeIn) {
      throw new Error('You must time in before timing out.')
    }
    if (existing.timeOut) return delay(existing)

    const now = new Date()
    const timeOut = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const { status, hoursWorked } = computeStatus(existing.timeIn, timeOut)
    return store.update(existing.id, { timeOut, status, hoursWorked })
  },

  async getSummary(employeeId?: string): Promise<Record<AttendanceStatus, number>> {
    const all = await store.getAll()
    const scoped = employeeId ? all.filter((r) => r.employeeId === employeeId) : all
    return scoped.reduce(
      (acc, rec) => {
        acc[rec.status] += 1
        return acc
      },
      { PRESENT: 0, LATE: 0, UNDERTIME: 0, ABSENT: 0 } as Record<AttendanceStatus, number>,
    )
  },
}
