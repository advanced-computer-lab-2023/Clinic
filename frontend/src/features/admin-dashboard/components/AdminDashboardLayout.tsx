import { AuthenticatedRoute } from '@/components/AuthenticatedRoute'
import { useSidebar } from '@/hooks/sidebar'
import { UserType } from 'clinic-common/types/user.types'
import { PersonAdd, Discount } from '@mui/icons-material'
import { Container } from '@mui/material'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCapsules } from '@fortawesome/free-solid-svg-icons'

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
      // {
      //   to: '/admin-dashboard/add-admin',
      //   text: 'Add Admin',
      //   icon: <PersonAdd />,
      // },
      {
        to: '/admin-dashboard/users',
        text: 'Users',
        icon: <PersonIcon />,
      },
      {
        to: '/admin-dashboard/pharmacy',
        text: 'Your Pharmacy',
        icon:   <FontAwesomeIcon
        icon={faCapsules}
      />,
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
