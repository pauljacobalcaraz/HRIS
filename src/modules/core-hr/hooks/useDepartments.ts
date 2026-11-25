import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  departmentService,
  type CreateDepartmentInput,
  type UpdateDepartmentInput,
} from '../services/departmentService'

export const departmentKeys = {
  all: ['departments'] as const,
  detail: (id: string) => ['departments', 'detail', id] as const,
}

export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.all,
    queryFn: () => departmentService.getDepartments(),
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDepartmentInput) => departmentService.createDepartment(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: departmentKeys.all }),
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDepartmentInput }) =>
      departmentService.updateDepartment(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: departmentKeys.all }),
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: departmentKeys.all }),
  })
}
