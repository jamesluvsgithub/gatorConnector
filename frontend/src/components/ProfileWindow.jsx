import { useEffect, useState } from "react";

function ProfileWindow() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    majors: "",
    minors: "",
    hobbies: "",
    isPublic: false,
  });

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setProfile({
            username: data.username || "",
            email: data.email || "",
            bio: data.bio || "",
            majors: data.majors?.join(", ") || "",
            minors: data.minors?.join(", ") || "",
            hobbies: data.hobbies?.join(", ") || "",
            isPublic: data.isPublic === true,
          });
        } else {
          setMessage(data.error || "Failed to load profile");
        }
      } catch (err) {
        setMessage("Server error");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: profile.bio,
          majors: profile.majors.split(",").map((item) => item.trim()).filter(Boolean),
          minors: profile.minors.split(",").map((item) => item.trim()).filter(Boolean),
          hobbies: profile.hobbies.split(",").map((item) => item.trim()).filter(Boolean),
          isPublic: profile.isPublic,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Profile updated successfully");
        setEditing(false);
      } else {
        setMessage(data.error || "Failed to update profile");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>{profile.username}</h1>
          <p className="profile-email">{profile.email}</p>
        </div>

        <div className="profile-card-large">
          <h2>BIO</h2>
          {editing ? (
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="4"
            />
          ) : (
            <p>
            {profile.bio && profile.bio !== "No bio (yet!)"
                ? profile.bio
                : "Add a short bio about yourself."}
            </p>
          )}
        </div>

        <div className="profile-grid">
          <div className="profile-info-card">
            <h3>Public Profile</h3>
            {editing ? (
              <label className="profile-checkbox">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={profile.isPublic}
                  onChange={handleChange}
                />
                Yes
              </label>
            ) : (
              <p>{profile.isPublic ? "Yes" : "No"}</p>
            )}
          </div>

          <div className="profile-info-card">
            <h3>Majors</h3>
            {editing ? (
              <input
                type="text"
                name="majors"
                value={profile.majors}
                onChange={handleChange}
                placeholder="e.g. Computer Science, Math (Required)"
              />
            ) : (
              <p>{profile.majors || "None"}</p>
            )}
          </div>

          <div className="profile-info-card">
            <h3>Minors</h3>
            {editing ? (
              <input
                type="text"
                name="minors"
                value={profile.minors}
                onChange={handleChange}
                placeholder="e.g. Statistics"
              />
            ) : (
              <p>{profile.minors || "None"}</p>
            )}
          </div>

          <div className="profile-info-card">
            <h3>Hobbies</h3>
            {editing ? (
              <input
                type="text"
                name="hobbies"
                value={profile.hobbies}
                onChange={handleChange}
                placeholder="e.g. Reading, Tennis"
              />
            ) : (
              <p>{profile.hobbies || "None"}</p>
            )}
          </div>
        </div>

        <div className="button-row profile-actions">
          {editing ? (
            <>
              <button className="secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button onClick={handleSave}>Save</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>

        {message && <p className="success">{message}</p>}
      </div>
    </div>
  );
}

export default ProfileWindow;