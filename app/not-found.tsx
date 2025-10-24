import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-900 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-purple-900 mb-4">Page Not Found</h2>
        <p className="text-purple-700 mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
