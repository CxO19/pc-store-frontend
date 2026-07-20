import { useThemeMode } from '../theme/ThemeModeContext'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AuthLayout from '../components/AuthLayout'
import AuthCard from '../components/AuthCard'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  const { palette } = useThemeMode()

  return (
    <AuthLayout palette={palette}>
      <AuthCard
        palette={palette}
        icon={<PersonAddIcon fontSize="large" sx={{ color: palette.accentContrast }} />}
        title="Crear cuenta"
        subtitle="Únete a PC Store"
      >
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  )
}
