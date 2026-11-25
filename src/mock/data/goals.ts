export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export interface Goal {
  id: string
  employeeId: string
  title: string
  description: string
  targetDate: string
  progress: number
  status: GoalStatus
}

const EMPLOYEE_IDS = ['EMP-0006', 'EMP-0007', 'EMP-0008', 'EMP-0009', 'EMP-0010']
const GOAL_TITLES = [
  'Complete onboarding certification',
  'Improve customer satisfaction score',
  'Lead a cross-functional project',
  'Reduce process turnaround time',
  'Mentor a junior team member',
]
const STATUS_CYCLE: GoalStatus[] = ['IN_PROGRESS', 'COMPLETED', 'NOT_STARTED']

function buildGoals(): Goal[] {
  const goals: Goal[] = []
  let counter = 1
  for (const employeeId of EMPLOYEE_IDS) {
    for (let i = 0; i < 2; i++) {
      const status = STATUS_CYCLE[(counter + i) % STATUS_CYCLE.length]
      goals.push({
        id: `GOAL-${String(counter).padStart(4, '0')}`,
        employeeId,
        title: GOAL_TITLES[(counter + i) % GOAL_TITLES.length],
        description: 'Quarterly development goal aligned with team objectives.',
        targetDate: '2026-12-31',
        progress: status === 'COMPLETED' ? 100 : status === 'IN_PROGRESS' ? 50 : 0,
        status,
      })
      counter++
    }
  }
  return goals
}

export const goals: Goal[] = buildGoals()
