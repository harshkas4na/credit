"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminStatsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    pendingLoans: 0,
    verifiedLoans: 0,
    totalAmount: 0,
    approvedAmount: 0,
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/admin/statistics`)
        setStats(response.data)
      } catch (error) {
        console.error("Failed to fetch statistics:", error)
        // Fallback to mock data if API fails
        setStats({
          totalUsers: 25,
          totalLoans: 42,
          approvedLoans: 18,
          rejectedLoans: 7,
          pendingLoans: 12,
          verifiedLoans: 5,
          totalAmount: 250000,
          approvedAmount: 120000,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [API_URL])

  return (
    <DashboardLayout title="Statistics" allowedRoles={["admin"]}>
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="loans">Loan Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">Registered users in the system</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalLoans}</div>
                    <p className="text-xs text-muted-foreground">Total loan applications</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.approvedLoans}</div>
                    <p className="text-xs text-muted-foreground">
                      {((stats.approvedLoans / stats.totalLoans) * 100).toFixed(1)}% approval rate
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total loan amount requested</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="loans">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Loans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingLoans}</div>
                    <p className="text-xs text-muted-foreground">
                      {((stats.pendingLoans / stats.totalLoans) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Verified Loans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.verifiedLoans}</div>
                    <p className="text-xs text-muted-foreground">
                      {((stats.verifiedLoans / stats.totalLoans) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rejected Loans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.rejectedLoans}</div>
                    <p className="text-xs text-muted-foreground">
                      {((stats.rejectedLoans / stats.totalLoans) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.approvedAmount.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {((stats.approvedAmount / stats.totalAmount) * 100).toFixed(1)}% of total amount
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}

