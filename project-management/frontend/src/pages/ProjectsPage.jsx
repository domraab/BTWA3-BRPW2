// src/pages/ProjectsPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects } from "../services/projectService";
import { getCurrentUser, isLoggedIn } from "../services/authService";
import ProjectList from "../components/Project/ProjectList";

function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [uLoading, setULoading] = useState(true);
  const [uError, setUError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
        const visibleProjects = data.filter((p) => p.status !== "Done");
        setProjects(visibleProjects);
      } catch (e) {
        console.error(e);
        setError("Chyba při načítání projektů");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
      return;
    }
    (async () => {
      try {
        const me = await getCurrentUser();
        setUser(me);
      } catch (e) {
        console.error(e);
        setUError("Nepodařilo se načíst profil uživatele");
      } finally {
        setULoading(false);
      }
    })();
  }, [navigate]);

  if (loading || uLoading) return <p>Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (uError) return <div className="alert alert-warning">{uError}</div>;

  const isManager = user.role === "manager";

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 text-gray-800">Projects</h2>
        {isManager && (
          <Link to="/projects/create" className="btn btn-primary">
            <i className="fas fa-plus mr-1"></i> Create New Project
          </Link>
        )}
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}

export default ProjectsPage;
