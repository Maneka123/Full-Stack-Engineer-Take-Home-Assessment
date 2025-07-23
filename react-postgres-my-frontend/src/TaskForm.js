import React from "react";

export default function TaskForm({ newTask, setNewTask, createTask }) {
  return (
    <div className="task-form">
      <h2>Add a Task</h2>
      <input
        type="text"
        placeholder="Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      <button onClick={createTask}>Add Task</button>
    </div>
  );
}
