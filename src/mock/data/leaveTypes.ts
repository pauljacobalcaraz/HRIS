export interface LeaveType {
  id: string
  name: string
  annualAllocation: number
}

export const leaveTypes: LeaveType[] = [
  { id: 'LT-VAC', name: 'Vacation Leave', annualAllocation: 15 },
  { id: 'LT-SICK', name: 'Sick Leave', annualAllocation: 15 },
  { id: 'LT-EMERG', name: 'Emergency Leave', annualAllocation: 5 },
  { id: 'LT-BEREAVE', name: 'Bereavement Leave', annualAllocation: 3 },
]
