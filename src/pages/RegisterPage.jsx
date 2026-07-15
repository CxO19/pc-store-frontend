import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Avatar, Button, TextField, Box, Typography,
  Container, Paper, CssBaseline, Grid
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const ACCENT = '#63CAAC'
const ACCENT_GLOW = 'rgba(99, 202, 172, 0.5)'
const ACCENT_BG = 'rgba(99, 202, 172, 0.1)'
const BG = 'linear-gradient(135deg, #20232a, #1a1a1a, #20232a)'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: ''
  })
  const { register, loading } = useAuth()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    register(formData)
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: BG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
    }}>
      <CssBaseline />
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Paper elevation={0} sx={{
            padding: 4,
            borderRadius: 5,
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <Avatar sx={{ m: 1, bgcolor: ACCENT, width: 56, height: 56 }}>
                <PersonAddIcon fontSize="large" sx={{ color: '#20232a' }} />
              </Avatar>
            </motion.div>

            <Typography variant="h5" fontWeight="bold" color="white" mb={0.5}>
              Crear cuenta
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.4)" mb={3}>
              Únete a PC Store
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required fullWidth
                    label="Nombre"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={inputStyle(ACCENT)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required fullWidth
                    label="Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={inputStyle(ACCENT)}
                  />
                </Grid>
              </Grid>

              <TextField
                margin="normal" required fullWidth
                label="Email" name="email" type="email"
                value={formData.email}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={inputStyle(ACCENT)}
              />
              <TextField
                margin="normal" required fullWidth
                label="Contraseña (mín. 8 caracteres)"
                name="password" type="password"
                inputProps={{ minLength: 8 }}
                value={formData.password}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={inputStyle(ACCENT)}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit" fullWidth variant="outlined"
                  disabled={loading}
                  sx={glowBtn(ACCENT, ACCENT_GLOW, ACCENT_BG)}
                >
                  {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Button>
              </motion.div>

              <Typography variant="body2" textAlign="center" color="rgba(255,255,255,0.4)" mt={2}>
                ¿Ya tienes cuenta?{' '}
                <Link to="/" style={{ color: ACCENT, fontWeight: 'bold' }}>
                  Inicia sesión
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}

const inputStyle = (accent) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: accent },
    '&.Mui-focused fieldset': { borderColor: accent, borderWidth: 2 },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.6)',
  },
  '& .MuiInputLabel-root.Mui-focused': { color: accent },
  '& .MuiInputLabel-shrink': { color: accent },
})

const glowBtn = (accent, glow, bg) => ({
  mt: 3, mb: 1,
  borderRadius: 3,
  color: '#20232a',
  borderColor: accent,
  bgcolor: accent,
  py: 1.5,
  fontSize: '1rem',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: accent,
    boxShadow: `0 0 25px ${glow}`,
    bgcolor: accent,
    opacity: 0.9,
  },
  '&:disabled': {
    color: 'rgba(255,255,255,0.3)',
    borderColor: 'rgba(255,255,255,0.1)',
    bgcolor: 'transparent',
  }
})