import { useAuth } from '@/hooks/auth'
import { UserType } from 'clinic-common/types/user.types'
import { Navigate } from 'react-router-dom'

export function RedirectToDashboard() {
  const { user } = useAuth()

  switch (user?.type) {
    case UserType.Admin:
      return <Navigate to="/admin-dashboard" />

    case UserType.Doctor:
      return <Navigate to="/doctor-dashboard" />

    case UserType.Patient:
      return <Navigate to="/patient-dashboard" />

    default:
      return <Navigate to="/auth/login" />
  }
}
