import { overtimeRequests, type OvertimeRequest } from '@/mock/data/overtimeRequests'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<OvertimeRequest>('overtime-requests', overtimeRequests)

export type CreateOvertimeInput = Pick<OvertimeRequest, 'employeeId' | 'date' | 'hours' | 'reason'>

function nextId(existing: OvertimeRequest[]): string {
  const maxNum = existing.reduce((max, req) => {
    const num = Number(req.id.replace('OT-', ''))
    return Number.isFinite(num) ? Math.max(max, num) : max
  }, 0)
  return `OT-${String(maxNum + 1).padStart(4, '0')}`
}

export const overtimeService = {
  async getAll(): Promise<OvertimeRequest[]> {
    return store.getAll()
  },

  async getByEmployee(employeeId: string): Promise<OvertimeRequest[]> {
    const all = await store.getAll()
    return all.filter((req) => req.employeeId === employeeId)
  },

  async create(payload: CreateOvertimeInput): Promise<OvertimeRequest> {
    const existing = await store.getAll()
    return store.create({ ...payload, id: nextId(existing), status: 'PENDING' })
  },

  async approve(id: string): Promise<OvertimeRequest> {
    return store.update(id, { status: 'APPROVED' })
  },

  async reject(id: string): Promise<OvertimeRequest> {
    return store.update(id, { status: 'REJECTED' })
  },
}
