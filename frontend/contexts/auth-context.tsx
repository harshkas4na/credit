"use client"

import type React from "react"
import { createContext, useCallback, useEffect, useState } from "react"
import axios from "axios"

// Define types
export interface User {
  _id: string
  username: string
  email: string
  role: "user" | "verifier" | "admin"
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

interface AuthContextType {
  authState: AuthState
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  })

  // Check if user is already logged in (on mount and when token changes)
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        })
        return
      }

      // Set auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Verify token and get user data
      const response = await axios.get(`${API_URL}/auth/me`)

      setAuthState({
        isAuthenticated: true,
        user: response.data,
        loading: false,
        error: null,
      })
    } catch (error) {
      localStorage.removeItem("token")
      delete axios.defaults.headers.common["Authorization"]

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      })
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await axios.post(`${API_URL}/auth/login`, credentials)
      const { token, user } = response.data

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || "Login failed. Please try again.",
      }))
    }
  }

  // Register function
  const register = async (data: RegisterData) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await axios.post(`${API_URL}/auth/register`, data)
      const { token, user } = response.data

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || "Registration failed. Please try again.",
      }))
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]

    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    })
  }

  return <AuthContext.Provider value={{ authState, login, register, logout }}>{children}</AuthContext.Provider>
}

