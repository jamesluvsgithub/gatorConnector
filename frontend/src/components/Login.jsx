import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (username === "admin" && password === "123") {
      setError("");
      setLoggedIn(true);
    } else {
      setError("Invalid username or password");
    }
  };

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

        <button onClick={handleLogin}>Login</button>

        <p className="hint">Demo: admin / 123</p>
      </div>
    </div>
  );
}

export default Login;