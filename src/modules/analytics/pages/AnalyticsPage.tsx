import PrintIcon from '@mui/icons-material/PrintOutlined'
import { Button, Chip, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useDepartments } from '@/modules/core-hr/hooks/useDepartments'
import { useAllEmployees } from '@/modules/core-hr/hooks/useEmployees'
import { useAllPayrollRecords } from '@/modules/compensation/hooks/usePayroll'
import { useApplicants } from '@/modules/talent/hooks/useRecruitment'
import { useAllEvaluations, useKpis } from '@/modules/talent/hooks/usePerformance'
import { useAllAttendance } from '@/modules/workforce/hooks/useAttendance'
import { useAllLeaveApplications, useLeaveTypes } from '@/modules/workforce/hooks/useLeave'
import { PageHeader } from '@/shared/components/PageHeader'
import { exportToCsv } from '@/shared/utils/exportCsv'
import { AnalyticsPanel } from '../components/AnalyticsPanel'
import { SimpleBarChart } from '../components/SimpleBarChart'

const ApplicantStageOrder = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'] as const

function computeAge(dateOfBirth: string, today: Date): number {
  const birth = new Date(dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())
  if (!hasHadBirthdayThisYear) age -= 1
  return age
}

function peso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

const TODAY = new Date()

export function AnalyticsPage() {
  const { data: employees = [] } = useAllEmployees()
  const { data: departments = [] } = useDepartments()
  const { data: attendance = [] } = useAllAttendance()
  const { data: leaveApplications = [] } = useAllLeaveApplications()
  const { data: leaveTypes = [] } = useLeaveTypes()
  const { data: payrollRecords = [] } = useAllPayrollRecords()
  const { data: applicants = [] } = useApplicants()
  const { data: evaluations = [] } = useAllEvaluations()
  const { data: kpis = [] } = useKpis()

  const demographics = useMemo(() => {
    const bands = { '< 25': 0, '25–34': 0, '35–44': 0, '45–54': 0, '55+': 0 }
    employees.forEach((emp) => {
      const age = computeAge(emp.dateOfBirth, TODAY)
      if (age < 25) bands['< 25']++
      else if (age < 35) bands['25–34']++
      else if (age < 45) bands['35–44']++
      else if (age < 55) bands['45–54']++
      else bands['55+']++
    })
    return Object.entries(bands).map(([name, value]) => ({ name, value }))
  }, [employees])

  const employmentTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    employees.forEach((e) => {
      counts[e.employmentType] = (counts[e.employmentType] ?? 0) + 1
    })
    return counts
  }, [employees])

  const attendanceByStatus = useMemo(() => {
    const counts = { PRESENT: 0, LATE: 0, UNDERTIME: 0, ABSENT: 0 }
    attendance.forEach((rec) => {
      counts[rec.status]++
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [attendance])

  const leaveUtilization = useMemo(() => {
    return leaveTypes.map((type) => {
      const daysUsed = leaveApplications
        .filter((app) => app.leaveTypeId === type.id && app.status === 'APPROVED')
        .reduce((sum, app) => sum + app.days, 0)
      return { name: type.name, value: daysUsed }
    })
  }, [leaveTypes, leaveApplications])

  const payrollByPeriod = useMemo(() => {
    const totals = new Map<string, number>()
    payrollRecords.forEach((rec) => {
      totals.set(rec.period, (totals.get(rec.period) ?? 0) + rec.netPay)
    })
    return Array.from(totals.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([name, value]) => ({ name, value: Math.round(value) }))
  }, [payrollRecords])

  const totalPayrollCost = payrollRecords.reduce((sum, r) => sum + r.netPay, 0)

  const recruitmentFunnel = useMemo(() => {
    return ApplicantStageOrder.map((stage) => ({
      name: stage,
      value: applicants.filter((a) => a.stage === stage).length,
    }))
  }, [applicants])

  const turnoverRate = useMemo(() => {
    const terminated = employees.filter((e) => e.employmentStatus === 'TERMINATED').length
    return employees.length > 0 ? Math.round((terminated / employees.length) * 1000) / 10 : 0
  }, [employees])

  const performanceByKpi = useMemo(() => {
    return kpis.map((kpi) => {
      const scores = evaluations.map((ev) => ev.scores[kpi.id]).filter((v): v is number => typeof v === 'number')
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      return { name: kpi.name, value: Math.round(avg * 10) / 10 }
    })
  }, [kpis, evaluations])

  const departmentHeadcount = useMemo(
    () => departments.map((d) => ({ name: d.name, value: employees.filter((e) => e.departmentId === d.id).length })),
    [departments, employees],
  )

  return (
    <>
      <PageHeader
        title="HR Analytics"
        subtitle="Workforce insights across the organization. Figures are demo calculations."
        actions={
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}>
            Export PDF
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnalyticsPanel
          title="Employee Demographics"
          subtitle="Headcount by age band"
          onExport={() => exportToCsv('demographics', demographics)}
        >
          <SimpleBarChart data={demographics} />
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(employmentTypeCounts).map(([type, count]) => (
              <Chip key={type} size="small" variant="outlined" label={`${type.replace('_', ' ')}: ${count}`} />
            ))}
          </div>
        </AnalyticsPanel>

        <AnalyticsPanel
          title="Department Distribution"
          subtitle="Headcount by department"
          onExport={() => exportToCsv('department-distribution', departmentHeadcount)}
        >
          <SimpleBarChart data={departmentHeadcount} />
        </AnalyticsPanel>

        <AnalyticsPanel
          title="Attendance Analytics"
          subtitle="Attendance outcomes, last 6 working days"
          onExport={() => exportToCsv('attendance-analytics', attendanceByStatus)}
        >
          <SimpleBarChart data={attendanceByStatus} color={{ light: '#1baf7a', dark: '#199e70' }} />
        </AnalyticsPanel>

        <AnalyticsPanel
          title="Leave Utilization"
          subtitle="Approved leave days used by type"
          onExport={() => exportToCsv('leave-utilization', leaveUtilization)}
        >
          <SimpleBarChart data={leaveUtilization} color={{ light: '#eda100', dark: '#c98500' }} />
        </AnalyticsPanel>

        <AnalyticsPanel
          title="Payroll Summary"
          subtitle={`Total net pay processed: ${peso(totalPayrollCost)}`}
          onExport={() => exportToCsv('payroll-summary', payrollByPeriod)}
        >
          <SimpleBarChart data={payrollByPeriod} valueFormatter={(v) => peso(v)} color={{ light: '#4a3aa7', dark: '#9085e9' }} />
        </AnalyticsPanel>

        <AnalyticsPanel
          title="Recruitment Funnel"
          subtitle="Applicants by pipeline stage"
          onExport={() => exportToCsv('recruitment-funnel', recruitmentFunnel)}
        >
          <SimpleBarChart data={recruitmentFunnel} color={{ light: '#eb6834', dark: '#d95926' }} />
        </AnalyticsPanel>

        <AnalyticsPanel title="Employee Turnover" onExport={() => exportToCsv('turnover', [{ name: 'Turnover rate (%)', value: turnoverRate }])}>
          <div className="flex items-center gap-4 py-4">
            <Typography variant="h3" className="font-bold">
              {turnoverRate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              of the current workforce is marked terminated, based on the latest employee records.
            </Typography>
          </div>
        </AnalyticsPanel>

        <AnalyticsPanel
          title="Performance Analytics"
          subtitle="Average KPI score across submitted evaluations (out of 5)"
          onExport={() => exportToCsv('performance-analytics', performanceByKpi)}
        >
          <SimpleBarChart data={performanceByKpi} color={{ light: '#e34948', dark: '#e66767' }} />
        </AnalyticsPanel>
      </div>
    </>
  )
}
