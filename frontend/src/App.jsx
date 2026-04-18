import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import GoalWindow from "./components/GoalWindow";
import MentorMenteeWindow from "./components/MentorMenteeWindow";

function App() {
  const linkStyle = {
    textDecoration: "none",
    color: "#374151",
    padding: "6px 12px",
    borderRadius: "6px",
  };

  return (
    <Router>
      {/* Navbar */}
      <nav
        style={{
          padding: "12px 24px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          gap: "20px",
          alignItems: "center",
          fontWeight: "500",
          position: "sticky",
          top: 0,
        }}
      >
        <Link to="/" style={linkStyle}>Login</Link>
        <Link to="/goals" style={linkStyle}>Goals</Link>
        <Link to="/mentors" style={linkStyle}>Mentors</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/goals" element={<GoalWindow />} />
        <Route path="/mentors" element={<MentorMenteeWindow />} />
      </Routes>
    </Router>
  );
}

export default App;