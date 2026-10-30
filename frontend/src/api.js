// Base URL of the Kotlin Spring Boot backend
const API_BASE = "http://localhost:8080/api";

/**
 * Fetch all jobs or filter by client ID
 */
export async function fetchJobs(clientId = null) {
  const url = clientId ? `${API_BASE}/jobs?clientId=${clientId}` : `${API_BASE}/jobs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

/**
 * Create a new job posting (Client action)
 */
export async function createJob(jobData) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
}

/**
 * Fetch users, optionally filtered by role: "FREELANCER" or "CLIENT"
 */
export async function fetchUsers(role = null) {
  const url = role ? `${API_BASE}/users?role=${role}` : `${API_BASE}/users`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

/**
 * Create a new user profile
 */
export async function createUser(userData) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

/**
 * Fetch proposals, optionally filtered by jobId or freelancerId
 */
export async function fetchProposals({ jobId, freelancerId } = {}) {
  let url = `${API_BASE}/proposals`;
  if (jobId) url += `?jobId=${jobId}`;
  else if (freelancerId) url += `?freelancerId=${freelancerId}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch proposals");
  return res.json();
}

/**
 * Submit a proposal/bid for a job (Freelancer action)
 */
export async function submitProposal(proposalData) {
  const res = await fetch(`${API_BASE}/proposals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proposalData),
  });
  if (!res.ok) throw new Error("Failed to submit proposal");
  return res.json();
}

/**
 * Update proposal status (e.g. "ACCEPTED" or "REJECTED")
 */
export async function updateProposalStatus(proposalId, status) {
  const res = await fetch(`${API_BASE}/proposals/${proposalId}/status?status=${status}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to update proposal status");
  return res.json();
}

/**
 * Delete a job and its associated proposals (Client action)
 */
export async function deleteJob(jobId, clientId = null) {
  const url = clientId ? `${API_BASE}/jobs/${jobId}?clientId=${clientId}` : `${API_BASE}/jobs/${jobId}`;
  const res = await fetch(url, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to delete job");
  }
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return { success: true };
}
