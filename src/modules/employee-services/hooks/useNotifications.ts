import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../services/notificationService'

export const notificationKeys = {
  byEmployee: (employeeId: string) => ['notifications', 'employee', employeeId] as const,
}

export function useEmployeeNotifications(employeeId: string | undefined) {
  return useQuery({
    queryKey: notificationKeys.byEmployee(employeeId ?? ''),
    queryFn: () => notificationService.getByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: (notification) =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.byEmployee(notification.employeeId) }),
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (employeeId: string) => notificationService.markAllRead(employeeId),
    onSuccess: (_, employeeId) =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.byEmployee(employeeId) }),
  })
}
