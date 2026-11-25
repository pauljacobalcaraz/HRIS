import { ROLES, type Role } from '@/shared/constants/roles'

export interface MockUser {
  id: string
  employeeId: string
  email: string
  password: string
  role: Role
  displayName: string
}

export const users: MockUser[] = [
  { id: 'USR-001', employeeId: 'EMP-0001', email: 'superadmin@company.com', password: 'password', role: ROLES.SUPER_ADMIN, displayName: 'John Doe' },
  { id: 'USR-002', employeeId: 'EMP-0002', email: 'hradmin@company.com', password: 'password', role: ROLES.HR_ADMIN, displayName: 'Maria Santos' },
  { id: 'USR-003', employeeId: 'EMP-0006', email: 'hrstaff@company.com', password: 'password', role: ROLES.HR_STAFF, displayName: 'Grace Garcia' },
  { id: 'USR-004', employeeId: 'EMP-0004', email: 'manager@company.com', password: 'password', role: ROLES.DEPARTMENT_MANAGER, displayName: 'Ana Cruz' },
  { id: 'USR-005', employeeId: 'EMP-0009', email: 'teamlead@company.com', password: 'password', role: ROLES.TEAM_LEADER, displayName: 'William Flores' },
  { id: 'USR-006', employeeId: 'EMP-0007', email: 'payroll@company.com', password: 'password', role: ROLES.PAYROLL_ADMIN, displayName: 'Michael Torres' },
  { id: 'USR-007', employeeId: 'EMP-0008', email: 'recruiter@company.com', password: 'password', role: ROLES.RECRUITER, displayName: 'Carmela Flores' },
  { id: 'USR-008', employeeId: 'EMP-0010', email: 'employee@company.com', password: 'password', role: ROLES.EMPLOYEE, displayName: 'Rosa Mendoza' },
]
