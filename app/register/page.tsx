import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import RegistrationForm from "@/components/registration-form"

export default async function RegisterPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return <RegistrationForm />
}
