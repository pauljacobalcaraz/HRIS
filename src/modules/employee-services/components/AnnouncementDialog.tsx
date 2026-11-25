import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Message is required'),
  postedBy: z.string().min(1, 'Posted by is required'),
})

type AnnouncementFormValues = z.infer<typeof schema>

interface AnnouncementDialogProps {
  open: boolean
  defaultPostedBy: string
  onClose: () => void
  onSubmit: (values: AnnouncementFormValues) => void
  isSubmitting?: boolean
}

export function AnnouncementDialog({ open, defaultPostedBy, onClose, onSubmit, isSubmitting }: AnnouncementDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(schema),
    values: { title: '', body: '', postedBy: defaultPostedBy },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Post announcement</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Title" error={!!errors.title} helperText={errors.title?.message} fullWidth required autoFocus />
            )}
          />
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Message" error={!!errors.body} helperText={errors.body?.message} fullWidth multiline minRows={3} required />
            )}
          />
          <Controller
            name="postedBy"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Posted by" error={!!errors.postedBy} helperText={errors.postedBy?.message} fullWidth required />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Posting…' : 'Post announcement'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
