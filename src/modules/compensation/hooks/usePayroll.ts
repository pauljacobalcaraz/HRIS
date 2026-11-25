import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { payrollService } from '../services/payrollService'

export const payrollKeys = {
  all: ['payroll'] as const,
  byEmployee: (employeeId: string) => ['payroll', 'employee', employeeId] as const,
  byPeriod: (period: string) => ['payroll', 'period', period] as const,
}

export function useAllPayrollRecords() {
  return useQuery({ queryKey: payrollKeys.all, queryFn: () => payrollService.getAll() })
}

export function useEmployeePayrollHistory(employeeId: string | undefined) {
  return useQuery({
    queryKey: payrollKeys.byEmployee(employeeId ?? ''),
    queryFn: () => payrollService.getByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function useGeneratePayroll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ period, employeeIds }: { period: string; employeeIds: string[] }) =>
      payrollService.generatePayroll(period, employeeIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: payrollKeys.all }),
  })
}
