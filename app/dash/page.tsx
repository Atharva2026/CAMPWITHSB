import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const registrations = await prisma.registration.findMany({
    where: { clerk_user_id: userId },
    orderBy: { created_at: "desc" },
  })

  const totalCost = registrations.reduce((sum, reg) => sum + Number(reg.amount || 0), 0)

  return <DashboardClient registrations={registrations} totalCost={totalCost} />
}
