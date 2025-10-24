"use client"

import { useState } from "react"
import calculateCost from "@/lib/calculate-cost"
import { PaymentConfirmation } from "./PaymentConfirmation"
import { useRouter } from "next/navigation"
import { PaymentMethodSelection } from "./PaymentMethodSelection"
import { RazorpayPayment } from "./RazorpayPayment"

export default function BulkRegistration() {
  const [entries, setEntries] = useState([])
  const [pocDetails, setPocDetails] = useState({
    pocName: "",
    pocContact: "",
  })
  const [userEmail, setUserEmail] = useState("")
  const [formData, setFormData] = useState({
    voiceName: "",
    participantName: "",
    whatsapp: "",
    parentTemple: "",
    counselorName: "",
    campName: "",
    firstMealDate: "",
    firstMealType: "",
    lastMealDate: "",
    lastMealType: "",
    dinnerType: "Dinner Meal",
    accommodation: "",
    gender: "male",
    participantType: "",
    age: "",
    marriedSinceYear: "",
  })
  const [editIndex, setEditIndex] = useState(null)
  const [pocEntered, setPocEntered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false)
  const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [showCopyLastEntry, setShowCopyLastEntry] = useState(false)
  const router = useRouter()

  function handleChange(e) {
    if (e.target.name === "gender") {
      // When gender changes, update accommodation based on gender
      const isFemale = e.target.value.startsWith("male")
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        accommodation: isFemale ? "No" : "", // Set "No" for females, empty for males
      })
    } else if (e.target.name === "campName" && e.target.value !== "NS Camp - Attended Before") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        marriedSinceYear: "",
      })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  function handlePocChange(e) {
    const { name, value } = e.target
    if (name === "pocContact") {
      // Only allow digits for the contact number
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10)
      setPocDetails({ ...pocDetails, [name]: numericValue })
    } else {
      // Allow any text for the name
      setPocDetails({ ...pocDetails, [name]: value })
    }
  }

  function savePocDetails() {
    if (!pocDetails.pocName || !pocDetails.pocContact || pocDetails.pocContact.length !== 10) {
      alert("Please enter POC Name and a valid 10-digit Contact number.")
      return
    }
    if (!userEmail || !userEmail.includes("@")) {
      alert("Please enter a valid email address.")
      return
    }
    setPocEntered(true)
  }

  function addEntry() {
    const requiredFields = {
      parentTemple: "Parent Temple",
      voiceName: "Voice Name",
      participantName: "Participant Name",
      whatsapp: "WhatsApp Number",
      age: "Age",
      campName: "Camp Name",
      participantType: "Participant Type",
      counselorName: "Counselor Name",
      firstMealDate: "First Meal Date",
      firstMealType: "First Meal Type",
      lastMealDate: "Last Meal Date",
      lastMealType: "Last Meal Type",
      accommodation: "Accommodation",
      dinnerType: "Dinner Type",
    }

    const missingFields = []

    for (const field in requiredFields) {
      if (!formData[field]) {
        missingFields.push(requiredFields[field])
      }
    }

    if (missingFields.length > 0) {
      alert(`You're missing some required details:\n\n- ${missingFields.join("\n- ")}`)
      return
    }

    // MEAL DATE Comparison
    // Parse and build full date strings

    const currentYear = new Date().getFullYear() // or hardcode 2025 if needed

    // Get values from formData
    const firstDay = Number.parseInt(formData.firstMealDate) // e.g., "25"
    const lastDay = Number.parseInt(formData.lastMealDate) // e.g., "2"

    // Validate selection
    if (!firstDay || !lastDay) {
      alert("Please select both dates.")
      return
    }

    // First meal is always in December
    const firstMealDate = new Date(`${currentYear}-12-${firstDay.toString().padStart(2, "0")}`)

    // Determine month/year of last meal
    let lastMealMonth = 12
    let lastMealYear = currentYear

    if (lastDay <= 3) {
      // Last meal in Jan of next year
      lastMealMonth = 1
      lastMealYear += 1
    }

    const lastMealDate = new Date(
      `${lastMealYear}-${lastMealMonth.toString().padStart(2, "0")}-${lastDay.toString().padStart(2, "0")}`,
    )

    // Final check
    if (firstMealDate > lastMealDate) {
      alert("First meal date should be before last meal date.")
      return
    }

    // Add new validation for meal types when dates are the same
    if (formData.firstMealDate === formData.lastMealDate) {
      const mealOrder = {
        Breakfast: 1,
        Lunch: 2,
        Dinner: 3,
      }

      if (mealOrder[formData.lastMealType] < mealOrder[formData.firstMealType]) {
        alert(
          "The meal order is not valid. Meals must be chosen in the correct order: Breakfast  → Lunch  →  Dinner. Please review your selections.",
        )
        return
      }
    }

    // Calculate the cost and add it to the entry
    const entryCost = calculateCost(
      formData.firstMealDate,
      formData.firstMealType,
      formData.lastMealDate,
      formData.lastMealType,
      formData.accommodation,
      formData.participantType,
    )

    const newEntry = { ...formData, ...pocDetails, email: userEmail, entryCost }

    if (editIndex !== null) {
      const updatedEntries = [...entries]
      updatedEntries[editIndex] = newEntry
      setEntries(updatedEntries)
      setEditIndex(null)
      setSubmitStatus({
        type: "success",
        message: "Entry updated successfully! You can add more entries or scroll down to check your entries.",
      })
    } else {
      setEntries([...entries, newEntry])
      setSubmitStatus({
        type: "success",
        message: "Entry added successfully! You can add more entries or scroll down to check your entries.",
      })
    }

    setFormData({
      voiceName: formData.voiceName,
      parentTemple: formData.parentTemple,
      counselorName: formData.counselorName,
      participantName: "",
      whatsapp: "",
      campName: "",
      firstMealDate: "",
      firstMealType: "",
      lastMealDate: "",
      lastMealType: "",
      dinnerType: "Dinner Meal",
      accommodation: "",
      gender: "",
      participantType: "",
      age: "",
      marriedSinceYear: "",
    })

    setTimeout(() => {
      setSubmitStatus(null)
    }, 5000)
  }

  function editEntry(index) {
    const entry = entries[index]
    // Preserve the entryCost when editing
    const entryWithCost = {
      ...entry,
      entryCost: calculateCost(
        entry.firstMealDate,
        entry.firstMealType,
        entry.lastMealDate,
        entry.lastMealType,
        entry.accommodation,
        entry.participantType,
      ),
    }
    setFormData(entryWithCost)
    setEditIndex(index)
  }

  function deleteEntry(index) {
    const updatedEntries = entries.filter((_, i) => i !== index)
    setEntries(updatedEntries)
  }

  function copyLastEntry() {
    if (entries.length === 0) {
      alert("No entries available to copy.")
      setShowCopyLastEntry(false)
      return
    }

    const lastEntry = entries[entries.length - 1]

    // Copy all fields except participant-specific ones that should be unique
    setFormData({
      voiceName: lastEntry.voiceName,
      parentTemple: lastEntry.parentTemple,
      counselorName: lastEntry.counselorName,
      participantName: "", // Clear participant name for new entry
      whatsapp: lastEntry.whatsapp,
      campName: "",
      firstMealDate: lastEntry.firstMealDate,
      firstMealType: lastEntry.firstMealType,
      lastMealDate: lastEntry.lastMealDate,
      lastMealType: lastEntry.lastMealType,
      dinnerType: lastEntry.dinnerType,
      accommodation: lastEntry.accommodation,
      gender: lastEntry.gender,
      participantType: lastEntry.participantType,
      age: "", // Clear age for new entry
      marriedSinceYear: lastEntry.marriedSinceYear,
    })

    setShowCopyLastEntry(false)
    setSubmitStatus({
      type: "success",
      message: "Last entry copied successfully! Please update participant-specific details.",
    })

    setTimeout(() => {
      setSubmitStatus(null)
    }, 3000)
  }

  const calculateTotalCost = () => {
    return entries.reduce((total, entry) => {
      const cost =
        entry.entryCost ||
        calculateCost(
          entry.firstMealDate,
          entry.firstMealType,
          entry.lastMealDate,
          entry.lastMealType,
          entry.accommodation,
          entry.participantType,
        )
      return total + cost
    }, 0)
  }

  const calculateTotalWithSurcharge = (baseAmount, paymentMethod) => {
    if (paymentMethod === "upi") {
      // Add 2% surcharge for Razorpay/UPI payments
      const surcharge = baseAmount * 0.02
      return baseAmount + surcharge
    }
    return baseAmount
  }

  const handlePayment = () => {
    setShowPaymentMethodSelection(true)
  }

  const handlePaymentMethodSelect = (method) => {
    setShowPaymentMethodSelection(false)
    setSelectedPaymentMethod(method)
    if (method === "idt") {
      setShowPaymentConfirmation(true)
    }
  }

  const handlePaymentCancel = () => {
    setShowPaymentMethodSelection(false)
    setSelectedPaymentMethod(null)
    setShowPaymentConfirmation(false)
  }

  const handlePaymentConfirm = async (paymentDetails) => {
    setIsSubmitting(true)
    try {
      // Add validation for IDT payment
      if (paymentDetails.paymentMethod === "IDT" && (!paymentDetails.deductionSource || !paymentDetails.passcode)) {
        throw new Error("Please provide both deduction source and passcode for IDT payment")
      }

      // Update entries with payment details
      const updatedEntries = entries.map((entry) => ({
        ...entry,
        deductionSource: paymentDetails.deductionSource,
        passcode: paymentDetails.passcode,
        entryCost:
          entry.entryCost ||
          calculateCost(
            entry.firstMealDate,
            entry.firstMealType,
            entry.lastMealDate,
            entry.lastMealType,
            entry.accommodation,
            entry.participantType,
          ),
      }))

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...paymentDetails,
          entries: updatedEntries,
          email: userEmail,
          amount: calculateTotalCost(),
        }),
      })

      const data = await response.json()
      console.log("Verification response:", data)

      if (response.ok) {
        // Send data to Google Sheets
        try {
          const scriptUrl =
            "https://script.google.com/macros/s/AKfycbxaDZm1jY2WA4lEXGrYOJpwbe_hFkYQkaYxXQjb16sS6RQ6sh78XtIYREzmnwyUkXrRnQ/exec"

          // Format entries for Google Sheets
          const formattedData = updatedEntries.map((entry) => ({
            name: entry.participantName,
            email: entry.email,
            phone: entry.whatsapp,
            event: entry.campName,
            gender: entry.gender,
            age: entry.age,
            counselorName: entry.counselorName,
            firstMeal: `${entry.firstMealDate} - ${entry.firstMealType}`,
            lastMeal: `${entry.lastMealDate} - ${entry.lastMealType}`,
            accommodation: entry.accommodation,
            cost: entry.entryCost,
            paymentMethod: "IDT",
            deductionSource: entry.deductionSource,
            passcode: entry.passcode,
            pocName: entry.pocName,
            pocContact: entry.pocContact,
            parentTemple: entry.parentTemple,
            voiceName: entry.voiceName,
            participantType: entry.participantType,
            dinnerType: entry.dinnerType,
            marriedSinceYear: entry.marriedSinceYear,
          }))

          const data = encodeURIComponent(JSON.stringify(formattedData))
          const recipient = encodeURIComponent(userEmail)
          const url = `${scriptUrl}?data=${data}&recipient=${recipient}`

          const sheetsResponse = await fetch(url)
          console.log("Google Sheets response:", sheetsResponse)
        } catch (sheetsError) {
          console.error("Error sending data to Google Sheets:", sheetsError)
          // Don't throw the error, just log it
        }

        localStorage.setItem("registrations", JSON.stringify(updatedEntries))

        setSubmitStatus({
          type: "success",
          message: "Registration successful! Thank you for your payment.",
          icon: "✅",
        })
        // Clear form
        setEntries([])
        setPocEntered(false)
        setPocDetails({
          pocName: "",
          pocContact: "",
        })
        // Redirect to dashboard after successful payment
        router.push("/dash")
      } else {
        throw new Error(data.error || "Payment verification failed")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setSubmitStatus({
        type: "error",
        message: `Payment verification failed: ${error.message}`,
        icon: "❌",
      })
    } finally {
      setIsSubmitting(false)
      setSelectedPaymentMethod(null)
      setShowPaymentConfirmation(false)
    }
  }

  const getStatusMessageStyles = (status) => ({
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center",
    backgroundColor:
      status?.type === "success"
        ? "#e8f5e9"
        : status?.type === "error"
          ? "#ffebee"
          : status?.type === "info"
            ? "#e3f2fd"
            : "#e8f5e9",
    color:
      status?.type === "success"
        ? "#2e7d32"
        : status?.type === "error"
          ? "#c62828"
          : status?.type === "info"
            ? "#1565c0"
            : "#2e7d32",
  })

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Registration Portal</h3>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => router.push("/dash")}>
          View My Registrations
        </button>
      </div>

      {submitStatus && <div style={getStatusMessageStyles(submitStatus)}>{submitStatus.message}</div>}

      {!pocEntered ? (
        <div style={styles.pocForm}>
          <label>Email Address:</label>
          <input
            style={styles.input}
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <br />
          <label>POC Name:</label>
          <input
            style={styles.input}
            type="text"
            name="pocName"
            value={pocDetails.pocName}
            onChange={handlePocChange}
          />
          <br />
          <label>POC Contact no:</label>
          <input
            style={styles.input}
            type="tel"
            name="pocContact"
            value={pocDetails.pocContact}
            onChange={handlePocChange}
            minLength={10}
            maxLength={10}
            pattern="[0-9]{10}"
            placeholder="Enter 10-digit number"
            required
          />
          <br />
          <button style={styles.button} onClick={savePocDetails}>
            Save POC Details
          </button>
        </div>
      ) : (
        <div style={styles.pocDetails}>
          <p>
            <strong>Email:</strong> {userEmail}
          </p>
          <p>
            <strong>POC Name:</strong> {pocDetails.pocName}
          </p>
          <p>
            <strong>POC Contact:</strong> {pocDetails.pocContact}
          </p>
        </div>
      )}

      {pocEntered && (
        <div style={styles.registrationForm}>
          <div style={styles.twoColumnContainer}>
            <div style={styles.column}>
              <label>Parent Temple:</label>
              <input
                style={styles.input}
                type="text"
                name="parentTemple"
                value={formData.parentTemple}
                onChange={handleChange}
              />
            </div>
            <div style={styles.column}>
              <label>Voice Name:</label>
              <input
                style={styles.input}
                type="text"
                name="voiceName"
                value={formData.voiceName}
                onChange={handleChange}
              />
            </div>
          </div>
          <label>Counselor Name:</label>
          <input
            style={styles.input}
            type="text"
            name="counselorName"
            value={formData.counselorName}
            onChange={handleChange}
          />
          <label>Participant Name:</label>
          <input
            style={styles.input}
            type="text"
            name="participantName"
            value={formData.participantName}
            onChange={handleChange}
          />
          <br />

          <div style={styles.twoColumnContainer}>
            <div style={styles.column}>
              <label>Whatsapp:</label>
              <input
                style={styles.input}
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
                  handleChange({ target: { name: "whatsapp", value } })
                }}
                minLength={10}
                maxLength={10}
                pattern="[0-9]{10}"
                placeholder="Enter 10-digit WhatsApp number"
              />
            </div>
            <div style={styles.column}>
              <label>Age:</label>
              <input
                style={styles.input}
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                max="150"
              />
            </div>
          </div>
          <label>Camp Name:</label>
          <select style={styles.select} name="campName" value={formData.campName} onChange={handleChange}>
            <option value="">Select Camp</option>
            <option value="Nishtha Camp 1: Dec 20 (AM) - Dec 24 (PM), for Utkarsh camp graduates & SRCGD, chanting 4+ rounds.">
              Nishtha Camp 1: Dec 20 (AM) - Dec 24 (PM), for Utkarsh camp graduates & SRCGD, chanting 4+ rounds.
            </option>
            <option value="Ashray Camp 1: Dec 20 (AM) - Dec 24 (PM), for Nishtha camp graduates, chanting 16 rounds.">
              Ashray Camp 1: Dec 20 (AM) - Dec 24 (PM), for Nishtha camp graduates, chanting 16 rounds.
            </option>
            <option value="Nishtha Camp 2: Dec 26 (AM) - Dec 30 (PM), same as Camp 1 criteria.">
              Nishtha Camp 2: Dec 26 (AM) - Dec 30 (PM), same as Camp 1 criteria.
            </option>
            <option value="Ashray Camp 2: Dec 26 (AM) - Dec 30 (PM), same as Camp 1 criteria.">
              Ashray Camp 2: Dec 26 (AM) - Dec 30 (PM), same as Camp 1 criteria.
            </option>
            <option value="Brahmachari">Brahmachari</option>
          </select>
          <br />
          <div style={styles.twoColumnContainer}>
            <div style={styles.column}>
              <label>Participant Type:</label>
              <select
                style={styles.select}
                name="participantType"
                value={formData.participantType}
                onChange={handleChange}
                required
              >
                <option value="">Select Participant Type</option>
                <option value="Camp Participant">Camp Participant</option>
                <option value="Mentor">Mentor</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Brahmachari">Brahmachari</option>
              </select>
            </div>
          </div>
          {formData.participantType === "Brahmachari" && (
            <div style={styles.brahmachariMessage}>
              <p>
                Brahmacharis are required to pay a <b>nominal confirmation fee of ₹11.</b>
              </p>
              <p>
                Registration falls under the <b> "Donate As You Like"</b> category.
              </p>
              <p>The ₹11 charge is for technical reasons as a token amount.</p>
            </div>
          )}

          <br />

          <br />

          <div style={styles.mealDateContainer}>
            <div style={styles.mealRow}>
              <div style={styles.mealColumn}>
                <label>First Meal Date:</label>
                <select
                  style={styles.select}
                  name="firstMealDate"
                  value={formData.firstMealDate}
                  onChange={handleChange}
                >
                  <option value="">Select Date</option>
                  <option value="17">17 - Dec</option>
                  <option value="18">18 - Dec</option>
                  <option value="19">19 - Dec</option>
                  <option value="20">20 - Dec</option>
                  <option value="21">21 - Dec</option>
                  <option value="22">22 - Dec</option>
                  <option value="23">23 - Dec</option>
                  <option value="24">24 - Dec</option>
                  <option value="25">25 - Dec</option>
                  <option value="26">26 - Dec</option>
                  <option value="27">27 - Dec</option>
                </select>
              </div>
              <div style={styles.mealColumn}>
                <label>First Meal Type:</label>
                <select
                  style={styles.select}
                  name="firstMealType"
                  value={formData.firstMealType}
                  onChange={handleChange}
                >
                  <option value="">Choose Meal Type</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div style={styles.mealRow}>
              <div style={styles.mealColumn}>
                <label>Last Meal Date:</label>
                <select style={styles.select} name="lastMealDate" value={formData.lastMealDate} onChange={handleChange}>
                  <option value="">Select Last Meal Date</option>
                  <option value="23">23 - Dec</option>
                  <option value="24">24 - Dec</option>
                  <option value="25">25 - Dec</option>
                  <option value="26">26 - Dec</option>
                  <option value="27">27 - Dec</option>
                  <option value="28">28 - Dec</option>
                  <option value="29">29 - Dec</option>
                  <option value="30">30 - Dec</option>
                  <option value="31">31 - Dec</option>
                  <option value="1">1 - Jan</option>
                  <option value="2">2 - Jan</option>
                  <option value="3">3 - Jan</option>
                </select>
              </div>
              <div style={styles.mealColumn}>
                <label>Last Meal Type:</label>
                <select style={styles.select} name="lastMealType" value={formData.lastMealType} onChange={handleChange}>
                  <option value="">Choose Meal Type</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
            </div>
          </div>
          <label>Dinner Type:</label>
          <select style={styles.select} name="dinnerType" value={formData.dinnerType} onChange={handleChange}>
            <option value="Dinner Meal">Dinner Meal</option>
            <option value="Only Milk">Only Milk</option>
          </select>
          <br />

          <>
            <label>Accommodation:</label>
            <select style={styles.select} name="accommodation" value={formData.accommodation} onChange={handleChange}>
              <option value="">Select Accommodation</option>
              <option value="Yes">Yes , I need accomodation from CV</option>
              <option value="No">No , or I will arrange my own stay in guest house</option>
            </select>
          </>

          <br />
          <div style={styles.buttonRow}>
            <button
              style={isSubmitting ? styles.disabledButton : styles.button}
              onClick={addEntry}
              disabled={isSubmitting}
            >
              {editIndex !== null ? "Update Entry" : "Add Entry"}
            </button>
            {entries.length > 0 && (
              <button
                style={isSubmitting ? styles.disabledButton : styles.copyButton}
                onClick={() => setShowCopyLastEntry(true)}
                disabled={isSubmitting}
              >
                Copy Last Entry
              </button>
            )}
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div style={styles.entriesList}>
          <h3>Added Entries</h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Full Name</th>
                  <th style={styles.th}>Age</th>
                  <th style={styles.th}>Counselor Name</th>
                  <th style={styles.th}>First Meal</th>
                  <th style={styles.th}>Last Meal</th>
                  <th style={styles.th}>Camp Name</th>
                  <th style={styles.th}>Stay</th>
                  <th style={styles.th}>Cost</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{entry.participantName}</td>
                    <td style={styles.td}>{entry.age}</td>

                    <td style={styles.td}>{entry.counselorName}</td>
                    <td style={styles.td}>
                      {entry.firstMealDate} - {entry.firstMealType}
                    </td>
                    <td style={styles.td}>
                      {entry.lastMealDate} - {entry.lastMealType}
                    </td>
                    <td style={{ ...styles.td, fontSize: "13px" }}>{entry.campName}</td>
                    <td style={styles.td}>{entry.accommodation}</td>
                    <td style={styles.td}>₹{entry.entryCost}</td>
                    <td style={styles.td}>
                      <div style={styles.actionButtonsContainer}>
                        <button
                          style={{
                            ...styles.actionButton,
                            ...styles.editButton,
                            opacity: isSubmitting ? 0.7 : 1,
                          }}
                          onClick={() => editEntry(index)}
                          disabled={isSubmitting}
                        >
                          Edit
                        </button>
                        <button
                          style={{
                            ...styles.actionButton,
                            ...styles.deleteButton,
                            opacity: isSubmitting ? 0.7 : 1,
                          }}
                          onClick={() => deleteEntry(index)}
                          disabled={isSubmitting}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>Registration & Charges: ₹{calculateTotalCost()}</h3>
          {selectedPaymentMethod === "upi" && (
            <p style={styles.surchargeInfo}>
              Total with 2% Razorpay charges: ₹{calculateTotalWithSurcharge(calculateTotalCost(), "upi")}
            </p>
          )}

          <button
            style={isSubmitting ? styles.disabledButton : styles.button}
            onClick={handlePayment}
            disabled={isSubmitting || entries.length === 0}
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      )}

      {showPaymentMethodSelection && (
        <PaymentMethodSelection onSelectMethod={handlePaymentMethodSelect} onCancel={handlePaymentCancel} />
      )}

      {selectedPaymentMethod === "upi" && (
        <RazorpayPayment
          amount={calculateTotalWithSurcharge(calculateTotalCost(), "upi")}
          email={userEmail}
          onConfirm={async (paymentDetails) => {
            setIsSubmitting(true)
            try {
              const response = await fetch("/api/verify-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...paymentDetails,
                  entries: entries.map((entry) => ({
                    ...entry,
                    entryCost:
                      entry.entryCost ||
                      calculateCost(
                        entry.firstMealDate,
                        entry.firstMealType,
                        entry.lastMealDate,
                        entry.lastMealType,
                        entry.accommodation,
                        entry.participantType,
                      ),
                  })),
                  email: userEmail,
                  amount: calculateTotalWithSurcharge(calculateTotalCost(), "upi"),
                }),
              })

              const data = await response.json()

              if (response.ok) {
                // Send data to Google Sheets
                try {
                  const scriptUrl =
                    "https://script.google.com/macros/s/AKfycbxaDZm1jY2WA4lEXGrYOJpwbe_hFkYQkaYxXQjb16sS6RQ6sh78XtIYREzmnwyUkXrRnQ/exec"

                  // Format entries for Google Sheets
                  const formattedData = entries.map((entry) => ({
                    name: entry.participantName,
                    email: entry.email,
                    phone: entry.whatsapp,
                    event: entry.campName,
                    gender: entry.gender,
                    age: entry.age,
                    counselorName: entry.counselorName,
                    firstMeal: `${entry.firstMealDate} - ${entry.firstMealType}`,
                    lastMeal: `${entry.lastMealDate} - ${entry.lastMealType}`,
                    accommodation: entry.accommodation,
                    cost: entry.entryCost,
                    paymentMethod: "UPI",
                    pocName: entry.pocName,
                    pocContact: entry.pocContact,
                  }))

                  const data = encodeURIComponent(JSON.stringify(formattedData))
                  const recipient = encodeURIComponent(userEmail)
                  const url = `${scriptUrl}?data=${data}&recipient=${recipient}`

                  const sheetsResponse = await fetch(url)
                  console.log("Google Sheets response:", sheetsResponse)
                } catch (sheetsError) {
                  console.error("Error sending data to Google Sheets:", sheetsError)
                }

                setSubmitStatus({
                  type: "success",
                  message: "Payment successful! Your registration is complete.",
                  icon: "✅",
                })
                setEntries([])
                setPocEntered(false)
                setPocDetails({
                  pocName: "",
                  pocContact: "",
                })
                router.push("/dash")
              } else {
                throw new Error(data.error || "Payment verification failed")
              }
            } catch (error) {
              console.error("Payment verification error:", error)
              setSubmitStatus({
                type: "error",
                message: "Payment verification failed. Please contact support.",
                icon: "❌",
              })
            } finally {
              setIsSubmitting(false)
              setSelectedPaymentMethod(null)
            }
          }}
          onCancel={handlePaymentCancel}
          isSubmitting={isSubmitting}
        />
      )}

      {showPaymentConfirmation && selectedPaymentMethod === "idt" && (
        <PaymentConfirmation
          onConfirm={handlePaymentConfirm}
          onCancel={handlePaymentCancel}
          isSubmitting={isSubmitting}
          entries={entries}
          email={userEmail}
          amount={calculateTotalCost()}
        />
      )}

      {showCopyLastEntry && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Copy Last Entry</h3>
            <p style={styles.modalText}>
              This will copy all details from your last entry except participant-specific information (name, camp name,
              age). Are you sure you want to proceed?
            </p>
            <div style={styles.modalButtons}>
              <button style={styles.modalButton} onClick={copyLastEntry}>
                Yes, Copy
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.modalCancelButton }}
                onClick={() => setShowCopyLastEntry(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "transparent",
  },
  header: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "24px",
    color: "#6b4423",
    fontWeight: "700",
    background: "linear-gradient(135deg, #d4a574 0%, #9b7653 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  buttonContainer: {
    textAlign: "center",
    marginBottom: "24px",
  },
  button: {
    backgroundColor: "#d4a574",
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(212, 165, 116, 0.3)",
  },
  pocForm: {
    marginBottom: "24px",
    padding: "24px",
    backgroundColor: "rgba(212, 165, 116, 0.08)",
    borderRadius: "12px",
    border: "2px solid #d4a574",
  },
  input: {
    width: "calc(100% - 16px)",
    padding: "12px 8px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "2px solid #e8d4c0",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "2px solid #e8d4c0",
    fontSize: "14px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  },
  registrationForm: {
    marginBottom: "24px",
    padding: "24px",
    backgroundColor: "rgba(212, 165, 116, 0.05)",
    borderRadius: "12px",
    border: "2px solid #e8d4c0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    border: "2px solid #d4a574",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    padding: "14px",
    backgroundColor: "#d4a574",
    textAlign: "left",
    fontWeight: "700",
    fontSize: "13px",
    color: "#fff",
    borderBottom: "2px solid #c49564",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #e8d4c0",
    fontSize: "13px",
    color: "#333",
  },
  actionButton: {
    padding: "6px 12px",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#f0e6d8",
    color: "#6b4423",
    transition: "all 0.3s ease",
  },
  editButton: {
    backgroundColor: "#d4a574",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#c97070",
    color: "#fff",
  },
  actionButtonsContainer: {
    display: "flex",
    gap: "8px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b4423",
  },
  tableContainer: {
    overflowX: "auto",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  disabledButton: {
    backgroundColor: "#e8d4c0",
    color: "#999",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  pocDetails: {
    fontSize: "14px",
    padding: "16px",
    backgroundColor: "rgba(212, 165, 116, 0.1)",
    borderRadius: "8px",
    border: "2px solid #d4a574",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  entriesList: {
    marginBottom: "24px",
    backgroundColor: "rgba(212, 165, 116, 0.05)",
    borderRadius: "12px",
    padding: "24px",
    border: "2px solid #e8d4c0",
  },
  mealDateContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "16px",
  },
  mealRow: {
    display: "flex",
    gap: "12px",
  },
  mealColumn: {
    flex: 1,
  },
  twoColumnContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
  },
  column: {
    flex: 1,
  },
  surchargeInfo: {
    fontSize: "14px",
    color: "#6b4423",
    marginTop: "12px",
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "rgba(212, 165, 116, 0.1)",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid #d4a574",
  },
  brahmachariMessage: {
    marginBottom: "16px",
    padding: "14px",
    backgroundColor: "rgba(155, 118, 83, 0.08)",
    borderRadius: "8px",
    border: "2px solid #9b7653",
    fontSize: "13px",
    color: "#6b4423",
    lineHeight: "1.6",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
  copyButton: {
    backgroundColor: "#9b7653",
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "12px",
    maxWidth: "450px",
    width: "90%",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    border: "2px solid #d4a574",
  },
  modalTitle: {
    margin: "0 0 16px 0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#6b4423",
  },
  modalText: {
    margin: "0 0 24px 0",
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
  },
  modalButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  modalButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "#d4a574",
    color: "#fff",
    transition: "all 0.3s ease",
  },
  modalCancelButton: {
    backgroundColor: "#9b7653",
    color: "#fff",
  },
}
