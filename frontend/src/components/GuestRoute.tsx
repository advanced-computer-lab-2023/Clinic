import { useAuth } from '@/hooks/auth'
import { Navigate } from 'react-router-dom'

/**
 * A route that requires the user to be a guest (not authenticated).
 */
export function GuestRoute({ children }: React.PropsWithChildren) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" />
  }

  return children
}
