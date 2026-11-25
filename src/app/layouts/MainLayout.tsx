import AnalyticsIcon from '@mui/icons-material/Analytics'
import AdminIcon from '@mui/icons-material/AdminPanelSettings'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PaymentsIcon from '@mui/icons-material/Payments'
import PeopleIcon from '@mui/icons-material/People'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SearchIcon from '@mui/icons-material/Search'
import SupportIcon from '@mui/icons-material/Support'
import WorkIcon from '@mui/icons-material/Work'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState, type ReactNode } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useColorMode } from '@/app/providers/ThemeProvider'
import { useEmployeeNotifications } from '@/modules/employee-services/hooks/useNotifications'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { NAV_ITEMS, type NavItem } from '@/shared/constants/navigation'
import { ROLE_LABELS } from '@/shared/constants/roles'

const EXPANDED_WIDTH = 248
const COLLAPSED_WIDTH = 72

const ICONS: Record<NavItem['icon'], ReactNode> = {
  dashboard: <DashboardIcon />,
  people: <PeopleIcon />,
  schedule: <ScheduleIcon />,
  payments: <PaymentsIcon />,
  work: <WorkIcon />,
  support: <SupportIcon />,
  analytics: <AnalyticsIcon />,
  admin: <AdminIcon />,
}

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null)
  const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null)
  const { user, can, logout } = useAuth()
  const { mode, toggleMode } = useColorMode()
  const location = useLocation()
  const navigate = useNavigate()
  const { data: notifications = [] } = useEmployeeNotifications(user?.employeeId)
  const unreadCount = notifications.filter((n) => !n.read).length

  const visibleNavItems = NAV_ITEMS.filter((item) => can(item.moduleKey, 'READ'))
  const drawerWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH

  const breadcrumbSegments = location.pathname.split('/').filter(Boolean)

  const handleLogout = async () => {
    setUserMenuAnchor(null)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box className="flex min-h-screen">
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: 'width 0.2s',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: 'width 0.2s',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar className="flex items-center justify-between px-3">
          {!collapsed && (
            <Typography variant="h6" className="font-bold text-indigo-600 whitespace-nowrap">
              HRIS Suite
            </Typography>
          )}
          <IconButton size="small" onClick={() => setCollapsed((prev) => !prev)}>
            {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <Box className="flex flex-col gap-1 p-2 mt-2">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path.split('/').slice(0, 2).join('/'))
            return (
              <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    minHeight: 44,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 40 }}>{ICONS[item.icon]}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            )
          })}
        </Box>
      </Drawer>

      <Box className="flex flex-1 flex-col min-w-0">
        <AppBar
          position="sticky"
          color="inherit"
          sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(6px)' }}
        >
          <Toolbar className="gap-3">
            <Breadcrumbs className="flex-1 hidden sm:flex">
              <MuiLink component={Link} to="/dashboard" underline="hover" color="inherit">
                Home
              </MuiLink>
              {breadcrumbSegments.map((segment, idx) => (
                <Typography key={idx} color="text.primary" className="capitalize">
                  {segment.replace(/-/g, ' ')}
                </Typography>
              ))}
            </Breadcrumbs>

            <TextField
              size="small"
              placeholder="Search employees, modules…"
              className="hidden md:block w-72"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Tooltip title="Toggle theme">
              <IconButton onClick={toggleMode}>{mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={notifAnchor} open={!!notifAnchor} onClose={() => setNotifAnchor(null)}>
              {notifications.length === 0 ? (
                <MenuItem disabled>No notifications</MenuItem>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <MenuItem
                    key={n.id}
                    onClick={() => {
                      setNotifAnchor(null)
                      navigate('/employee-services/notifications')
                    }}
                    className={n.read ? '' : 'font-medium'}
                  >
                    {n.message}
                  </MenuItem>
                ))
              )}
              <Divider />
              <MenuItem
                onClick={() => {
                  setNotifAnchor(null)
                  navigate('/employee-services/notifications')
                }}
              >
                View all notifications
              </MenuItem>
            </Menu>

            <Tooltip title="Account">
              <IconButton onClick={(e) => setUserMenuAnchor(e.currentTarget)} className="gap-2">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                  {user?.displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={userMenuAnchor} open={!!userMenuAnchor} onClose={() => setUserMenuAnchor(null)}>
              <Box className="px-4 py-2">
                <Typography variant="subtitle2">{user?.displayName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user ? ROLE_LABELS[user.role] : ''}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box component="main" className="flex-1 p-4 md:p-6" sx={{ bgcolor: 'background.default' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
