
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tasks on mount and after updates
  const fetchTasks = async () => {
    setError(""); // reset error
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create new task
  const createTask = async () => {
    if (!newTask.title.trim()) {
      alert("Title is required");
      return;
    }
    setError(""); // reset error
    try {
      setLoading(true);
      await axios.post(API_URL, newTask);
      setNewTask({ title: "", description: "" });
      await fetchTasks();
    } catch {
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // Mark task done
  const markTaskAsDone = async (id) => {
    setError(""); // reset error
    try {
      setLoading(true);
      await axios.put(`${API_URL}/${id}/status`);
      await fetchTasks();
    } catch {
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Task Manager</h1>

      <div style={{ marginBottom: 30, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>Add Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <button onClick={createTask} disabled={loading} style={{ padding: "10px 20px" }}>
          Add Task
        </button>
      </div>

      <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>Tasks</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && tasks.length === 0 && <p>No incomplete tasks.</p>}
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                padding: 10,
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{task.title}</strong> — {task.description}
              </div>
              <button
                onClick={() => markTaskAsDone(task.id)}
                disabled={loading}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
