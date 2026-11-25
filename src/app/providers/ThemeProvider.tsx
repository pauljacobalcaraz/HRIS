import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type ColorMode = 'light' | 'dark'

interface ColorModeContextValue {
  mode: ColorMode
  toggleMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined)

export function useColorMode() {
  const ctx = useContext(ColorModeContext)
  if (!ctx) throw new Error('useColorMode must be used within ThemeProvider')
  return ctx
}

const STORAGE_KEY = 'hris:color-mode'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' ? 'dark' : 'light'
  })

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#4f46e5' },
          secondary: { main: '#0ea5e9' },
          background:
            mode === 'light'
              ? { default: '#f6f7fb', paper: '#ffffff' }
              : { default: '#0f1115', paper: '#171a21' },
        },
        shape: { borderRadius: 10 },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiPaper: { defaultProps: { elevation: 0 } },
          MuiAppBar: { defaultProps: { elevation: 0 } },
        },
      }),
    [mode],
  )

  return (
    <ColorModeContext value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext>
  )
}
