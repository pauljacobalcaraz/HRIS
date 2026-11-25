import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentService, type CreateDocumentRequestInput } from '../services/documentService'
import type { DocumentRequestStatus } from '../types'

export const documentKeys = {
  all: ['document-requests'] as const,
  byEmployee: (employeeId: string) => ['document-requests', 'employee', employeeId] as const,
}

export function useAllDocumentRequests() {
  return useQuery({ queryKey: documentKeys.all, queryFn: () => documentService.getAll() })
}

export function useEmployeeDocumentRequests(employeeId: string | undefined) {
  return useQuery({
    queryKey: documentKeys.byEmployee(employeeId ?? ''),
    queryFn: () => documentService.getByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function useCreateDocumentRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDocumentRequestInput) => documentService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  })
}

export function useUpdateDocumentRequestStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, remarks }: { id: string; status: DocumentRequestStatus; remarks?: string }) =>
      documentService.updateStatus(id, status, remarks),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  })
}
