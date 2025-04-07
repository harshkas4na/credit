"use client"

import type React from "react"

import { IoNotificationsOutline, IoPersonCircleOutline, IoMenuOutline } from "react-icons/io5"
import { useAuth } from "@/hooks/use-auth"

interface HeaderProps {
  title?: string
  onToggleSidebar?: () => void
}

export const Header: React.FC<HeaderProps> = ({ title = "Dashboard", onToggleSidebar }) => {
  const { authState } = useAuth()
  const { user } = authState

  return (
    <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center">
        {onToggleSidebar && (
          <button onClick={onToggleSidebar} className="mr-4 md:hidden">
            <IoMenuOutline size={24} />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-900">
          <IoNotificationsOutline size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <IoPersonCircleOutline size={20} />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-700">{user?.username || "User"}</div>
            <div className="text-xs text-gray-500">{user?.role || "User"}</div>
          </div>
        </div>
      </div>
    </header>
  )
}

