import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { leaveService, type CreateLeaveApplicationInput } from '../services/leaveService'

export const leaveKeys = {
  all: ['leave'] as const,
  types: ['leave', 'types'] as const,
  byEmployee: (employeeId: string) => ['leave', 'employee', employeeId] as const,
  pending: ['leave', 'pending'] as const,
  balances: (employeeId: string) => ['leave', 'balances', employeeId] as const,
}

export function useLeaveTypes() {
  return useQuery({ queryKey: leaveKeys.types, queryFn: () => leaveService.getLeaveTypes() })
}

export function useAllLeaveApplications() {
  return useQuery({ queryKey: leaveKeys.all, queryFn: () => leaveService.getAll() })
}

export function useEmployeeLeaveApplications(employeeId: string | undefined) {
  return useQuery({
    queryKey: leaveKeys.byEmployee(employeeId ?? ''),
    queryFn: () => leaveService.getByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function usePendingLeaveApprovals() {
  return useQuery({ queryKey: leaveKeys.pending, queryFn: () => leaveService.getPendingApprovals() })
}

export function useLeaveBalances(employeeId: string | undefined) {
  return useQuery({
    queryKey: leaveKeys.balances(employeeId ?? ''),
    queryFn: () => leaveService.getBalances(employeeId!),
    enabled: !!employeeId,
  })
}

export function useCreateLeaveApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateLeaveApplicationInput) => leaveService.createApplication(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaveKeys.all }),
  })
}

export function useApproveLeave() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => leaveService.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaveKeys.all }),
  })
}

export function useRejectLeave() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => leaveService.reject(id, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaveKeys.all }),
  })
}
