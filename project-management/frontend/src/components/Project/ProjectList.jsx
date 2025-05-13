// src/components/Project/ProjectList.jsx
import React from "react";
import ProjectCard from "./ProjectCard";

function ProjectList({ projects }) {
  return (
    <div className="row">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectList;
