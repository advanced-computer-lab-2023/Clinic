import { useAuth } from '@/hooks/auth'
import { UserType } from '@/types/user.types'

/**
 * A component that displays its children only if the user is authenticated.
 * @param requiredUserType If provided, the user must have this type to view the page.
 */
export function OnlyAuthenticated({
  children,
  requiredUserType,
}: React.PropsWithChildren<{
  requiredUserType?: UserType
}>) {
  const { user } = useAuth()

  if (!user || (requiredUserType && user.type !== requiredUserType)) {
    return
  }

  return children
}
