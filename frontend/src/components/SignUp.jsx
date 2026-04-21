import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    major: "",
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
      !formData.confirmPassword ||
      !formData.major
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          majors: formData.major
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      setSuccess("Account created successfully!");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        major: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.message || "Server error. Please try again later.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Sign Up</h2>

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
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <input
          name="major"
          placeholder="Major"
          value={formData.major}
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button onClick={handleSubmit}>Create Account</button>

        <div className="button-row">
          <button className="secondary" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;