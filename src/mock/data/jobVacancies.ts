export type VacancyStatus = 'OPEN' | 'ON_HOLD' | 'CLOSED'

export interface JobVacancy {
  id: string
  title: string
  departmentId: string
  positionId: string
  openings: number
  status: VacancyStatus
  postedDate: string
  description: string
}

export const jobVacancies: JobVacancy[] = [
  {
    id: 'VAC-001',
    title: 'Software Engineer',
    departmentId: 'DEPT-004',
    positionId: 'POS-010',
    openings: 2,
    status: 'OPEN',
    postedDate: '2026-10-01',
    description: 'Build and maintain features across the product platform.',
  },
  {
    id: 'VAC-002',
    title: 'QA Engineer',
    departmentId: 'DEPT-004',
    positionId: 'POS-011',
    openings: 1,
    status: 'OPEN',
    postedDate: '2026-10-10',
    description: 'Own test strategy and quality gates for releases.',
  },
  {
    id: 'VAC-003',
    title: 'Account Executive',
    departmentId: 'DEPT-005',
    positionId: 'POS-013',
    openings: 1,
    status: 'OPEN',
    postedDate: '2026-10-15',
    description: 'Drive new business and manage key accounts.',
  },
  {
    id: 'VAC-004',
    title: 'HR Generalist',
    departmentId: 'DEPT-002',
    positionId: 'POS-003',
    openings: 1,
    status: 'ON_HOLD',
    postedDate: '2026-09-20',
    description: 'Support HR operations and employee relations.',
  },
  {
    id: 'VAC-005',
    title: 'Customer Support Representative',
    departmentId: 'DEPT-007',
    positionId: 'POS-015',
    openings: 2,
    status: 'CLOSED',
    postedDate: '2026-08-01',
    description: 'Provide first-line support to customers.',
  },
]
