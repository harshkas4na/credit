"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { LoanProvider } from "@/contexts/loan-context"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <LoanProvider>{children}</LoanProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

