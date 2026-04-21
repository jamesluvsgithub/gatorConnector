import React, { useEffect, useState } from "react";
import "../App.css";

function FacultyStudentList() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("facultyToken");

      if (!token) {
        throw new Error("No faculty token found. Please log in again.");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch students");
      }

      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStudents();
}, []);

    if (loading) {
        return (
            <div className="faculty-page">
                <div className="faculty-status-card">Loading student information...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="faculty-page">
                <div className="faculty-status-card error-text">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="faculty-page">
            <div className="faculty-container">
                <div className="faculty-header">
                    <p className="faculty-label">Faculty Dashboard</p>
                    <h1>Student Information</h1>
                    <p className="faculty-subtitle">
                        View student profile details and public information.
                    </p>
                </div>

                {students.length === 0 ? (
                    <div className="faculty-status-card">No student information available.</div>
                ) : (
                    <div className="faculty-grid">
                        {students.map((student) => (
                            <div key={student._id} className="faculty-student-card">
                                <div className="faculty-card-top">
                                    <div>
                                        <h2>{student.username}</h2>
                                        <p className="faculty-email">{student.email}</p>
                                    </div>
                                    <span className="faculty-role-badge">{student.role}</span>
                                </div>

                                <div className="faculty-bio-box">
                                    <p className="faculty-section-title">Bio</p>
                                    <p className="faculty-bio-text">
                                        {student.bio || "No bio yet"}
                                    </p>
                                </div>

                                <div className="faculty-info-grid">
                                    <div className="faculty-info-item">
                                        <span className="faculty-info-label">Public Profile</span>
                                        <span className="faculty-info-value">
                                            {student.isPublic ? "Yes" : "No"}
                                        </span>
                                    </div>

                                    <div className="faculty-info-item">
                                        <span className="faculty-info-label">Majors</span>
                                        <span className="faculty-info-value">
                                            {student.majors && student.majors.length > 0
                                                ? student.majors.join(", ")
                                                : "None"}
                                        </span>
                                    </div>

                                    <div className="faculty-info-item">
                                        <span className="faculty-info-label">Minors</span>
                                        <span className="faculty-info-value">
                                            {student.minors && student.minors.length > 0
                                                ? student.minors.join(", ")
                                                : "None"}
                                        </span>
                                    </div>

                                    <div className="faculty-info-item">
                                        <span className="faculty-info-label">Hobbies</span>
                                        <span className="faculty-info-value">
                                            {student.hobbies && student.hobbies.length > 0
                                                ? student.hobbies.join(", ")
                                                : "None"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FacultyStudentList;