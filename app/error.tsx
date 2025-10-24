"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-4">Something went wrong!</h2>
        <p className="text-purple-700 mb-8">{error.message}</p>
        <Button
          onClick={() => reset()}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}
