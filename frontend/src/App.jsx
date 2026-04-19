import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import GoalWindow from "./components/GoalWindow";
import MentorMenteeWindow from "./components/MentorMenteeWindow";
import StudentWindow from "./components/StudentWindow";
import ChatWindow from "./components/ChatWindow";
import FacultyLogin from "./components/FacultyLogin";
import FacultyStudentList from "./components/FacultyStudentList";

function App() {
  const linkStyle = {
    textDecoration: "none",
    color: "#374151",
    padding: "6px 12px",
    borderRadius: "6px",
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
        <Link to="/" style={linkStyle}>Login</Link>
        <Link to="/signup" style={linkStyle}>Sign Up</Link>
        <Link to="/goals" style={linkStyle}>Goals</Link>
        <Link to="/mentors" style={linkStyle}>Mentors</Link>
        <Link to="/students" style={linkStyle}>Students</Link>
        <Link to="/chat" style={linkStyle}>Chat</Link>
        <Link to="/faculty-login" style={linkStyle}>Faculty Login</Link>
        <Link to="/faculty-students" style={linkStyle}>Faculty Students</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/goals" element={<GoalWindow />} />
        <Route path="/mentors" element={<MentorMenteeWindow />} />
        <Route path="/students" element={<StudentWindow />} />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        <Route path="/faculty-students" element={<FacultyStudentList />} />
      </Routes>
    </Router>
  );
}

export default App;