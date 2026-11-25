export type NotificationCategory = 'LEAVE' | 'DOCUMENT' | 'ANNOUNCEMENT' | 'PAYROLL' | 'RECRUITMENT'

export interface Notification {
  id: string
  employeeId: string
  category: NotificationCategory
  message: string
  createdAt: string
  read: boolean
}

const DEMO_EMPLOYEE_IDS = ['EMP-0001', 'EMP-0002', 'EMP-0004', 'EMP-0006', 'EMP-0007', 'EMP-0008', 'EMP-0009', 'EMP-0010']

const TEMPLATES: Array<{ category: NotificationCategory; message: string }> = [
  { category: 'LEAVE', message: 'Your leave request has been approved.' },
  { category: 'DOCUMENT', message: 'Your Certificate of Employment is ready for release.' },
  { category: 'ANNOUNCEMENT', message: 'New announcement: Q4 Townhall Meeting.' },
  { category: 'PAYROLL', message: 'Your payslip for the latest period is now available.' },
  { category: 'RECRUITMENT', message: 'A new applicant has been added to your pipeline.' },
]

function buildNotifications(): Notification[] {
  const list: Notification[] = []
  let counter = 1
  for (const employeeId of DEMO_EMPLOYEE_IDS) {
    TEMPLATES.forEach((template, idx) => {
      list.push({
        id: `NOTIF-${String(counter).padStart(4, '0')}`,
        employeeId,
        category: template.category,
        message: template.message,
        createdAt: `2026-11-${String(10 + idx).padStart(2, '0')}T09:00:00`,
        read: idx > 1,
      })
      counter++
    })
  }
  return list
}

export const notifications: Notification[] = buildNotifications()
