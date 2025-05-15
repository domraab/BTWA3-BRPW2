// src/pages/KanbanBoardPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getTasksByProject, updateTaskStatus, createTask } from "../services/taskService";
import { getProjectById, updateProjectStatus } from "../services/projectService";
import { getCurrentUser } from "../services/authService";
import TaskModal from "../components/Task/TaskModal";

const STATUSES = ["Pending", "In Progress", "On Hold", "Done"];

export default function KanbanBoardPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(null); // null = zavřeno, jinak status
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [proj, taskList, me] = await Promise.all([
          getProjectById(projectId),
          getTasksByProject(projectId),
          getCurrentUser(),
        ]);
        setProject(proj);
        setTasks(taskList);
        setUser(me);
      } catch (err) {
        console.error(err);
        setError("Failed to load project or tasks");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const handleCreateTask = async (data) => {
    try {
      const newTask = await createTask({
        ...data,
        projectId: parseInt(projectId),
      });
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const handleFinishProject = async () => {
    try {
      await updateProjectStatus(project.id, "Done");
      setProject((prev) => ({ ...prev, status: "Done" }));
    } catch (err) {
      console.error("Failed to finish project", err);
    }
  };

  const allTasksDone = tasks.length > 0 && tasks.every((task) => task.status === "Done");

  if (loading) return <p>Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">Kanban Board: {project.name}</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          {STATUSES.map((status) => (
            <div className="col-md-3" key={status}>
              <div className="card shadow mb-4">
                <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                  <strong>{status}</strong>
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => setModalOpen(status)}
                  >
                    + Add
                  </button>
                </div>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="card-body min-vh-25"
                      style={{ minHeight: "200px" }}
                    >
                      {tasks
                        .filter((t) => t.status === status)
                        .map((task, index) => (
                          <Draggable
                            draggableId={String(task.id)}
                            index={index}
                            key={task.id}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="card mb-2 p-2 shadow-sm"
                              >
                                <div className="fw-bold">{task.title}</div>
                                <small>{task.description}</small>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {user?.role === "manager" && allTasksDone && project.status !== "Done" && (
        <div className="text-end mt-3">
          <button className="btn btn-sm btn-success" onClick={handleFinishProject}>Finish Project</button>
        </div>
      )}

      <TaskModal
        isOpen={modalOpen !== null}
        onClose={() => setModalOpen(null)}
        onCreate={handleCreateTask}
        initialStatus={modalOpen}
      />
    </div>
  );
}
