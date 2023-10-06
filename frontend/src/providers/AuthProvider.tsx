import { getCurrentUser } from '@/api/auth'
import { UserType } from '@/types/user.types'
import { createContext, useEffect, useState } from 'react'

interface AuthContextUser {
  type: UserType
  username: string
}

interface AuthContextData {
  user?: AuthContextUser
  refreshUser: () => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextUser | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    refreshUser()
  }, [])

  const refreshUser = async () => {
    setLoading(true)
    setUser(await getCurrentUser())
    setLoading(false)
  }

  const logout = async () => {
    setUser(undefined)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, refreshUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
