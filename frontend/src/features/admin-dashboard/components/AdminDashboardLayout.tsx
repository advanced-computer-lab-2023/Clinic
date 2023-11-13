import { AuthenticatedRoute } from '@/components/AuthenticatedRoute'
import { useSidebar } from '@/hooks/sidebar'
import { UserType } from 'clinic-common/types/user.types'
import { PersonAdd, Discount, VpnKey } from '@mui/icons-material'
import { Container } from '@mui/material'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'

export function AdminDashboardLayout() {
  const { setSidebarLinks } = useSidebar()

  useEffect(() => {
    setSidebarLinks([
      {
        to: '/admin-dashboard/pending-doctors',
        text: 'Pending Doctor Requests',
        icon: <PersonAdd />,
      },
      {
        to: '/admin-dashboard/health-packages',
        text: 'Health Packages',
        icon: <Discount />,
      },
      {
        to: '/admin-dashboard/add-admin',
        text: 'Add Admin',
        icon: <PersonAdd />,
      },
      {
        to: '/admin-dashboard/users',
        text: 'Users',
        icon: <PersonIcon />,
      },
      {
        to: '/admin-dashboard/change-password',
        text: 'Change Password',
        icon: <VpnKey />,
      },
    ])
  }, [setSidebarLinks])

  return (
    <AuthenticatedRoute requiredUserType={UserType.Admin}>
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </AuthenticatedRoute>
  )
}
