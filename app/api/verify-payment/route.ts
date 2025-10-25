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
            poc_contact: entry.pocContact ? String(entry.pocContact) : null, // Ensure string conversion
            voice_name: entry.voiceName || null,
            participant_name: entry.participantName,
            participant_type: entry.participantType || null,
            gender: entry.gender || "NA",
            whatsapp: entry.whatsapp ? String(entry.whatsapp) : null, // Ensure string conversion
            parent_temple: entry.parentTemple || null,
            counselor_name: entry.counselorName || null,
            camp_name: entry.campName,
            first_meal_date: entry.firstMealDate ? Number.parseInt(String(entry.firstMealDate).split("-")[0]) : null, // Ensure string then int conversion
            first_meal_type: entry.firstMealType || null,
            last_meal_date: entry.lastMealDate ? Number.parseInt(String(entry.lastMealDate).split("-")[0]) : null, // Ensure string then int conversion
            last_meal_type: entry.lastMealType || null,
            dinner_type: entry.dinnerType || null,
            accommodation: entry.accommodation || null,
            age: entry.age ? Number.parseInt(String(entry.age)) : null, // Ensure string then int conversion
            married_since_year: entry.marriedSinceYear ? Number.parseInt(String(entry.marriedSinceYear)) : null, // Ensure string then int conversion
            amount: parseFloat(entry.entryCost) || 0,
            entry_cost: parseFloat(entry.entryCost) || 0,
            payment_id: paymentMethod === "RAZORPAY" ? razorpay_payment_id : null,
            payment_method: paymentMethod,
            deduction_source: paymentMethod === "IDT" ? deductionSource || null : null,
            passcode: paymentMethod === "IDT" ? passcode || null : null,
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
        amount: parseFloat(amount as any),
        payment_method: paymentMethod,
        payment_status: "completed", // Ensure status is set correctly
      },
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified and registrations saved",
      registrations: registrations.map((reg) => ({
        ...reg,
        amount: parseFloat(reg.amount as any), // Convert Decimal to float
        entry_cost: parseFloat(reg.entry_cost as any), // Convert Decimal to float
      })),
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Payment verification failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
