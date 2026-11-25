import AddIcon from '@mui/icons-material/Add'
import CampaignIcon from '@mui/icons-material/CampaignOutlined'
import { Button, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '@/modules/iam/hooks/useAuth'
import { PageHeader } from '@/shared/components/PageHeader'
import { ROLE_LABELS } from '@/shared/constants/roles'
import { AnnouncementDialog } from '../components/AnnouncementDialog'
import { useAnnouncements, useCreateAnnouncement } from '../hooks/useAnnouncements'

export function AnnouncementsPage() {
  const { user } = useAuth()
  const { data: announcements = [] } = useAnnouncements()
  const createAnnouncement = useCreateAnnouncement()
  const [dialogOpen, setDialogOpen] = useState(false)

  const canPost = user?.role === 'SUPER_ADMIN' || user?.role === 'HR_ADMIN'

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Company and HR updates."
        actions={
          canPost && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
              Post announcement
            </Button>
          )
        }
      />
      <div className="flex flex-col gap-3">
        {announcements.map((ann) => (
          <Paper key={ann.id} variant="outlined" className="p-4 rounded-lg flex gap-3">
            <CampaignIcon color="primary" className="shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Typography variant="subtitle2" className="font-bold">
                  {ann.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {ann.postedDate}
                </Typography>
              </div>
              <Typography variant="body2" color="text.secondary" className="mt-1">
                {ann.body}
              </Typography>
              <Typography variant="caption" color="text.secondary" className="block mt-2">
                — {ann.postedBy}
              </Typography>
            </div>
          </Paper>
        ))}
      </div>

      <AnnouncementDialog
        open={dialogOpen}
        defaultPostedBy={user ? ROLE_LABELS[user.role] : ''}
        onClose={() => setDialogOpen(false)}
        onSubmit={(values) => createAnnouncement.mutate(values, { onSuccess: () => setDialogOpen(false) })}
        isSubmitting={createAnnouncement.isPending}
      />
    </>
  )
}
