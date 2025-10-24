"use client"

import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Camp {
  id: string
  name: string
  dates: string
  description: string
  color: string
}

const camps: Camp[] = [
  {
    id: "nishtha-1",
    name: "Nishtha Camp 1",
    dates: "Dec 20 (AM) - Dec 24 (PM)",
    description: "For Utkarsh camp graduates & SRCGD — chanting 4+ rounds.",
    color: "from-amber-100 to-orange-100",
  },
  {
    id: "ashray-1",
    name: "Ashray Camp 1",
    dates: "Dec 20 (AM) - Dec 24 (PM)",
    description: "For Nishtha camp graduates — chanting 16 rounds.",
    color: "from-purple-100 to-pink-100",
  },
  {
    id: "nishtha-2",
    name: "Nishtha Camp 2",
    dates: "Dec 26 (AM) - Dec 30 (PM)",
    description: "Same criteria as Nishtha Camp 1.",
    color: "from-amber-100 to-orange-100",
  },
  {
    id: "ashray-2",
    name: "Ashray Camp 2",
    dates: "Dec 26 (AM) - Dec 30 (PM)",
    description: "Same criteria as Ashray Camp 1.",
    color: "from-purple-100 to-pink-100",
  },
]

const policyLinks = [
  { name: "About Us", href: "/events/about-us" },
  { name: "Contact Us", href: "/events/contact-us" },
  { name: "Privacy Policy", href: "/events/privacy-policy" },
  { name: "Terms & Conditions", href: "/events/terms-and-conditions" },
  { name: "Pricing Policy", href: "/events/pricing-policy" },
  { name: "Shipping Policy", href: "/events/shipping-policy" },
  { name: "Cancellation & Refund", href: "/events/cancellation-refund-policy" },
]

export default function CampRegistration() {
  const { isSignedIn } = useUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-orange-50 py-12 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block mb-4">
          <div className="text-6xl font-bold bg-gradient-to-r from-amber-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            ✨
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-purple-900 mb-2">Spiritual Camp</h1>
        <p className="text-xl text-purple-700 font-medium">Journey of Inner Awakening</p>
      </div>

      {/* Registration Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-4xl font-bold text-center text-purple-900 mb-12">Camp Registration</h2>

        {/* Camps Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {camps.map((camp) => (
            <Card
              key={camp.id}
              className={`bg-gradient-to-br ${camp.color} border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-8 rounded-2xl`}
            >
              <h3 className="text-2xl font-bold text-purple-900 mb-3">{camp.name}</h3>
              <p className="text-sm font-semibold text-amber-700 mb-4">{camp.dates}</p>
              <p className="text-gray-700 mb-6 leading-relaxed">{camp.description}</p>
              <Link href={isSignedIn ? "/register" : "/sign-in"}>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  {isSignedIn ? "Register Now" : "Sign In to Register"}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isSignedIn && (
            <>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="px-8 py-3 text-lg font-semibold border-2 border-purple-400 text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-300 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
          <h3 className="text-3xl font-bold text-center text-purple-900 mb-8">Important Information</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {policyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-center"
              >
                <span className="text-purple-900 font-semibold hover:text-amber-600 transition-colors">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 pt-8 border-t-2 border-purple-200">
        <h3 className="text-2xl font-bold text-purple-900 mb-4">Welcome to VOICE Pune</h3>
        <p className="text-purple-700 max-w-2xl mx-auto">
          Join our spiritual camps and embark on a journey of inner awakening and personal growth
        </p>
      </footer>
    </main>
  )
}
