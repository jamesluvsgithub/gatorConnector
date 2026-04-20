
import React, { useState, useEffect, useRef } from "react";

function TagInput({ label, items, setItems, placeholder }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const handleInput = (e) => setInput(e.target.value);
  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!items.includes(input.trim())) {
        setItems([...items, input.trim()]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && items.length) {
      setItems(items.slice(0, -1));
    }
  };
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>{label}</label>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        minHeight: 44,
        border: "1px solid #cbd5e1",
        borderRadius: 8,
        background: "#fff",
        padding: "6px 8px"
      }} onClick={() => inputRef.current && inputRef.current.focus()}>
        {items.map((item, idx) => (
          <span key={idx} style={{
            display: "flex",
            alignItems: "center",
            background: "#e0e7ff",
            color: "#3730a3",
            borderRadius: 16,
            padding: "4px 12px 4px 10px",
            fontSize: 14,
            fontWeight: 500
          }}>
            {item}
            <button type="button" onClick={() => removeItem(idx)} style={{
              marginLeft: 6,
              background: "none",
              border: "none",
              color: "#6366f1",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer"
            }} aria-label="Remove">×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            minWidth: 120,
            border: "none",
            outline: "none",
            fontSize: 15,
            background: "#fff",
            padding: "6px 0"
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}


function Profile() {
  const [majors, setMajors] = useState([]);
  const [minors, setMinors] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [currentProfile, setCurrentProfile] = useState({ majors: [], minors: [], hobbies: [], role: "" });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setMajors(userObj.majors || []);
      setMinors(userObj.minors || []);
      setHobbies(userObj.hobbies || []);
      setRole(userObj.role || "");
      setCurrentProfile({
        majors: userObj.majors || [],
        minors: userObj.minors || [],
        hobbies: userObj.hobbies || [],
        role: userObj.role || ""
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        setMessage("Not logged in.");
        return;
      }
      const userObj = JSON.parse(userStr);
      const userId = userObj.id || userObj._id;
      // Update user profile
      const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          majors,
          minors,
          hobbies,
          role,
        })
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      setMessage("Profile updated!");
      // Fetch the latest user profile from backend
      const getUser = await fetch(`http://localhost:4000/api/users/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!getUser.ok) {
        throw new Error("Failed to fetch updated profile");
      }
      const updatedUser = await getUser.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentProfile({
        majors: updatedUser.majors || [],
        minors: updatedUser.minors || [],
        hobbies: updatedUser.hobbies || [],
        role: updatedUser.role || ""
      });
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "48px auto",
      padding: "32px 32px 28px 32px",
      background: "#f9fafb",
      borderRadius: 18,
      boxShadow: "0 6px 32px 0 rgba(0,0,0,0.10)",
      border: "1px solid #e5e7eb"
    }}>
      <h2 style={{
        textAlign: "center",
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 8,
        color: "#1e293b"
      }}>Edit Profile</h2>
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "18px 20px 10px 20px",
        marginBottom: 24,
        boxShadow: "0 2px 8px #f1f5f9"
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#334155", margin: 0, marginBottom: 8 }}>Current Profile</h3>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: "#64748b", fontWeight: 500 }}>Majors:</span>
          {currentProfile.majors.length > 0 ? (
            currentProfile.majors.map((m, i) => (
              <span key={i} style={{
                background: "#e0e7ff",
                color: "#3730a3",
                borderRadius: 12,
                padding: "2px 10px",
                marginLeft: 8,
                fontSize: 14,
                fontWeight: 500
              }}>{m}</span>
            ))
          ) : (
            <span style={{ marginLeft: 8, color: "#94a3b8" }}>None</span>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: "#64748b", fontWeight: 500 }}>Minors:</span>
          {currentProfile.minors.length > 0 ? (
            currentProfile.minors.map((m, i) => (
              <span key={i} style={{
                background: "#fef9c3",
                color: "#b45309",
                borderRadius: 12,
                padding: "2px 10px",
                marginLeft: 8,
                fontSize: 14,
                fontWeight: 500
              }}>{m}</span>
            ))
          ) : (
            <span style={{ marginLeft: 8, color: "#94a3b8" }}>None</span>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: "#64748b", fontWeight: 500 }}>Hobbies:</span>
          {currentProfile.hobbies.length > 0 ? (
            currentProfile.hobbies.map((h, i) => (
              <span key={i} style={{
                background: "#d1fae5",
                color: "#047857",
                borderRadius: 12,
                padding: "2px 10px",
                marginLeft: 8,
                fontSize: 14,
                fontWeight: 500
              }}>{h}</span>
            ))
          ) : (
            <span style={{ marginLeft: 8, color: "#94a3b8" }}>None</span>
          )}
        </div>
        <div style={{ marginBottom: 0 }}>
          <span style={{ color: "#64748b", fontWeight: 500 }}>Role:</span>
          {currentProfile.role ? (
            <span style={{
              background: currentProfile.role === "Mentor" ? "#dbeafe" : "#ede9fe",
              color: currentProfile.role === "Mentor" ? "#1d4ed8" : "#6d28d9",
              borderRadius: 12,
              padding: "2px 10px",
              marginLeft: 8,
              fontSize: 14,
              fontWeight: 500
            }}>{currentProfile.role}</span>
          ) : (
            <span style={{ marginLeft: 8, color: "#94a3b8" }}>None</span>
          )}
        </div>
      </div>
      <p style={{
        textAlign: "center",
        color: "#64748b",
        marginBottom: 28,
        fontSize: 15
      }}>
        Update your majors, minors, and hobbies to get better matches!
      </p>
      <form onSubmit={handleSubmit}>
        <TagInput label="Majors" items={majors} setItems={setMajors} placeholder="Add a major and press Enter" />
        <TagInput label="Minors" items={minors} setItems={setMinors} placeholder="Add a minor and press Enter" />
        <TagInput label="Hobbies" items={hobbies} setItems={setHobbies} placeholder="Add a hobby and press Enter" />
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 15,
              background: "#fff"
            }}
          >
            <option value="">Select...</option>
            <option value="Mentor">Mentor</option>
            <option value="Mentee">Mentee</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 0.5,
            boxShadow: "0 2px 8px #dbeafe",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          Save Changes
        </button>
      </form>
      {message && <p style={{ marginTop: 22, textAlign: "center", color: message.includes("Error") ? "#dc2626" : "#059669", fontWeight: 600 }}>{message}</p>}
    </div>
  );
}

export default Profile;
