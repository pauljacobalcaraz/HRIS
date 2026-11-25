import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  employeeService,
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
} from '../services/employeeService'
import type { ListQueryParams } from '@/shared/types/common'

export const employeeKeys = {
  all: ['employees'] as const,
  list: (params: ListQueryParams) => ['employees', 'list', params] as const,
  detail: (id: string) => ['employees', 'detail', id] as const,
}

export function useEmployees(params: ListQueryParams) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeeService.getEmployees(params),
    placeholderData: keepPreviousData,
  })
}

export function useAllEmployees() {
  return useQuery({
    queryKey: employeeKeys.all,
    queryFn: () => employeeService.getAllEmployees(),
  })
}

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: employeeKeys.detail(id ?? ''),
    queryFn: () => employeeService.getEmployeeById(id!),
    enabled: !!id,
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEmployeeInput) => employeeService.createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeeInput }) =>
      employeeService.updateEmployee(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) })
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}
