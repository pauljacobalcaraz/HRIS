import { Chip } from '@mui/material'

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'default' | 'error' | 'info'> = {
  ACTIVE: 'success',
  ON_LEAVE: 'warning',
  INACTIVE: 'default',
  TERMINATED: 'error',
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  PRESENT: 'success',
  LATE: 'warning',
  UNDERTIME: 'info',
  ABSENT: 'error',
  REGULAR: 'default',
  SPECIAL: 'info',
  OPEN: 'success',
  ON_HOLD: 'warning',
  CLOSED: 'default',
  APPLIED: 'default',
  SCREENING: 'info',
  INTERVIEW: 'warning',
  OFFER: 'warning',
  HIRED: 'success',
  NOT_STARTED: 'default',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  DRAFT: 'default',
  SUBMITTED: 'warning',
  ACKNOWLEDGED: 'success',
  ENROLLED: 'info',
  PROCESSING: 'info',
  RELEASED: 'success',
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  INACTIVE: 'Inactive',
  TERMINATED: 'Terminated',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PRESENT: 'Present',
  LATE: 'Late',
  UNDERTIME: 'Undertime',
  ABSENT: 'Absent',
  REGULAR: 'Regular Holiday',
  SPECIAL: 'Special Holiday',
  OPEN: 'Open',
  ON_HOLD: 'On Hold',
  CLOSED: 'Closed',
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  ACKNOWLEDGED: 'Acknowledged',
  ENROLLED: 'Enrolled',
  PROCESSING: 'Processing',
  RELEASED: 'Released',
}

export function StatusChip({ status }: { status: string }) {
  return (
    <Chip
      size="small"
      color={STATUS_COLOR[status] ?? 'default'}
      label={STATUS_LABEL[status] ?? status}
      variant="outlined"
    />
  )
}
