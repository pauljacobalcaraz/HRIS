import { leaveApplications, type LeaveApplication } from '@/mock/data/leaveApplications'
import { leaveTypes } from '@/mock/data/leaveTypes'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<LeaveApplication>('leave-applications', leaveApplications)

function nextId(existing: LeaveApplication[]): string {
  const maxNum = existing.reduce((max, app) => {
    const num = Number(app.id.replace('LV-', ''))
    return Number.isFinite(num) ? Math.max(max, num) : max
  }, 0)
  return `LV-${String(maxNum + 1).padStart(4, '0')}`
}

export interface LeaveBalance {
  leaveTypeId: string
  leaveTypeName: string
  allocated: number
  used: number
  remaining: number
}

export type CreateLeaveApplicationInput = Pick<
  LeaveApplication,
  'employeeId' | 'leaveTypeId' | 'startDate' | 'endDate' | 'days' | 'reason'
>

export const leaveService = {
  async getLeaveTypes() {
    return leaveTypes
  },

  async getAll(): Promise<LeaveApplication[]> {
    return store.getAll()
  },

  async getByEmployee(employeeId: string): Promise<LeaveApplication[]> {
    const all = await store.getAll()
    return all.filter((app) => app.employeeId === employeeId).sort((a, b) => (a.appliedOn < b.appliedOn ? 1 : -1))
  },

  async getPendingApprovals(): Promise<LeaveApplication[]> {
    const all = await store.getAll()
    return all.filter((app) => app.status === 'PENDING')
  },

  async getBalances(employeeId: string): Promise<LeaveBalance[]> {
    const applications = await this.getByEmployee(employeeId)
    return leaveTypes.map((type) => {
      const used = applications
        .filter((app) => app.leaveTypeId === type.id && app.status === 'APPROVED')
        .reduce((sum, app) => sum + app.days, 0)
      return {
        leaveTypeId: type.id,
        leaveTypeName: type.name,
        allocated: type.annualAllocation,
        used,
        remaining: Math.max(0, type.annualAllocation - used),
      }
    })
  },

  async createApplication(payload: CreateLeaveApplicationInput): Promise<LeaveApplication> {
    const existing = await store.getAll()
    const application: LeaveApplication = {
      ...payload,
      id: nextId(existing),
      status: 'PENDING',
      appliedOn: new Date().toISOString().slice(0, 10),
    }
    return store.create(application)
  },

  async approve(id: string): Promise<LeaveApplication> {
    return store.update(id, { status: 'APPROVED', decisionNote: undefined })
  },

  async reject(id: string, decisionNote: string): Promise<LeaveApplication> {
    return store.update(id, { status: 'REJECTED', decisionNote })
  },
}
