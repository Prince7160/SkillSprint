import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";

/**
 * PostJobModal Component:
 * - Simple form for Clients to create a new job posting
 */
export default function PostJobModal({ client, onClose, onJobCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !budget || !description.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await onJobCreated({
        title: title.trim(),
        category,
        budget: Number(budget),
        description: description.trim(),
        clientId: client.id,
        clientName: client.name,
        status: "OPEN",
      });
      onClose();
    } catch (err) {
      alert("Error posting job: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📢 Post a New Job</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title:</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Build Responsive Landing Page in React"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category:</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Web Development">Web Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Mobile Development">Mobile Development</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Budget (₹ INR):</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 25000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              min="100"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Description & Requirements:</label>
            <textarea
              className="form-control"
              placeholder="Describe the scope, deliverables, timeline, and technologies required..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <PlusCircle size={16} />
              {loading ? "Posting..." : "Publish Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
