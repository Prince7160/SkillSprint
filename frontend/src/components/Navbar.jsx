import React from "react";
import { Briefcase, LogOut, PlusCircle, User } from "lucide-react";

/**
 * Navbar Component:
 * - Brand logo & title
 * - Shows ONE active user profile
 * - "Post a Job" button (only for Clients)
 * - Clear "Log Out" button
 */
export default function Navbar({ currentUser, onLogout, onOpenPostJob }) {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <div className="brand">
          <Briefcase size={26} />
          <span>SkillSprint</span>
          <span className="brand-badge">Marketplace</span>
        </div>

        {/* Navigation actions for logged-in user */}
        {currentUser && (
          <div className="nav-actions">
            {/* Single Profile Display */}
            <div className="user-profile-badge">
              <div className="avatar-circle">
                <User size={16} />
              </div>
              <div className="profile-details">
                <span className="profile-name">{currentUser.name}</span>
                <span
                  className={`badge ${
                    currentUser.role === "CLIENT"
                      ? "badge-primary"
                      : "badge-success"
                  } profile-role`}
                >
                  {currentUser.role}
                </span>
              </div>
            </div>

            {/* If Client, show "Post a Job" button */}
            {currentUser.role === "CLIENT" && (
              <button className="btn btn-primary" onClick={onOpenPostJob}>
                <PlusCircle size={16} />
                Post a Job
              </button>
            )}

            {/* Logout button */}
            <button
              className="btn btn-outline btn-logout"
              onClick={onLogout}
              title="Log out of your account"
            >
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
