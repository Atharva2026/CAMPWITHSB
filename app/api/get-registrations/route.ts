import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const registrations = await prisma.registration.findMany({
      where: { clerk_user_id: userId },
      orderBy: { created_at: "desc" },
    })

    return NextResponse.json(registrations.map((reg) => ({
      ...reg,
      amount: parseFloat(reg.amount as any),
      entry_cost: parseFloat(reg.entry_cost as any),
    })))
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}
