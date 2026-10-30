import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

/**
 * ProposalsList Component:
 * - Shows submitted bids and allows Clients to Accept/Reject them
 */
export default function ProposalsList({
  proposals,
  currentRole,
  onUpdateStatus,
}) {
  const getBadgeClass = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "badge-success";
      case "REJECTED":
        return "badge-danger";
      default:
        return "badge-warning";
    }
  };

  return (
    <div>
      {proposals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3 className="empty-title">No proposals yet</h3>
          <p className="empty-text">
            {currentRole === "CLIENT"
              ? "When freelancers apply to your jobs, proposals will appear here."
              : "You haven't submitted any proposals yet. Browse jobs and apply!"}
          </p>
        </div>
      ) : (
        <div className="grid">
          {proposals.map((p) => (
            <div key={p.id} className="card">
              <div>
                <div className="card-header">
                  <div>
                    <h4 className="card-title" style={{ fontSize: "1.05rem" }}>
                      {p.jobTitle}
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Freelancer: <strong>{p.freelancerName}</strong>
                    </p>
                  </div>
                  <span className="card-budget">
                    ₹{p.bidAmount?.toLocaleString()}
                  </span>
                </div>

                <div className="card-meta">
                  <span>
                    <Clock size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                    {p.submittedAt}
                  </span>
                  <span className={`badge ${getBadgeClass(p.status)}`}>
                    {p.status}
                  </span>
                </div>

                <p
                  className="card-desc"
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    whiteSpace: "pre-line",
                  }}
                >
                  "{p.coverLetter}"
                </p>
              </div>

              {/* Actions for Client */}
              {currentRole === "CLIENT" && p.status === "PENDING" && (
                <div className="card-footer" style={{ gap: "0.5rem" }}>
                  <button
                    className="btn btn-success btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => onUpdateStatus(p.id, "ACCEPTED")}
                  >
                    <CheckCircle size={15} />
                    Accept
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => onUpdateStatus(p.id, "REJECTED")}
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
