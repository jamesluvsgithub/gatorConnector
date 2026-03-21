import { useState } from "react";

function GoalWindow() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      setError("Goal title is required.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Goal saved successfully.");
    console.log("Saved goal:", { title, description });
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
          <button className="secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default GoalWindow;