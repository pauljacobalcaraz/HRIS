import { holidays, type Holiday } from '@/mock/data/holidays'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<Holiday>('holidays', holidays)

export type CreateHolidayInput = Omit<Holiday, 'id'>
export type UpdateHolidayInput = Partial<Omit<Holiday, 'id'>>

function nextId(existing: Holiday[]): string {
  const maxNum = existing.reduce((max, h) => {
    const num = Number(h.id.replace('HOL-', ''))
    return Number.isFinite(num) ? Math.max(max, num) : max
  }, 0)
  return `HOL-${String(maxNum + 1).padStart(3, '0')}`
}

export const holidayService = {
  async getHolidays(): Promise<Holiday[]> {
    const all = await store.getAll()
    return all.sort((a, b) => (a.date > b.date ? 1 : -1))
  },

  async createHoliday(payload: CreateHolidayInput): Promise<Holiday> {
    const existing = await store.getAll()
    return store.create({ ...payload, id: nextId(existing) })
  },

  async updateHoliday(id: string, payload: UpdateHolidayInput): Promise<Holiday> {
    return store.update(id, payload)
  },

  async deleteHoliday(id: string): Promise<void> {
    return store.remove(id)
  },
}
