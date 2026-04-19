import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import GoalWindow from "./components/GoalWindow";
import MentorMenteeWindow from "./components/MentorMenteeWindow";
import StudentWindow from "./components/StudentWindow";
import ChatWindow from "./components/ChatWindow";
import FacultyLogin from "./components/FacultyLogin";
import FacultyStudentList from "./components/FacultyStudentList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const linkStyle = {
    textDecoration: "none",
    color: "#374151",
    padding: "6px 12px",
    borderRadius: "6px",
  };

  const logoutButtonStyle = {
    border: "none",
    background: "transparent",
    color: "#374151",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
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
        {!isLoggedIn ? (
          <>
            <Link to="/" style={linkStyle}>Login</Link>
            <Link to="/signup" style={linkStyle}>Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/goals" style={linkStyle}>Goals</Link>
            <Link to="/mentors" style={linkStyle}>Mentors</Link>
            <Link to="/students" style={linkStyle}>Students</Link>
            <Link to="/chat" style={linkStyle}>Chat</Link>
            <Link to="/faculty-login" style={linkStyle}>Faculty Login</Link>
            <Link to="/faculty-students" style={linkStyle}>Faculty Students</Link>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/goals"
          element={isLoggedIn ? <GoalWindow /> : <Navigate to="/" />}
        />
        <Route
          path="/mentors"
          element={isLoggedIn ? <MentorMenteeWindow /> : <Navigate to="/" />}
        />
        <Route
          path="/students"
          element={isLoggedIn ? <StudentWindow /> : <Navigate to="/" />}
        />
        <Route
          path="/chat"
          element={isLoggedIn ? <ChatWindow /> : <Navigate to="/" />}
        />
        <Route
          path="/faculty-login"
          element={isLoggedIn ? <FacultyLogin /> : <Navigate to="/" />}
        />
        <Route
          path="/faculty-students"
          element={isLoggedIn ? <FacultyStudentList /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;