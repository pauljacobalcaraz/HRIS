import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { announcementService, type CreateAnnouncementInput } from '../services/announcementService'

export const announcementKeys = {
  all: ['announcements'] as const,
}

export function useAnnouncements() {
  return useQuery({ queryKey: announcementKeys.all, queryFn: () => announcementService.getAll() })
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAnnouncementInput) => announcementService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: announcementKeys.all }),
  })
}
