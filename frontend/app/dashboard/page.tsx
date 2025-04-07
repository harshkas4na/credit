"use client"

import { useEffect } from "react"
import Link from "next/link"
import { IoCardOutline, IoWalletOutline } from "react-icons/io5"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/shared/stat-card"
import { LoanStatusBadge } from "@/components/loan/loan-status-badge"
import { useLoan } from "@/hooks/use-loan"
import { useAuth } from "@/hooks/use-auth"
import { formatCurrency } from "@/lib/formatters"

export default function UserDashboardPage() {
  const { userLoans, fetchUserLoans, loading, error } = useLoan()
  const { authState } = useAuth()
  const { user } = authState

  useEffect(() => {
    fetchUserLoans()
  }, [fetchUserLoans])

  // Sort loans by date, most recent first
  const sortedLoans = [...userLoans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Take only the first 5 loans
  const recentLoans = sortedLoans.slice(0, 5)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="ACTIVE LOANS"
            value={userLoans.filter((loan) => loan.status === "approved").length}
            icon={<IoCardOutline size={20} />}
          />
          <StatCard
            title="TOTAL BALANCE"
            value={formatCurrency(
              userLoans.filter((loan) => loan.status === "approved").reduce((sum, loan) => sum + loan.amount, 0),
            )}
            icon={<IoWalletOutline size={20} />}
            className="bg-blue-600"
          />
        </div>

        {/* Recent Loans */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Loans</h2>
            <Link href="/dashboard/apply" className="btn btn-primary">
              Apply for Loan
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">{error}</div>
          ) : recentLoans.length === 0 ? (
            <div className="text-gray-500 p-4 text-center">
              You haven't applied for any loans yet. Apply for one to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Full Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Purpose
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentLoans.map((loan) => (
                    <tr key={loan._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{loan.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(loan.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(loan.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <LoanStatusBadge status={loan.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {userLoans.length > 5 && (
            <div className="mt-4 text-right">
              <Link href="/dashboard/loans" className="text-primary hover:text-primary-dark text-sm font-medium">
                View all loans →
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

