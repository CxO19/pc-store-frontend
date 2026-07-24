import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Avatar, Button, TextField, Box, Typography,
  Container, CssBaseline, Grid, Divider
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GoogleIcon from '@mui/icons-material/Google'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import heroImage from '../assets/hero.png'

const ACCENT = '#00e5a0'
const ACCENT_GLOW = 'rgba(0,229,160,0.4)'
const BG = '#080b10'

const registerSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export default function RegisterPage() {
  const { register: registerUser, loginWithGoogle, loading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  })

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      loginWithGoogle(credentialResponse.credential)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <CssBaseline />
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', borderRadius: 5, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', flexDirection: { xs: 'column', md: 'row' } }}>
            
            <Box sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                  <Avatar sx={{ bgcolor: ACCENT, width: 52, height: 52, boxShadow: `0 0 20px ${ACCENT_GLOW}` }}>
                    <PersonAddIcon fontSize="large" sx={{ color: '#20232a' }} />
                  </Avatar>
                </motion.div>
                <Typography variant="h5" fontWeight="bold" color="white" mt={2} mb={0.5}>Crear cuenta</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>Únete a PC Store</Typography>

                <Box component="form" onSubmit={handleSubmit((data) => registerUser(data))} sx={{ width: '100%' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Nombre" {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} InputLabelProps={{ shrink: true }} sx={inputStyle} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Apellido" {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} InputLabelProps={{ shrink: true }} sx={inputStyle} />
                    </Grid>
                  </Grid>
                  <TextField margin="normal" fullWidth label="Email" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} InputLabelProps={{ shrink: true }} sx={inputStyle} />
                  <TextField margin="normal" fullWidth label="Contraseña (mín. 8 caracteres)" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} InputLabelProps={{ shrink: true }} sx={inputStyle} />

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Button type="submit" fullWidth disabled={loading}
                      sx={{ mt: 3, mb: 2, borderRadius: 3, color: '#20232a', bgcolor: ACCENT, py: 1.5, fontSize: '1rem', fontWeight: 'bold', textTransform: 'none', boxShadow: `0 0 15px ${ACCENT_GLOW}`, '&:hover': { boxShadow: `0 0 25px ${ACCENT_GLOW}`, opacity: 0.9 }, '&:disabled': { color: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                      {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </Button>
                  </motion.div>

                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)', '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>O continúa con</Typography>
                  </Divider>

                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => console.log('Error al iniciar sesión con Google')}
                      theme="filled_black"
                      shape="pill"
                      size="large"
                      text="continue_with"
                      width="100%"
                    />
                  </Box>

                  <Typography variant="body2" textAlign="center" sx={{ color: 'rgba(255,255,255,0.7)', mt: 3 }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" style={{ color: ACCENT, fontWeight: 'bold' }}>Inicia sesión</Link>
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', p: 6, background: 'rgba(99,202,172,0.05)', borderLeft: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT_GLOW} 0%, transparent 70%)`, filter: 'blur(50px)', bottom: '20%', right: '10%' }} />
              <Box component="img" src={heroImage} alt="PC Hardware" sx={{ width: '100%', maxWidth: 320, height: 'auto', objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }} />
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