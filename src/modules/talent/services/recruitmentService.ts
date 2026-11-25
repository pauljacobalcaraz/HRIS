import { applicants, type Applicant, type ApplicantStage } from '@/mock/data/applicants'
import { jobVacancies, type JobVacancy } from '@/mock/data/jobVacancies'
import { MockStore } from '@/services/mock/mockClient'

const vacancyStore = new MockStore<JobVacancy>('job-vacancies', jobVacancies)
const applicantStore = new MockStore<Applicant>('applicants', applicants)

export type CreateVacancyInput = Omit<JobVacancy, 'id'>
export type UpdateVacancyInput = Partial<Omit<JobVacancy, 'id'>>
export type CreateApplicantInput = Pick<Applicant, 'name' | 'email' | 'vacancyId'>

function nextVacancyId(existing: JobVacancy[]): string {
  const maxNum = existing.reduce((max, v) => Math.max(max, Number(v.id.replace('VAC-', '')) || 0), 0)
  return `VAC-${String(maxNum + 1).padStart(3, '0')}`
}

function nextApplicantId(existing: Applicant[]): string {
  const maxNum = existing.reduce((max, a) => Math.max(max, Number(a.id.replace('APP-', '')) || 0), 0)
  return `APP-${String(maxNum + 1).padStart(4, '0')}`
}

export const recruitmentService = {
  async getVacancies(): Promise<JobVacancy[]> {
    return vacancyStore.getAll()
  },

  async createVacancy(payload: CreateVacancyInput): Promise<JobVacancy> {
    const existing = await vacancyStore.getAll()
    return vacancyStore.create({ ...payload, id: nextVacancyId(existing) })
  },

  async updateVacancy(id: string, payload: UpdateVacancyInput): Promise<JobVacancy> {
    return vacancyStore.update(id, payload)
  },

  async deleteVacancy(id: string): Promise<void> {
    return vacancyStore.remove(id)
  },

  async getApplicants(): Promise<Applicant[]> {
    return applicantStore.getAll()
  },

  async createApplicant(payload: CreateApplicantInput): Promise<Applicant> {
    const existing = await applicantStore.getAll()
    const applicant: Applicant = {
      ...payload,
      id: nextApplicantId(existing),
      stage: 'APPLIED',
      evaluationScore: null,
      evaluationNotes: '',
      interviewDate: null,
      appliedDate: new Date().toISOString().slice(0, 10),
    }
    return applicantStore.create(applicant)
  },

  async moveStage(id: string, stage: ApplicantStage): Promise<Applicant> {
    return applicantStore.update(id, { stage })
  },

  async scheduleInterview(id: string, interviewDate: string): Promise<Applicant> {
    return applicantStore.update(id, { interviewDate, stage: 'INTERVIEW' })
  },

  async evaluateApplicant(id: string, evaluationScore: number, evaluationNotes: string): Promise<Applicant> {
    return applicantStore.update(id, { evaluationScore, evaluationNotes })
  },
}
