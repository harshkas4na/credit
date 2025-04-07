import type React from "react"
import type { LoanStatus } from "@/contexts/loan-context"

interface LoanStatusBadgeProps {
  status: LoanStatus
}

export const LoanStatusBadge: React.FC<LoanStatusBadgeProps> = ({ status }) => {
  let badgeClass = ""
  const text = status.charAt(0).toUpperCase() + status.slice(1)

  switch (status) {
    case "pending":
      badgeClass = "bg-yellow-100 text-yellow-800"
      break
    case "verified":
      badgeClass = "bg-blue-100 text-blue-800"
      break
    case "approved":
      badgeClass = "bg-green-100 text-green-800"
      break
    case "rejected":
      badgeClass = "bg-red-100 text-red-800"
      break
    default:
      badgeClass = "bg-gray-100 text-gray-800"
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
      {text}
    </span>
  )
}

