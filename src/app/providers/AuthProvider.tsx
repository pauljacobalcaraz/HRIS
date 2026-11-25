import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from '@/modules/iam/components/AuthContext'
import { authService } from '@/modules/iam/services/authService'
import type { AuthenticatedUser, LoginCredentials } from '@/modules/iam/types/auth'
import { PERMISSION_MATRIX, type Action, type ModuleKey } from '@/shared/constants/roles'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => authService.getSession())
  const [isInitializing] = useState(false)

  const login = useCallback(async (credentials: LoginCredentials) => {
    const authUser = await authService.login(credentials)
    setUser(authUser)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const can = useCallback(
    (moduleKey: ModuleKey, action: Action) => {
      if (!user) return false
      const allowedRoles = PERMISSION_MATRIX[moduleKey]?.[action]
      return allowedRoles?.includes(user.role) ?? false
    },
    [user],
  )

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isInitializing, login, logout, can }),
    [user, isInitializing, login, logout, can],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
