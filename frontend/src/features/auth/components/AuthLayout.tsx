import { GuestRoute } from '@/components/GuestRoute'
import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <GuestRoute>
      <Container maxWidth="xs">
        <Outlet />
      </Container>
    </GuestRoute>
  )
}
