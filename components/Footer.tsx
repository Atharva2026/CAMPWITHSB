import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-md text-purple-900 py-12 rounded-t-3xl shadow-lg shadow-purple-200/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        <div className="col-span-full md:col-span-2 flex flex-col items-center md:items-start">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent">
            VOICE Pune
          </h3>
          <p className="text-purple-700 leading-relaxed mb-4 max-w-sm">
            Join our spiritual camps and embark on a journey of inner awakening and personal growth.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-purple-700 hover:text-orange-400 transition-colors duration-200">
              {/* Replace with actual social media icons */}
              Facebook
            </Link>
            <Link href="#" className="text-purple-700 hover:text-orange-400 transition-colors duration-200">
              Twitter
            </Link>
            <Link href="#" className="text-purple-700 hover:text-orange-400 transition-colors duration-200">
              Instagram
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <h4 className="text-xl font-semibold text-purple-800 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/events/about-us" className="text-purple-700 hover:text-orange-400 transition-colors duration-200">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/events/contact-us" className="text-purple-700 hover:text-orange-400 transition-colors duration-200">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-purple-700 hover:text-orange-400 transition-colors duration-200">
                Register for Camp
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start">
          <h4 className="text-xl font-semibold text-purple-800 mb-4">Policies</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/events/privacy-policy" className="text-purple-700 hover:text-orange-400 transition-colors duration-200">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/events/terms-and-conditions" className="text-purple-700 hover:text-orange-400 transition-colors duration-200">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/events/cancellation-refund-policy" className="text-purple-700 hover:text-orange-400 transition-colors duration-200">
                Cancellation & Refund
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center border-t border-purple-300/40 mt-8 pt-8 px-4">
        <p className="text-purple-600">
          &copy; {new Date().getFullYear()} VOICE Pune. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
