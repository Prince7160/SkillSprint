import React, { useState } from "react";
import { Building, Clock, ArrowRight, Trash2 } from "lucide-react";

/**
 * JobList Component:
 * - Search & category filters
 * - Grid of job cards
 * - Actions for Freelancers (Apply) and Clients (View Details, Delete Job)
 */
export default function JobList({
  jobs,
  onSelectJob,
  currentRole,
  currentUser,
  onDeleteJob,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Filter jobs by search term and selected category
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search & Category Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search jobs by keyword, title, or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Backend Development">Backend Development</option>
        </select>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3 className="empty-title">No jobs found</h3>
          <p className="empty-text">
            Try adjusting your search filters or check back later!
          </p>
        </div>
      ) : (
        <div className="grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="card">
              <div>
                <div className="card-header">
                  <span className="badge badge-primary">{job.category}</span>
                  <span className="card-budget">
                    ₹{job.budget?.toLocaleString()}
                  </span>
                </div>

                <h3 className="card-title">{job.title}</h3>

                <div className="card-meta">
                  <span>
                    <Building size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                    {job.clientName}
                  </span>
                  <span>
                    <Clock size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                    {job.createdAt || "Recently"}
                  </span>
                </div>

                <p className="card-desc">{job.description}</p>
              </div>

              <div className="card-footer">
                <span
                  className={`badge ${
                    job.status === "OPEN" ? "badge-success" : "badge-danger"
                  }`}
                >
                  {job.status}
                </span>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {/* Delete Job button: Only shown for CLIENT who owns this job */}
                  {currentRole === "CLIENT" && currentUser && currentUser.id === job.clientId && (
                    <button
                      className="btn btn-outline btn-sm btn-delete-job"
                      onClick={(e) => {
                        e.stopPropagation();
                        const confirmed = window.confirm(
                          `Are you sure you want to delete "${job.title}"?\n\nThis will permanently delete the job and all its submitted proposals.`
                        );
                        if (confirmed && onDeleteJob) {
                          onDeleteJob(job.id);
                        }
                      }}
                      title="Delete this job"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  )}

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => onSelectJob(job)}
                  >
                    {currentRole === "FREELANCER" ? "View & Apply" : "View Details"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
