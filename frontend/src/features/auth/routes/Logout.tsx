import { AuthenticatedRoute } from '@/components/AuthenticatedRoute'
import { useAuth } from '@/hooks/auth'
import { useEffect } from 'react'

export const Logout = () => {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
  }, [logout])

  return (
    <AuthenticatedRoute>
      <div>Logging out...</div>
    </AuthenticatedRoute>
  )
}
