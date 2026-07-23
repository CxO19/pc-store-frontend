import { Box, Typography, Container } from '@mui/material'
import ComputerIcon from '@mui/icons-material/Computer'
import { useThemeMode } from '../theme/ThemeModeContext'

const ACCENT = '#63CAAC'

export default function Footer() {
  const { palette } = useThemeMode()

  return (
    <Box component="footer" sx={{ mt: 'auto' }}>
      <Box sx={{ height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT}50, ${ACCENT}, ${ACCENT}50, transparent)` }} />
      <Box sx={{ py: 2.5, borderTop: `1px solid ${palette.paperBorder}` }}>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} flexWrap="wrap">
            <ComputerIcon sx={{ color: ACCENT, fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: palette.textSecondary, fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} PC Store — Todos los derechos reservados
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
