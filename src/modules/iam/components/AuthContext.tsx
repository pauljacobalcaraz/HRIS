import { createContext } from 'react'
import type { Action, ModuleKey } from '@/shared/constants/roles'
import type { AuthenticatedUser, LoginCredentials } from '../types/auth'

export interface AuthContextValue {
  user: AuthenticatedUser | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  can: (moduleKey: ModuleKey, action: Action) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
