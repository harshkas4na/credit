"use client"

import { useContext } from "react"
import { LoanContext } from "@/contexts/loan-context"

export const useLoan = () => {
  const context = useContext(LoanContext)
  if (context === undefined) {
    throw new Error("useLoan must be used within a LoanProvider")
  }
  return context
}

