"use client"

interface PaymentConfirmationProps {
  onConfirm: (details: any) => void
  onCancel: () => void
  isSubmitting: boolean
  entries: any[]
  email: string
  amount: number
}

export function PaymentConfirmation({
  onConfirm,
  onCancel,
  isSubmitting,
  entries,
  email,
  amount,
}: PaymentConfirmationProps) {
  const handleConfirm = () => {
    onConfirm({
      paymentMethod: "IDT",
      deductionSource: "ISKCON",
      passcode: "12345",
    })
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Payment Confirmation</h2>
        <p style={styles.text}>Amount: ₹{amount}</p>
        <p style={styles.text}>Entries: {entries.length}</p>
        <p style={styles.text}>Email: {email}</p>
        <div style={styles.buttonGroup}>
          <button style={{ ...styles.button, ...styles.confirmButton }} onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </button>
          <button style={{ ...styles.button, ...styles.cancelButton }} onClick={onCancel} disabled={isSubmitting}>
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
    margin: "0 0 16px 0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
  },
  text: {
    margin: "8px 0",
    fontSize: "14px",
    color: "#666",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    justifyContent: "flex-end",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  confirmButton: {
    backgroundColor: "#0070f3",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
    color: "#333",
  },
}
