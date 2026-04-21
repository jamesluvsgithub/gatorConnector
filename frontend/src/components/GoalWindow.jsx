import { useEffect, useState } from "react";

function GoalWindow() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("not started");

  const [goals, setGoals] = useState([]);
  const [editingGoalId, setEditingGoalId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  let userId = null;

try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    console.log("stored user:", parsedUser);
    userId = parsedUser.id || parsedUser._id || parsedUser.userId || null;
  }
} catch (err) {
  console.error("Failed to parse stored user:", err);
}

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("not started");
    setEditingGoalId(null);
  };

  const fetchGoals = async () => {
    if (!userId) {
      setError("User ID not found.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/goals/user/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load goals.");
        return;
      }

      setGoals(data);
    } catch (err) {
      setError("Server error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSaveOrUpdate = async () => {
    if (!userId) {
      setError("User ID not found.");
      return;
    }

    if (!title.trim()) {
      setError("Goal title is required.");
      return;
    }

    try {
      setLoading(true);
      clearMessages();

      const isEditing = !!editingGoalId;
      const url = isEditing
        ? `${API_URL}/api/goals/${editingGoalId}`
        : `${API_URL}/api/goals`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userId,
          name: title,
          description,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Failed to ${isEditing ? "update" : "save"} goal.`);
        return;
      }

      setSuccess(isEditing ? "Goal updated successfully." : "Goal added successfully.");
      resetForm();
      await fetchGoals();
    } catch (err) {
      setError("Server error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoalId(goal._id);
    setTitle(goal.name || "");
    setDescription(goal.description || "");
    setStatus(goal.status || "not started");
    clearMessages();
  };

  const handleDelete = async (goalId) => {
    try {
      setLoading(true);
      clearMessages();

      const response = await fetch(`${API_URL}/api/goals/${goalId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete goal.");
        return;
      }

      if (editingGoalId === goalId) {
        resetForm();
      }

      setSuccess("Goal deleted successfully.");
      await fetchGoals();
    } catch (err) {
      setError("Server error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    clearMessages();
  };

  return (
    <div className="goal-page">
      <div className="goal-layout">
        <div className="card goal-card">
          <h2>{editingGoalId ? "Edit Goal" : "Goal Window"}</h2>

          <input
            type="text"
            placeholder="Goal title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearMessages();
            }}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearMessages();
            }}
            rows="4"
          />

          <select
            className="goal-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              clearMessages();
            }}
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="button-row">
            <button className="secondary" onClick={handleCancel} disabled={loading}>
              {editingGoalId ? "Cancel Edit" : "Clear"}
            </button>
            <button onClick={handleSaveOrUpdate} disabled={loading}>
              {loading
                ? editingGoalId
                  ? "Updating..."
                  : "Saving..."
                : editingGoalId
                ? "Update Goal"
                : "Add Goal"}
            </button>
          </div>
        </div>

        <div className="card goal-list-card">
          <h2>My Goals</h2>

          {loading && goals.length === 0 ? (
            <p className="hint">Loading goals...</p>
          ) : goals.length === 0 ? (
            <p className="hint">No goals yet. Add your first goal.</p>
          ) : (
            <div className="goal-list">
              {goals.map((goal) => (
                <div key={goal._id} className="goal-item">
                  <div className="goal-item-top">
                    <div>
                      <h3>{goal.name}</h3>
                      <p className="goal-item-description">
                        {goal.description || "No description yet."}
                      </p>
                    </div>

                    <span className={`goal-status ${goal.status.replace(/\s+/g, "-")}`}>
                      {goal.status}
                    </span>
                  </div>

                  <div className="button-row">
                    <button
                      className="secondary"
                      onClick={() => handleEdit(goal)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-button"
                      onClick={() => handleDelete(goal._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoalWindow;