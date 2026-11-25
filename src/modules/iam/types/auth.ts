import type { Role } from '@/shared/constants/roles'

export interface AuthenticatedUser {
  id: string
  employeeId: string
  email: string
  role: Role
  displayName: string
}

export interface LoginCredentials {
  email: string
  password: string
}
