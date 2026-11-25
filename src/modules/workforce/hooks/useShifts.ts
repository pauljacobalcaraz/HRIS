import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { shiftService } from '../services/shiftService'

export const shiftKeys = {
  shifts: ['shifts'] as const,
  assignments: ['shift-assignments'] as const,
}

export function useShifts() {
  return useQuery({ queryKey: shiftKeys.shifts, queryFn: () => shiftService.getShifts() })
}

export function useShiftAssignments() {
  return useQuery({ queryKey: shiftKeys.assignments, queryFn: () => shiftService.getAssignments() })
}

export function useUpdateShiftAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, shiftId }: { employeeId: string; shiftId: string }) =>
      shiftService.updateAssignment(employeeId, shiftId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shiftKeys.assignments }),
  })
}
