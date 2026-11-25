import { Tab, Tabs } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { label: 'Attendance', path: '/workforce/attendance' },
  { label: 'Leave', path: '/workforce/leave' },
  { label: 'Overtime', path: '/workforce/overtime' },
  { label: 'Shift Schedule', path: '/workforce/shifts' },
  { label: 'Holidays', path: '/workforce/holidays' },
]

export function WorkforceLayout() {
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
