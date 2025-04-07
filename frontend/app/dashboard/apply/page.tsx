"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormik } from "formik"
import * as Yup from "yup"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useLoan } from "@/hooks/use-loan"
import type { LoanApplication } from "@/contexts/loan-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoanApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { applyForLoan } = useLoan()
  const router = useRouter()

  // Form validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    amount: Yup.number()
      .required("Loan amount is required")
      .positive("Loan amount must be positive")
      .min(1000, "Minimum loan amount is $1,000"),
    purpose: Yup.string().required("Loan purpose is required"),
    employmentStatus: Yup.string().required("Employment status is required"),
    employmentAddress: Yup.string().required("Employment address is required"),
    loanTenure: Yup.number()
      .required("Loan tenure is required")
      .min(1, "Minimum tenure is 1 month")
      .max(60, "Maximum tenure is 60 months"),
  })

  // Initialize formik
  const formik = useFormik<LoanApplication & { loanTenure: number }>({
    initialValues: {
      fullName: "",
      amount: 0,
      purpose: "",
      employmentStatus: "",
      employmentAddress: "",
      loanTenure: 12,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      setError(null)

      try {
        await applyForLoan(values)
        // Redirect to loans page on success
        router.push("/dashboard/loans")
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to submit loan application")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <DashboardLayout title="Apply for Loan">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">APPLY FOR A LOAN</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name (as it appears on bank account)</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-sm text-red-500">{formik.errors.fullName}</p>
                  )}
                </div>

                {/* Loan Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">How much do you need?</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formik.values.amount || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <p className="text-sm text-red-500">{formik.errors.amount}</p>
                  )}
                </div>

                {/* Loan Tenure */}
                <div className="space-y-2">
                  <Label htmlFor="loanTenure">Loan tenure (in months)</Label>
                  <Input
                    id="loanTenure"
                    name="loanTenure"
                    type="number"
                    min={1}
                    max={60}
                    value={formik.values.loanTenure}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.loanTenure && formik.errors.loanTenure && (
                    <p className="text-sm text-red-500">{formik.errors.loanTenure}</p>
                  )}
                </div>

                {/* Employment Status */}
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment status</Label>
                  <Select
                    name="employmentStatus"
                    value={formik.values.employmentStatus}
                    onValueChange={(value) => formik.setFieldValue("employmentStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Self-employed">Self-employed</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.employmentStatus && formik.errors.employmentStatus && (
                    <p className="text-sm text-red-500">{formik.errors.employmentStatus}</p>
                  )}
                </div>

                {/* Loan Purpose */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="purpose">Reason for loan</Label>
                  <Textarea
                    id="purpose"
                    name="purpose"
                    rows={3}
                    value={formik.values.purpose}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.purpose && formik.errors.purpose && (
                    <p className="text-sm text-red-500">{formik.errors.purpose}</p>
                  )}
                </div>

                {/* Employment Address */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="employmentAddress">Employment address</Label>
                  <Input
                    id="employmentAddress"
                    name="employmentAddress"
                    value={formik.values.employmentAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.employmentAddress && formik.errors.employmentAddress && (
                    <p className="text-sm text-red-500">{formik.errors.employmentAddress}</p>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-600 mt-6 mb-4">
                <p>
                  I have read that important information contained within your Information and Disclosure Document and I
                  accept the terms.
                </p>
                <p className="mt-2">
                  Any personal or credit information obtained may be disclosed from time to to Credit Bro, credit
                  bureaus or debt collection agencies.
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <Button type="submit" disabled={isSubmitting} className="px-8">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

