export interface Announcement {
  id: string
  title: string
  body: string
  postedBy: string
  postedDate: string
}

export const announcements: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'Year-End Holiday Schedule',
    body: 'The office will observe a holiday break from December 24 to January 1. Please coordinate with your manager for any coverage needs.',
    postedBy: 'HR Department',
    postedDate: '2026-11-20',
  },
  {
    id: 'ANN-002',
    title: 'Open Enrollment for HMO Benefits',
    body: 'Open enrollment for HMO coverage is now open until the end of the month. Visit the Benefits tab to review your options.',
    postedBy: 'HR Department',
    postedDate: '2026-11-10',
  },
  {
    id: 'ANN-003',
    title: 'Q4 Townhall Meeting',
    body: 'Join us for the company-wide Q4 townhall on November 28, 2pm, at the main conference hall.',
    postedBy: 'Executive Office',
    postedDate: '2026-11-05',
  },
  {
    id: 'ANN-004',
    title: 'Payroll Cutoff Reminder',
    body: 'Please submit all overtime and leave requests before the 25th of each month to be included in that month’s payroll run.',
    postedBy: 'Payroll Department',
    postedDate: '2026-10-28',
  },
]
