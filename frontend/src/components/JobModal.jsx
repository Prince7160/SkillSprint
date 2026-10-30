import React, { useState } from "react";
import { Building, Clock, Send, X } from "lucide-react";

/**
 * JobModal Component:
 * - Displays complete job details
 * - Allows Freelancers to submit a proposal with cover letter and bid amount
 */
export default function JobModal({
  job,
  currentUser,
  currentRole,
  onClose,
  onSubmitProposal,
}) {
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState(job ? job.budget : "");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in as a freelancer to submit a proposal.");
      return;
    }
    if (!coverLetter.trim() || !bidAmount) {
      alert("Please enter a cover letter and bid amount.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitProposal({
        jobId: job.id,
        jobTitle: job.title,
        freelancerId: currentUser.id,
        freelancerName: currentUser.name,
        coverLetter: coverLetter.trim(),
        bidAmount: Number(bidAmount),
        status: "PENDING",
      });
      setSuccessMessage("🎉 Proposal submitted successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      alert("Error submitting proposal: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="badge badge-primary">{job.category}</span>
            <h2 className="modal-title" style={{ marginTop: "0.4rem" }}>
              {job.title}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Job details */}
        <div className="card-meta" style={{ marginBottom: "1rem" }}>
          <span>
            <Building size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            Posted by <strong>{job.clientName}</strong>
          </span>
          <span>
            <Clock size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            {job.createdAt}
          </span>
          <span style={{ fontWeight: 700, color: "var(--success)" }}>
            Budget: ₹{job.budget?.toLocaleString()}
          </span>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "0.95rem", marginBottom: "0.5rem", color: "#334155" }}>
            Job Description:
          </h4>
          <p style={{ whiteSpace: "pre-line", color: "#475569", lineHeight: "1.6" }}>
            {job.description}
          </p>
        </div>

        {/* Freelancer Proposal Form */}
        {currentRole === "FREELANCER" && job.status === "OPEN" && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "1.25rem",
              marginTop: "1.25rem",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              ✍️ Submit a Proposal
            </h3>

            {successMessage ? (
              <div className="banner banner-info">{successMessage}</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Your Bid Amount (₹ INR):
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Letter / Pitch:</label>
                  <textarea
                    className="form-control"
                    placeholder="Explain why you're a great fit for this project, your experience, and timeline..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    <Send size={16} />
                    {submitting ? "Submitting..." : "Send Proposal"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* If closed or Client view */}
        {job.status === "CLOSED" && (
          <div className="banner banner-warning">
            This job posting has been marked as closed.
          </div>
        )}
      </div>
    </div>
  );
}
