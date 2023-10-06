import { AuthenticatedRoute } from '@/components/AuthenticatedRoute'
import { UserType } from '@/types/user.types'
import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function DoctorDashboardLayout() {
  return (
    <AuthenticatedRoute requiredUserType={UserType.Doctor}>
      <Container maxWidth="xs">
        <Outlet />
      </Container>
    </AuthenticatedRoute>
  )
}
