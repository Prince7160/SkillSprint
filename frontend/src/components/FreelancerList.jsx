import React, { useState } from "react";
import { Mail } from "lucide-react";

/**
 * FreelancerList Component:
 * - Search talent by name or skill (e.g., "React", "Kotlin")
 * - View profile bios, hourly rates, and skill pills
 */
export default function FreelancerList({ freelancers }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFreelancers = freelancers.filter((f) => {
    const term = searchTerm.toLowerCase();
    return (
      f.name.toLowerCase().includes(term) ||
      f.title.toLowerCase().includes(term) ||
      f.skills.toLowerCase().includes(term) ||
      f.bio.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Search Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search freelancers by name, skill (e.g. React, Kotlin), or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredFreelancers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3 className="empty-title">No freelancers found</h3>
          <p className="empty-text">Try searching for other skills or keywords.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredFreelancers.map((freelancer) => {
            const skillList = freelancer.skills
              ? freelancer.skills.split(",").map((s) => s.trim())
              : [];

            return (
              <div key={freelancer.id} className="card">
                <div>
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">{freelancer.name}</h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>
                        {freelancer.title || "Independent Professional"}
                      </p>
                    </div>
                    {freelancer.hourlyRate > 0 && (
                      <span className="card-budget" style={{ fontSize: "1.05rem" }}>
                        ₹{freelancer.hourlyRate}/hr
                      </span>
                    )}
                  </div>

                  <p className="card-desc">{freelancer.bio}</p>

                  {/* Skills */}
                  {skillList.length > 0 && (
                    <div className="skills-wrap">
                      {skillList.map((skill, idx) => (
                        <span key={idx} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <span className="card-meta" style={{ margin: 0 }}>
                    <Mail size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    {freelancer.email}
                  </span>
                  <a
                    href={`mailto:${freelancer.email}`}
                    className="btn btn-primary btn-sm"
                  >
                    Contact
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
