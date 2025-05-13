import React from "react";

function TaskCard({ task }) {
  return (
    <div key={task.id} className="col-md-3 mb-4">
      <div className="card shadow h-100">
        <div className="card-body">
          <h5>{task.title}</h5>
          <p className="text-muted">Status: {task.status}</p>
          <p>{task.description}</p>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
