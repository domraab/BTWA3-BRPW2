// src/components/Layout/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, isLoggedIn, logout } from "../../services/authService";

function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      return navigate("/login", { replace: true });
    }
    async function loadUser() {
      const u = await getCurrentUser();
      if (!u) {
        // token invalid or expired
        logout();
        return navigate("/login", { replace: true });
      }
      setUser(u);
    }
    loadUser();
  }, [navigate]);

  // role is a single string: "manager", "developer", or "tester"
  const role = user?.role;

  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* Brand */}
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink" />
        </div>
        <div className="sidebar-brand-text mx-3">PROJECT MGMT</div>
      </Link>

      <hr className="sidebar-divider my-0" />

      {/* Dashboard */}
      <li className="nav-item">
        <Link className="nav-link" to="/">
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Dashboard</span>
        </Link>
      </li>

      {/* Projects */}
      <li className="nav-item">
        <Link className="nav-link" to="/projects">
          <i className="fas fa-fw fa-folder" />
          <span>Projects</span>
        </Link>
      </li>

      {/* Tasks */}
      <li className="nav-item">
        <Link className="nav-link" to="/tasks">
          <i className="fas fa-fw fa-tasks" />
          <span>Tasks</span>
        </Link>
      </li>

      {/* Manager‑only */}
      {role === "manager" && (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/reports">
              <i className="fas fa-fw fa-chart-bar" />
              <span>Reports</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/users">
              <i className="fas fa-fw fa-user" />
              <span>Users</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/teams">
                <i className="fas fa-fw fa-users" />
                <span>Teams</span>
            </Link>
          </li>
          
        </>
      )}

      {/* Settings (all roles) */}
      <li className="nav-item">
        <Link className="nav-link" to="/settings">
          <i className="fas fa-fw fa-cog" />
          <span>Settings</span>
        </Link>
      </li>

      <hr className="sidebar-divider d-none d-md-block" />

      {/* Show current role + Logout */}
      {user && (
        <div className="sidebar-footer text-center">
          <small className="text-light d-block mb-1">Role: {role}</small>
        </div>
      )}

      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
    </ul>
  );
}

export default Sidebar;
