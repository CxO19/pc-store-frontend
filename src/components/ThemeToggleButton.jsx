import { IconButton, Tooltip } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useThemeMode } from '../theme/ThemeModeContext'

export default function ThemeToggleButton() {
  const { mode, toggleMode, palette } = useThemeMode()

  return (
    <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
      <IconButton
        onClick={toggleMode}
        aria-label="Cambiar tema"
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1300,
          width: 52,
          height: 52,
          background: palette.accentGradient,
          border: `2px solid ${palette.accentContrast}`,
          color: palette.accentContrast,
          boxShadow: `0 4px 20px -2px ${palette.accentGlow}`,
          transition: 'all 0.3s ease',
          '& svg': { fontSize: 26 },
          '&:hover': {
            transform: 'scale(1.08)',
            boxShadow: `0 6px 28px -2px ${palette.accentGlow}`,
          },
        }}
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  )
}
