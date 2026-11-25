import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Button,
  Chip,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { ROLE_LABELS } from '@/shared/constants/roles'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)
  const demoAccounts = authService.listDemoAccounts()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      await login(values)
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to sign in.')
    }
  }

  return (
    <Paper className="w-full max-w-4xl p-8 md:p-10 flex flex-col md:flex-row gap-8" sx={{ borderRadius: 3 }}>
      <div className="flex-1 min-w-0">
        <Typography variant="h5" className="font-bold mb-1">
          Welcome to HRIS Suite
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-6">
          Sign in to manage your workforce. This is a demo environment backed by mock data.
        </Typography>

        {serverError && (
          <Alert severity="error" className="mb-4">
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                autoComplete="username"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="Password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
            )}
          />
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>

      <Divider orientation="vertical" flexItem className="hidden md:block" />

      <div className="flex-1 min-w-0">
        <Typography variant="subtitle2" className="mb-2">
          Demo accounts (password: <code>password</code>)
        </Typography>
        <div className="flex flex-col gap-1.5 max-h-80 overflow-auto pr-1">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                setValue('email', account.email)
                setValue('password', account.password)
              }}
              className="flex items-center justify-between gap-2 rounded-lg border border-black/10 px-3 py-2 text-left hover:bg-black/5 transition-colors"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium">{account.displayName}</span>
                <span className="text-xs text-neutral-500">{account.email}</span>
              </span>
              <Chip size="small" label={ROLE_LABELS[account.role]} />
            </button>
          ))}
        </div>
      </div>
    </Paper>
  )
}
