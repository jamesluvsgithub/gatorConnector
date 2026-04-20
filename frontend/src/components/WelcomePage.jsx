import { Link } from "react-router-dom";

function WelcomePage() {
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: "20px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    maxWidth: "700px",
    width: "100%",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#111827",
  };

  const textStyle = {
    fontSize: "18px",
    color: "#4b5563",
    lineHeight: "1.6",
    marginBottom: "28px",
  };

  const buttonRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  };

  const primaryButtonStyle = {
    textDecoration: "none",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 22px",
    borderRadius: "10px",
    fontWeight: "600",
  };

  const secondaryButtonStyle = {
    textDecoration: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "12px 22px",
    borderRadius: "10px",
    fontWeight: "600",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Welcome to Gator Connectors</h1>

        <p style={textStyle}>
          Gator Connectors is a Gainesville-focused platform designed to help UF and Santa Fe College students build meaningful connections with peers and faculty.
<br /><br />
Starting college can feel overwhelming — whether you're new to campus, an international student, or simply unsure how to find people who share your interests. Our platform makes it easier by creating intentional connections based on your academic goals, interests, and background.
<br /><br />
Users can build profiles and connect through mentorship or peer networking. Whether you're looking for guidance, community, or collaboration, Gator Connectors helps you find people who truly align with you.
        </p>

        <div style={buttonRowStyle}>
          <Link to="/login" style={primaryButtonStyle}>
            Login
          </Link>

          <Link to="/signup" style={secondaryButtonStyle}>
            Sign Up
          </Link>

          <Link to="/faculty-login" style={secondaryButtonStyle}>
            Faculty Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;