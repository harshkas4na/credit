"use client"

import type React from "react"
import { createContext, useCallback, useState } from "react"
import axios from "axios"

// Define types for loans
export type LoanStatus = "pending" | "verified" | "approved" | "rejected"

export interface LoanApplication {
  fullName: string
  amount: number
  purpose: string
  employmentStatus: string
  employmentAddress: string
  loanTenure?: number
}

export interface Loan extends LoanApplication {
  _id: string
  userId: string
  status: LoanStatus
  createdAt: string
  updatedAt: string
}

interface LoanContextType {
  userLoans: Loan[]
  loading: boolean
  error: string | null
  fetchUserLoans: () => Promise<void>
  applyForLoan: (application: LoanApplication) => Promise<void>
}

// Create the context
export const LoanContext = createContext<LoanContextType | undefined>(undefined)

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Provider component
export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLoans, setUserLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user loans
  const fetchUserLoans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(`${API_URL}/loans/user`)
      setUserLoans(response.data)
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch loans")
    } finally {
      setLoading(false)
    }
  }, [])

  // Apply for a loan
  const applyForLoan = async (application: LoanApplication) => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post(`${API_URL}/loans/apply`, application)

      // Add the new loan to the loans state
      setUserLoans((prev) => [...prev, response.data])

      return response.data
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to apply for loan")
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoanContext.Provider
      value={{
        userLoans,
        loading,
        error,
        fetchUserLoans,
        applyForLoan,
      }}
    >
      {children}
    </LoanContext.Provider>
  )
}

