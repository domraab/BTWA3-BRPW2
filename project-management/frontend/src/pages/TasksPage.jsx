import React, { useEffect, useState } from "react";
import TaskCard from "../components/Task/TaskCard";
import { getTasks } from "../services/taskService";

function TasksPage() {
  const [tasks, setTasks]         = useState([]);
  const [filterStatus, setFilter] = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (e) {
        console.error(e);
        setError("Chyba při načítání úkolů");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;

  const filteredTasks = tasks.filter((t) => {
    if (!filterStatus) return true;
    return t.status === filterStatus;
  });

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 text-gray-800">All Tasks</h2>
      </div>
      <div className="mb-3">
        <label className="form-label">Filter by status:</label>
        <select
          className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filterStatus}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="">-- All --</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="On Hold">On Hold</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className="row">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TasksPage;
