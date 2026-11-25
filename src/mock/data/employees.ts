import type { EmploymentStatus, EmploymentType } from '@/shared/types/common'

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatarColor: string
  departmentId: string
  positionId: string
  managerId: string | null
  employmentStatus: EmploymentStatus
  employmentType: EmploymentType
  dateHired: string
  dateOfBirth: string
  address: string
}

const FIRST_NAMES = [
  'John', 'Maria', 'James', 'Ana', 'Robert', 'Grace', 'Michael', 'Carmela', 'William', 'Rosa',
  'Daniel', 'Joy', 'Mark', 'Angela', 'Paul', 'Katrina', 'Peter', 'Liza', 'Carlos', 'Nina',
  'Victor', 'Elena', 'Samuel', 'Bianca', 'George', 'Faith', 'Edward', 'Hope', 'Richard', 'Mae',
  'Anthony', 'Cristina', 'Francis', 'Dianne', 'Patrick', 'Michelle', 'Benjamin', 'Sophia', 'Gabriel', 'Isabel',
  'Nathan', 'Camille', 'Julian', 'Andrea', 'Oliver', 'Patricia', 'Sean', 'Erika', 'Marco', 'Kristine',
]
const LAST_NAMES = [
  'Doe', 'Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Torres', 'Flores', 'Ramos', 'Mendoza',
  'Castillo', 'Villanueva', 'Aquino', 'Pascual', 'Gonzales', 'Fernandez', 'De Leon', 'Rivera', 'Navarro', 'Morales',
  'Domingo', 'Salazar', 'Tolentino', 'Ocampo', 'Valdez', 'Lim', 'Tan', 'Sy', 'Rosales', 'Marquez',
  'Diaz', 'Alvarez', 'Castro', 'Gutierrez', 'Herrera', 'Jimenez', 'Soto', 'Vargas', 'Pena', 'Medina',
  'Guerrero', 'Vega', 'Campos', 'Cabrera', 'Serrano', 'Ibarra', 'Molina', 'Rosario', 'Dela Cruz', 'Lazaro',
]
const AVATAR_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#ec4899']

const DEPT_POSITIONS: Record<string, string[]> = {
  'DEPT-001': ['POS-001'],
  'DEPT-002': ['POS-002', 'POS-003', 'POS-004'],
  'DEPT-003': ['POS-005', 'POS-006', 'POS-007'],
  'DEPT-004': ['POS-008', 'POS-009', 'POS-010', 'POS-011'],
  'DEPT-005': ['POS-012', 'POS-013'],
  'DEPT-006': ['POS-014'],
  'DEPT-007': ['POS-015'],
  'DEPT-008': ['POS-010'],
}

const MANAGER_IDS = ['EMP-0001', 'EMP-0002', 'EMP-0003', 'EMP-0004', 'EMP-0005']
const MANAGER_DEPTS = ['DEPT-001', 'DEPT-002', 'DEPT-003', 'DEPT-004', 'DEPT-005']
const MANAGER_POSITIONS = ['POS-001', 'POS-002', 'POS-005', 'POS-008', 'POS-012']

const STATUS_CYCLE: EmploymentStatus[] = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ON_LEAVE', 'ACTIVE', 'ACTIVE', 'INACTIVE', 'ACTIVE', 'ACTIVE']
const TYPE_CYCLE: EmploymentType[] = ['REGULAR', 'REGULAR', 'REGULAR', 'PROBATIONARY', 'CONTRACTUAL', 'REGULAR', 'REGULAR', 'PART_TIME', 'REGULAR', 'REGULAR']

const ALL_DEPTS = Object.keys(DEPT_POSITIONS)

function pad(n: number) {
  return String(n).padStart(4, '0')
}

function buildEmployees(): Employee[] {
  const list: Employee[] = []

  for (let i = 1; i <= 50; i++) {
    const id = `EMP-${pad(i)}`
    const firstName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length]
    const lastName = LAST_NAMES[(i - 1) % LAST_NAMES.length]
    const email = `${firstName.toLowerCase().replace(/\s/g, '')}.${lastName.toLowerCase().replace(/\s/g, '')}@company.com`

    const isManager = i <= 5
    const departmentId = isManager ? MANAGER_DEPTS[i - 1] : ALL_DEPTS[i % ALL_DEPTS.length]
    const positionId = isManager
      ? MANAGER_POSITIONS[i - 1]
      : DEPT_POSITIONS[departmentId][i % DEPT_POSITIONS[departmentId].length]
    const managerId = isManager ? null : MANAGER_IDS[i % MANAGER_IDS.length]

    const hireYear = 2018 + (i % 7)
    const hireMonth = String(1 + (i % 12)).padStart(2, '0')
    const hireDay = String(1 + (i % 28)).padStart(2, '0')

    const birthYear = 1975 + (i % 25)
    const birthMonth = String(1 + ((i + 3) % 12)).padStart(2, '0')
    const birthDay = String(1 + ((i + 7) % 28)).padStart(2, '0')

    list.push({
      id,
      firstName,
      lastName,
      email,
      phone: `+63 9${String(100000000 + i * 137).slice(0, 9)}`,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      departmentId,
      positionId,
      managerId,
      employmentStatus: isManager ? 'ACTIVE' : STATUS_CYCLE[i % STATUS_CYCLE.length],
      employmentType: isManager ? 'REGULAR' : TYPE_CYCLE[i % TYPE_CYCLE.length],
      dateHired: `${hireYear}-${hireMonth}-${hireDay}`,
      dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
      address: `${100 + i} Rizal Street, Quezon City, Metro Manila`,
    })
  }

  return list
}

export const employees: Employee[] = buildEmployees()
