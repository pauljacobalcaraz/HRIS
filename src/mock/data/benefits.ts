export interface Benefit {
  id: string
  name: string
  description: string
  eligibility: 'REGULAR' | 'ALL'
  provider: string
}

export const benefits: Benefit[] = [
  {
    id: 'BEN-001',
    name: 'HMO Health Coverage',
    description: 'Inpatient and outpatient medical coverage for the employee and up to 2 dependents.',
    eligibility: 'REGULAR',
    provider: 'MediCare Plus',
  },
  {
    id: 'BEN-002',
    name: 'Group Life Insurance',
    description: 'Term life insurance equivalent to 24 months of basic pay.',
    eligibility: 'REGULAR',
    provider: 'SunLife Demo',
  },
  {
    id: 'BEN-003',
    name: 'Retirement Plan',
    description: 'Company-funded retirement plan vesting after 3 years of regular employment.',
    eligibility: 'REGULAR',
    provider: 'Internal',
  },
  {
    id: 'BEN-004',
    name: 'Mandatory Government Contributions',
    description: 'SSS, PhilHealth, and Pag-IBIG contributions remitted on behalf of the employee.',
    eligibility: 'ALL',
    provider: 'Government',
  },
  {
    id: 'BEN-005',
    name: 'Leave Conversion',
    description: 'Unused vacation leave credits convertible to cash at year-end.',
    eligibility: 'ALL',
    provider: 'Internal',
  },
]
