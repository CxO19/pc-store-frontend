import { Box, Avatar, Typography, Paper, Container, Grow, Zoom } from '@mui/material'

export default function AuthCard({ palette, icon, title, subtitle, children }) {
  return (
    <Box sx={{
      flex: { xs: 1, md: '0 0 420px' },
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container maxWidth="xs" disableGutters>
        <Grow in timeout={700}>
          <Paper elevation={0} sx={{
            position: 'relative',
            padding: 4,
            paddingTop: 4.5,
            borderRadius: 5,
            background: palette.paperBg,
            backdropFilter: 'blur(24px)',
            border: `1px solid ${palette.paperBorder}`,
            boxShadow: `${palette.paperShadow}, 0 0 40px -10px ${palette.accentGlow}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 5,
              background: palette.accentGradient,
            }} />

            {/* Brillo diagonal tipo vidrio, sutil */}
            <Box sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 68%)',
              pointerEvents: 'none',
            }} />

            <Zoom in style={{ transitionDelay: '150ms' }}>
              <Avatar sx={{
                m: 1, bgcolor: palette.accent, width: 64, height: 64,
                animation: 'authPulseGlow 2.5s ease-in-out infinite',
                '@keyframes authPulseGlow': {
                  '0%, 100%': { boxShadow: `0 0 20px ${palette.accentGlow}` },
                  '50%': { boxShadow: `0 0 40px ${palette.accentGlow}` },
                },
              }}>
                {icon}
              </Avatar>
            </Zoom>

            <Typography variant="h4" sx={{ color: palette.textPrimary, fontWeight: 800, mb: 0.5, textShadow: `0 0 20px ${palette.accentGlow}` }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: palette.textSecondary, fontWeight: 600, mb: 3 }}>
              {subtitle}
            </Typography>

            {children}
          </Paper>
        </Grow>
      </Container>
    </Box>
  )
}
