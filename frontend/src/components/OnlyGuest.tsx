import { useAuth } from '@/hooks/auth'
import { UserType } from 'clinic-common/types/user.types'

/**
 * A component that displays its children only if the user is not authenticated.
 */
export function OnlyAuthenticated({
  children,
}: React.PropsWithChildren<{
  requiredUserType?: UserType
}>) {
  const { user } = useAuth()

  if (user) {
    return
  }

  return children
}
