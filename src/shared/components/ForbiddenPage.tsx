import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center p-6">
      <Typography variant="h3" className="font-bold">
        403
      </Typography>
      <Typography variant="h6">You don't have permission to access this page.</Typography>
      <Typography variant="body2" color="text.secondary" className="max-w-sm">
        Your current role does not include the required permission. Contact your administrator if you believe this is a mistake.
      </Typography>
      <Button component={Link} to="/dashboard" variant="contained" className="mt-3">
        Back to dashboard
      </Button>
    </div>
  )
}
