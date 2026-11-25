import { departments, type Department } from '@/mock/data/departments'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<Department>('departments', departments)

export type CreateDepartmentInput = Omit<Department, 'id'>
export type UpdateDepartmentInput = Partial<Omit<Department, 'id'>>

function nextDepartmentId(existing: Department[]): string {
  const maxNum = existing.reduce((max, dept) => {
    const num = Number(dept.id.replace('DEPT-', ''))
    return Number.isFinite(num) ? Math.max(max, num) : max
  }, 0)
  return `DEPT-${String(maxNum + 1).padStart(3, '0')}`
}

export const departmentService = {
  async getDepartments(): Promise<Department[]> {
    return store.getAll()
  },

  async getDepartmentById(id: string): Promise<Department | undefined> {
    return store.getById(id)
  },

  async createDepartment(payload: CreateDepartmentInput): Promise<Department> {
    const existing = await store.getAll()
    const department: Department = { ...payload, id: nextDepartmentId(existing) }
    return store.create(department)
  },

  async updateDepartment(id: string, payload: UpdateDepartmentInput): Promise<Department> {
    return store.update(id, payload)
  },

  async deleteDepartment(id: string): Promise<void> {
    return store.remove(id)
  },
}
