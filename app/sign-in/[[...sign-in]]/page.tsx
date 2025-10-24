import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-purple-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-amber-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-purple-600">
            Or{" "}
            <a href="/sign-up" className="font-medium text-purple-700 hover:text-purple-900">
              create a new account
            </a>
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn
            afterSignInUrl="/dash"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-sm normal-case",
                card: "shadow-lg border-2 border-purple-200",
                headerTitle: "text-purple-900",
                headerSubtitle: "text-purple-600",
                socialButtonsBlockButton: "border-2 border-purple-200 hover:bg-purple-50",
                socialButtonsBlockButtonText: "font-normal text-purple-900",
                formFieldInput: "border-2 border-purple-200 rounded-md bg-white text-purple-900",
                footerActionLink: "text-purple-700 hover:text-purple-900",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
