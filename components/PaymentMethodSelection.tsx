"use client"

interface PaymentMethodSelectionProps {
  onSelectMethod: (method: string) => void
  onCancel: () => void
}

export function PaymentMethodSelection({ onSelectMethod, onCancel }: PaymentMethodSelectionProps) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Select Payment Method</h2>
        <div style={styles.methodsContainer}>
          <button style={styles.methodButton} onClick={() => onSelectMethod("idt")}>
            <div style={styles.methodName}>IDT (Bank Transfer)</div>
            <div style={styles.methodDesc}>Direct bank transfer</div>
          </button>
          <button style={styles.methodButton} onClick={() => onSelectMethod("upi")}>
            <div style={styles.methodName}>UPI / Razorpay</div>
            <div style={styles.methodDesc}>Online payment via UPI</div>
          </button>
        </div>
        <button style={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
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
  methodsContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginBottom: "16px",
  },
  methodButton: {
    padding: "16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "all 0.3s ease",
  },
  methodName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px",
  },
  methodDesc: {
    fontSize: "13px",
    color: "#666",
  },
  cancelButton: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
}
