export interface Position {
  id: string
  title: string
  departmentId: string
  level: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER' | 'EXECUTIVE'
}

export const positions: Position[] = [
  { id: 'POS-001', title: 'Chief Executive Officer', departmentId: 'DEPT-001', level: 'EXECUTIVE' },
  { id: 'POS-002', title: 'HR Director', departmentId: 'DEPT-002', level: 'MANAGER' },
  { id: 'POS-003', title: 'HR Generalist', departmentId: 'DEPT-002', level: 'MID' },
  { id: 'POS-004', title: 'Recruiter', departmentId: 'DEPT-002', level: 'MID' },
  { id: 'POS-005', title: 'Finance Director', departmentId: 'DEPT-003', level: 'MANAGER' },
  { id: 'POS-006', title: 'Payroll Specialist', departmentId: 'DEPT-003', level: 'MID' },
  { id: 'POS-007', title: 'Accountant', departmentId: 'DEPT-003', level: 'MID' },
  { id: 'POS-008', title: 'Engineering Director', departmentId: 'DEPT-004', level: 'MANAGER' },
  { id: 'POS-009', title: 'Senior Software Engineer', departmentId: 'DEPT-004', level: 'SENIOR' },
  { id: 'POS-010', title: 'Software Engineer', departmentId: 'DEPT-004', level: 'MID' },
  { id: 'POS-011', title: 'QA Engineer', departmentId: 'DEPT-004', level: 'MID' },
  { id: 'POS-012', title: 'Sales Director', departmentId: 'DEPT-005', level: 'MANAGER' },
  { id: 'POS-013', title: 'Account Executive', departmentId: 'DEPT-005', level: 'MID' },
  { id: 'POS-014', title: 'Marketing Specialist', departmentId: 'DEPT-006', level: 'MID' },
  { id: 'POS-015', title: 'Customer Support Representative', departmentId: 'DEPT-007', level: 'ENTRY' },
]
