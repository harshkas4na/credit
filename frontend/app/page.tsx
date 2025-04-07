"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const router = useRouter()
  const { authState } = useAuth()
  const { isAuthenticated, user, loading } = authState

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirect based on role
        if (user.role === "admin") {
          router.replace("/admin")
        } else if (user.role === "verifier") {
          router.replace("/verifier")
        } else {
          router.replace("/dashboard")
        }
      } else {
        // Not authenticated, redirect to login
        router.replace("/login")
      }
    }
  }, [isAuthenticated, user, loading, router])

  // Show a loading indicator while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

