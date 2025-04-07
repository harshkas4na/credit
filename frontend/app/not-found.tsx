import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-6xl font-bold text-primary mb-4">404</h2>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h3>
        <p className="text-gray-600 mb-6">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/" passHref>
          <Button>Go to Home</Button>
        </Link>
      </div>
    </div>
  )
}

