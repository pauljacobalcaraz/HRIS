import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center p-6">
      <Typography variant="h3" className="font-bold">
        404
      </Typography>
      <Typography variant="h6">Page not found.</Typography>
      <Button component={Link} to="/dashboard" variant="contained" className="mt-3">
        Back to dashboard
      </Button>
    </div>
  )
}
