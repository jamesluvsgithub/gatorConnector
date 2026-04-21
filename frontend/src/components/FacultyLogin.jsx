import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FacultyLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFacultyLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facultyAuth/login`, {
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

      localStorage.setItem("facultyUser", JSON.stringify(data.user || { username }));
      if (data.token) {
        localStorage.setItem("facultyToken", data.token);
      }

      if (onLogin) {
        onLogin();
      }

      navigate("/faculty-students");
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
          <button
            className="secondary"
            onClick={() => navigate("/faculty-signup")}
          >
            Sign Up as Faculty
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultyLogin;