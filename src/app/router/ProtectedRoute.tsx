import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import type { Action, ModuleKey } from '@/shared/constants/roles'

interface ProtectedRouteProps {
  requiredModule?: ModuleKey
  requiredAction?: Action
}

export function ProtectedRoute({ requiredModule, requiredAction = 'READ' }: ProtectedRouteProps) {
  const { isAuthenticated, can } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requiredModule && !can(requiredModule, requiredAction)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
