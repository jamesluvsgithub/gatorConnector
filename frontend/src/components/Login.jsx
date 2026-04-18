import { useState } from "react";
import SignUp from "./SignUp";
import FacultyLogin from "./FacultyLogin";

function Login() {
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoggedIn(true);
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "signup") {
    return <SignUp onBack={() => setMode("login")} />;
  }

  if (mode === "faculty") {
    return <FacultyLogin onBack={() => setMode("login")} />;
  }

  if (loggedIn) {
    return (
      <div className="page">
        <div className="card">
          <h2>Welcome, {username}!</h2>
          <p className="hint">You have successfully logged in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
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

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="button-row">
          <button className="secondary" onClick={() => setMode("signup")}>
            Sign Up
          </button>

          <button className="secondary" onClick={() => setMode("faculty")}>
            Faculty Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;