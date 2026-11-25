import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { holidayService, type CreateHolidayInput, type UpdateHolidayInput } from '../services/holidayService'

export const holidayKeys = {
  all: ['holidays'] as const,
}

export function useHolidays() {
  return useQuery({ queryKey: holidayKeys.all, queryFn: () => holidayService.getHolidays() })
}

export function useCreateHoliday() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateHolidayInput) => holidayService.createHoliday(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: holidayKeys.all }),
  })
}

export function useUpdateHoliday() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHolidayInput }) => holidayService.updateHoliday(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: holidayKeys.all }),
  })
}

export function useDeleteHoliday() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => holidayService.deleteHoliday(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: holidayKeys.all }),
  })
}
