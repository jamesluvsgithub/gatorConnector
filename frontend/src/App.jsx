import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import GoalWindow from "./components/GoalWindow";
import MentorMenteeWindow from "./components/MentorMenteeWindow";
import StudentWindow from "./components/StudentWindow";
import ChatWindow from "./components/ChatWindow";
import FacultyLogin from "./components/FacultyLogin";
import FacultyStudentList from "./components/FacultyStudentList";
import WelcomePage from "./components/WelcomePage";
import FacultySignUp from "./components/FacultySignUp";
import ProfileWindow from "./components/ProfileWindow";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const studentToken = localStorage.getItem("token");
    const facultyToken = localStorage.getItem("facultyToken");

    if (studentToken) {
      setIsLoggedIn(true);
      setUserType("student");
    } else if (facultyToken) {
      setIsLoggedIn(true);
      setUserType("faculty");
    }
  }, []);

  const linkStyle = {
    textDecoration: "none",
    color: "#374151",
    padding: "6px 12px",
    borderRadius: "6px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("facultyUser");
    localStorage.removeItem("facultyToken");
    navigate("/");
  };

  const publicPaths = ["/", "/login", "/signup", "/faculty-login", "/faculty-signup"];
  const shouldShowNav = isLoggedIn && !publicPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNav && (
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
          {userType === "student" && (
            <>
              <Link to="/goals" style={linkStyle}>Goals</Link>
              <Link to="/profile" style={linkStyle}>Profile</Link>
              <Link to="/mentors" style={linkStyle}>Mentors</Link>
              <Link to="/students" style={linkStyle}>Students</Link>
              <Link to="/chat" style={linkStyle}>Chat</Link>
            </>
          )}

          {userType === "faculty" && (
            <>
              <Link to="/faculty-students" style={linkStyle}>Faculty Students</Link>
            </>
          )}

          <button onClick={handleLogout} style={linkStyle}>Logout</button>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/login"
          element={
            <Login
              onLogin={() => {
                setIsLoggedIn(true);
                setUserType("student");
              }}
            />
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/faculty-login"
          element={
            <FacultyLogin
              onLogin={() => {
                setIsLoggedIn(true);
                setUserType("faculty");
              }}
            />
          }
        />
        <Route path="/faculty-signup" element={<FacultySignUp />} />
        <Route path="/goals" element={<GoalWindow />} />
        <Route path="/profile" element={<ProfileWindow />} />
        <Route path="/mentors" element={<MentorMenteeWindow />} />
        <Route path="/students" element={<StudentWindow />} />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/faculty-students" element={<FacultyStudentList />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;