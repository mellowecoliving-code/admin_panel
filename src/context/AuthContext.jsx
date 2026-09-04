import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi
      .getMe()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (data) => {
    const loggedInAdmin = await authApi.login(data)
    setAdmin(loggedInAdmin)
    return loggedInAdmin
  }

  const logout = async () => {
    await authApi.logout()
    setAdmin(null)
  }

  const value = { admin, setAdmin, loading, isAuthenticated: Boolean(admin), login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
