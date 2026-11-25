import AnnouncementIcon from '@mui/icons-material/CampaignOutlined'
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined'
import EventAvailableIcon from '@mui/icons-material/EventAvailableOutlined'
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined'
import WorkIcon from '@mui/icons-material/WorkOutlineOutlined'
import { Button, Paper, Typography } from '@mui/material'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/PageHeader'
import { useEmployeeNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from '../hooks/useNotifications'
import type { Notification, NotificationCategory } from '../types'

const CATEGORY_ICON: Record<NotificationCategory, typeof EventAvailableIcon> = {
  LEAVE: EventAvailableIcon,
  DOCUMENT: DescriptionIcon,
  ANNOUNCEMENT: AnnouncementIcon,
  PAYROLL: PaymentsIcon,
  RECRUITMENT: WorkIcon,
}

function NotificationRow({ notification, onMarkRead }: { notification: Notification; onMarkRead: (id: string) => void }) {
  const Icon = CATEGORY_ICON[notification.category]
  return (
    <div className={`flex items-start gap-3 py-3 ${notification.read ? '' : 'bg-indigo-500/5'} rounded-lg px-3 -mx-3`}>
      <Icon fontSize="small" className="mt-0.5 shrink-0 opacity-70" />
      <div className="flex-1 min-w-0">
        <Typography variant="body2" className={notification.read ? '' : 'font-medium'}>
          {notification.message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(notification.createdAt).toLocaleString()}
        </Typography>
      </div>
      {!notification.read && (
        <Button size="small" onClick={() => onMarkRead(notification.id)}>
          Mark read
        </Button>
      )}
    </div>
  )
}

export function NotificationsPage() {
  const { user } = useAuth()
  const { data: notifications = [] } = useEmployeeNotifications(user?.employeeId)
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread`}
        actions={
          unreadCount > 0 && (
            <Button variant="outlined" onClick={() => user && markAllRead.mutate(user.employeeId)}>
              Mark all as read
            </Button>
          )
        }
      />
      <Paper variant="outlined" className="p-5 rounded-lg">
        {notifications.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up." />
        ) : (
          <div className="flex flex-col divide-y divide-black/5">
            {notifications.map((n) => (
              <NotificationRow key={n.id} notification={n} onMarkRead={(id) => markRead.mutate(id)} />
            ))}
          </div>
        )}
      </Paper>
    </>
  )
}
