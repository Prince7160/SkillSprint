import React, { useState } from "react";
import { PlusCircle, ArrowRight, Briefcase } from "lucide-react";

/**
 * LoginView Component:
 * Displayed when user is logged out.
 * Allows user to log into one profile or create a new account.
 */
export default function LoginView({ users, onLogin, onRegisterUser }) {
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("FREELANCER");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please provide your name and email.");
      return;
    }

    setLoading(true);
    try {
      const newUser = await onRegisterUser({
        name: name.trim(),
        email: email.trim(),
        role,
        title: title.trim() || (role === "CLIENT" ? "Hiring Manager" : "Freelance Developer"),
        bio: role === "CLIENT" ? "Looking to hire talent for software projects." : "Available for freelance contracts.",
        skills: skills.trim(),
        hourlyRate: role === "FREELANCER" ? Number(hourlyRate) || 500.0 : 0.0,
      });
      onLogin(newUser);
    } catch (err) {
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-icon-wrap">
        <Briefcase size={28} />
      </div>

      <h2 className="login-title">Welcome to SkillSprint</h2>
      <p className="login-subtitle">
        {showRegister
          ? "Create your profile to start hiring or getting hired"
          : "Sign in to your profile to continue"}
      </p>

      {!showRegister ? (
        <>
          <div className="account-cards-list">
            {users.map((u) => (
              <div
                key={u.id}
                className="account-card-item"
                onClick={() => onLogin(u)}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {u.title || u.email}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    className={`badge ${
                      u.role === "CLIENT" ? "badge-primary" : "badge-success"
                    }`}
                  >
                    {u.role}
                  </span>
                  <ArrowRight size={16} color="#64748b" />
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-outline"
            style={{ width: "100%" }}
            onClick={() => setShowRegister(true)}
          >
            <PlusCircle size={16} /> Create a New Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleRegisterSubmit} style={{ textAlign: "left" }}>
          <div className="form-group">
            <label className="form-label">Full Name or Company:</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. John Doe or Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address:</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">I want to join as:</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="FREELANCER">Freelancer (Looking for Work)</option>
              <option value="CLIENT">Client (Looking to Hire)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Headline / Title:</label>
            <input
              type="text"
              className="form-control"
              placeholder={role === "CLIENT" ? "e.g. Founder at TechCo" : "e.g. Full-Stack React & Kotlin Developer"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {role === "FREELANCER" && (
            <>
              <div className="form-group">
                <label className="form-label">Skills (comma separated):</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. React, Kotlin, MySQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hourly Rate (₹ INR):</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 500"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-actions" style={{ marginTop: "1.25rem" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowRegister(false)}
            >
              Back to Sign In
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Sign Up & Enter"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
