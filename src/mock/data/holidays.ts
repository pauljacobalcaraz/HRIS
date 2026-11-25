export type HolidayType = 'REGULAR' | 'SPECIAL'

export interface Holiday {
  id: string
  name: string
  date: string
  type: HolidayType
}

export const holidays: Holiday[] = [
  { id: 'HOL-001', name: "New Year's Day", date: '2026-01-01', type: 'REGULAR' },
  { id: 'HOL-002', name: 'People Power Anniversary', date: '2026-02-25', type: 'SPECIAL' },
  { id: 'HOL-003', name: 'Maundy Thursday', date: '2026-04-02', type: 'REGULAR' },
  { id: 'HOL-004', name: 'Good Friday', date: '2026-04-03', type: 'REGULAR' },
  { id: 'HOL-005', name: 'Labor Day', date: '2026-05-01', type: 'REGULAR' },
  { id: 'HOL-006', name: 'Independence Day', date: '2026-06-12', type: 'REGULAR' },
  { id: 'HOL-007', name: 'Ninoy Aquino Day', date: '2026-08-21', type: 'SPECIAL' },
  { id: 'HOL-008', name: 'National Heroes Day', date: '2026-08-31', type: 'REGULAR' },
  { id: 'HOL-009', name: 'Bonifacio Day', date: '2026-11-30', type: 'REGULAR' },
  { id: 'HOL-010', name: 'Christmas Day', date: '2026-12-25', type: 'REGULAR' },
]
