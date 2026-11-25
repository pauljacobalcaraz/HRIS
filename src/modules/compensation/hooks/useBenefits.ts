import { useQuery } from '@tanstack/react-query'
import { benefitsService } from '../services/benefitsService'

export const benefitKeys = {
  all: ['benefits'] as const,
  byEmployee: (employeeId: string) => ['benefits', 'employee', employeeId] as const,
}

export function useBenefits() {
  return useQuery({ queryKey: benefitKeys.all, queryFn: () => benefitsService.getBenefits() })
}

export function useEmployeeBenefits(employeeId: string | undefined) {
  return useQuery({
    queryKey: benefitKeys.byEmployee(employeeId ?? ''),
    queryFn: () => benefitsService.getEmployeeBenefits(employeeId!),
    enabled: !!employeeId,
  })
}
