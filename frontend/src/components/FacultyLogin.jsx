import { useState } from "react";
import FacultyStudentList from "./FacultyStudentList";

function FacultyLogin({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleFacultyLogin = async () => {

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {}

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setLoggedIn(true);
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return <FacultyStudentList onBack={onBack} />;
  }

  return (
    <div className="page">
      <div className="card">
        <h2>Faculty Login</h2>

        <input
          type="text"
          placeholder="Faculty Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleFacultyLogin} disabled={loading}>
          {loading ? "Logging in..." : "Faculty Login"}
        </button>

        <div className="button-row">
          <button className="secondary" onClick={onBack}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultyLogin;