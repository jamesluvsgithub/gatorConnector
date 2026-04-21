import React, { useState } from "react";

function GoalEntryModal() {
  const [formData, setFormData] = useState({
    goalName: "",
    category: "",
    deadline: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.goalName.trim()) {
      newErrors.goalName = "Goal name is required.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    console.log("Goal submitted:", formData);

    setSubmitted(true);
    setErrors({});

    setFormData({
      goalName: "",
      category: "",
      deadline: "",
      notes: "",
    });
  };

  const handleClear = () => {
    setFormData({
      goalName: "",
      category: "",
      deadline: "",
      notes: "",
    });

    setErrors({});
    setSubmitted(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.modalCard}>
        <div style={styles.headerSection}>
          <h2 style={styles.title}>Add a New Goal</h2>
          <p style={styles.subtitle}>
            Enter a goal you want to track and manage in the system.
          </p>
        </div>

        {submitted && (
          <div style={styles.successMessage}>
            Goal submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label htmlFor="goalName" style={styles.label}>
              Goal Name
            </label>
            <input
              id="goalName"
              name="goalName"
              type="text"
              value={formData.goalName}
              onChange={handleChange}
              placeholder="Example: Get an internship"
              style={styles.input}
            />
            {errors.goalName && (
              <span style={styles.errorText}>{errors.goalName}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="category" style={styles.label}>
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Career, academics, personal, etc."
              style={styles.input}
            />
            {errors.category && (
              <span style={styles.errorText}>{errors.category}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="deadline" style={styles.label}>
              Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.deadline && (
              <span style={styles.errorText}>{errors.deadline}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="notes" style={styles.label}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any extra details here"
              style={styles.textarea}
            />
          </div>

          <div style={styles.buttonRow}>
            <button type="button" onClick={handleClear} style={styles.clearButton}>
              Clear
            </button>
            <button type="submit" style={styles.submitButton}>
              Submit Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2f7",
    padding: "24px",
    boxSizing: "border-box",
  },
  modalCard: {
    width: "100%",
    maxWidth: "540px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
    boxSizing: "border-box",
  },
  headerSection: {
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1f2937",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },
  successMessage: {
    marginBottom: "16px",
    backgroundColor: "#ecfdf3",
    color: "#166534",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    minHeight: "100px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  },
  errorText: {
    marginTop: "6px",
    color: "#dc2626",
    fontSize: "13px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px",
  },
  clearButton: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  },
  submitButton: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default GoalEntryModal;
