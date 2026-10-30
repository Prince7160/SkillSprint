import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import JobList from "./components/JobList";
import JobModal from "./components/JobModal";
import PostJobModal from "./components/PostJobModal";
import FreelancerList from "./components/FreelancerList";
import ProposalsList from "./components/ProposalsList";
import LoginView from "./components/LoginView";
import {
  fetchJobs,
  fetchUsers,
  fetchProposals,
  createJob,
  deleteJob,
  createUser,
  submitProposal,
  updateProposalStatus,
} from "./api";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);

  const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "freelancers" | "proposals"
  const [selectedJob, setSelectedJob] = useState(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);

  // Load all initial data from Spring Boot API
  const loadData = async () => {
    setLoading(true);
    setBackendError(null);
    try {
      const [usersData, jobsData, proposalsData] = await Promise.all([
        fetchUsers(),
        fetchJobs(),
        fetchProposals(),
      ]);

      setUsers(usersData);
      setJobs(jobsData);
      setProposals(proposalsData);

      // Check if user was previously logged in
      const savedUserId = localStorage.getItem("skillsprint_user_id");
      if (savedUserId) {
        const foundUser = usersData.find((u) => u.id === Number(savedUserId));
        if (foundUser) {
          setCurrentUser(foundUser);
          return;
        }
      }

      // Default to the first profile if not logged out
      const isLoggedOut = localStorage.getItem("skillsprint_logged_out") === "true";
      if (!isLoggedOut && usersData.length > 0) {
        const defaultUser = usersData[0];
        setCurrentUser(defaultUser);
        localStorage.setItem("skillsprint_user_id", defaultUser.id);
      }
    } catch (err) {
      console.error("Backend connection error:", err);
      setBackendError(
        "Could not connect to the Kotlin Spring Boot backend at http://localhost:8080. Make sure the backend server is running!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("skillsprint_user_id");
    localStorage.setItem("skillsprint_logged_out", "true");
  };

  // Handle Login
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("skillsprint_user_id", user.id);
    localStorage.removeItem("skillsprint_logged_out");
    setActiveTab("jobs");
  };

  // Register a new user
  const handleRegisterUser = async (newUserData) => {
    const created = await createUser(newUserData);
    setUsers([...users, created]);
    return created;
  };

  // Create a new job (Client action)
  const handleCreateJob = async (newJobData) => {
    const created = await createJob(newJobData);
    setJobs([created, ...jobs]);
    setNotification({
      type: "success",
      message: "Job posted successfully!",
    });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === "Job posted successfully!" ? null : curr));
    }, 4000);
  };

  // Delete a job (Client action)
  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId, currentUser?.id);
      // Refresh the job list in state
      setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
      // Also remove any proposals associated with this job
      setProposals((prevProposals) => prevProposals.filter((p) => p.jobId !== jobId));
      // Close modal if open for this job
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(null);
      }
      setNotification({
        type: "success",
        message: "Job and its associated proposals were deleted successfully.",
      });
      setTimeout(() => {
        setNotification((curr) => (curr?.type === "success" ? null : curr));
      }, 4000);
    } catch (err) {
      console.error("Error deleting job:", err);
      setNotification({
        type: "error",
        message: err.message || "Failed to delete job.",
      });
      setTimeout(() => {
        setNotification((curr) => (curr?.type === "error" ? null : curr));
      }, 5000);
    }
  };

  // Submit a proposal (Freelancer action)
  const handleSubmitProposal = async (proposalData) => {
    const created = await submitProposal(proposalData);
    setProposals([created, ...proposals]);
  };

  // Accept or reject a proposal (Client action)
  const handleUpdateProposalStatus = async (proposalId, status) => {
    const updated = await updateProposalStatus(proposalId, status);
    setProposals(
      proposals.map((p) => (p.id === proposalId ? updated : p))
    );
  };

  const currentRole = currentUser ? currentUser.role : null;
  const currentFreelancers = users.filter((u) => u.role === "FREELANCER");

  // Filter proposals relevant to the active user
  const relevantProposals = proposals.filter((p) => {
    if (currentRole === "FREELANCER") {
      return currentUser && p.freelancerId === currentUser.id;
    }
    return true; // Clients see proposals submitted across jobs
  });

  return (
    <div className="app">
      {/* Navigation */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenPostJob={() => setIsPostJobOpen(true)}
      />

      {/* Backend Connection Warning if Spring Boot isn't running */}
      {backendError && (
        <div className="container" style={{ marginTop: "1rem" }}>
          <div className="banner banner-warning">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <AlertCircle size={22} />
              <div>
                <strong>Backend Disconnected: </strong>
                {backendError}
              </div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={loadData}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="container" style={{ marginTop: "3rem" }}>
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3 className="empty-title">Loading SkillSprint...</h3>
            <p className="empty-text">Connecting to your Spring Boot & MySQL backend.</p>
          </div>
        </div>
      ) : !currentUser ? (
        /* Logged Out: Show Single-Account Login Screen */
        <main className="container">
          <LoginView
            users={users}
            onLogin={handleLogin}
            onRegisterUser={handleRegisterUser}
          />
        </main>
      ) : (
        /* Logged In: Single Profile Experience */
        <>
          {/* Hero Header */}
          <section className="hero">
            <div className="container hero-content">
              <div>
                <h1 className="hero-title">
                  {currentRole === "FREELANCER"
                    ? "🚀 Discover freelance projects and get hired"
                    : "💼 Hire top freelance talent for your business"}
                </h1>
                <p className="hero-subtitle">
                  {currentRole === "FREELANCER"
                    ? "Browse open jobs, submit high-impact proposals, and grow your career on SkillSprint."
                    : "Post jobs, review applicant proposals, and connect directly with verified experts."}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "10px",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div style={{ fontSize: "0.8rem", opacity: 0.85 }}>Signed in as:</div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                  {currentUser.title || currentUser.role}
                </div>
              </div>
            </div>
          </section>

          {/* Main Body */}
          <main className="container">
            {/* Notification Banner for Success / Error */}
            {notification && (
              <div
                className={`banner ${
                  notification.type === "success" ? "banner-success" : "banner-error"
                }`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {notification.type === "success" ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                  <span>{notification.message}</span>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setNotification(null)}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
                onClick={() => setActiveTab("jobs")}
              >
                📋 Browse Jobs ({jobs.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "freelancers" ? "active" : ""}`}
                onClick={() => setActiveTab("freelancers")}
              >
                👥 Freelancers ({currentFreelancers.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "proposals" ? "active" : ""}`}
                onClick={() => setActiveTab("proposals")}
              >
                📄 {currentRole === "CLIENT" ? "Client Proposals" : "My Proposals"} (
                {relevantProposals.length})
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === "jobs" && (
              <JobList
                jobs={jobs}
                currentRole={currentRole}
                currentUser={currentUser}
                onSelectJob={(job) => setSelectedJob(job)}
                onDeleteJob={handleDeleteJob}
              />
            )}

            {activeTab === "freelancers" && (
              <FreelancerList freelancers={currentFreelancers} />
            )}

            {activeTab === "proposals" && (
              <ProposalsList
                proposals={relevantProposals}
                currentRole={currentRole}
                onUpdateStatus={handleUpdateProposalStatus}
              />
            )}
          </main>

          {/* Job Details & Proposal Submission Modal */}
          {selectedJob && (
            <JobModal
              key={selectedJob.id}
              job={selectedJob}
              currentUser={currentUser}
              currentRole={currentRole}
              onClose={() => setSelectedJob(null)}
              onSubmitProposal={handleSubmitProposal}
            />
          )}

          {/* Post a Job Modal (Client Only) */}
          {isPostJobOpen && currentUser && (
            <PostJobModal
              client={currentUser}
              onClose={() => setIsPostJobOpen(false)}
              onJobCreated={handleCreateJob}
            />
          )}
        </>
      )}
    </div>
  );
}
