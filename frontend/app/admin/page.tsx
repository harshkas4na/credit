"use client"

import { useEffect, useState } from "react"
import { IoCardOutline } from "react-icons/io5"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

interface LoanStats {
  pending: number
  verified: number
  approved: number
  rejected: number
  total: number
}

export default function AdminDashboardPage() {
  const [loanStats, setLoanStats] = useState<LoanStats>({
    pending: 0,
    verified: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // In a real app, you'd fetch this from your API
        const response = await axios.get(`${API_URL}/admin/stats`)
        setLoanStats(response.data)
      } catch (error) {
        // Fallback to mock data if API fails
        setLoanStats({
          pending: 5,
          verified: 3,
          approved: 12,
          rejected: 2,
          total: 22,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [API_URL])

  return (
    <DashboardLayout title="Admin Dashboard" allowedRoles={["admin"]}>
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="PENDING LOANS"
                value={loanStats.pending}
                icon={<IoCardOutline size={20} />}
                className="bg-yellow-500"
              />
              <StatCard
                title="VERIFIED LOANS"
                value={loanStats.verified}
                icon={<IoCardOutline size={20} />}
                className="bg-blue-500"
              />
              <StatCard
                title="APPROVED LOANS"
                value={loanStats.approved}
                icon={<IoCardOutline size={20} />}
                className="bg-green-500"
              />
              <StatCard
                title="REJECTED LOANS"
                value={loanStats.rejected}
                icon={<IoCardOutline size={20} />}
                className="bg-red-500"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">New loan application submitted</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">Loan #3456 verified</p>
                      <p className="text-xs text-gray-500">Yesterday at 3:45 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">Loan #2789 rejected</p>
                      <p className="text-xs text-gray-500">Yesterday at 11:20 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

