import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import RateReviewIcon from '@mui/icons-material/RateReviewOutlined'
import { Button, Card, CardContent, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { PageHeader } from '@/shared/components/PageHeader'
import { StatusChip } from '@/shared/components/StatusChip'
import { ApplicantDialog } from '../components/ApplicantDialog'
import { ApplicantEvaluationDialog } from '../components/ApplicantEvaluationDialog'
import { VacancyDialog } from '../components/VacancyDialog'
import {
  useApplicants,
  useCreateApplicant,
  useCreateVacancy,
  useEvaluateApplicant,
  useMoveApplicantStage,
  useScheduleInterview,
  useUpdateVacancy,
  useVacancies,
} from '../hooks/useRecruitment'
import type { Applicant, ApplicantStage, JobVacancy } from '../types'

const STAGE_ORDER: ApplicantStage[] = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED']

function nextStage(current: ApplicantStage): ApplicantStage | null {
  const idx = STAGE_ORDER.indexOf(current)
  if (idx === -1 || idx === STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[idx + 1]
}

function Vacancies({ canManage }: { canManage: boolean }) {
  const { data: vacancies = [] } = useVacancies()
  const createVacancy = useCreateVacancy()
  const updateVacancy = useUpdateVacancy()
  const [dialogState, setDialogState] = useState<{ open: boolean; vacancy?: JobVacancy }>({ open: false })

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <Typography variant="subtitle1" className="font-bold">
          Job Vacancies
        </Typography>
        {canManage && (
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setDialogState({ open: true })}>
            Post vacancy
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vacancies.map((v) => (
          <Card key={v.id} variant="outlined" className="rounded-lg">
            <CardContent>
              <div className="flex items-start justify-between gap-2 mb-1">
                <Typography variant="subtitle2" className="font-bold">
                  {v.title}
                </Typography>
                {canManage && (
                  <IconButton size="small" onClick={() => setDialogState({ open: true, vacancy: v })}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
              <StatusChip status={v.status} />
              <Typography variant="body2" color="text.secondary" className="mt-2 line-clamp-2">
                {v.description}
              </Typography>
              <Chip size="small" variant="outlined" label={`${v.openings} opening(s)`} className="mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      <VacancyDialog
        open={dialogState.open}
        vacancy={dialogState.vacancy}
        onClose={() => setDialogState({ open: false })}
        onSubmit={(values) => {
          if (dialogState.vacancy) {
            updateVacancy.mutate({ id: dialogState.vacancy.id, payload: values }, { onSuccess: () => setDialogState({ open: false }) })
          } else {
            createVacancy.mutate(values, { onSuccess: () => setDialogState({ open: false }) })
          }
        }}
        isSubmitting={createVacancy.isPending || updateVacancy.isPending}
      />
    </div>
  )
}

function ApplicantPipeline({ canManage }: { canManage: boolean }) {
  const { data: applicants = [], isLoading } = useApplicants()
  const { data: vacancies = [] } = useVacancies()
  const createApplicant = useCreateApplicant()
  const moveStage = useMoveApplicantStage()
  const scheduleInterview = useScheduleInterview()
  const evaluateApplicant = useEvaluateApplicant()

  const [addOpen, setAddOpen] = useState(false)
  const [evaluating, setEvaluating] = useState<Applicant | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const vacancyTitle = (id: string) => vacancies.find((v) => v.id === id)?.title ?? id
  const paged = applicants.slice((page - 1) * pageSize, page * pageSize)

  const columns: DataTableColumn<Applicant>[] = [
    { key: 'name', label: 'Applicant', render: (row) => row.name },
    { key: 'vacancy', label: 'Vacancy', render: (row) => vacancyTitle(row.vacancyId) },
    { key: 'stage', label: 'Stage', render: (row) => <StatusChip status={row.stage} /> },
    { key: 'interviewDate', label: 'Interview', render: (row) => row.interviewDate ?? '—' },
    { key: 'score', label: 'Score', render: (row) => (row.evaluationScore ? `${row.evaluationScore}/5` : '—') },
    ...(canManage
      ? [
          {
            key: 'actions',
            label: '',
            align: 'right' as const,
            render: (row: Applicant) => {
              const next = nextStage(row.stage)
              const isTerminal = row.stage === 'HIRED' || row.stage === 'REJECTED'
              return (
                <div className="flex justify-end gap-1">
                  <Tooltip title="Evaluate / schedule">
                    <IconButton size="small" onClick={() => setEvaluating(row)}>
                      <RateReviewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {!isTerminal && next && (
                    <Button size="small" variant="outlined" onClick={() => moveStage.mutate({ id: row.id, stage: next })}>
                      Advance
                    </Button>
                  )}
                  {!isTerminal && (
                    <Button size="small" color="error" onClick={() => moveStage.mutate({ id: row.id, stage: 'REJECTED' })}>
                      Reject
                    </Button>
                  )}
                </div>
              )
            },
          },
        ]
      : []),
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Typography variant="subtitle1" className="font-bold">
          Applicant Pipeline
        </Typography>
        {canManage && (
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
            Add applicant
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        rows={paged}
        rowKey={(row) => row.id}
        loading={isLoading}
        total={applicants.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      <ApplicantDialog
        open={addOpen}
        vacancies={vacancies.filter((v) => v.status === 'OPEN')}
        onClose={() => setAddOpen(false)}
        onSubmit={(values) => createApplicant.mutate(values, { onSuccess: () => setAddOpen(false) })}
        isSubmitting={createApplicant.isPending}
      />

      <ApplicantEvaluationDialog
        open={!!evaluating}
        applicant={evaluating ?? undefined}
        onClose={() => setEvaluating(null)}
        isSubmitting={scheduleInterview.isPending || evaluateApplicant.isPending}
        onSave={({ interviewDate, score, notes }) => {
          if (!evaluating) return
          const tasks: Promise<unknown>[] = []
          if (interviewDate) tasks.push(scheduleInterview.mutateAsync({ id: evaluating.id, interviewDate }))
          tasks.push(evaluateApplicant.mutateAsync({ id: evaluating.id, score, notes }))
          Promise.all(tasks).then(() => setEvaluating(null))
        }}
      />
    </div>
  )
}

export function RecruitmentPage() {
  const { can } = useAuth()
  const canManage = can('TALENT', 'CREATE')

  return (
    <>
      <PageHeader title="Recruitment" subtitle="Job vacancies, applicant pipeline, and interview scheduling." />
      <Vacancies canManage={canManage} />
      <ApplicantPipeline canManage={canManage} />
    </>
  )
}
