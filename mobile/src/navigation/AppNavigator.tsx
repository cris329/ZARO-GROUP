import React from 'react'
import { useAuthStore } from '@/store/authStore'
import { AuthNavigator } from './AuthNavigator'
import { MainNavigator } from './MainNavigator'

export function AppNavigator() {
  const { isAuthenticated } = useAuthStore()

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />
}