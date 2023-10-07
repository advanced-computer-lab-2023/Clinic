import { AuthenticatedRoute } from '@/components/AuthenticatedRoute'
import { useSidebar } from '@/hooks/sidebar'
import { UserType } from '@/types/user.types'
import { Person } from '@mui/icons-material'
import Container from '@mui/material/Container'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export function DoctorDashboardLayout() {
  const { setSidebarLinks } = useSidebar()

  useEffect(() => {
    setSidebarLinks([
      {
        to: '/doctor-dashboard/profile',
        text: 'Update Details',
        icon: <Person />,
      },
    ])
  }, [setSidebarLinks])

  return (
    <AuthenticatedRoute requiredUserType={UserType.Doctor}>
      <Container maxWidth="xs">
        <Outlet />
      </Container>
    </AuthenticatedRoute>
  )
}
