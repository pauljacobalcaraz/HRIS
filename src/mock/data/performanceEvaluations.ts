import { kpis } from './kpis'

export type EvaluationStatus = 'DRAFT' | 'SUBMITTED' | 'ACKNOWLEDGED'

export interface PerformanceEvaluation {
  id: string
  employeeId: string
  evaluatorId: string
  period: string
  scores: Record<string, number>
  overallScore: number
  comments: string
  status: EvaluationStatus
}

const EMPLOYEE_IDS = ['EMP-0006', 'EMP-0007', 'EMP-0008', 'EMP-0009', 'EMP-0010']
const EVALUATOR_ID = 'EMP-0004'

function buildEvaluations(): PerformanceEvaluation[] {
  return EMPLOYEE_IDS.map((employeeId, i) => {
    const scores: Record<string, number> = {}
    kpis.forEach((kpi, kIdx) => {
      scores[kpi.id] = 3 + ((i + kIdx) % 3)
    })
    const overallScore = Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / kpis.length) * 10) / 10

    return {
      id: `PE-${String(i + 1).padStart(4, '0')}`,
      employeeId,
      evaluatorId: EVALUATOR_ID,
      period: '2026-Q3',
      scores,
      overallScore,
      comments: 'Consistent performance with room to grow in strategic initiatives.',
      status: i % 3 === 0 ? 'ACKNOWLEDGED' : 'SUBMITTED',
    }
  })
}

export const performanceEvaluations: PerformanceEvaluation[] = buildEvaluations()
