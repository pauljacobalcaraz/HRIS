import { Tab, Tabs } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { label: 'Payroll', path: '/compensation/payroll' },
  { label: 'Salary', path: '/compensation/salary' },
  { label: 'Benefits', path: '/compensation/benefits' },
]

export function CompensationLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = TABS.find((tab) => location.pathname.startsWith(tab.path))?.path ?? TABS[0].path

  return (
    <div>
      <Tabs value={activeTab} onChange={(_, value) => navigate(value)} className="mb-5 border-b border-black/10">
        {TABS.map((tab) => (
          <Tab key={tab.path} label={tab.label} value={tab.path} />
        ))}
      </Tabs>
      <Outlet />
    </div>
  )
}
