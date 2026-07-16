import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Grid, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import MailOutlineIcon from '@mui/icons-material/MailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAuth } from '../hooks/useAuth'
import { useThemeMode } from '../theme/ThemeModeContext'
import { inputStyle, glowBtn } from '../theme/authStyles'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const { register, loading } = useAuth()
  const { palette } = useThemeMode()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    register(formData)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            required fullWidth
            label="Nombre"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: palette.textSecondary, fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={inputStyle(palette)}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            required fullWidth
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: palette.textSecondary, fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={inputStyle(palette)}
          />
        </Grid>
      </Grid>

      <TextField
        margin="normal" required fullWidth
        label="Email" name="email" type="email"
        value={formData.email}
        onChange={handleChange}
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
        margin="normal" required fullWidth
        label="Contraseña (mín. 8 caracteres)"
        name="password" type={showPassword ? 'text' : 'password'}
        slotProps={{
          htmlInput: { minLength: 8 },
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
        value={formData.password}
        onChange={handleChange}
        sx={inputStyle(palette)}
      />

      <Button
        type="submit" fullWidth variant="outlined"
        disabled={loading}
        sx={glowBtn(palette)}
      >
        {loading ? 'Creando cuenta...' : 'Registrarse'}
      </Button>

      <Typography variant="body2" sx={{ color: palette.textSecondary, fontWeight: 600, mt: 2, textAlign: 'center' }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/" style={{ color: palette.accent, fontWeight: 'bold' }}>
          Inicia sesión
        </Link>
      </Typography>
    </Box>
  )
}
