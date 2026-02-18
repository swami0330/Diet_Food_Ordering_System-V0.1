"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import apiClient from "./api"

interface User {
  id: string
  email: string
  name: string
  phone?: string
  age?: number
  weight?: number
  height?: number
  gender?: "male" | "female" | "other"
  healthConditions?: string[]
  dietPreferences?: string[]
  allergies?: string[]
  goalType?: "weight-loss" | "muscle-gain" | "maintenance" | "diabetic-control"
  targetCalories?: number
  targetProtein?: number
  targetCarbs?: number
  targetFats?: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          apiClient.setToken(token)
          const response = await apiClient.getProfile()
          if (response.data?.user) {
            setUser(response.data.user)
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // Clear invalid token
        apiClient.clearToken()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      if (response.data?.user) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.register(email, password, name)
      if (response.data?.user) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await apiClient.updateProfile(data)
      if (response.data?.user) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  const refreshProfile = async () => {
    try {
      const response = await apiClient.getProfile()
      if (response.data?.user) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Profile refresh failed:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext