// src/components/Project/ProjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  const { name, description, status, id } = project;

  return (
    <div className="col-md-3 mb-4">
      <div className="card shadow h-100">
        <div className="card-body d-flex flex-column">
          <h5>{name}</h5>
          <p className="text-muted">Status: {status}</p>
          <p>{description}</p>

          <Link
            to={`/projects/${id}`}
            className="btn btn-sm btn-outline-primary mt-auto"
          >
            View Details
          </Link>

          <Link
            to={`/kanban/${id}`}
            className="btn btn-sm btn-outline-secondary mt-2"
          >
            Open Kanban
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
