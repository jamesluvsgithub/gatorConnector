
import { useEffect, useState } from "react";

function MentorMenteeWindow() {

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getMatches = async () => {
      setLoading(true);
      setMessage("");
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!userStr || !token) {
          setMessage("Not logged in.");
          setLoading(false);
          return;
        }
        const userObj = JSON.parse(userStr);
        const userId = userObj._id || userObj.id;
        const response = await fetch(`http://localhost:4000/api/matching/top/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Could not get matches");
        }
        const data = await response.json();
        console.log("[MentorMenteeWindow] matches API response:", data);
        if (Array.isArray(data.matches) && data.matches.length > 0) {
          // Get current user's role
          const userRole = userObj.role || userObj.accountType || userObj.type || "";
          // Determine opposite role
          let targetRole = "";
          if (userRole.toLowerCase() === "mentor") targetRole = "mentee";
          else if (userRole.toLowerCase() === "mentee") targetRole = "mentor";
          // Filter matches for opposite role only
          const filtered = data.matches.filter(
            (person) => {
              const matchRole = (person.role || person.accountType || person.type || "").toLowerCase();
              return matchRole === targetRole;
            }
          );
          setPeople(filtered);
          if (filtered.length === 0) setMessage("No matches found.");
        } else {
          setMessage("No matches found.");
          setPeople([]);
        }
      } catch (error) {
        setMessage("Error loading matches.");
        setPeople([]);
      } finally {
        setLoading(false);
      }
    };
    getMatches();
  }, []);



  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Meet your match</h1>
        <p style={styles.subtitle}>
          Scroll through profiles to explore possible matches.
        </p>

        <div style={styles.listBox}>
          {loading && <p style={styles.messageText}>Loading profiles...</p>}

          {!loading && message && (
            <p style={styles.messageText}>{message}</p>
          )}

          {!loading &&
            people.map((person, idx) => {
              // Try to handle different possible field names and structures
              const name = person.username || person.name || person.fullName || "User";
              const role = person.role || person.accountType || person.type || "";
              const majors = Array.isArray(person.majors)
                ? person.majors.join(", ")
                : person.majors || person.major || "Not provided";
              const minors = Array.isArray(person.minors)
                ? person.minors.join(", ")
                : person.minors || person.minor || "Not provided";
              const hobbies = Array.isArray(person.hobbies)
                ? person.hobbies.join(", ")
                : person.hobbies || person.hobby || "Not provided";
              return (
                <div key={person._id || person.id || idx} style={styles.card}>
                  <div style={styles.cardTop}>
                    <h2 style={styles.name}>{name}</h2>
                    <span
                      style={{
                        ...styles.roleTag,
                        backgroundColor:
                          role === "Mentor"
                            ? "#dbeafe"
                            : "#ede9fe",
                        color:
                          role === "Mentor"
                            ? "#1d4ed8"
                            : "#6d28d9",
                      }}
                    >
                      {role || "User"}
                    </span>
                  </div>

                  <p style={styles.label}>Majors</p>
                  <p style={styles.info}>{majors}</p>

                  <p style={styles.label}>Minors</p>
                  <p style={styles.info}>{minors}</p>

                  <p style={styles.label}>Hobbies</p>
                  <p style={styles.info}>{hobbies}</p>

                  <button style={styles.button}>View Profile</button>
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