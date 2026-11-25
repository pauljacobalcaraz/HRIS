import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { attendanceService } from '../services/attendanceService'

export const attendanceKeys = {
  all: ['attendance'] as const,
  byEmployee: (employeeId: string) => ['attendance', 'employee', employeeId] as const,
  today: (employeeId: string) => ['attendance', 'today', employeeId] as const,
  summary: (employeeId?: string) => ['attendance', 'summary', employeeId ?? 'all'] as const,
}

export function useAllAttendance() {
  return useQuery({ queryKey: attendanceKeys.all, queryFn: () => attendanceService.getAll() })
}

export function useEmployeeAttendance(employeeId: string | undefined) {
  return useQuery({
    queryKey: attendanceKeys.byEmployee(employeeId ?? ''),
    queryFn: () => attendanceService.getByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function useTodayAttendance(employeeId: string | undefined) {
  return useQuery({
    queryKey: attendanceKeys.today(employeeId ?? ''),
    queryFn: () => attendanceService.getTodayRecord(employeeId!),
    enabled: !!employeeId,
  })
}

export function useAttendanceSummary(employeeId?: string) {
  return useQuery({
    queryKey: attendanceKeys.summary(employeeId),
    queryFn: () => attendanceService.getSummary(employeeId),
  })
}

export function useTimeIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (employeeId: string) => attendanceService.timeIn(employeeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: attendanceKeys.all }),
  })
}

export function useTimeOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (employeeId: string) => attendanceService.timeOut(employeeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: attendanceKeys.all }),
  })
}
