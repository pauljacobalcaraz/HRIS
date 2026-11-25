import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import { Button, IconButton, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { PageHeader } from '@/shared/components/PageHeader'
import { StatusChip } from '@/shared/components/StatusChip'
import { HolidayDialog } from '../components/HolidayDialog'
import { useCreateHoliday, useDeleteHoliday, useHolidays, useUpdateHoliday } from '../hooks/useHolidays'
import type { Holiday } from '../types'

export function HolidayListPage() {
  const { can } = useAuth()
  const { data: holidays = [], isLoading } = useHolidays()
  const createHoliday = useCreateHoliday()
  const updateHoliday = useUpdateHoliday()
  const deleteHoliday = useDeleteHoliday()

  const [dialogState, setDialogState] = useState<{ open: boolean; holiday?: Holiday }>({ open: false })
  const [pendingDelete, setPendingDelete] = useState<Holiday | null>(null)

  const canManage = can('CORE_HR', 'CREATE')

  const columns: DataTableColumn<Holiday>[] = [
    { key: 'date', label: 'Date', sortable: false, render: (row) => row.date },
    { key: 'name', label: 'Holiday', render: (row) => row.name },
    { key: 'type', label: 'Type', render: (row) => <StatusChip status={row.type} /> },
    ...(canManage
      ? [
          {
            key: 'actions',
            label: '',
            align: 'right' as const,
            render: (row: Holiday) => (
              <div className="flex justify-end gap-1">
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => setDialogState({ open: true, holiday: row })}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => setPendingDelete(row)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]
      : []),
  ]

  return (
    <>
      <PageHeader
        title="Holidays"
        subtitle={`${holidays.length} holidays configured`}
        actions={
          canManage && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogState({ open: true })}>
              Add holiday
            </Button>
          )
        }
      />
      <DataTable
        columns={columns}
        rows={holidays}
        rowKey={(row) => row.id}
        loading={isLoading}
        total={holidays.length}
        page={1}
        pageSize={holidays.length || 10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />

      <HolidayDialog
        open={dialogState.open}
        holiday={dialogState.holiday}
        onClose={() => setDialogState({ open: false })}
        onSubmit={(values) => {
          if (dialogState.holiday) {
            updateHoliday.mutate(
              { id: dialogState.holiday.id, payload: values },
              { onSuccess: () => setDialogState({ open: false }) },
            )
          } else {
            createHoliday.mutate(values, { onSuccess: () => setDialogState({ open: false }) })
          }
        }}
        isSubmitting={createHoliday.isPending || updateHoliday.isPending}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete holiday"
        description={`Remove ${pendingDelete?.name} from the holiday calendar?`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleteHoliday.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteHoliday.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </>
  )
}
