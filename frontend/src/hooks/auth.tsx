import { AuthContext } from '@/providers/AuthProvider'
import { useContext } from 'react'

export function useAuth() {
  return useContext(AuthContext)
}
