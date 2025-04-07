"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InfoIcon } from "lucide-react"

export default function PaymentPage() {
  return (
    <DashboardLayout title="Payment">
      <div className="space-y-6">
        <Tabs defaultValue="payment" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment">Make a Payment</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
                <CardDescription>Pay your loan installment using your preferred payment method.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>No active payments due</AlertTitle>
                  <AlertDescription>
                    You don't have any payments due at this time. When you have an approved loan, payment options will
                    appear here.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select a loan</Label>
                    <select className="input-field" disabled>
                      <option>No active loans available</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment amount</Label>
                    <Input type="number" placeholder="0.00" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Payment method</Label>
                    <RadioGroup defaultValue="card" className="space-y-2">
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="card" id="card" disabled />
                        <Label htmlFor="card" className="flex-1">
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="bank" id="bank" disabled />
                        <Label htmlFor="bank" className="flex-1">
                          Bank Transfer
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button className="w-full" disabled>
                    Make Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all your previous payments and transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-gray-500 p-4 text-center">No payment history available.</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

