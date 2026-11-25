import ConstructionIcon from '@mui/icons-material/ConstructionOutlined'
import { Paper, Typography } from '@mui/material'
import { PageHeader } from './PageHeader'

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} subtitle="This module is planned for a later implementation phase." />
      <Paper className="flex flex-col items-center justify-center gap-2 py-20 border border-black/10 rounded-lg" variant="outlined">
        <ConstructionIcon sx={{ fontSize: 48, opacity: 0.4 }} />
        <Typography variant="subtitle1" className="font-medium">
          Coming soon
        </Typography>
        <Typography variant="body2" color="text.secondary" className="max-w-sm text-center">
          This area is reserved in the navigation and routing architecture but has not been built yet.
        </Typography>
      </Paper>
    </>
  )
}
