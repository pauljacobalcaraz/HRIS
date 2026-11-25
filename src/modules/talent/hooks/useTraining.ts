import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trainingService, type CreateProgramInput, type UpdateProgramInput } from '../services/trainingService'

export const trainingKeys = {
  programs: ['training-programs'] as const,
  enrollments: ['training-enrollments'] as const,
  enrollmentsByEmployee: (employeeId: string) => ['training-enrollments', 'employee', employeeId] as const,
}

export function useTrainingPrograms() {
  return useQuery({ queryKey: trainingKeys.programs, queryFn: () => trainingService.getPrograms() })
}

export function useCreateTrainingProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProgramInput) => trainingService.createProgram(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.programs }),
  })
}

export function useUpdateTrainingProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProgramInput }) => trainingService.updateProgram(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.programs }),
  })
}

export function useDeleteTrainingProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => trainingService.deleteProgram(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.programs }),
  })
}

export function useAllEnrollments() {
  return useQuery({ queryKey: trainingKeys.enrollments, queryFn: () => trainingService.getAllEnrollments() })
}

export function useEmployeeEnrollments(employeeId: string | undefined) {
  return useQuery({
    queryKey: trainingKeys.enrollmentsByEmployee(employeeId ?? ''),
    queryFn: () => trainingService.getEnrollmentsByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function useEnrollTraining() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, programId }: { employeeId: string; programId: string }) =>
      trainingService.enroll(employeeId, programId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.enrollments }),
  })
}

export function useMarkTrainingComplete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => trainingService.markComplete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.enrollments }),
  })
}
