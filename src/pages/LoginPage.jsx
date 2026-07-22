import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Avatar, Button, TextField, Box,
  Typography, Container, Paper, CssBaseline
} from '@mui/material'
import ComputerIcon from '@mui/icons-material/Computer'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const ACCENT = '#63CAAC'
const ACCENT_GLOW = 'rgba(99, 202, 172, 0.5)'
const ACCENT_BG = 'rgba(99, 202, 172, 0.1)'
const BG = 'linear-gradient(135deg, #20232a, #1a1a1a, #20232a)'

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export default function LoginPage() {
  const { login, loading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data) => {
    login(data.email, data.password)
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: BG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
                <ComputerIcon fontSize="large" sx={{ color: '#20232a' }} />
              </Avatar>
            </motion.div>

            <Typography variant="h5" fontWeight="bold" color="white" mb={0.5}>
              PC Store
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.4)" mb={3}>
              Inicia sesión para continuar
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                type="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputLabelProps={{ shrink: true }}
                sx={inputStyle(ACCENT)}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Contraseña"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputLabelProps={{ shrink: true }}
                sx={inputStyle(ACCENT)}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  sx={glowBtn(ACCENT, ACCENT_GLOW, ACCENT_BG)}
                >
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </Button>
              </motion.div>

              <Typography variant="body2" textAlign="center" color="rgba(255,255,255,0.4)" mt={2}>
                ¿No tienes cuenta?{' '}
                <Link to="/register" style={{ color: ACCENT, fontWeight: 'bold' }}>
                  Regístrate
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
    backgroundColor: 'transparent',
  },
  '& .MuiInputLabel-root.Mui-focused': { color: accent },
  '& .MuiInputLabel-shrink': { color: accent },
  '& .MuiFormHelperText-root': { color: '#f87171' },
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