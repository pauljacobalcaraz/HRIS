import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import { Button, Chip, IconButton, LinearProgress, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { EmptyState } from '@/shared/components/EmptyState'
import { StatusChip } from '@/shared/components/StatusChip'
import { EvaluationDialog } from './EvaluationDialog'
import { GoalDialog } from './GoalDialog'
import {
  useAcknowledgeEvaluation,
  useCreateEvaluation,
  useCreateGoal,
  useEmployeeEvaluations,
  useEmployeeGoals,
  useEmployeeSkills,
  useKpis,
  useSkillsCatalog,
  useUpdateGoal,
  useUpdateSkillLevel,
} from '../hooks/usePerformance'
import type { Goal, SkillLevel } from '../types'

const SKILL_LEVELS: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

interface EmployeePerformancePanelProps {
  employeeId: string
  employeeName?: string
  canManage: boolean
}

export function EmployeePerformancePanel({ employeeId, employeeName, canManage }: EmployeePerformancePanelProps) {
  const { data: goals = [] } = useEmployeeGoals(employeeId)
  const { data: evaluations = [] } = useEmployeeEvaluations(employeeId)
  const { data: kpis = [] } = useKpis()
  const { data: skillCatalog = [] } = useSkillsCatalog()
  const { data: employeeSkills = [] } = useEmployeeSkills(employeeId)

  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const createEvaluation = useCreateEvaluation()
  const acknowledgeEvaluation = useAcknowledgeEvaluation()
  const updateSkillLevel = useUpdateSkillLevel()

  const [goalDialog, setGoalDialog] = useState<{ open: boolean; goal?: Goal }>({ open: false })
  const [evalDialogOpen, setEvalDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <Paper variant="outlined" className="p-5 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <Typography variant="subtitle1" className="font-bold">
            Goals
          </Typography>
          {canManage && (
            <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setGoalDialog({ open: true })}>
              Add goal
            </Button>
          )}
        </div>
        {goals.length === 0 ? (
          <EmptyState title="No goals set" description="Development goals will appear here." />
        ) : (
          <div className="flex flex-col gap-3">
            {goals.map((goal) => (
              <div key={goal.id} className="border border-black/10 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Typography variant="body2" className="font-medium">
                      {goal.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Due {goal.targetDate}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusChip status={goal.status} />
                    {canManage && (
                      <IconButton size="small" onClick={() => setGoalDialog({ open: true, goal })}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                </div>
                <LinearProgress variant="determinate" value={goal.progress} className="mt-2 rounded-full" sx={{ height: 6 }} />
              </div>
            ))}
          </div>
        )}
      </Paper>

      <Paper variant="outlined" className="p-5 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <Typography variant="subtitle1" className="font-bold">
            Performance Evaluations
          </Typography>
          {canManage && (
            <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setEvalDialogOpen(true)}>
              New evaluation
            </Button>
          )}
        </div>
        {evaluations.length === 0 ? (
          <EmptyState title="No evaluations yet" description="Performance evaluations will appear here." />
        ) : (
          <div className="flex flex-col divide-y divide-black/5">
            {evaluations.map((ev) => (
              <div key={ev.id} className="py-3">
                <div className="flex items-center justify-between">
                  <Typography variant="body2" className="font-medium">
                    {ev.period} · Overall {ev.overallScore}/5
                  </Typography>
                  <div className="flex items-center gap-2">
                    <StatusChip status={ev.status} />
                    {!canManage && ev.status === 'SUBMITTED' && (
                      <Button size="small" onClick={() => acknowledgeEvaluation.mutate(ev.id)}>
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {kpis.map((kpi) => (
                    <Chip key={kpi.id} size="small" variant="outlined" label={`${kpi.name}: ${ev.scores[kpi.id] ?? '—'}/5`} />
                  ))}
                </div>
                <Typography variant="caption" color="text.secondary" className="block mt-1">
                  {ev.comments}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </Paper>

      <Paper variant="outlined" className="p-5 rounded-lg">
        <Typography variant="subtitle1" className="font-bold mb-3">
          Skills
        </Typography>
        <div className="flex flex-wrap gap-3">
          {skillCatalog.map((skill) => {
            const entry = employeeSkills.find((s) => s.skillId === skill.id)
            const level = entry?.level ?? 'BEGINNER'
            if (!canManage) {
              return <Chip key={skill.id} label={`${skill.name}: ${level}`} variant="outlined" />
            }
            return (
              <TextField
                key={skill.id}
                size="small"
                select
                label={skill.name}
                value={level}
                onChange={(e) => updateSkillLevel.mutate({ employeeId, skillId: skill.id, level: e.target.value as SkillLevel })}
                className="w-56"
              >
                {SKILL_LEVELS.map((lvl) => (
                  <MenuItem key={lvl} value={lvl}>
                    {lvl}
                  </MenuItem>
                ))}
              </TextField>
            )
          })}
        </div>
      </Paper>

      <GoalDialog
        open={goalDialog.open}
        goal={goalDialog.goal}
        onClose={() => setGoalDialog({ open: false })}
        onSubmit={(values) => {
          if (goalDialog.goal) {
            updateGoal.mutate({ id: goalDialog.goal.id, payload: values }, { onSuccess: () => setGoalDialog({ open: false }) })
          } else {
            createGoal.mutate({ ...values, employeeId }, { onSuccess: () => setGoalDialog({ open: false }) })
          }
        }}
        isSubmitting={createGoal.isPending || updateGoal.isPending}
      />

      <EvaluationDialog
        open={evalDialogOpen}
        employeeName={employeeName}
        kpis={kpis}
        onClose={() => setEvalDialogOpen(false)}
        onSubmit={(values) =>
          createEvaluation.mutate(
            { employeeId, evaluatorId: employeeId, status: 'SUBMITTED', ...values },
            { onSuccess: () => setEvalDialogOpen(false) },
          )
        }
        isSubmitting={createEvaluation.isPending}
      />
    </div>
  )
}
