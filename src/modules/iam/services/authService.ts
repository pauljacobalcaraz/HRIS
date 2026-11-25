import { users } from '@/mock/data/users'
import { delay } from '@/services/mock/mockClient'
import type { AuthenticatedUser, LoginCredentials } from '../types/auth'

const SESSION_KEY = 'hris:session'

function toAuthenticatedUser(user: (typeof users)[number]): AuthenticatedUser {
  return {
    id: user.id,
    employeeId: user.employeeId,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
  }
}

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthenticatedUser> {
    const match = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
    )
    if (!match) {
      await delay(null, 400)
      throw new Error('Invalid email or password.')
    }
    const authUser = toAuthenticatedUser(match)
    await delay(authUser)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser))
    return authUser
  },

  async logout(): Promise<void> {
    sessionStorage.removeItem(SESSION_KEY)
    return delay(undefined, 150)
  },

  getSession(): AuthenticatedUser | null {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthenticatedUser
    } catch {
      return null
    }
  },

  listDemoAccounts() {
    return users.map((user) => ({ email: user.email, password: user.password, role: user.role, displayName: user.displayName }))
  },
}
