"use client"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"

export default function FloatingNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn } = useUser()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events/about-us", label: "About Us" },
    { href: "/register", label: "Register" },
    { href: "/dash", label: "Dashboard" },
    { href: "/events/contact-us", label: "Contact" },
  ]

  return (
    <>
      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-4xl">
        <div className="bg-gradient-to-r from-amber-50 via-purple-50 to-orange-50 backdrop-blur-md rounded-full shadow-lg border border-amber-200/30 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                ✨
              </div>
              <span className="hidden sm:inline">Spiritual Camp</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {isSignedIn ? (
                <div className="py-2 px-3 w-full flex justify-start">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-full border-2 border-purple-300",
                      },
                    }}
                  />
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-amber-100 rounded-full transition-colors"
            >
              {isOpen ? <X className="w-5 h-5 text-amber-600" /> : <Menu className="w-5 h-5 text-amber-600" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-amber-200/30 flex flex-col gap-3 overflow-x-hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors py-2 px-3 rounded-lg hover:bg-amber-50"
                >
                  {link.label}
                </Link>
              ))}
              {isSignedIn ? (
                <div className="py-2 px-3">
                  <UserButton />
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors py-2 px-3 rounded-lg hover:bg-amber-50 w-full text-start"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-24" />
    </>
  )
}
