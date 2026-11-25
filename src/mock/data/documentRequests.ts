export type DocumentRequestType = 'COE' | 'CERTIFICATE_OF_CLEARANCE' | 'PAYSLIP_COPY' | 'EMPLOYMENT_VERIFICATION'
export type DocumentRequestStatus = 'PENDING' | 'PROCESSING' | 'RELEASED' | 'REJECTED'

export interface DocumentRequest {
  id: string
  employeeId: string
  type: DocumentRequestType
  purpose: string
  status: DocumentRequestStatus
  requestedDate: string
  remarks?: string
}

const EMPLOYEE_IDS = ['EMP-0006', 'EMP-0007', 'EMP-0008', 'EMP-0009', 'EMP-0010']
const TYPE_CYCLE: DocumentRequestType[] = ['COE', 'PAYSLIP_COPY', 'CERTIFICATE_OF_CLEARANCE', 'EMPLOYMENT_VERIFICATION']
const STATUS_CYCLE: DocumentRequestStatus[] = ['RELEASED', 'PROCESSING', 'PENDING', 'RELEASED', 'REJECTED']
const PURPOSES = ['Bank loan application', 'Visa application', 'New employer requirement', 'Personal records', 'Government transaction']

function buildDocumentRequests(): DocumentRequest[] {
  return EMPLOYEE_IDS.flatMap((employeeId, empIdx) =>
    [0, 1].map((n) => {
      const i = empIdx * 2 + n
      const status = STATUS_CYCLE[i % STATUS_CYCLE.length]
      return {
        id: `DOC-${String(i + 1).padStart(4, '0')}`,
        employeeId,
        type: TYPE_CYCLE[i % TYPE_CYCLE.length],
        purpose: PURPOSES[i % PURPOSES.length],
        status,
        requestedDate: `2026-${String(1 + (i % 10)).padStart(2, '0')}-10`,
        remarks: status === 'REJECTED' ? 'Please resubmit with complete details.' : undefined,
      }
    }),
  )
}

export const documentRequests: DocumentRequest[] = buildDocumentRequests()
