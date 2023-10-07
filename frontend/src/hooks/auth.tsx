import { AuthContext } from '@/providers/AuthProvider'
import { useContext } from 'react'

/**
 * Used for accessing authentication helper methods.
 *
 * The helper methods available are:
 * - `user` - The currently logged in user.
 * - `refreshUser` - Refresh the current user (used in login for example to fetch the user after login)
 * - `logout` - Logs the user out
 */
export function useAuth() {
  return useContext(AuthContext)
}
