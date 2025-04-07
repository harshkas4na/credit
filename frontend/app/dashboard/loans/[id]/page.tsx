"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { Loan } from "@/contexts/loan-context"
import { LoanStatusBadge } from "@/components/loan/loan-status-badge"
import { formatCurrency } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"

export default function LoanDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [loan, setLoan] = useState<Loan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/loans/${params.id}`)
        setLoan(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch loan details")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchLoanDetails()
    }
  }, [params.id, API_URL])

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
    <DashboardLayout title="Loan Details">
      <div className="space-y-6">
        <Button variant="outline" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loans
        </Button>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : loan ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Loan #{loan._id.substring(0, 8)}</CardTitle>
                  <CardDescription>Applied on {formatDate(loan.createdAt)}</CardDescription>
                </div>
                <LoanStatusBadge status={loan.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Loan Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-semibold">{formatCurrency(loan.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Purpose</p>
                      <p>{loan.purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <LoanStatusBadge status={loan.status} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Applicant Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p>{loan.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employment Status</p>
                      <p>{loan.employmentStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employment Address</p>
                      <p>{loan.employmentAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-semibold mb-4">Loan Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-0.5 h-full bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="font-medium">Application Submitted</p>
                      <p className="text-sm text-gray-500">{formatDate(loan.createdAt)}</p>
                    </div>
                  </div>

                  {loan.status !== "pending" && (
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="font-medium">Application Verified</p>
                        <p className="text-sm text-gray-500">{formatDate(loan.updatedAt)}</p>
                      </div>
                    </div>
                  )}

                  {(loan.status === "approved" || loan.status === "rejected") && (
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div
                          className={`w-3 h-3 ${
                            loan.status === "approved" ? "bg-green-500" : "bg-red-500"
                          } rounded-full`}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium">
                          Application {loan.status === "approved" ? "Approved" : "Rejected"}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(loan.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {loan.status === "approved" && (
                <Button onClick={() => router.push("/dashboard/payment")}>Make a Payment</Button>
              )}
              {loan.status === "rejected" && (
                <Button onClick={() => router.push("/dashboard/apply")}>Apply Again</Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <div className="text-gray-500 p-4 text-center">Loan not found</div>
        )}
      </div>
    </DashboardLayout>
  )
}

