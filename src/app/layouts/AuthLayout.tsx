import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <Box
      className="min-h-screen flex items-center justify-center p-4"
      sx={(theme) => ({
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #f0f9ff 100%)'
            : 'linear-gradient(135deg, #0f1115 0%, #15171c 50%, #0f1115 100%)',
      })}
    >
      <Outlet />
    </Box>
  )
}
