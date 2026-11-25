import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { MainLayout } from '@/app/layouts/MainLayout'
import { CoreHrLayout } from '@/modules/core-hr/pages/CoreHrLayout'
import { DepartmentListPage } from '@/modules/core-hr/pages/DepartmentListPage'
import { EmployeeDetailPage } from '@/modules/core-hr/pages/EmployeeDetailPage'
import { EmployeeFormPage } from '@/modules/core-hr/pages/EmployeeFormPage'
import { EmployeeListPage } from '@/modules/core-hr/pages/EmployeeListPage'
import { LoginPage } from '@/modules/iam/pages/LoginPage'
import { AnalyticsPage } from '@/modules/analytics/pages/AnalyticsPage'
import { DashboardPage } from '@/modules/analytics/pages/DashboardPage'
import { BenefitsPage } from '@/modules/compensation/pages/BenefitsPage'
import { CompensationLayout } from '@/modules/compensation/pages/CompensationLayout'
import { PayrollPage } from '@/modules/compensation/pages/PayrollPage'
import { SalaryPage } from '@/modules/compensation/pages/SalaryPage'
import { AttendancePage } from '@/modules/workforce/pages/AttendancePage'
import { HolidayListPage } from '@/modules/workforce/pages/HolidayListPage'
import { LeavePage } from '@/modules/workforce/pages/LeavePage'
import { OvertimePage } from '@/modules/workforce/pages/OvertimePage'
import { ShiftSchedulePage } from '@/modules/workforce/pages/ShiftSchedulePage'
import { WorkforceLayout } from '@/modules/workforce/pages/WorkforceLayout'
import { PerformancePage } from '@/modules/talent/pages/PerformancePage'
import { RecruitmentPage } from '@/modules/talent/pages/RecruitmentPage'
import { TalentLayout } from '@/modules/talent/pages/TalentLayout'
import { TrainingPage } from '@/modules/talent/pages/TrainingPage'
import { AnnouncementsPage } from '@/modules/employee-services/pages/AnnouncementsPage'
import { DocumentRequestsPage } from '@/modules/employee-services/pages/DocumentRequestsPage'
import { EmployeeServicesLayout } from '@/modules/employee-services/pages/EmployeeServicesLayout'
import { MyProfilePage } from '@/modules/employee-services/pages/MyProfilePage'
import { NotificationsPage } from '@/modules/employee-services/pages/NotificationsPage'
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'
import { ForbiddenPage } from '@/shared/components/ForbiddenPage'
import { NotFoundPage } from '@/shared/components/NotFoundPage'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/403" element={<ForbiddenPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route element={<ProtectedRoute requiredModule="CORE_HR" />}>
              <Route path="/core-hr" element={<CoreHrLayout />}>
                <Route index element={<Navigate to="employees" replace />} />
                <Route path="employees" element={<EmployeeListPage />} />
                <Route
                  path="employees/new"
                  element={<ProtectedRoute requiredModule="CORE_HR" requiredAction="CREATE" />}
                >
                  <Route index element={<EmployeeFormPage />} />
                </Route>
                <Route path="employees/:id" element={<EmployeeDetailPage />} />
                <Route
                  path="employees/:id/edit"
                  element={<ProtectedRoute requiredModule="CORE_HR" requiredAction="UPDATE" />}
                >
                  <Route index element={<EmployeeFormPage />} />
                </Route>
                <Route path="departments" element={<DepartmentListPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredModule="WORKFORCE" />}>
              <Route path="/workforce" element={<WorkforceLayout />}>
                <Route index element={<Navigate to="attendance" replace />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="leave" element={<LeavePage />} />
                <Route path="overtime" element={<OvertimePage />} />
                <Route path="shifts" element={<ShiftSchedulePage />} />
                <Route path="holidays" element={<HolidayListPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredModule="COMPENSATION" />}>
              <Route path="/compensation" element={<CompensationLayout />}>
                <Route index element={<Navigate to="payroll" replace />} />
                <Route path="payroll" element={<PayrollPage />} />
                <Route path="salary" element={<SalaryPage />} />
                <Route path="benefits" element={<BenefitsPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredModule="TALENT" />}>
              <Route path="/talent" element={<TalentLayout />}>
                <Route index element={<Navigate to="recruitment" replace />} />
                <Route path="recruitment" element={<RecruitmentPage />} />
                <Route path="performance" element={<PerformancePage />} />
                <Route path="training" element={<TrainingPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredModule="EMPLOYEE_SERVICES" />}>
              <Route path="/employee-services" element={<EmployeeServicesLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<MyProfilePage />} />
                <Route path="documents" element={<DocumentRequestsPage />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredModule="ANALYTICS" />}>
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredModule="IAM" />}>
              <Route path="/admin/users" element={<ComingSoonPage title="Identity & Access Management" />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
