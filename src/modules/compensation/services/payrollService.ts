import { payrollRecords, type PayrollRecord } from '@/mock/data/payrollRecords'
import { overtimeService } from '@/modules/workforce/services/overtimeService'
import { MockStore, delay } from '@/services/mock/mockClient'
import { salaryService } from './salaryService'
import { computePayroll } from '../utils/payrollCalculator'

const store = new MockStore<PayrollRecord>('payroll-records', payrollRecords)

function nextId(existing: PayrollRecord[]): string {
  const maxNum = existing.reduce((max, rec) => {
    const num = Number(rec.id.replace('PAY-', ''))
    return Number.isFinite(num) ? Math.max(max, num) : max
  }, 0)
  return `PAY-${String(maxNum + 1).padStart(4, '0')}`
}

export const payrollService = {
  async getAll(): Promise<PayrollRecord[]> {
    return store.getAll()
  },

  async getByEmployee(employeeId: string): Promise<PayrollRecord[]> {
    const all = await store.getAll()
    return all.filter((r) => r.employeeId === employeeId).sort((a, b) => (a.period < b.period ? 1 : -1))
  },

  async getByPeriod(period: string): Promise<PayrollRecord[]> {
    const all = await store.getAll()
    return all.filter((r) => r.period === period)
  },

  async getById(id: string): Promise<PayrollRecord | undefined> {
    return store.getById(id)
  },

  /** Generates (or returns existing) payroll records for the given employees and period. */
  async generatePayroll(period: string, employeeIds: string[]): Promise<PayrollRecord[]> {
    const existing = await store.getAll()
    const results: PayrollRecord[] = []

    for (const employeeId of employeeIds) {
      const alreadyGenerated = existing.find((r) => r.employeeId === employeeId && r.period === period)
      if (alreadyGenerated) {
        results.push(alreadyGenerated)
        continue
      }

      const salary = await salaryService.getByEmployee(employeeId)
      if (!salary) continue

      const overtimeRequests = await overtimeService.getByEmployee(employeeId)
      const approvedOvertimeHours = overtimeRequests
        .filter((req) => req.status === 'APPROVED' && req.date.startsWith(period))
        .reduce((sum, req) => sum + req.hours, 0)

      const allowances = salary.riceAllowance + salary.transportationAllowance + salary.clothingAllowance
      const hourlyRate = salary.basicPay / 22 / 8
      const computation = computePayroll({
        basicPay: salary.basicPay,
        allowances,
        overtimeHours: approvedOvertimeHours,
        hourlyRate,
      })

      const record: PayrollRecord = {
        id: nextId([...existing, ...results]),
        employeeId,
        period,
        ...computation,
        status: 'PROCESSED',
        processedOn: new Date().toISOString().slice(0, 10),
      }
      const created = await store.create(record)
      results.push(created)
    }

    return delay(results, 500)
  },
}
