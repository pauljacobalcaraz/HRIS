import { trainingEnrollments, type TrainingEnrollment } from '@/mock/data/trainingEnrollments'
import { trainingPrograms, type TrainingProgram } from '@/mock/data/trainingPrograms'
import { MockStore } from '@/services/mock/mockClient'

const programStore = new MockStore<TrainingProgram>('training-programs', trainingPrograms)
const enrollmentStore = new MockStore<TrainingEnrollment>('training-enrollments', trainingEnrollments)

export type CreateProgramInput = Omit<TrainingProgram, 'id'>
export type UpdateProgramInput = Partial<Omit<TrainingProgram, 'id'>>

function nextId(prefix: string, existing: { id: string }[]): string {
  const maxNum = existing.reduce((max, item) => Math.max(max, Number(item.id.replace(`${prefix}-`, '')) || 0), 0)
  return `${prefix}-${String(maxNum + 1).padStart(4, '0')}`
}

export const trainingService = {
  async getPrograms(): Promise<TrainingProgram[]> {
    return programStore.getAll()
  },

  async createProgram(payload: CreateProgramInput): Promise<TrainingProgram> {
    const existing = await programStore.getAll()
    return programStore.create({ ...payload, id: nextId('TRN', existing) })
  },

  async updateProgram(id: string, payload: UpdateProgramInput): Promise<TrainingProgram> {
    return programStore.update(id, payload)
  },

  async deleteProgram(id: string): Promise<void> {
    return programStore.remove(id)
  },

  async getEnrollmentsByEmployee(employeeId: string): Promise<TrainingEnrollment[]> {
    const all = await enrollmentStore.getAll()
    return all.filter((e) => e.employeeId === employeeId)
  },

  async getAllEnrollments(): Promise<TrainingEnrollment[]> {
    return enrollmentStore.getAll()
  },

  async enroll(employeeId: string, programId: string): Promise<TrainingEnrollment> {
    const existing = await enrollmentStore.getAll()
    const already = existing.find((e) => e.employeeId === employeeId && e.programId === programId)
    if (already) return already
    return enrollmentStore.create({
      id: nextId('TE', existing),
      employeeId,
      programId,
      status: 'ENROLLED',
      enrolledDate: new Date().toISOString().slice(0, 10),
      completedDate: null,
    })
  },

  async markComplete(id: string): Promise<TrainingEnrollment> {
    return enrollmentStore.update(id, { status: 'COMPLETED', completedDate: new Date().toISOString().slice(0, 10) })
  },
}
