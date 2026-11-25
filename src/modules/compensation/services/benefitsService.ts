import { benefits, type Benefit } from '@/mock/data/benefits'
import { employees } from '@/mock/data/employees'
import { delay } from '@/services/mock/mockClient'

export const benefitsService = {
  async getBenefits(): Promise<Benefit[]> {
    return delay(benefits)
  },

  async getEmployeeBenefits(employeeId: string): Promise<Benefit[]> {
    const employee = employees.find((e) => e.id === employeeId)
    const isRegular = employee?.employmentType === 'REGULAR'
    const eligible = benefits.filter((b) => b.eligibility === 'ALL' || (b.eligibility === 'REGULAR' && isRegular))
    return delay(eligible)
  },
}
