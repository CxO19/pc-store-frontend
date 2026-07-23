import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Avatar, Button, TextField, Box,
  Typography, Container, CssBaseline
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import heroImage from '../assets/hero.png'

const ACCENT = '#00e5a0'
const ACCENT_GLOW = 'rgba(0,229,160,0.4)'
const BG = '#080b10'

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export default function LoginPage() {
  const { login, loading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CssBaseline />
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', borderRadius: 5, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', flexDirection: { xs: 'column', md: 'row' } }}>
            
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', p: 6, background: 'rgba(99,202,172,0.05)', borderRight: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT_GLOW} 0%, transparent 70%)`, filter: 'blur(50px)', top: '30%', left: '10%' }} />
              <Box component="img" src={heroImage} alt="PC Hardware" sx={{ width: '100%', maxWidth: 320, height: 'auto', objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }} />
            </Box>

            <Box sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                  <Avatar sx={{ bgcolor: ACCENT, width: 52, height: 52, boxShadow: `0 0 20px ${ACCENT_GLOW}` }}>
                    <LockOutlinedIcon sx={{ color: '#20232a' }} />
                  </Avatar>
                </motion.div>
                <Typography variant="h5" fontWeight="bold" color="white" mt={2} mb={0.5}>Iniciar sesión</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>Accede a tu cuenta de PC Store</Typography>

                <Box component="form" onSubmit={handleSubmit((data) => login(data.email, data.password))} sx={{ width: '100%' }}>
                  <TextField margin="normal" fullWidth label="Email" type="email" autoFocus {...register('email')} error={!!errors.email} helperText={errors.email?.message} InputLabelProps={{ shrink: true }} sx={inputStyle} />
                  <TextField margin="normal" fullWidth label="Contraseña" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} InputLabelProps={{ shrink: true }} sx={inputStyle} />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Button type="submit" fullWidth disabled={loading}
                      sx={{ mt: 3, mb: 1, borderRadius: 3, color: '#20232a', bgcolor: ACCENT, py: 1.5, fontSize: '1rem', fontWeight: 'bold', textTransform: 'none', boxShadow: `0 0 15px ${ACCENT_GLOW}`, '&:hover': { boxShadow: `0 0 25px ${ACCENT_GLOW}`, opacity: 0.9 }, '&:disabled': { color: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                      {loading ? 'Ingresando...' : 'Iniciar sesión'}
                    </Button>
                  </motion.div>
                  <Typography variant="body2" textAlign="center" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" style={{ color: ACCENT, fontWeight: 'bold' }}>Regístrate</Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
        <Box textAlign="center" mt={4}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>← Volver al inicio</Link>
        </Box>
      </Container>
    </Box>
  )
}

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: '#00e5a0' },
    '&.Mui-focused fieldset': { borderColor: '#00e5a0', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#00e5a0' },
  '& .MuiInputLabel-shrink': { color: '#00e5a0' },
  '& .MuiFormHelperText-root': { color: '#f87171' },
  '& .MuiInputBase-input': { color: '#ffffff' },
  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
}
