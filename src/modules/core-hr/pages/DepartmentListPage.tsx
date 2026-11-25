import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import { Button, Card, CardContent, Chip, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/PageHeader'
import { DepartmentDialog } from '../components/DepartmentDialog'
import { useAllEmployees } from '../hooks/useEmployees'
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
} from '../hooks/useDepartments'
import type { Department } from '../types'

export function DepartmentListPage() {
  const { can } = useAuth()
  const { data: departments = [], isLoading } = useDepartments()
  const { data: employees = [] } = useAllEmployees()
  const createDepartment = useCreateDepartment()
  const updateDepartment = useUpdateDepartment()
  const deleteDepartment = useDeleteDepartment()

  const [dialogState, setDialogState] = useState<{ open: boolean; department?: Department }>({ open: false })
  const [pendingDelete, setPendingDelete] = useState<Department | null>(null)

  const canCreate = can('CORE_HR', 'CREATE')
  const canUpdate = can('CORE_HR', 'UPDATE')
  const canDelete = can('CORE_HR', 'DELETE')

  const headcount = (deptId: string) => employees.filter((e) => e.departmentId === deptId).length

  const handleSubmit = (values: { name: string; code: string; managerId: string | null; description: string }) => {
    if (dialogState.department) {
      updateDepartment.mutate(
        { id: dialogState.department.id, payload: values },
        { onSuccess: () => setDialogState({ open: false }) },
      )
    } else {
      createDepartment.mutate(
        { ...values, parentDepartmentId: null },
        { onSuccess: () => setDialogState({ open: false }) },
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Departments"
        subtitle={`${departments.length} departments`}
        actions={
          canCreate && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogState({ open: true })}>
              Add department
            </Button>
          )
        }
      />

      {departments.length === 0 ? (
        <EmptyState title="No departments yet" description="Create your first department to organize employees." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const manager = employees.find((e) => e.id === dept.managerId)
            return (
              <Card key={dept.id} variant="outlined" className="rounded-lg">
                <CardContent>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Typography variant="subtitle1" className="font-bold truncate">
                        {dept.name}
                      </Typography>
                      <Chip size="small" label={dept.code} className="mt-1" />
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {canUpdate && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => setDialogState({ open: true, department: dept })}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setPendingDelete(dept)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <Typography variant="body2" color="text.secondary" className="mt-2 line-clamp-2">
                    {dept.description}
                  </Typography>
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-neutral-500">
                      Manager: {manager ? `${manager.firstName} ${manager.lastName}` : '—'}
                    </span>
                    <Chip size="small" variant="outlined" label={`${headcount(dept.id)} employees`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <DepartmentDialog
        open={dialogState.open}
        department={dialogState.department}
        onClose={() => setDialogState({ open: false })}
        onSubmit={handleSubmit}
        isSubmitting={createDepartment.isPending || updateDepartment.isPending}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete department"
        description={`Are you sure you want to delete ${pendingDelete?.name}? Employees assigned to it will keep their reference until reassigned.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleteDepartment.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteDepartment.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </>
  )
}
