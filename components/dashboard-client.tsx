"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Registration {
  id: number
  participant_name: string
  age: number | null
  counselor_name: string | null
  first_meal_date: number | null
  first_meal_type: string | null
  last_meal_date: number | null
  last_meal_type: string | null
  camp_name: string
  accommodation: string | null
  amount: number
  email_id: string
  whatsapp: string | null
  parent_temple: string | null
  voice_name: string | null
  participant_type: string | null
  dinner_type: string | null
  poc_name: string | null
  poc_contact: string | null
  payment_status: string
  created_at: Date
}

export default function DashboardClient({
  registrations,
  totalCost,
}: {
  registrations: Registration[]
  totalCost: number
}) {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-900 mb-2">Your Registrations</h1>
          <p className="text-xl text-purple-700">View all your camp registrations</p>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-6 rounded-lg"
          >
            ← Back to Camps
          </Button>
        </div>

        {registrations.length === 0 ? (
          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-purple-200 p-12 text-center rounded-2xl">
            <p className="text-purple-900 text-lg font-semibold mb-4">No registrations yet</p>
            <p className="text-purple-700 mb-6">Start your spiritual journey by registering for a camp!</p>
            <Button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg"
            >
              Register Now
            </Button>
          </Card>
        ) : (
          <>
            {/* Registrations Grid */}
            <div className="grid gap-6 mb-12">
              {registrations.map((reg) => (
                <Card
                  key={reg.id}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                      <h3 className="text-2xl font-bold text-purple-900 mb-4">{reg.participant_name}</h3>
                      <div className="space-y-3">
                        {reg.age && (
                          <div>
                            <p className="text-sm text-purple-600 font-semibold">Age</p>
                            <p className="text-lg text-purple-900">{reg.age}</p>
                          </div>
                        )}
                        {reg.counselor_name && (
                          <div>
                            <p className="text-sm text-purple-600 font-semibold">Counselor</p>
                            <p className="text-lg text-purple-900">{reg.counselor_name}</p>
                          </div>
                        )}
                        {reg.parent_temple && (
                          <div>
                            <p className="text-sm text-purple-600 font-semibold">Parent Temple</p>
                            <p className="text-lg text-purple-900">{reg.parent_temple}</p>
                          </div>
                        )}
                        {reg.participant_type && (
                          <div>
                            <p className="text-sm text-purple-600 font-semibold">Participant Type</p>
                            <p className="text-lg text-purple-900">{reg.participant_type}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-purple-600 font-semibold">Camp</p>
                          <p className="text-sm text-purple-900">{reg.camp_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-600 font-semibold">Meals</p>
                          <p className="text-sm text-purple-900">
                            {reg.first_meal_date} ({reg.first_meal_type}) → {reg.last_meal_date} ({reg.last_meal_type})
                          </p>
                        </div>
                        {reg.accommodation && (
                          <div>
                            <p className="text-sm text-purple-600 font-semibold">Accommodation</p>
                            <p className="text-sm text-purple-900">{reg.accommodation}</p>
                          </div>
                        )}
                        {reg.dinner_type && (
                          <div>
                            <p className="text-sm text-purple-600 font-semibold">Dinner Type</p>
                            <p className="text-sm text-purple-900">{reg.dinner_type}</p>
                          </div>
                        )}
                        <div className="pt-4 border-t-2 border-purple-200">
                          <p className="text-sm text-purple-600 font-semibold">Payment Status</p>
                          <p className="text-sm font-bold text-green-600 capitalize">{reg.payment_status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-600 font-semibold">Cost</p>
                          <p className="text-2xl font-bold text-amber-600">₹{reg.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Total Cost Summary */}
            <Card className="bg-gradient-to-r from-amber-100 via-purple-100 to-orange-100 border-2 border-purple-300 p-8 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-700 text-lg font-semibold">Total Registrations</p>
                  <p className="text-4xl font-bold text-purple-900">{registrations.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-700 text-lg font-semibold">Total Cost</p>
                  <p className="text-4xl font-bold text-amber-600">₹{totalCost}</p>
                </div>
              </div>
            </Card>

            {/* New Registration Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg"
              >
                Add More Registrations
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
