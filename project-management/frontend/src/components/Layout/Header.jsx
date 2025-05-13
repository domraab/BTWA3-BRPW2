// src/components/Layout/Header.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../../services/authService";
import { getProjects } from "../../services/projectService";

function Header() {
  const navigate = useNavigate();

  // switch to async-loaded user
  const [user, setUser] = useState(null);

  // search form state
  const [searchTerm, setSearchTerm] = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  // load projects for the autocomplete
  useEffect(() => {
    getProjects()
      .then(setAllProjects)
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  // load current user
  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      if (!u) {
        // if no token / no user, force login
        return navigate("/login", { replace: true });
      }
      setUser(u);
    }
    loadUser();
  }, [navigate]);

  // filter as you type
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProjects([]);
      return;
    }
    setFilteredProjects(
      allProjects.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, allProjects]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSelectProject = (projectId) => {
    navigate(`/projects/${projectId}`);
    setFilteredProjects([]);
    setSearchTerm("");
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
      >
        <i className="fa fa-bars" />
      </button>

      <form
        className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="input-group" style={{ position: "relative" }}>
          <input
            type="text"
            className="form-control bg-light border-0 small"
            placeholder="Search projects…"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ zIndex: 2 }}
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit">
              <i className="fas fa-search fa-sm" />
            </button>
          </div>
          {filteredProjects.length > 0 && (
            <ul
              className="list-group"
              style={{
                position: "absolute",
                top: "38px",
                left: 0,
                width: "100%",
                zIndex: 10,
              }}
            >
              {filteredProjects.map((proj) => (
                <li
                  key={proj.id}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectProject(proj.id)}
                >
                  {proj.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      <ul className="navbar-nav ml-auto">
        {/* Mobile search dropdown, etc… */}

        {user && (
          <li className="nav-item dropdown no-arrow">
            <a
              className="nav-link dropdown-toggle"
              href="#!"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                {/* display fullName or fallback to username */}
                {user.fullName || user.username}
              </span>
              <i className="fas fa-user-circle fa-lg text-gray-400" />
            </a>
            <div
              className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="userDropdown"
            >
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                Logout
              </button>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Header;
