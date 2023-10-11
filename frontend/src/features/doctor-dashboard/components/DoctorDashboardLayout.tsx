import { AuthenticatedRoute } from '@/components/AuthenticatedRoute'
import { useSidebar } from '@/hooks/sidebar'
import { UserType } from 'clinic-common/types/user.types'
import { Person } from '@mui/icons-material'
import Container from '@mui/material/Container'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

export function DoctorDashboardLayout() {
  const { setSidebarLinks } = useSidebar()

  useEffect(() => {
    setSidebarLinks([
      {
        to: '/doctor-dashboard/profile',
        text: 'Update Details',
        icon: <Person />,
      },
      {
        to: '/doctor-dashboard/appointments',
        text: 'Appoitments',
        icon: <AccessTimeIcon />,
      },{
        to: '/doctor-dashboard/view-patients',
        text: 'View Patients',
        icon: <Person />,
      }
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
