import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  recruitmentService,
  type CreateApplicantInput,
  type CreateVacancyInput,
  type UpdateVacancyInput,
} from '../services/recruitmentService'
import type { ApplicantStage } from '../types'

export const recruitmentKeys = {
  vacancies: ['vacancies'] as const,
  applicants: ['applicants'] as const,
}

export function useVacancies() {
  return useQuery({ queryKey: recruitmentKeys.vacancies, queryFn: () => recruitmentService.getVacancies() })
}

export function useCreateVacancy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateVacancyInput) => recruitmentService.createVacancy(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recruitmentKeys.vacancies }),
  })
}

export function useUpdateVacancy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVacancyInput }) => recruitmentService.updateVacancy(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recruitmentKeys.vacancies }),
  })
}

export function useDeleteVacancy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recruitmentService.deleteVacancy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recruitmentKeys.vacancies }),
  })
}

export function useApplicants() {
  return useQuery({ queryKey: recruitmentKeys.applicants, queryFn: () => recruitmentService.getApplicants() })
}

export function useCreateApplicant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateApplicantInput) => recruitmentService.createApplicant(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recruitmentKeys.applicants }),
  })
}

export function useMoveApplicantStage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: ApplicantStage }) => recruitmentService.moveStage(id, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recruitmentKeys.applicants }),
  })
}

export function useScheduleInterview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, interviewDate }: { id: string; interviewDate: string }) =>
      recruitmentService.scheduleInterview(id, interviewDate),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recruitmentKeys.applicants }),
  })
}

export function useEvaluateApplicant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, score, notes }: { id: string; score: number; notes: string }) =>
      recruitmentService.evaluateApplicant(id, score, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recruitmentKeys.applicants }),
  })
}
