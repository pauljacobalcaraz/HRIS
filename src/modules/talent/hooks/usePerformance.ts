import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  performanceService,
  type CreateEvaluationInput,
  type CreateGoalInput,
  type UpdateGoalInput,
} from '../services/performanceService'
import type { SkillLevel } from '../types'

export const performanceKeys = {
  kpis: ['kpis'] as const,
  goals: ['goals'] as const,
  goalsByEmployee: (employeeId: string) => ['goals', 'employee', employeeId] as const,
  evaluations: ['evaluations'] as const,
  evaluationsByEmployee: (employeeId: string) => ['evaluations', 'employee', employeeId] as const,
  skills: ['skills'] as const,
  employeeSkills: (employeeId: string) => ['employee-skills', employeeId] as const,
}

export function useKpis() {
  return useQuery({ queryKey: performanceKeys.kpis, queryFn: () => performanceService.getKpis() })
}

export function useAllGoals() {
  return useQuery({ queryKey: performanceKeys.goals, queryFn: () => performanceService.getAllGoals() })
}

export function useEmployeeGoals(employeeId: string | undefined) {
  return useQuery({
    queryKey: performanceKeys.goalsByEmployee(employeeId ?? ''),
    queryFn: () => performanceService.getGoalsByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateGoalInput) => performanceService.createGoal(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: performanceKeys.goals }),
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalInput }) => performanceService.updateGoal(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: performanceKeys.goals }),
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => performanceService.deleteGoal(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: performanceKeys.goals }),
  })
}

export function useAllEvaluations() {
  return useQuery({ queryKey: performanceKeys.evaluations, queryFn: () => performanceService.getAllEvaluations() })
}

export function useEmployeeEvaluations(employeeId: string | undefined) {
  return useQuery({
    queryKey: performanceKeys.evaluationsByEmployee(employeeId ?? ''),
    queryFn: () => performanceService.getEvaluationsByEmployee(employeeId!),
    enabled: !!employeeId,
  })
}

export function useCreateEvaluation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEvaluationInput) => performanceService.createEvaluation(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: performanceKeys.evaluations }),
  })
}

export function useAcknowledgeEvaluation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => performanceService.acknowledgeEvaluation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: performanceKeys.evaluations }),
  })
}

export function useSkillsCatalog() {
  return useQuery({ queryKey: performanceKeys.skills, queryFn: () => performanceService.getSkills() })
}

export function useEmployeeSkills(employeeId: string | undefined) {
  return useQuery({
    queryKey: performanceKeys.employeeSkills(employeeId ?? ''),
    queryFn: () => performanceService.getEmployeeSkills(employeeId!),
    enabled: !!employeeId,
  })
}

export function useUpdateSkillLevel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, skillId, level }: { employeeId: string; skillId: string; level: SkillLevel }) =>
      performanceService.updateSkillLevel(employeeId, skillId, level),
    onSuccess: (_, { employeeId }) =>
      queryClient.invalidateQueries({ queryKey: performanceKeys.employeeSkills(employeeId) }),
  })
}
