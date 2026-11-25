import { documentRequests, type DocumentRequest, type DocumentRequestType } from '@/mock/data/documentRequests'
import { MockStore } from '@/services/mock/mockClient'

const store = new MockStore<DocumentRequest>('document-requests', documentRequests)

export const DOCUMENT_TYPE_LABELS: Record<DocumentRequestType, string> = {
  COE: 'Certificate of Employment',
  CERTIFICATE_OF_CLEARANCE: 'Certificate of Clearance',
  PAYSLIP_COPY: 'Payslip Copy',
  EMPLOYMENT_VERIFICATION: 'Employment Verification',
}

export type CreateDocumentRequestInput = Pick<DocumentRequest, 'employeeId' | 'type' | 'purpose'>

function nextId(existing: DocumentRequest[]): string {
  const maxNum = existing.reduce((max, r) => Math.max(max, Number(r.id.replace('DOC-', '')) || 0), 0)
  return `DOC-${String(maxNum + 1).padStart(4, '0')}`
}

export const documentService = {
  async getAll(): Promise<DocumentRequest[]> {
    return store.getAll()
  },

  async getByEmployee(employeeId: string): Promise<DocumentRequest[]> {
    const all = await store.getAll()
    return all.filter((r) => r.employeeId === employeeId).sort((a, b) => (a.requestedDate < b.requestedDate ? 1 : -1))
  },

  async create(payload: CreateDocumentRequestInput): Promise<DocumentRequest> {
    const existing = await store.getAll()
    return store.create({
      ...payload,
      id: nextId(existing),
      status: 'PENDING',
      requestedDate: new Date().toISOString().slice(0, 10),
    })
  },

  async updateStatus(id: string, status: DocumentRequest['status'], remarks?: string): Promise<DocumentRequest> {
    return store.update(id, { status, remarks })
  },
}
