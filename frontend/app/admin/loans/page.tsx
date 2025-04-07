"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { Loan, LoanStatus } from "@/contexts/loan-context"
import { LoanStatusBadge } from "@/components/loan/loan-status-badge"
import { formatCurrency } from "@/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/admin/loans`)
        setLoans(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch loans")
        // Fallback to mock data if API fails
        setLoans([
          {
            _id: "1",
            userId: "user123",
            fullName: "John Doe",
            amount: 5000,
            purpose: "Home renovation",
            employmentStatus: "Employed",
            employmentAddress: "123 Work Street, Business City",
            status: "approved",
            createdAt: "2025-03-15T10:30:00.000Z",
            updatedAt: "2025-03-17T14:45:00.000Z",
          },
          {
            _id: "2",
            userId: "user123",
            fullName: "John Doe",
            amount: 2500,
            purpose: "Car repair",
            employmentStatus: "Employed",
            employmentAddress: "123 Work Street, Business City",
            status: "pending",
            createdAt: "2025-04-01T09:15:00.000Z",
            updatedAt: "2025-04-01T09:15:00.000Z",
          },
          {
            _id: "3",
            userId: "user123",
            fullName: "John Doe",
            amount: 10000,
            purpose: "Education",
            employmentStatus: "Employed",
            employmentAddress: "123 Work Street, Business City",
            status: "verified",
            createdAt: "2025-02-05T08:20:00.000Z",
            updatedAt: "2025-02-06T11:30:00.000Z",
          },
          {
            _id: "4",
            userId: "user123",
            fullName: "John Doe",
            amount: 1500,
            purpose: "Debt consolidation",
            employmentStatus: "Employed",
            employmentAddress: "123 Work Street, Business City",
            status: "rejected",
            createdAt: "2025-01-10T14:00:00.000Z",
            updatedAt: "2025-01-12T09:45:00.000Z",
          },
        ] as Loan[])
      } finally {
        setLoading(false)
      }
    }

    fetchLoans()
  }, [API_URL])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle status update
  const handleStatusUpdate = async (loanId: string, newStatus: LoanStatus) => {
    try {
      await axios.put(`${API_URL}/admin/loans/${loanId}/status`, { status: newStatus })

      // Update local state
      const updatedLoans = loans.map((loan) => (loan._id === loanId ? { ...loan, status: newStatus } : loan))
      setLoans(updatedLoans)
    } catch (error) {
      console.error("Failed to update loan status:", error)
      // Fallback to just updating UI if API fails
      const updatedLoans = loans.map((loan) => (loan._id === loanId ? { ...loan, status: newStatus } : loan))
      setLoans(updatedLoans)
    }
  }

  return (
    <DashboardLayout title="All Loans" allowedRoles={["admin"]}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Loans</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
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
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loans.map((loan) => (
                      <tr key={loan._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {loan._id.substring(0, 8)}...
                        </td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Link href={`/admin/loans/${loan._id}`} className="text-primary hover:text-primary-dark">
                              View
                            </Link>
                            <Select
                              value={loan.status}
                              onValueChange={(value) => handleStatusUpdate(loan._id, value as LoanStatus)}
                            >
                              <SelectTrigger className="w-[130px] h-7 text-xs">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

