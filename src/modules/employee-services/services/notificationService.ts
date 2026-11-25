import { notifications, type Notification } from '@/mock/data/notifications'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<Notification>('notifications', notifications)

export const notificationService = {
  async getByEmployee(employeeId: string): Promise<Notification[]> {
    const all = await store.getAll()
    return all
      .filter((n) => n.employeeId === employeeId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  },

  async markRead(id: string): Promise<Notification> {
    return store.update(id, { read: true })
  },

  async markAllRead(employeeId: string): Promise<void> {
    const all = await store.getAll()
    const unread = all.filter((n) => n.employeeId === employeeId && !n.read)
    await Promise.all(unread.map((n) => store.update(n.id, { read: true })))
  },
}
