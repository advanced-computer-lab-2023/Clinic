import { GuestRoute } from '@/components/GuestRoute'
import { useSidebar } from '@/hooks/sidebar'
import { AppRegistrationRounded, Login } from '@mui/icons-material'
import { Container } from '@mui/material'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  const { setSidebarLinks } = useSidebar()

  useEffect(() => {
    setSidebarLinks([
      {
        to: '/auth/login',
        text: 'Login',
        icon: <Login />,
      },

      {
        to: '/auth/register',
        text: 'Register',
        icon: <AppRegistrationRounded />,
      },
    ])
  }, [setSidebarLinks])

  return (
    <GuestRoute>
      <Container maxWidth="xs">
        <Outlet />
      </Container>
    </GuestRoute>
  )
}
