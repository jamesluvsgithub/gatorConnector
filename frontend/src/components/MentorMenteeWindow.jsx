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
        const userType = userObj.type; // IMPORTANT: mentor or mentee

        // 🔥 choose correct endpoint based on user type
        const endpoint =
          userType === "mentor"
            ? `/api/matching/top/mentor/${userId}`
            : `/api/matching/top/mentee/${userId}`;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}${endpoint}`,
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

        if (Array.isArray(data) && data.length > 0) {
          setPeople(data);
        } else {
          setMessage("No matches found.");
          setPeople([]);
        }
      } catch (err) {
        console.error(err);
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
        <h1 style={styles.title}>Find your Match</h1>
        <p style={styles.subtitle}>
          Scroll through profiles to explore possible matches.
        </p>

        <div style={styles.listBox}>
          {loading && <p style={styles.messageText}>Loading profiles...</p>}

          {!loading && message && (
            <p style={styles.messageText}>{message}</p>
          )}

          {!loading &&
            people.map((match) => (
              <div key={match.candidate.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <h2 style={styles.name}>
                    {match.candidate.username}
                  </h2>
                  <span style={styles.scoreTag}>
                    {match.score}% match
                  </span>
                </div>

                <p style={styles.label}>Majors</p>
                <p style={styles.info}>
                  {match.candidate.majors?.length
                    ? match.candidate.majors.join(", ")
                    : "Not provided"}
                </p>

                <p style={styles.label}>Minors</p>
                <p style={styles.info}>
                  {match.candidate.minors?.length
                    ? match.candidate.minors.join(", ")
                    : "Not provided"}
                </p>

                <p style={styles.label}>Hobbies</p>
                <p style={styles.info}>
                  {match.candidate.hobbies?.length
                    ? match.candidate.hobbies.join(", ")
                    : "Not provided"}
                </p>

                <button style={styles.button}>
                  View Profile
                </button>
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
    display: "flex",
    flexDirection: "column",
    gap: "14px",
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
  },
  name: {
    margin: 0,
    fontSize: "20px",
  },
  scoreTag: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#dcfce7",
    color: "#15803d",
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
  },
  button: {
    marginTop: "12px",
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  messageText: {
    textAlign: "center",
    color: "#6b7280",
  },
};

export default MentorMenteeWindow;