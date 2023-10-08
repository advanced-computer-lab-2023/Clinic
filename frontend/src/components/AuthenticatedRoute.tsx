import { useAuth } from '@/hooks/auth'
import { UserType } from '@/types/user.types'
import { Navigate } from 'react-router-dom'

/**
 * A route that requires authentication.
 * @param requiredUserType If provided, the user must have this type to view the route.
 */
export function AuthenticatedRoute({
  children,
  requiredUserType,
}: React.PropsWithChildren<{
  requiredUserType?: UserType
}>) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth/login" />
  }

  if (requiredUserType && user.type !== requiredUserType) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    )
  }

  return children
}
