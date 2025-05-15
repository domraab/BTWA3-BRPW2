// src/pages/ProjectDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById, updateProjectStatus, assignTeamToProject } from "../services/projectService";
import { getTeams } from "../services/teamService";
import { getTasks, createTask, updateTaskStatus } from "../services/taskService";
import { getCurrentUser } from "../services/authService";
import TaskModal from "../components/Task/TaskModal";

function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const proj = await getProjectById(id);
        setProject(proj);

        const allTasks = await getTasks();
        const me = await getCurrentUser();
        setUser(me);

        const visibleTasks = allTasks.filter((t) => t.projectId === proj.id);
        setProjectTasks(visibleTasks);


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

  const handleAssignTeam = async (teamId) => {
    try {
      await assignTeamToProject(project.id, teamId);
      setProject((prev) => ({ ...prev, teamId }));
    } catch (e) {
      console.error("Failed to assign team", e);
      setError("Failed to assign team to project.");
    }
  };

  const handleCreateTask = async (data) => {
    try {
      const newTask = await createTask({
        ...data,
        projectId: project.id,
        status: data.status || "Pending",
      });
      setProjectTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error("Failed to create task", err);
      setError("Failed to create new task.");
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setProjectTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const allTasksDone = projectTasks.length > 0 && projectTasks.every((task) => task.status === "Done");

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
          </div>

          {user?.role === "manager" && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Assign Team:
              </label>
              <select
                className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => handleAssignTeam(e.target.value)}
                value={project.teamId || ""}
              >
                <option value="">-- Select Team --</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Task:</label>
            {projectTasks.map((task) => (
              <div key={task.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                <div>
                  <strong>{task.title}</strong>
                  <div><small>{task.description}</small></div>
                </div>
                <select
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={task.status}
                  onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {user?.role === "manager" && allTasksDone && project.status !== "Done" && (
        <div className="text-end mt-3">
          <button className="btn btn-sm btn-success" onClick={() => handleChangeStatus("Done")}> Finish Project</button>
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateTask}
        initialStatus="Pending"
      />
    </div>
  );
}

export default ProjectDetailPage;