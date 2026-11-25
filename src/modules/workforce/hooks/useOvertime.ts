import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { overtimeService, type CreateOvertimeInput } from '../services/overtimeService'

export const overtimeKeys = {
  all: ['overtime'] as const,
  byEmployee: (employeeId: string) => ['overtime', 'employee', employeeId] as const,
}

export function useAllOvertimeRequests() {
  return useQuery({ queryKey: overtimeKeys.all, queryFn: () => overtimeService.getAll() })
}

export function useEmployeeOvertimeRequests(employeeId: string | undefined) {
  return useQuery({
    queryKey: overtimeKeys.byEmployee(employeeId ?? ''),
    queryFn: () => overtimeService.getByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function useCreateOvertimeRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOvertimeInput) => overtimeService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: overtimeKeys.all }),
  })
}

export function useApproveOvertime() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => overtimeService.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: overtimeKeys.all }),
  })
}

export function useRejectOvertime() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => overtimeService.reject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: overtimeKeys.all }),
  })
}
