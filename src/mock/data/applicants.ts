export type ApplicantStage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED'

export interface Applicant {
  id: string
  name: string
  email: string
  vacancyId: string
  stage: ApplicantStage
  evaluationScore: number | null
  evaluationNotes: string
  interviewDate: string | null
  appliedDate: string
}

const NAMES = [
  'Miguel Fernandez', 'Isabel Torres', 'Rafael Cruz', 'Patricia Ramos', 'Diego Santos',
  'Camille Reyes', 'Joshua Bautista', 'Hannah Garcia', 'Adrian Flores', 'Samantha Mendoza',
]
const STAGE_CYCLE: ApplicantStage[] = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'INTERVIEW', 'SCREENING']
const VACANCY_CYCLE = ['VAC-001', 'VAC-001', 'VAC-002', 'VAC-003', 'VAC-003']

function buildApplicants(): Applicant[] {
  return NAMES.map((name, i) => {
    const stage = STAGE_CYCLE[i % STAGE_CYCLE.length]
    const hasInterview = stage === 'INTERVIEW' || stage === 'OFFER' || stage === 'HIRED'
    const hasScore = stage !== 'APPLIED' && stage !== 'SCREENING'
    return {
      id: `APP-${String(i + 1).padStart(4, '0')}`,
      name,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
      vacancyId: VACANCY_CYCLE[i % VACANCY_CYCLE.length],
      stage,
      evaluationScore: hasScore ? 3 + (i % 3) : null,
      evaluationNotes: hasScore ? 'Solid technical background and good culture fit.' : '',
      interviewDate: hasInterview ? `2026-11-${String(10 + i).padStart(2, '0')}` : null,
      appliedDate: `2026-10-${String(1 + i).padStart(2, '0')}`,
    }
  })
}

export const applicants: Applicant[] = buildApplicants()
