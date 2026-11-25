import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import { Card, CardContent, Chip, Typography } from '@mui/material'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { PageHeader } from '@/shared/components/PageHeader'
import { useEmployeeBenefits } from '../hooks/useBenefits'

export function BenefitsPage() {
  const { user } = useAuth()
  const { data: benefits = [], isLoading } = useEmployeeBenefits(user?.employeeId)

  return (
    <>
      <PageHeader title="Benefits" subtitle="Your enrolled benefits and programs." />
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit) => (
            <Card key={benefit.id} variant="outlined" className="rounded-lg">
              <CardContent>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Typography variant="subtitle1" className="font-bold">
                    {benefit.name}
                  </Typography>
                  <CheckCircleIcon color="success" fontSize="small" />
                </div>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  {benefit.description}
                </Typography>
                <Chip size="small" variant="outlined" label={benefit.provider} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
