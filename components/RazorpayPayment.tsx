"use client"

import { useState } from "react"

interface RazorpayPaymentProps {
  amount: number
  email: string
  onConfirm: (details: any) => void
  onCancel: () => void
  isSubmitting: boolean
}

export function RazorpayPayment({ amount, email, onConfirm, onCancel, isSubmitting }: RazorpayPaymentProps) {
  const [processing, setProcessing] = useState(false)

  const handlePayment = async () => {
    setProcessing(true)
    try {
      // Simulate payment processing
      setTimeout(() => {
        onConfirm({
          paymentMethod: "UPI",
          transactionId: `TXN_${Date.now()}`,
          amount: amount,
        })
        setProcessing(false)
      }, 2000)
    } catch (error) {
      console.error("Payment error:", error)
      setProcessing(false)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>UPI Payment</h2>
        <div style={styles.details}>
          <p style={styles.detailRow}>
            <span>Amount:</span>
            <strong>₹{amount}</strong>
          </p>
          <p style={styles.detailRow}>
            <span>Email:</span>
            <strong>{email}</strong>
          </p>
        </div>
        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.payButton }}
            onClick={handlePayment}
            disabled={processing || isSubmitting}
          >
            {processing || isSubmitting ? "Processing..." : "Pay Now"}
          </button>
          <button
            style={{ ...styles.button, ...styles.cancelBtn }}
            onClick={onCancel}
            disabled={processing || isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    margin: "0 0 20px 0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
  },
  details: {
    backgroundColor: "#f5f5f5",
    padding: "16px",
    borderRadius: "6px",
    marginBottom: "20px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    margin: "8px 0",
    fontSize: "14px",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  payButton: {
    backgroundColor: "#0070f3",
    color: "#fff",
  },
  cancelBtn: {
    backgroundColor: "#e0e0e0",
    color: "#333",
  },
}
