"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle>Error Loading Dashboard</CardTitle>
          </div>
          <CardDescription>There was a problem loading the dashboard content.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            This could be due to a network issue or a temporary server problem. You can try again or contact support if
            the issue persists.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

