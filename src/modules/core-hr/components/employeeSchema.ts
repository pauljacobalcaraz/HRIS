import { z } from 'zod'

export const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  departmentId: z.string().min(1, 'Select a department'),
  positionId: z.string().min(1, 'Select a position'),
  managerId: z.string().nullable(),
  employmentStatus: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']),
  employmentType: z.enum(['REGULAR', 'PROBATIONARY', 'CONTRACTUAL', 'PART_TIME']),
  dateHired: z.string().min(1, 'Hire date is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(1, 'Address is required'),
  avatarColor: z.string(),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>

export const EMPLOYEE_FORM_DEFAULTS: EmployeeFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  departmentId: '',
  positionId: '',
  managerId: null,
  employmentStatus: 'ACTIVE',
  employmentType: 'REGULAR',
  dateHired: '',
  dateOfBirth: '',
  address: '',
  avatarColor: '#6366f1',
}
