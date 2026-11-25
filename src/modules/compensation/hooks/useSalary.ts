import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { salaryService, type UpdateSalaryInput } from '../services/salaryService'

export const salaryKeys = {
  all: ['salary'] as const,
  byEmployee: (employeeId: string) => ['salary', 'employee', employeeId] as const,
}

export function useAllSalaryRecords() {
  return useQuery({ queryKey: salaryKeys.all, queryFn: () => salaryService.getAll() })
}

export function useEmployeeSalary(employeeId: string | undefined) {
  return useQuery({
    queryKey: salaryKeys.byEmployee(employeeId ?? ''),
    queryFn: () => salaryService.getByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function useUpdateSalary() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, payload }: { employeeId: string; payload: UpdateSalaryInput }) =>
      salaryService.updateSalary(employeeId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: salaryKeys.all }),
  })
}
