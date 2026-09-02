import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, register, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !token) {
      // Optionally redirect handled by protected routes
    }
  }, [isAuthenticated, isLoading, token])

  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
    navigate('/', { replace: true })
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    await register(name, email, password)
    navigate('/', { replace: true })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}