# Project: Enterprise HRIS – MERN Stack

Act as a Senior Software Architect, UI/UX Designer, and Senior MERN Stack Developer.

Design and develop a modern, enterprise-grade Human Resource Information System (HRIS) using the MERN technology stack.

The initial implementation must be a fully functional frontend application powered by mock data. Do not create or connect an actual database or backend yet.

However, design the application architecture so that mock data services can later be replaced with actual Express.js APIs and MongoDB without major changes to the UI components or business logic.

## 1. Technology Stack

### Frontend
- React.js
- TypeScript
- Vite
- Material UI (MUI)
- Tailwind CSS (optional)
- React Router
- TanStack Query
- React Hook Form
- Zod

### Future Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Keycloak compatibility (optional)

### Mock Data
- TypeScript mock datasets
- JSON fixtures
- Mock service layer
- LocalStorage for temporary persistence
- TanStack Query for data fetching and caching

IMPORTANT: Do not initialize MongoDB, Express.js, or any actual backend services during this phase.

## 2. System Modules

Implement the following modules with realistic mock data and functional user interactions.

### A. Identity & Access Management
- Login and logout simulation
- Mock authentication
- User account management
- Role-based access control
- Permission management
- Module-level navigation restrictions
- Page-level access restrictions
- Action-level permissions

Provide predefined demo accounts for different user roles.

### B. Core HR
- Employee management
- Employee profiles
- Personal information
- Employment information
- Employee status
- Department management
- Organization hierarchy
- Position management
- Employment history
- Employee transfers
- Employee onboarding

### C. Workforce Management
- Attendance monitoring
- Time-in and time-out simulation
- Late and undertime tracking
- Overtime requests
- Leave applications
- Leave balances
- Leave approval
- Shift scheduling
- Holiday management
- Attendance reports

### D. Compensation & Benefits
- Payroll management
- Salary records
- Allowances and deductions
- Overtime computation previews
- Mock tax computation
- SSS contributions
- PhilHealth contributions
- Pag-IBIG contributions
- 13th-month pay estimates
- Benefits management
- Payslip generation
- Payroll history

All financial calculations must be clearly labeled as demo calculations and not official payroll or tax computations.

### E. Talent Management
- Job vacancy management
- Applicant tracking
- Recruitment pipeline
- Interview scheduling
- Applicant evaluation
- Performance evaluation
- KPI management
- Goal setting
- Training programs
- Skills assessment

### F. Employee Services
- Employee self-service dashboard
- Personal information updates
- Payslip viewing
- Leave applications
- Attendance viewing
- Document requests
- COE request simulation
- Document management
- Approval requests
- HR announcements
- Notifications

### G. HR Analytics
- Employee headcount
- Employee demographics
- Department distribution
- Attendance analytics
- Leave utilization
- Payroll summaries
- Recruitment analytics
- Employee turnover
- Performance analytics
- Charts and reports
- Export to Excel and PDF

## 3. User Roles

Create the following demo roles:

1. Super Administrator
2. HR Administrator
3. HR Staff
4. Department Manager
5. Team Leader
6. Payroll Administrator
7. Recruiter
8. Employee

Implement a configurable permission system supporting:
- Create
- Read
- Update
- Delete
- Approve
- Reject
- Export

Permissions must control sidebar navigation, page access, buttons, and actions.

Frontend permissions are for demonstration only. Actual authorization must eventually be implemented and enforced by the backend.

## 4. UI/UX Requirements

Create a professional enterprise HR dashboard.

### Main Layout
- Collapsible sidebar
- Top navigation bar
- User profile menu
- Notification center
- Breadcrumb navigation
- Responsive layout
- Search functionality
- Dashboard widgets

### Design Direction
Use a clean, modern enterprise SaaS design.

- Material UI components
- Consistent spacing and typography
- Professional neutral color palette
- Clear information hierarchy
- Responsive tables
- Card-based dashboard widgets
- Accessible forms and dialogs
- Light and dark mode support

### Data Tables
All major listing pages should support:
- Pagination
- Sorting
- Search
- Filtering
- Row actions
- Status indicators
- Empty states
- Loading states

### Forms
Use reusable form components with:
- React Hook Form
- Zod validation
- Field-level error messages
- Required field indicators
- Confirmation dialogs
- Success and error notifications

## 5. Frontend Architecture

Follow feature-based modular architecture.

Suggested structure:

src/
├── app/
│   ├── providers/
│   ├── router/
│   └── layouts/
│
├── modules/
│   ├── iam/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   │
│   ├── core-hr/
│   ├── workforce/
│   ├── compensation/
│   ├── talent/
│   ├── employee-services/
│   └── analytics/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── utils/
│   ├── constants/
│   └── types/
│
├── mock/
│   ├── data/
│   ├── fixtures/
│   └── seed.ts
│
├── services/
│   ├── api/
│   ├── mock/
│   └── adapters/
│
└── main.tsx

Each module must be independently organized and maintain its own:
- Components
- Pages
- Types
- Constants
- Services
- Hooks
- Validation schemas

## 6. Mock Data Architecture

Create realistic and interconnected mock datasets.

Include:
- At least 50 employees
- 8 departments
- 15 positions
- 5 managers
- 30 attendance records
- 20 leave applications
- 15 payroll records
- 10 job applicants
- 10 training records
- 10 employee documents
- Sample approval requests

Use consistent IDs and references between datasets.

Example employee:

{
  "id": "EMP-0001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "departmentId": "DEPT-001",
  "positionId": "POS-001",
  "managerId": "EMP-0005",
  "employmentStatus": "ACTIVE",
  "employmentType": "REGULAR",
  "dateHired": "2024-01-15"
}

### Mock Service Layer

Never import mock JSON data directly into page components.

Instead, use service abstractions:

- employeeService
- departmentService
- attendanceService
- leaveService
- payrollService
- recruitmentService
- performanceService
- documentService
- approvalService

All services should expose asynchronous methods that behave like actual API requests.

Example:

employeeService.getEmployees()
employeeService.getEmployeeById(id)
employeeService.createEmployee(payload)
employeeService.updateEmployee(id, payload)
employeeService.deleteEmployee(id)

Use a small artificial delay to simulate network requests.

Persist changes in LocalStorage so CRUD operations survive page refreshes.

## 7. State Management

Use TanStack Query for server-like state management.

Requirements:
- Query keys per domain
- Query functions colocated with their services
- Mutations for create, update, and delete
- Query invalidation after successful mutations
- Loading and error states
- Empty states
- Background refetch behavior

Use React Context or local React state for UI-specific state.

Do not unnecessarily duplicate server data in global state.

## 8. Authentication Simulation

Implement a mock login system.

Provide predefined demo accounts for all eight roles.

After login:
- Load the user's role and permissions.
- Generate the appropriate navigation.
- Restrict unauthorized pages.
- Restrict unauthorized actions.
- Display the user's role and profile.
- Support logout.

Authentication must be abstracted so that a future Keycloak or JWT integration can replace the mock authentication provider.

## 9. Business Logic

Implement functional frontend workflows, not just static screens.

Examples:

- Create an employee and immediately display the new record.
- Submit a leave request and update its status.
- Approve or reject leave requests.
- Simulate time-in and time-out.
- Calculate attendance summaries.
- Generate sample payroll calculations.
- Create document requests.
- Track recruitment stages.
- Update employee performance evaluations.
- Generate dashboard statistics from mock datasets.

Use consistent business rules and validation.

## 10. Implementation Phases

Phase 1: Foundation
- Initialize Vite React TypeScript
- Install dependencies
- Configure MUI
- Create application layout
- Configure React Router
- Configure TanStack Query
- Implement mock authentication
- Implement RBAC

Phase 2: Core HR
- Employee management
- Department management
- Position management
- Organization hierarchy

Phase 3: Workforce
- Attendance
- Leave
- Shift scheduling
- Overtime

Phase 4: Compensation
- Payroll
- Benefits
- Tax simulation
- Payslips

Phase 5: Talent
- Recruitment
- Performance
- Training

Phase 6: Employee Services
- Employee self-service
- Documents
- Requests and approvals

Phase 7: Analytics
- Dashboard
- Reports
- Charts
- Export functionality

## 11. Future Backend Integration

Design the frontend so that switching from mock services to REST APIs requires minimal changes.

Use a service interface and interchangeable implementations.

Example:

EmployeeService interface
├── MockEmployeeService
└── ApiEmployeeService

The UI must depend on the service abstraction rather than directly depending on mock datasets.

Do not introduce unnecessary abstractions or overengineering.

## 12. Expected Deliverables

1. Complete React TypeScript project.
2. Enterprise dashboard UI.
3. Responsive navigation.
4. Functional module pages.
5. Reusable components.
6. Mock authentication.
7. Role-based access control.
8. Realistic mock datasets.
9. Functional CRUD operations.
10. Working approval workflows.
11. TanStack Query integration.
12. LocalStorage persistence.
13. Charts and analytics.
14. Export functionality.
15. Clear setup and installation instructions.

## Final Instructions

Start with the system architecture and project structure.

Then implement Phase 1 and Phase 2 before proceeding to the other modules.

Prioritize functional workflows, reusable components, realistic data, and consistent UI/UX.

Do not create a real backend or database.

Do not hardcode mock data inside React components.

Do not build static dashboard screens that have nonfunctional buttons.

Every visible action should perform a meaningful operation using the mock service layer.

The final result must be a working HRIS frontend prototype that can later evolve into a production MERN application.