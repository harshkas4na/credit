"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { IoDocumentTextOutline, IoDocumentAttachOutline } from "react-icons/io5"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/shared/stat-card"
import type { Loan } from "@/contexts/loan-context"
import { formatCurrency } from "@/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifierDashboardPage() {
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([])
  const [verifiedToday, setVerifiedToday] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    const fetchPendingLoans = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/verifier/pending-loans`)
        setPendingLoans(response.data.pendingLoans)
        setVerifiedToday(response.data.verifiedToday)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch pending loans")
        // Fallback to mock data if API fails
        setPendingLoans([
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
            _id: "5",
            userId: "user456",
            fullName: "Jane Smith",
            amount: 3500,
            purpose: "Medical expenses",
            employmentStatus: "Self-employed",
            employmentAddress: "456 Business Ave, Commerce Town",
            status: "pending",
            createdAt: "2025-04-02T14:30:00.000Z",
            updatedAt: "2025-04-02T14:30:00.000Z",
          },
        ] as Loan[])
        setVerifiedToday(3)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingLoans()
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
    <DashboardLayout title="Verifier Dashboard" allowedRoles={["verifier"]}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="PENDING VERIFICATION"
            value={pendingLoans.length}
            icon={<IoDocumentTextOutline size={20} />}
            className="bg-yellow-500"
          />
          <StatCard
            title="VERIFIED TODAY"
            value={verifiedToday}
            icon={<IoDocumentAttachOutline size={20} />}
            className="bg-green-500"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Loan Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center">{error}</div>
            ) : pendingLoans.length === 0 ? (
              <div className="text-gray-500 p-4 text-center">No pending loan applications to verify.</div>
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingLoans.map((loan) => (
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
                          <Link href={`/verifier/loans/${loan._id}`}>
                            <Button size="sm">Verify</Button>
                          </Link>
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

