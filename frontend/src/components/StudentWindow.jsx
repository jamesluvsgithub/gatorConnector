import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleStudents = [
  {
    id: 1,
    name: "Camila Gomez",
    major: "Computer Science",
    year: "Junior",
    interests: "Web Development, UX Design",
  },
  {
    id: 2,
    name: "David Nguyen",
    major: "Information Systems",
    year: "Senior",
    interests: "Data Analytics, Product Design",
  },
  {
    id: 3,
    name: "Sofia Brown",
    major: "Computer Engineering",
    year: "Sophomore",
    interests: "Robotics, Embedded Systems",
  },
  {
    id: 4,
    name: "Marleigh Martinez",
    major: "Digital Arts and Sciences",
    year: "Freshman",
    interests: "UI/UX, Frontend Development",
  },
  {
    id: 5,
    name: "Ethan Russell",
    major: "Data Science",
    year: "Junior",
    interests: "Machine Learning, Python",
  },
];

function StudentWindow() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/users/all");
        if (!response.ok) {
          throw new Error("Could not get students");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
          setMessage("");
        } else {
          setStudents(sampleStudents);
          setMessage("Showing sample student data for now.");
        }
      } catch (error) {
        console.log("Backend not ready yet, using sample student data.");
        setStudents(sampleStudents);
        setMessage("Showing sample student data for now.");
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Community</h1>
        <p style={styles.subtitle}>
          Scroll through student profiles to view their information.
        </p>

        <div style={styles.listBox}>
          {loading && <p style={styles.messageText}>Loading students...</p>}

          {!loading && message && (
            <p style={styles.messageText}>{message}</p>
          )}

          {!loading &&
            students.map((student) => {
              const name = student.username || student.name || student.fullName || "User";
              const majors = Array.isArray(student.majors) ? student.majors.join(", ") : student.majors || student.major || "Not provided";
              const minors = Array.isArray(student.minors) ? student.minors.join(", ") : student.minors || student.minor || "Not provided";
              const hobbies = Array.isArray(student.hobbies) ? student.hobbies.join(", ") : student.hobbies || student.hobby || "Not provided";
              return (
                <div key={student._id || student.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <h2 style={styles.name}>{name}</h2>
                  </div>

                  <p style={styles.label}>Majors</p>
                  <p style={styles.info}>{majors}</p>

                  <p style={styles.label}>Minors</p>
                  <p style={styles.info}>{minors}</p>

                  <p style={styles.label}>Hobbies</p>
                  <p style={styles.info}>{hobbies}</p>

                  <button
                    style={styles.button}
                    onClick={() => {
                      const name = encodeURIComponent(student.username || student.name || student.fullName || "User");
                      navigate(`/chat?userId=${student._id || student.id}&username=${name}`);
                    }}
                  >
                    Chat with Student
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  title: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "28px",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
  },
  listBox: {
    maxHeight: "500px",
    overflowY: "auto",
    scrollBehavior: "smooth",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    paddingRight: "6px",
  },
  card: {
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    padding: "16px",
    backgroundColor: "#fafafa",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  name: {
    margin: 0,
    fontSize: "20px",
  },
  label: {
    margin: "8px 0 2px 0",
    fontWeight: "600",
    fontSize: "13px",
    color: "#4b5563",
  },
  info: {
    margin: 0,
    fontSize: "14px",
    color: "#111827",
  },
  button: {
    marginTop: "12px",
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
  messageText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "6px",
  },
};

export default StudentWindow;