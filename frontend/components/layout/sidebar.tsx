"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  IoHomeOutline,
  IoBarChartOutline,
  IoDocumentTextOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoExitOutline,
  IoDocumentAttachOutline,
  IoWalletOutline,
  IoAddCircleOutline,
} from "react-icons/io5"
import { useAuth } from "@/hooks/use-auth"

interface SidebarProps {
  role?: "user" | "verifier" | "admin"
}

export const Sidebar: React.FC<SidebarProps> = ({ role = "user" }) => {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Define navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        path: role === "admin" ? "/admin" : role === "verifier" ? "/verifier" : "/dashboard",
        icon: <IoHomeOutline size={20} />,
      },
    ]

    if (role === "admin") {
      return [
        ...baseItems,
        {
          name: "All Loans",
          path: "/admin/loans",
          icon: <IoDocumentTextOutline size={20} />,
        },
        {
          name: "User Management",
          path: "/admin/users",
          icon: <IoPersonOutline size={20} />,
        },
        {
          name: "Report",
          path: "/admin/report",
          icon: <IoBarChartOutline size={20} />,
        },
        {
          name: "Settings",
          path: "/admin/settings",
          icon: <IoSettingsOutline size={20} />,
        },
      ]
    } else if (role === "verifier") {
      return [
        ...baseItems,
        {
          name: "Applications",
          path: "/verifier/loans",
          icon: <IoDocumentTextOutline size={20} />,
        },
        {
          name: "Verified Loans",
          path: "/verifier/verified",
          icon: <IoDocumentAttachOutline size={20} />,
        },
        {
          name: "Statistics",
          path: "/verifier/stats",
          icon: <IoBarChartOutline size={20} />,
        },
      ]
    } else {
      // Regular user
      return [
        ...baseItems,
        {
          name: "Apply for Loan",
          path: "/dashboard/apply",
          icon: <IoAddCircleOutline size={20} />,
        },
        {
          name: "My Loans",
          path: "/dashboard/loans",
          icon: <IoDocumentTextOutline size={20} />,
        },
        {
          name: "Payment",
          path: "/dashboard/payment",
          icon: <IoWalletOutline size={20} />,
        },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="sidebar w-64 flex flex-col">
      <div className="p-4 flex items-center gap-2 mb-8">
        <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
          <span className="text-primary font-bold text-lg">CS</span>
        </div>
        <span className="text-white font-semibold text-lg">CREDIT APP</span>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => (
          <Link key={item.name} href={item.path} className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}>
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto mb-6">
        <button onClick={logout} className="sidebar-item">
          <IoExitOutline size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

