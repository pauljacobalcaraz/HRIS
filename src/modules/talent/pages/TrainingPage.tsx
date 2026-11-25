import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import { Button, Card, CardContent, Chip, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { EmptyState } from '@/shared/components/EmptyState'
import { PageHeader } from '@/shared/components/PageHeader'
import { StatusChip } from '@/shared/components/StatusChip'
import { TrainingProgramDialog } from '../components/TrainingProgramDialog'
import {
  useCreateTrainingProgram,
  useEmployeeEnrollments,
  useEnrollTraining,
  useMarkTrainingComplete,
  useTrainingPrograms,
  useUpdateTrainingProgram,
} from '../hooks/useTraining'
import type { TrainingProgram } from '../types'

function MyTrainings() {
  const { user } = useAuth()
  const { data: programs = [] } = useTrainingPrograms()
  const { data: enrollments = [] } = useEmployeeEnrollments(user?.employeeId)
  const enroll = useEnrollTraining()
  const markComplete = useMarkTrainingComplete()

  const programName = (id: string) => programs.find((p) => p.id === id)?.title ?? id
  const enrolledProgramIds = new Set(enrollments.map((e) => e.programId))

  return (
    <Paper variant="outlined" className="p-5 rounded-lg mb-5">
      <Typography variant="subtitle1" className="font-bold mb-3">
        My Trainings
      </Typography>
      {enrollments.length === 0 ? (
        <EmptyState title="No trainings yet" description="Enroll in a program from the catalog below." />
      ) : (
        <div className="flex flex-col divide-y divide-black/5 mb-4">
          {enrollments.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="font-medium">{programName(e.programId)}</span>
              <div className="flex items-center gap-2">
                <StatusChip status={e.status} />
                {e.status === 'ENROLLED' && (
                  <Button size="small" onClick={() => markComplete.mutate(e.id)}>
                    Mark complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Typography variant="caption" color="text.secondary">
        Available programs
      </Typography>
      <div className="flex flex-wrap gap-2 mt-2">
        {programs
          .filter((p) => !enrolledProgramIds.has(p.id))
          .map((p) => (
            <Button
              key={p.id}
              size="small"
              variant="outlined"
              onClick={() => user && enroll.mutate({ employeeId: user.employeeId, programId: p.id })}
            >
              Enroll: {p.title}
            </Button>
          ))}
      </div>
    </Paper>
  )
}

function TrainingCatalog({ canManage }: { canManage: boolean }) {
  const { data: programs = [] } = useTrainingPrograms()
  const createProgram = useCreateTrainingProgram()
  const updateProgram = useUpdateTrainingProgram()
  const [dialogState, setDialogState] = useState<{ open: boolean; program?: TrainingProgram }>({ open: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Typography variant="subtitle1" className="font-bold">
          Training Catalog
        </Typography>
        {canManage && (
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setDialogState({ open: true })}>
            Add program
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((program) => (
          <Card key={program.id} variant="outlined" className="rounded-lg">
            <CardContent>
              <div className="flex items-start justify-between gap-2 mb-1">
                <Typography variant="subtitle2" className="font-bold">
                  {program.title}
                </Typography>
                {canManage && (
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => setDialogState({ open: true, program })}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              <Typography variant="body2" color="text.secondary">
                {program.provider}
              </Typography>
              <div className="flex gap-2 mt-3">
                <Chip size="small" label={program.category} />
                <Chip size="small" variant="outlined" label={`${program.durationHours}h`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TrainingProgramDialog
        open={dialogState.open}
        program={dialogState.program}
        onClose={() => setDialogState({ open: false })}
        onSubmit={(values) => {
          if (dialogState.program) {
            updateProgram.mutate({ id: dialogState.program.id, payload: values }, { onSuccess: () => setDialogState({ open: false }) })
          } else {
            createProgram.mutate(values, { onSuccess: () => setDialogState({ open: false }) })
          }
        }}
        isSubmitting={createProgram.isPending || updateProgram.isPending}
      />
    </div>
  )
}

export function TrainingPage() {
  const { can } = useAuth()
  const canManage = can('TALENT', 'CREATE')

  return (
    <>
      <PageHeader title="Training" subtitle="Training programs and enrollment." />
      <MyTrainings />
      <TrainingCatalog canManage={canManage} />
    </>
  )
}
