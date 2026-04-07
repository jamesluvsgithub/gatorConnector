import { useState } from "react";

function GoalWindow() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Goal title is required.");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: title,
        description,
      }),
    });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save goal.");
        return;
      }

      setSuccess("Goal saved successfully.");
      setTitle("");
      setDescription("");
      console.log("Saved goal:", data);
    } catch (err) {
      setError("Server error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Goal Window</h2>

        <input
          type="text"
          placeholder="Goal title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
            setSuccess("");
          }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setSuccess("");
          }}
          rows="3"
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="button-row">
          <button className="secondary" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalWindow;