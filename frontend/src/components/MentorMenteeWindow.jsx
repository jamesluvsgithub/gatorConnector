import { useEffect, useState } from "react";

const samplePeople = [
  {
    id: 1,
    name: "Camila Gomez",
    role: "Mentor",
    major: "Computer Science",
    interests: "Web Development, UX Design",
  },
  {
    id: 2,
    name: "David Nguyen",
    role: "Mentee",
    major: "Information Systems",
    interests: "Data Analytics, Product Design",
  },
  {
    id: 3,
    name: "Sofia Brown",
    role: "Mentor",
    major: "Computer Engineering",
    interests: "Robotics, Embedded Systems",
  },
  {
    id: 4,
    name: "Marleigh Martinez",
    role: "Mentee",
    major: "Digital Arts and Sciences",
    interests: "UI/UX, Frontend Development",
  },
  {
    id: 5,
    name: "Ethan Russell",
    role: "Mentor",
    major: "Data Science",
    interests: "Machine Learning, Python",
  },
];

function MentorMenteeWindow() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getPeople = async () => {
      try {
        const response = await fetch("http://localhost:4000/users");

        if (!response.ok) {
          throw new Error("Could not get users");
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setPeople(data);
        } else {
          setPeople(samplePeople);
          setMessage("Showing sample profiles for now.");
        }
      } catch (error) {
        console.log("Backend not ready yet, using sample data.");
        setPeople(samplePeople);
        setMessage("Showing sample profiles for now.");
      } finally {
        setLoading(false);
      }
    };

    getPeople();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Mentors and Mentees</h1>
        <p style={styles.subtitle}>
          Scroll through profiles to explore possible matches.
        </p>

        <div style={styles.listBox}>
          {loading && <p style={styles.messageText}>Loading profiles...</p>}

          {!loading && message && (
            <p style={styles.messageText}>{message}</p>
          )}

          {!loading &&
            people.map((person) => (
              <div key={person.id || person._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <h2 style={styles.name}>{person.name || person.username}</h2>
                  <span
                    style={{
                      ...styles.roleTag,
                      backgroundColor:
                        (person.role || person.accountType) === "Mentor"
                          ? "#dbeafe"
                          : "#ede9fe",
                      color:
                        (person.role || person.accountType) === "Mentor"
                          ? "#1d4ed8"
                          : "#6d28d9",
                    }}
                  >
                    {person.role || person.accountType || "User"}
                  </span>
                </div>

                <p style={styles.label}>Major</p>
                <p style={styles.info}>{person.major || "Not provided"}</p>

                <p style={styles.label}>Interests</p>
                <p style={styles.info}>
                  {person.interests || "Not provided"}
                </p>

                <button style={styles.button}>View Profile</button>
              </div>
            ))}
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
  roleTag: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
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

export default MentorMenteeWindow;