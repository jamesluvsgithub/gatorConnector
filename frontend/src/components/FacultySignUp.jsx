import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FacultySignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    specialty: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.specialty
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/facultyAuth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccess("Faculty account created!");

      setTimeout(() => {
        navigate("/faculty-login");
      }, 1000);
    } catch (err) {
      setError(err.message || "Server error");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Faculty Sign Up</h2>

        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          name="specialty"
          placeholder="Specialty"
          value={formData.specialty}
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button onClick={handleSubmit}>Create Faculty Account</button>

        <div className="button-row">
          <button onClick={() => navigate("/faculty-login")}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultySignUp;