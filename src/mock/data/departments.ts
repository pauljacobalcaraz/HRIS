export interface Department {
  id: string
  name: string
  code: string
  managerId: string | null
  parentDepartmentId: string | null
  description: string
}

export const departments: Department[] = [
  { id: 'DEPT-001', name: 'Executive Office', code: 'EXEC', managerId: 'EMP-0001', parentDepartmentId: null, description: 'Executive leadership and corporate strategy.' },
  { id: 'DEPT-002', name: 'Human Resources', code: 'HR', managerId: 'EMP-0002', parentDepartmentId: null, description: 'Talent, compensation, and employee relations.' },
  { id: 'DEPT-003', name: 'Finance & Accounting', code: 'FIN', managerId: 'EMP-0003', parentDepartmentId: null, description: 'Financial planning, payroll, and accounting.' },
  { id: 'DEPT-004', name: 'Engineering', code: 'ENG', managerId: 'EMP-0004', parentDepartmentId: null, description: 'Product engineering and platform infrastructure.' },
  { id: 'DEPT-005', name: 'Sales', code: 'SALES', managerId: 'EMP-0005', parentDepartmentId: null, description: 'New business and account management.' },
  { id: 'DEPT-006', name: 'Marketing', code: 'MKT', managerId: null, parentDepartmentId: null, description: 'Brand, growth, and demand generation.' },
  { id: 'DEPT-007', name: 'Customer Support', code: 'CS', managerId: null, parentDepartmentId: null, description: 'Customer success and technical support.' },
  { id: 'DEPT-008', name: 'Operations', code: 'OPS', managerId: null, parentDepartmentId: null, description: 'Facilities, IT, and general operations.' },
]
