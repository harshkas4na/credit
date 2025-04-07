"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifierStatsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVerified: 0,
    verifiedToday: 0,
    pendingVerification: 0,
    approvalRate: 0,
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/verifier/statistics`)
        setStats(response.data)
      } catch (error) {
        console.error("Failed to fetch statistics:", error)
        // Fallback to mock data if API fails
        setStats({
          totalVerified: 28,
          verifiedToday: 3,
          pendingVerification: 5,
          approvalRate: 85,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [API_URL])

  return (
    <DashboardLayout title="Verification Statistics" allowedRoles={["verifier"]}>
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVerified}</div>
                <p className="text-xs text-muted-foreground">Total loans you've verified</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.verifiedToday}</div>
                <p className="text-xs text-muted-foreground">Loans verified in the last 24 hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingVerification}</div>
                <p className="text-xs text-muted-foreground">Loans waiting for verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approvalRate}%</div>
                <p className="text-xs text-muted-foreground">Percentage of verified loans that get approved</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

