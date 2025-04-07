"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  requireAuth?: boolean
  allowedRoles?: ("admin" | "verifier" | "user")[]
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title = "Dashboard",
  requireAuth = true,
  allowedRoles,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { authState } = useAuth()
  const { isAuthenticated, user, loading } = authState
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If authentication is required but the user is not authenticated, redirect to login
    if (requireAuth && !loading && !isAuthenticated) {
      router.push("/login")
    }

    // If specific roles are allowed and the user doesn't have one of those roles, redirect
    if (
      requireAuth &&
      !loading &&
      isAuthenticated &&
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.role as any)
    ) {
      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "verifier") {
        router.push("/verifier")
      } else {
        router.push("/dashboard")
      }
    }
  }, [requireAuth, isAuthenticated, loading, allowedRoles, user, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated, don't render the protected content
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Determine which role-based sidebar to show
  const sidebarRole = user?.role === "admin" ? "admin" : user?.role === "verifier" ? "verifier" : "user"

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless toggled */}
      <div
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen
          transform ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transition-transform duration-300 ease-in-out
        `}
      >
        <Sidebar role={sidebarRole} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header title={title} onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

