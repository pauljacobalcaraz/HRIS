import { Paper, Skeleton } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmployeeForm } from '../components/EmployeeForm'
import { EMPLOYEE_FORM_DEFAULTS, type EmployeeFormValues } from '../components/employeeSchema'
import { useCreateEmployee, useEmployee, useUpdateEmployee } from '../hooks/useEmployees'

export function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const { data: employee, isLoading } = useEmployee(id)
  const createEmployee = useCreateEmployee()
  const updateEmployee = useUpdateEmployee()

  if (isEdit && isLoading) {
    return <Skeleton variant="rounded" height={420} />
  }

  const defaultValues: EmployeeFormValues | undefined = isEdit
    ? employee
      ? { ...employee }
      : undefined
    : EMPLOYEE_FORM_DEFAULTS

  const handleSubmit = (values: EmployeeFormValues) => {
    if (isEdit && id) {
      updateEmployee.mutate(
        { id, payload: values },
        { onSuccess: () => navigate(`/core-hr/employees/${id}`) },
      )
    } else {
      createEmployee.mutate(values, {
        onSuccess: (created) => navigate(`/core-hr/employees/${created.id}`),
      })
    }
  }

  return (
    <>
      <PageHeader
        title={isEdit ? `Edit ${employee?.firstName ?? ''} ${employee?.lastName ?? ''}` : 'Add employee'}
        subtitle={isEdit ? 'Update employment and personal information.' : 'Create a new employee record.'}
      />
      <Paper variant="outlined" className="p-5 rounded-lg max-w-3xl">
        {defaultValues && (
          <EmployeeForm
            defaultValues={defaultValues}
            submitLabel={isEdit ? 'Save changes' : 'Create employee'}
            onSubmit={handleSubmit}
            isSubmitting={createEmployee.isPending || updateEmployee.isPending}
            excludeEmployeeId={id}
          />
        )}
      </Paper>
    </>
  )
}
