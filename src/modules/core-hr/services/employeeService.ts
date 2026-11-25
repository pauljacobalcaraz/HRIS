import { employees, type Employee } from '@/mock/data/employees'
import { MockStore } from '@/services/mock/mockClient'
import type { ListQueryParams, PaginatedResult } from '@/shared/types/common'

const store = new MockStore<Employee>('employees', employees)
const SEARCHABLE_FIELDS: (keyof Employee)[] = ['firstName', 'lastName', 'email', 'id']

function nextEmployeeId(existing: Employee[]): string {
  const maxNum = existing.reduce((max, emp) => {
    const num = Number(emp.id.replace('EMP-', ''))
    return Number.isFinite(num) ? Math.max(max, num) : max
  }, 0)
  return `EMP-${String(maxNum + 1).padStart(4, '0')}`
}

export type CreateEmployeeInput = Omit<Employee, 'id'>
export type UpdateEmployeeInput = Partial<Omit<Employee, 'id'>>

export const employeeService = {
  async getEmployees(params: ListQueryParams = {}): Promise<PaginatedResult<Employee>> {
    return store.paginate(params, SEARCHABLE_FIELDS)
  },

  async getAllEmployees(): Promise<Employee[]> {
    return store.getAll()
  },

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    return store.getById(id)
  },

  async createEmployee(payload: CreateEmployeeInput): Promise<Employee> {
    const existing = await store.getAll()
    const employee: Employee = { ...payload, id: nextEmployeeId(existing) }
    return store.create(employee)
  },

  async updateEmployee(id: string, payload: UpdateEmployeeInput): Promise<Employee> {
    return store.update(id, payload)
  },

  async deleteEmployee(id: string): Promise<void> {
    return store.remove(id)
  },
}
