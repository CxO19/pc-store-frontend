import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, Avatar,
  TextField, Button, Grid, Divider, Chip, Container
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import { motion } from 'framer-motion'
import { useThemeMode } from '../../theme/ThemeModeContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const ACCENT = '#63CAAC'
const ACCENT_GLOW = 'rgba(99, 202, 172, 0.4)'

export default function ProfilePage() {
  const { palette } = useThemeMode()
  const isLight = palette.mode === 'light'

  const textColor = isLight ? '#1a1a1a' : '#ffffff'
  const textMuted = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}') }
    catch { return {} }
  })()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.patch(`/users/${user.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }))
      toast.success('Perfil actualizado correctamente')
    } catch {
      toast.error('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Encabezado Centrado */}
      <Box sx={{ mb: 5, textAlign: 'center', width: '100%', maxWidth: 700 }}>
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ color: textColor, letterSpacing: '-0.5px', mb: 1 }}>
            Mi Perfil
          </Typography>
          <Typography variant="body1" sx={{ color: textMuted }}>
            Gestiona tu información personal y mantén tu cuenta actualizada
          </Typography>
        </motion.div>
      </Box>

      {/* Contenedor Principal Centrado en Fila */}
      <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ width: '100%', maxWidth: 1100 }}>

        {/* Tarjeta de Información (Avatar y Rol) */}
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} style={{ height: '100%' }}>
            <Card sx={{
              height: '100%',
              backgroundColor: palette.paperBg,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${palette.paperBorder}`,
              borderRadius: 4,
              p: 3,
              boxShadow: isLight 
                ? '0 10px 30px rgba(0, 0, 0, 0.08)' 
                : '0 10px 30px -10px rgba(99, 202, 172, 0.15)',
              backgroundImage: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, p: '0 !important' }}>
                <Avatar sx={{ bgcolor: ACCENT, width: 90, height: 90, fontSize: 36, fontWeight: 'bold', color: '#1a1a1a', boxShadow: `0 0 20px ${ACCENT_GLOW}` }}>
                  {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="bold" sx={{ color: textColor, mb: 0.5 }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: textMuted, mb: 1.5 }}>
                    {user?.email}
                  </Typography>
                  <Chip
                    label={user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                    size="small"
                    sx={{
                      bgcolor: user?.role === 'admin' ? 'rgba(99,202,172,0.15)' : 'rgba(129,140,248,0.15)',
                      color: user?.role === 'admin' ? ACCENT : '#818cf8',
                      border: `1px solid ${user?.role === 'admin' ? ACCENT : '#818cf8'}`,
                      fontWeight: 'bold',
                    }}
                  />
                </Box>

                <Divider sx={{ width: '100%', borderColor: palette.paperBorder }} />

                <Box width="100%" display="flex" flexDirection="column" gap={1.5}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1.5}>
                    <PersonIcon sx={{ color: textMuted, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: textColor }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1.5}>
                    <EmailIcon sx={{ color: textMuted, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: textColor }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Formulario de Edición */}
        <Grid item xs={12} md={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ height: '100%' }}>
            <Card sx={{
              height: '100%',
              backgroundColor: palette.paperBg,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${palette.paperBorder}`,
              borderRadius: 4,
              boxShadow: isLight 
                ? '0 10px 30px rgba(0, 0, 0, 0.08)' 
                : '0 10px 30px -10px rgba(99, 202, 172, 0.15)',
              backgroundImage: 'none',
              backgroundImage: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <CardContent sx={{ p: 4, width: '100%' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: textColor, mb: 3 }}>
                  Editar Información
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2.5}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    sx={getInputStyle(isLight, textColor, textMuted, palette)}
                  />
                  
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    sx={getInputStyle(isLight, textColor, textMuted, palette)}
                  />
                  
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                    sx={getInputStyle(isLight, textColor, textMuted, palette)}
                  />

                  <Box display="flex" justifyContent="flex-start" mt={1}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        variant="outlined"
                        disabled={loading}
                        sx={{
                          borderRadius: 3,
                          color: ACCENT,
                          borderColor: ACCENT,
                          fontWeight: 'bold',
                          px: 4,
                          py: 1.2,
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: ACCENT,
                            boxShadow: isLight ? '0 5px 20px rgba(99,202,172,0.3)' : `0 0 20px ${ACCENT_GLOW}`,
                            background: 'rgba(99,202,172,0.1)',
                          }
                        }}
                      >
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

      </Grid>
    </Container>
  )
}

const getInputStyle = (isLight, textColor, textMuted, palette) => ({
  '& .MuiOutlinedInput-root': {
    color: textColor,
    borderRadius: 3,
    backgroundColor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
    '& fieldset': { borderColor: palette.paperBorder },
    '&:hover fieldset': { borderColor: '#63CAAC' },
    '&.Mui-focused fieldset': { borderColor: '#63CAAC', borderWidth: 2 },
    '&.Mui-disabled': { color: textMuted },
  },
  '& .MuiInputLabel-root': { color: textMuted },
  '& .MuiInputLabel-root.Mui-focused': { color: '#63CAAC' },
})