import { goals, type Goal, type GoalStatus } from '@/mock/data/goals'
import { kpis } from '@/mock/data/kpis'
import { performanceEvaluations, type PerformanceEvaluation } from '@/mock/data/performanceEvaluations'
import { employeeSkills, skills, type EmployeeSkill, type SkillLevel } from '@/mock/data/skills'
import { MockStore } from '@/services/mock/mockClient'

const goalStore = new MockStore<Goal>('goals', goals)
const evaluationStore = new MockStore<PerformanceEvaluation>('performance-evaluations', performanceEvaluations)
const employeeSkillStore = new MockStore<EmployeeSkill>('employee-skills', employeeSkills)

export type CreateGoalInput = Omit<Goal, 'id'>
export type UpdateGoalInput = Partial<Omit<Goal, 'id' | 'employeeId'>>
export type CreateEvaluationInput = Omit<PerformanceEvaluation, 'id' | 'overallScore'>

function nextId(prefix: string, existing: { id: string }[]): string {
  const maxNum = existing.reduce((max, item) => Math.max(max, Number(item.id.replace(`${prefix}-`, '')) || 0), 0)
  return `${prefix}-${String(maxNum + 1).padStart(4, '0')}`
}

export const performanceService = {
  async getKpis() {
    return kpis
  },

  async getGoalsByEmployee(employeeId: string): Promise<Goal[]> {
    const all = await goalStore.getAll()
    return all.filter((g) => g.employeeId === employeeId)
  },

  async getAllGoals(): Promise<Goal[]> {
    return goalStore.getAll()
  },

  async createGoal(payload: CreateGoalInput): Promise<Goal> {
    const existing = await goalStore.getAll()
    return goalStore.create({ ...payload, id: nextId('GOAL', existing) })
  },

  async updateGoal(id: string, payload: UpdateGoalInput & { status?: GoalStatus }): Promise<Goal> {
    return goalStore.update(id, payload)
  },

  async deleteGoal(id: string): Promise<void> {
    return goalStore.remove(id)
  },

  async getEvaluationsByEmployee(employeeId: string): Promise<PerformanceEvaluation[]> {
    const all = await evaluationStore.getAll()
    return all.filter((e) => e.employeeId === employeeId)
  },

  async getAllEvaluations(): Promise<PerformanceEvaluation[]> {
    return evaluationStore.getAll()
  },

  async createEvaluation(payload: CreateEvaluationInput): Promise<PerformanceEvaluation> {
    const existing = await evaluationStore.getAll()
    const scoreValues = Object.values(payload.scores)
    const overallScore = Math.round((scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) * 10) / 10
    return evaluationStore.create({ ...payload, id: nextId('PE', existing), overallScore })
  },

  async acknowledgeEvaluation(id: string): Promise<PerformanceEvaluation> {
    return evaluationStore.update(id, { status: 'ACKNOWLEDGED' })
  },

  async getSkills() {
    return skills
  },

  async getEmployeeSkills(employeeId: string): Promise<EmployeeSkill[]> {
    const all = await employeeSkillStore.getAll()
    return all.filter((s) => s.employeeId === employeeId)
  },

  async updateSkillLevel(employeeId: string, skillId: string, level: SkillLevel): Promise<EmployeeSkill> {
    const all = await employeeSkillStore.getAll()
    const existing = all.find((s) => s.employeeId === employeeId && s.skillId === skillId)
    if (existing) {
      return employeeSkillStore.update(existing.id, { level })
    }
    return employeeSkillStore.create({ id: nextId('ESK', all), employeeId, skillId, level })
  },
}
