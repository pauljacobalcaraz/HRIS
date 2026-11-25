import { salaryRecords, type SalaryRecord } from '@/mock/data/salaryRecords'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<SalaryRecord>('salary-records', salaryRecords)

export type UpdateSalaryInput = Partial<Pick<SalaryRecord, 'basicPay' | 'riceAllowance' | 'transportationAllowance' | 'clothingAllowance'>>

export const salaryService = {
  async getAll(): Promise<SalaryRecord[]> {
    return store.getAll()
  },

  async getByEmployee(employeeId: string): Promise<SalaryRecord | undefined> {
    const all = await store.getAll()
    return all.find((s) => s.employeeId === employeeId)
  },

  async updateSalary(employeeId: string, payload: UpdateSalaryInput): Promise<SalaryRecord> {
    const all = await store.getAll()
    const record = all.find((s) => s.employeeId === employeeId)
    if (!record) throw new Error('Salary record not found')
    return store.update(record.id, payload)
  },
}
