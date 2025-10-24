"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RazorpayPayment } from "@/components/razorpay-payment"
import { PaymentConfirmation } from "@/components/payment-confirmation"
import { PaymentMethodSelection } from "@/components/payment-method-selection"
import calculateCost from "@/lib/calculate-cost"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { AddedParticipantsTable } from "./AddedParticipantsTable"

const CAMPS = [
  { id: "nishtha-1", name: "Nishtha Camp 1", dates: "Dec 20 (AM) - Dec 24 (PM)" },
  { id: "ashray-1", name: "Ashray Camp 1", dates: "Dec 20 (AM) - Dec 24 (PM)" },
  { id: "nishtha-2", name: "Nishtha Camp 2", dates: "Dec 26 (AM) - Dec 30 (PM)" },
  { id: "ashray-2", name: "Ashray Camp 2", dates: "Dec 26 (AM) - Dec 30 (PM)" },
]

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"]
const ACCOMMODATION_OPTIONS = ["Yes", "No"]
const PARTICIPANT_TYPES = ["Mentor", "Brahmachari", "Devotee"]
const GENDERS = ["Male", "Female", "Other"]
const DATES = Array.from({ length: 18 }, (_, i) => {
  const date = 17 + i
  if (date <= 31) return `${date}-Dec`
  return `${date - 31}-Jan`
})

interface InputFieldProps {
  label: string
  id: string
  type: string
  value: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  required?: boolean
  readOnly?: boolean
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  readOnly = false,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>
      {label} {required && "*"}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50 text-orange-900"
    />
  </div>
)

interface SelectFieldProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50 text-orange-900 data-[placeholder]:text-orange-400"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-orange-50 border border-orange-300 rounded-md shadow-lg">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

export default function RegistrationForm() {
  const { user } = useUser()
  const [entries, setEntries] = useState([
    {
      pocName: "",
      pocContact: "",
      voiceName: "",
      participantName: "",
      participantType: "Devotee",
      gender: "Male",
      whatsapp: "",
      parentTemple: "",
      counselorName: "",
      campName: "nishtha-1",
      firstMealDate: "20-Dec",
      firstMealType: "Breakfast",
      lastMealDate: "24-Dec",
      lastMealType: "Dinner",
      dinnerType: "Dinner Meal",
      accommodation: "No",
      age: "",
      marriedSinceYear: "",
    },
  ])

  const [showPaymentMethod, setShowPaymentMethod] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "")
  const [pocDetailsSaved, setPocDetailsSaved] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        pocName: entries[0]?.pocName || "",
        pocContact: entries[0]?.pocContact || "",
        voiceName: entries[0]?.voiceName || "",
        participantName: "",
        participantType: "Devotee",
        gender: "Male",
        whatsapp: entries[0]?.whatsapp || "",
        parentTemple: entries[0]?.parentTemple || "",
        counselorName: entries[0]?.counselorName || "",
        campName: "nishtha-1",
        firstMealDate: "20-Dec",
        firstMealType: "Breakfast",
        lastMealDate: "24-Dec",
        lastMealType: "Dinner",
        dinnerType: "Dinner Meal",
        accommodation: "No",
        age: "",
        marriedSinceYear: "",
      },
    ])
  }

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index))
    if (editingIndex === index) {
      setEditingIndex(null)
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1)
    }
  }

  const handleEditEntry = (index: number) => {
    setEditingIndex(index)
  }

  const handleUpdateEntry = () => {
    setEditingIndex(null)
  }

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries]
    newEntries[index][field] = value
    setEntries(newEntries)
  }

  const calculateCostForEntry = (entry: any) => {
    return calculateCost(
      entry.firstMealDate,
      entry.firstMealType,
      entry.lastMealDate,
      entry.lastMealType,
      entry.accommodation,
      entry.participantType,
    )
  }

  const calculateTotalCost = () => {
    return entries.reduce((total, entry) => {
      const cost = calculateCostForEntry(entry)
      return total + cost
    }, 0)
  }

  const totalCost = calculateTotalCost()
  const razorpayAmount = Math.round(totalCost * 1.02 * 100) // 2% surcharge

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method)
    setShowPaymentMethod(false)

    if (method === "upi") {
      // Razorpay payment will be triggered
    } else if (method === "idt") {
      // IDT payment confirmation will be shown
    }
  }

  const handlePaymentConfirm = async (paymentData) => {
    setIsSubmitting(true)
    try {
      const entriesWithCost = entries.map((e) => ({
        ...e,
        entryCost: calculateCostForEntry(e),
      }))
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: entriesWithCost,
          email,
          amount: totalCost,
          clerkUserId: user?.id,
          ...paymentData,
        }),
      })

      if (response.ok) {
        alert("Registration successful!")
        setEntries([
          {
            pocName: "",
            pocContact: "",
            voiceName: "",
            participantName: "",
            participantType: "Devotee",
            gender: "Male",
            whatsapp: "",
            parentTemple: "",
            counselorName: "",
            campName: "nishtha-1",
            firstMealDate: "20-Dec",
            firstMealType: "Breakfast",
            lastMealDate: "24-Dec",
            lastMealType: "Dinner",
            dinnerType: "Dinner Meal",
            accommodation: "No",
            age: "",
            marriedSinceYear: "",
          },
        ])
        setSelectedPaymentMethod(null)
        setPocDetailsSaved(false) // Reset POC details on successful registration
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSavePocDetails = () => {
    setPocDetailsSaved(true)
  }

  const currentEntry = editingIndex !== null ? entries[editingIndex] : entries[entries.length - 1]
  const currentEntryIndex = editingIndex !== null ? editingIndex : entries.length - 1

  return (
    <div className="min-h-screen bg-orange-100 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-orange-50 rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-orange-800 mb-10">Registration Portal</h1>

        {/* Email and POC Details */}
        <Card className="p-6 border-2 border-orange-300 bg-white shadow-md mb-8 rounded-lg">
          {!pocDetailsSaved ? (
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Email Address"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                required
                readOnly={entries.length > 0}
              />
              <InputField
                label="POC Name"
                id="pocName"
                type="text"
                value={entries[0]?.pocName}
                onChange={(value) => handleEntryChange(0, "pocName", value)}
                placeholder="Enter POC name"
              />
              <InputField
                label="POC Contact no"
                id="pocContact"
                type="tel"
                value={entries[0]?.pocContact}
                onChange={(value) => handleEntryChange(0, "pocContact", value)}
                placeholder="Enter 10-digit number"
              />
              <div className="flex items-end justify-start">
                <Button
                  onClick={handleSavePocDetails}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition-all duration-300"
                  disabled={!email || !entries[0]?.pocName || !entries[0]?.pocContact}
                >
                  Save POC Details
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-orange-800">
                <span className="font-semibold">Email:</span> {email}
              </p>
              <p className="text-lg text-orange-800">
                <span className="font-semibold">POC Name:</span> {entries[0]?.pocName}
              </p>
              <p className="text-lg text-orange-800">
                <span className="font-semibold">POC Contact:</span> {entries[0]?.pocContact}
              </p>
              <Button
                onClick={() => setPocDetailsSaved(false)}
                variant="outline"
                className="text-orange-700 border-orange-300 hover:bg-orange-100 transition-all duration-300"
              >
                Edit POC Details
              </Button>
            </div>
          )}
        </Card>
        <div className="flex justify-end mb-8">
          <Button
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition-all duration-300"
          >
            View My Registrations
          </Button>
        </div>

        <Card className="p-6 border-2 border-orange-300 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-orange-800 mb-6">
            {editingIndex !== null ? "Edit Participant" : "Add New Participant"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <InputField
              label="Parent Temple"
              id="parentTemple"
              type="text"
              value={currentEntry?.parentTemple}
              onChange={(value) => handleEntryChange(currentEntryIndex, "parentTemple", value)}
              placeholder="Enter parent temple"
            />
            <InputField
              label="Voice Name"
              id="voiceName"
              type="text"
              value={currentEntry?.voiceName}
              onChange={(value) => handleEntryChange(currentEntryIndex, "voiceName", value)}
              placeholder="Enter voice name"
            />
            <InputField
              label="Counselor Name"
              id="counselorName"
              type="text"
              value={currentEntry?.counselorName}
              onChange={(value) => handleEntryChange(currentEntryIndex, "counselorName", value)}
              placeholder="Enter counselor name"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <InputField
              label="Participant Name"
              id="participantName"
              type="text"
              value={currentEntry?.participantName}
              onChange={(value) => handleEntryChange(currentEntryIndex, "participantName", value)}
              required
              placeholder="Enter participant name"
            />
            <InputField
              label="WhatsApp"
              id="whatsapp"
              type="tel"
              value={currentEntry?.whatsapp}
              onChange={(value) => handleEntryChange(currentEntryIndex, "whatsapp", value)}
              placeholder="Enter 10-digit WhatsApp number"
            />
            <InputField
              label="Age"
              id="age"
              type="number"
              value={currentEntry?.age}
              onChange={(value) => handleEntryChange(currentEntryIndex, "age", value)}
              placeholder="Enter age"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <SelectField
              label="Camp Name"
              id="campName"
              value={currentEntry?.campName}
              onChange={(value) => handleEntryChange(currentEntryIndex, "campName", value)}
              options={CAMPS.map((camp) => ({ value: camp.id, label: camp.name }))}
              placeholder="Select Camp"
            />
            <SelectField
              label="Participant Type"
              id="participantType"
              value={currentEntry?.participantType}
              onChange={(value) => handleEntryChange(currentEntryIndex, "participantType", value)}
              options={PARTICIPANT_TYPES.map((type) => ({ value: type, label: type }))}
              placeholder="Select Participant Type"
            />
            <SelectField
              label="Gender"
              id="gender"
              value={currentEntry?.gender}
              onChange={(value) => handleEntryChange(currentEntryIndex, "gender", value)}
              options={GENDERS.map((gender) => ({ value: gender, label: gender }))}
              placeholder="Select Gender"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <SelectField
              label="First Meal Date"
              id="firstMealDate"
              value={currentEntry?.firstMealDate}
              onChange={(value) => handleEntryChange(currentEntryIndex, "firstMealDate", value)}
              options={DATES.map((date) => ({ value: date, label: date }))}
              placeholder="Select Date"
            />
            <SelectField
              label="First Meal Type"
              id="firstMealType"
              value={currentEntry?.firstMealType}
              onChange={(value) => handleEntryChange(currentEntryIndex, "firstMealType", value)}
              options={MEAL_TYPES.map((type) => ({ value: type, label: type }))}
              placeholder="Choose Meal Type"
            />
            <SelectField
              label="Last Meal Date"
              id="lastMealDate"
              value={currentEntry?.lastMealDate}
              onChange={(value) => handleEntryChange(currentEntryIndex, "lastMealDate", value)}
              options={DATES.map((date) => ({ value: date, label: date }))}
              placeholder="Select Last Meal Date"
            />
            <SelectField
              label="Last Meal Type"
              id="lastMealType"
              value={currentEntry?.lastMealType}
              onChange={(value) => handleEntryChange(currentEntryIndex, "lastMealType", value)}
              options={MEAL_TYPES.map((type) => ({ value: type, label: type }))}
              placeholder="Choose Meal Type"
            />
            <SelectField
              label="Dinner Type"
              id="dinnerType"
              value={currentEntry?.dinnerType}
              onChange={(value) => handleEntryChange(currentEntryIndex, "dinnerType", value)}
              options={MEAL_TYPES.map((type) => ({ value: type, label: type }))}
              placeholder="Dinner Meal"
            />
            <SelectField
              label="Accommodation"
              id="accommodation"
              value={currentEntry?.accommodation}
              onChange={(value) => handleEntryChange(currentEntryIndex, "accommodation", value)}
              options={ACCOMMODATION_OPTIONS.map((option) => ({ value: option, label: option }))}
              placeholder="Select Accommodation"
            />
            <InputField
              label="Married Since Year"
              id="marriedSinceYear"
              type="number"
              value={currentEntry?.marriedSinceYear}
              onChange={(value) => handleEntryChange(currentEntryIndex, "marriedSinceYear", value)}
              placeholder="Enter year"
            />
          </div>

          <div className="flex justify-end mt-6">
            {editingIndex !== null ? (
              <Button
                onClick={handleUpdateEntry}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition-all duration-300"
              >
                Update Participant
              </Button>
            ) : (
              <Button
                onClick={handleAddEntry}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition-all duration-300"
              >
                Add Entry
              </Button>
            )}
          </div>
        </Card>
        
        <div className="mt-8">
          <AddedParticipantsTable
            entries={entries.map((entry) => ({
              ...entry,
              entryCost: calculateCostForEntry(entry),
            }))}
            onEdit={handleEditEntry}
            onRemove={handleRemoveEntry}
          />
        </div>

        {/* Cost Summary and Payment Button */}
        <Card className="p-6 border-2 border-orange-300 bg-white shadow-md rounded-lg mt-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm font-semibold text-orange-900">Total Cost</p>
            <p className="text-3xl font-bold text-orange-700">₹{totalCost}</p>
          </div>

          <Button
            onClick={() => setShowPaymentMethod(true)}
            disabled={entries.length === 0 || !email || entries.some((e) => !e.participantName) || !pocDetailsSaved}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-md shadow-md transition-all duration-300"
          >
            Proceed to Payment
          </Button>
        </Card>
      </div>

      {/* Payment Method Selection */}
      {showPaymentMethod && (
        <PaymentMethodSelection
          onSelectMethod={handlePaymentMethodSelect}
          onCancel={() => setShowPaymentMethod(false)}
          disableUPI={false}
        />
      )}

      {/* Razorpay Payment */}
      {selectedPaymentMethod === "upi" && (
        <RazorpayPayment
          amount={totalCost * 1.02}
          email={email}
          isSubmitting={isSubmitting}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setSelectedPaymentMethod(null)}
        />
      )}

      {/* IDT Payment */}
      {selectedPaymentMethod === "idt" && (
        <PaymentConfirmation
          entries={entries.map((e) => ({
            ...e,
            entryCost: calculateCostForEntry(e),
          }))}
          email={email}
          amount={totalCost}
          isSubmitting={isSubmitting}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setSelectedPaymentMethod(null)}
        />
      )}
    </div>
  )
}
