import React from "react";

export default function TaskList({ tasks, markTaskAsDone }) {
  return (
    <div className="task-list">
      <h2>Tasks</h2>
      <ul>
        {tasks
          .filter((task) => task.status !== "complete")
          .map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> — {task.description}
              <button onClick={() => markTaskAsDone(task.id)} className="done-button">
                Done
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
