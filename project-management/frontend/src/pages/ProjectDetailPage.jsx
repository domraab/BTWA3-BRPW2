// src/pages/ProjectDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById, updateProjectStatus, assignTeamToProject } from "../services/projectService";
import { getTeams } from "../services/teamService";
import { getTasks, createTask } from "../services/taskService";
import { getCurrentUser } from "../services/authService";
import TaskList from "../components/Task/TaskList";
import TaskForm from "../components/Task/TaskForm";

function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const proj = await getProjectById(id);
        setProject(proj);

        const allTasks = await getTasks();
        setProjectTasks(allTasks.filter((t) => t.projectId === proj.id));

        const me = await getCurrentUser();
        setUser(me);

        if (me.role === "manager") {
          const teamList = await getTeams();
          setTeams(teamList);
        }
      } catch (e) {
        console.error("Error loading project detail:", e);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChangeStatus = async (newStatus) => {
    setError("");
    try {
      await updateProjectStatus(project.id, newStatus);
      setProject((prev) => ({ ...prev, status: newStatus }));
    } catch (e) {
      console.error("Failed to update status", e);
      setError("Failed to update project status.");
    }
  };

  const handleCreateTask = async (taskData) => {
    setError("");
    try {
      const created = await createTask(taskData);
      setProjectTasks((prev) => [...prev, created]);
    } catch (e) {
      console.error("Failed to create task", e);
      setError("Failed to create new task.");
    }
  };

  const handleAssignTeam = async (teamId) => {
    try {
      await assignTeamToProject(project.id, teamId);
      setProject((prev) => ({ ...prev, teamId }));
    } catch (e) {
      console.error("Failed to assign team", e);
      setError("Failed to assign team to project.");
    }
  };

  if (loading) return <div className="container-fluid"><p>Loading…</p></div>;
  if (!project) return <div className="container-fluid"><h2 className="h4 text-gray-800">Project not found</h2></div>;

  return (
    <div className="container-fluid">
      <h2 className="h3 mb-4 text-gray-800">Project Detail</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Name: {project.name}</h5>
          <p className="card-text"><strong>Description:</strong> {project.description}</p>
          <p className="card-text"><strong>Status:</strong> {project.status}</p>

          <div className="mb-3">
            <button className="btn btn-sm btn-secondary me-2" onClick={() => handleChangeStatus("In Progress")}>Set In Progress</button>
            <button className="btn btn-sm btn-success" onClick={() => handleChangeStatus("Done")}>Set Done</button>
          </div>

          {user?.role === "manager" && (
            <div className="mt-3">
              <label className="form-label">Assign Team:</label>
              <select className="form-select" onChange={(e) => handleAssignTeam(e.target.value)} value={project.teamId || ""}>
                <option value="">-- Select Team --</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Tasks for this project</h6>
        </div>
        <div className="card-body">
          {projectTasks.length === 0 ? <p>No tasks found for this project.</p> : <TaskList tasks={projectTasks} />}
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Create New Task</h6>
        </div>
        <div className="card-body">
          <TaskForm onSubmit={handleCreateTask} projectId={project.id} />
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
