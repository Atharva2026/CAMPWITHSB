import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      entries,
      email,
      amount,
      clerkUserId,
      paymentMethod,
      deductionSource,
      passcode,
    } = await request.json()

    if (!email || !clerkUserId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify Razorpay signature if payment method is RAZORPAY
    if (paymentMethod === "RAZORPAY") {
      const sign = razorpay_order_id + "|" + razorpay_payment_id
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign.toString())
        .digest("hex")

      if (razorpay_signature !== expectedSign) {
        return NextResponse.json({ error: "Payment signature verification failed" }, { status: 401 })
      }
    }

    // Create registrations in database
    const registrations = await Promise.all(
      entries.map((entry: any) =>
        prisma.registration.create({
          data: {
            clerk_user_id: clerkUserId,
            email_id: email,
            poc_name: entry.pocName || null,
            poc_contact: entry.pocContact || null,
            voice_name: entry.voiceName || null,
            participant_name: entry.participantName,
            participant_type: entry.participantType,
            gender: entry.gender || "NA",
            whatsapp: entry.whatsapp || null,
            parent_temple: entry.parentTemple || null,
            counselor_name: entry.counselorName || null,
            camp_name: entry.campName,
            first_meal_date: Number.parseInt(entry.firstMealDate.split("-")[0]),
            first_meal_type: entry.firstMealType,
            last_meal_date: Number.parseInt(entry.lastMealDate.split("-")[0]),
            last_meal_type: entry.lastMealType,
            dinner_type: entry.dinnerType,
            accommodation: entry.accommodation,
            age: entry.age ? Number.parseInt(entry.age) : null,
            married_since_year: entry.marriedSinceYear ? Number.parseInt(entry.marriedSinceYear) : null,
            amount: entry.entryCost || 0,
            entry_cost: entry.entryCost || 0,
            payment_id: paymentMethod === "RAZORPAY" ? razorpay_payment_id : null,
            payment_method: paymentMethod,
            deduction_source: paymentMethod === "IDT" ? deductionSource : null,
            passcode: paymentMethod === "IDT" ? passcode : null,
            payment_status: "completed",
          },
        }),
      ),
    )

    // Create payment record
    await prisma.payment.create({
      data: {
        clerk_user_id: clerkUserId,
        razorpay_order_id: razorpay_order_id || null,
        razorpay_payment_id: razorpay_payment_id || null,
        razorpay_signature: razorpay_signature || null,
        amount: amount,
        payment_method: paymentMethod,
        payment_status: "completed",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified and registrations saved",
      registrations,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Payment verification failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
