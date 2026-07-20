import { Box, Typography } from '@mui/material'

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
        Dashboard
      </Typography>
      <Typography color="rgba(255,255,255,0.4)">
        Bienvenido al panel de control
      </Typography>
    </Box>
  )
}