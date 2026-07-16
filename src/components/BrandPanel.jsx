import { Box, Avatar, Typography, Grow } from '@mui/material'
import ComputerIcon from '@mui/icons-material/Computer'
import MemoryIcon from '@mui/icons-material/Memory'
import BoltIcon from '@mui/icons-material/Bolt'

export default function BrandPanel({ palette }) {
  return (
    <Box sx={{
      display: { xs: 'none', md: 'flex' },
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 3,
    }}>
      <Grow in timeout={700}>
        <Box sx={{
          background: palette.mode === 'dark' ? 'rgba(30,34,42,0.45)' : 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${palette.paperBorder}`,
          borderRadius: 5,
          p: 4,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ bgcolor: palette.accent, width: 48, height: 48 }}>
              <ComputerIcon sx={{ color: palette.accentContrast }} />
            </Avatar>
            <Typography variant="h5" sx={{ color: palette.textPrimary, fontWeight: 'bold' }}>
              PC Store
            </Typography>
          </Box>
          <Typography variant="h3" sx={{
            color: palette.textPrimary,
            fontWeight: 900,
            maxWidth: 480,
            lineHeight: 1.15,
            mb: 2,
            textShadow: `0 0 30px ${palette.accentGlow}`,
          }}>
            Arma el PC de tus <Box component="span" sx={{ color: palette.accent, textShadow: `0 0 24px ${palette.accentGlow}` }}>sueños</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: palette.textSecondary, fontWeight: 500, maxWidth: 420, mb: 3 }}>
            Componentes originales, precios claros y el mejor soporte para tu próximo build.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MemoryIcon sx={{ color: palette.accent }} />
              <Typography variant="body2" sx={{ color: palette.textSecondary, fontWeight: 600 }}>Hardware certificado</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltIcon sx={{ color: palette.accent }} />
              <Typography variant="body2" sx={{ color: palette.textSecondary, fontWeight: 600 }}>Envíos rápidos</Typography>
            </Box>
          </Box>
        </Box>
      </Grow>
    </Box>
  )
}
