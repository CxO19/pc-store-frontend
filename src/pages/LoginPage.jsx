import { useThemeMode } from '../theme/ThemeModeContext'
import ComputerIcon from '@mui/icons-material/Computer'
import AuthLayout from '../components/AuthLayout'
import AuthCard from '../components/AuthCard'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  const { palette } = useThemeMode()

  return (
    <AuthLayout palette={palette}>
      <AuthCard
        palette={palette}
        icon={<ComputerIcon fontSize="large" sx={{ color: palette.accentContrast }} />}
        title="Bienvenido de nuevo"
        subtitle="Inicia sesión para continuar"
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  )
}
