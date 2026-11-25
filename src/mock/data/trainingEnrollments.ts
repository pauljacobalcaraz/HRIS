export type EnrollmentStatus = 'ENROLLED' | 'COMPLETED'

export interface TrainingEnrollment {
  id: string
  employeeId: string
  programId: string
  status: EnrollmentStatus
  enrolledDate: string
  completedDate: string | null
}

const SEED: Array<[string, string, EnrollmentStatus]> = [
  ['EMP-0006', 'TRN-001', 'COMPLETED'],
  ['EMP-0006', 'TRN-004', 'COMPLETED'],
  ['EMP-0007', 'TRN-002', 'ENROLLED'],
  ['EMP-0008', 'TRN-003', 'COMPLETED'],
  ['EMP-0009', 'TRN-005', 'ENROLLED'],
  ['EMP-0010', 'TRN-006', 'COMPLETED'],
]

export const trainingEnrollments: TrainingEnrollment[] = SEED.map(([employeeId, programId, status], i) => ({
  id: `TE-${String(i + 1).padStart(4, '0')}`,
  employeeId,
  programId,
  status,
  enrolledDate: `2026-0${(i % 9) + 1}-15`,
  completedDate: status === 'COMPLETED' ? `2026-0${(i % 9) + 1}-28` : null,
}))
