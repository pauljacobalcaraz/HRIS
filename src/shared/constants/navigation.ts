import type { ModuleKey } from './roles'

export interface NavItem {
  label: string
  path: string
  moduleKey: ModuleKey
  icon: 'dashboard' | 'people' | 'schedule' | 'payments' | 'work' | 'support' | 'analytics' | 'admin'
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', moduleKey: 'ANALYTICS', icon: 'dashboard' },
  { label: 'Core HR', path: '/core-hr/employees', moduleKey: 'CORE_HR', icon: 'people' },
  { label: 'Workforce', path: '/workforce', moduleKey: 'WORKFORCE', icon: 'schedule' },
  { label: 'Compensation', path: '/compensation', moduleKey: 'COMPENSATION', icon: 'payments' },
  { label: 'Talent', path: '/talent', moduleKey: 'TALENT', icon: 'work' },
  { label: 'Employee Services', path: '/employee-services', moduleKey: 'EMPLOYEE_SERVICES', icon: 'support' },
  { label: 'Analytics', path: '/analytics', moduleKey: 'ANALYTICS', icon: 'analytics' },
  { label: 'Administration', path: '/admin/users', moduleKey: 'IAM', icon: 'admin' },
]
