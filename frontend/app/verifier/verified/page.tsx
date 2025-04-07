"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { Loan } from "@/contexts/loan-context"
import { LoanStatusBadge } from "@/components/loan/loan-status-badge"
import { formatCurrency } from "@/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifiedLoansPage() {
  const [verifiedLoans, setVerifiedLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    const fetchVerifiedLoans = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/verifier/verified-loans`)
        setVerifiedLoans(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch verified loans")
        // Fallback to mock data if API fails
        setVerifiedLoans([
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
            _id: "6",
            userId: "user789",
            fullName: "Robert Johnson",
            amount: 7500,
            purpose: "Home renovation",
            employmentStatus: "Employed",
            employmentAddress: "789 Corporate Blvd, Metro City",
            status: "verified",
            createdAt: "2025-03-10T16:45:00.000Z",
            updatedAt: "2025-03-11T09:20:00.000Z",
          },
        ] as Loan[])
      } finally {
        setLoading(false)
      }
    }

    fetchVerifiedLoans()
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

  return (
    <DashboardLayout title="Verified Loans" allowedRoles={["verifier"]}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loans You've Verified</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center">{error}</div>
            ) : verifiedLoans.length === 0 ? (
              <div className="text-gray-500 p-4 text-center">You haven't verified any loans yet.</div>
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
                        Verified Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Current Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {verifiedLoans.map((loan) => (
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
                          {formatDate(loan.updatedAt)}
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

