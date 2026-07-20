import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAuth } from '../hooks/useAuth'
import { useThemeMode } from '../theme/ThemeModeContext'
import { inputStyle, glowBtn } from '../theme/authStyles'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const { palette } = useThemeMode()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData.email, formData.password)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        type="email"
        autoFocus
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon sx={{ color: palette.textSecondary, fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={inputStyle(palette)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: palette.textSecondary, fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((v) => !v)}
                  edge="end"
                  size="small"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ color: palette.textSecondary, fontSize: 20 }} />
                  ) : (
                    <Visibility sx={{ color: palette.textSecondary, fontSize: 20 }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={inputStyle(palette)}
      />

      <Button
        type="submit"
        fullWidth
        variant="outlined"
        disabled={loading}
        sx={glowBtn(palette)}
      >
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </Button>

      <Typography variant="body2" sx={{ color: palette.textSecondary, fontWeight: 600, mt: 2, textAlign: 'center' }}>
        ¿No tienes cuenta?{' '}
        <Link to="/register" style={{ color: palette.accent, fontWeight: 'bold' }}>
          Regístrate
        </Link>
      </Typography>
    </Box>
  )
}
