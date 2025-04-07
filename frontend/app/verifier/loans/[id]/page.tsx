"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import type { Loan } from "@/contexts/loan-context"
import { formatCurrency } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"

export default function VerifyLoanPage() {
  const params = useParams()
  const router = useRouter()
  const [loan, setLoan] = useState<Loan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/verifier/loans/${params.id}`)
        setLoan(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch loan details")
        // Fallback to mock data if API fails
        setLoan({
          _id: params.id as string,
          userId: "user123",
          fullName: "John Doe",
          amount: 2500,
          purpose: "Car repair",
          employmentStatus: "Employed",
          employmentAddress: "123 Work Street, Business City",
          status: "pending",
          createdAt: "2025-04-01T09:15:00.000Z",
          updatedAt: "2025-04-01T09:15:00.000Z",
        } as Loan)
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

  const handleVerify = async (approved: boolean) => {
    if (!loan) return

    try {
      setIsSubmitting(true)
      await axios.post(`${API_URL}/verifier/verify-loan`, {
        loanId: loan._id,
        status: approved ? "verified" : "rejected",
        notes: verificationNotes,
      })

      // Redirect back to verifier dashboard
      router.push("/verifier")
    } catch (error) {
      console.error("Failed to verify loan:", error)
      // Just redirect anyway for demo purposes
      router.push("/verifier")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout title="Verify Loan" allowedRoles={["verifier"]}>
      <div className="space-y-6">
        <Button variant="outline" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : loan ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Loan Application #{loan._id.substring(0, 8)}</CardTitle>
                <CardDescription>Submitted on {formatDate(loan.createdAt)}</CardDescription>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Decision</CardTitle>
                <CardDescription>Review the application details and make a verification decision</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Verification Notes</p>
                    <Textarea
                      placeholder="Add notes about your verification decision"
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleVerify(false)}
                  disabled={isSubmitting}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleVerify(true)}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="text-gray-500 p-4 text-center">Loan not found</div>
        )}
      </div>
    </DashboardLayout>
  )
}

