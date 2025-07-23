import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    setError("");
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

  const createTask = async () => {
    if (!newTask.title.trim()) {
      alert("Title is required");
      return;
    }
    setError("");
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

  const markTaskAsDone = async (id) => {
    setError("");
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
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
        backgroundImage: `url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 20,
        borderRadius: 12,
        color: "#fff",
        minHeight: "80vh",
        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30, textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}>
        Task Manager
      </h1>

      <div
        style={{
          display: "flex",
          gap: 40,
          justifyContent: "space-between",
        }}
      >
        {/* Left column: Add Task Form */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0,0,0,0.4)",
          }}
        >
          <h2>Add Task</h2>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ width: "100%", padding: 8, marginBottom: 10, borderRadius: 4, border: "none" }}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ width: "100%", padding: 8, marginBottom: 10, borderRadius: 4, border: "none" }}
          />
          <button
            onClick={createTask}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Add Task
          </button>
          {error && <p style={{ color: "#ff6b6b", marginTop: 10 }}>{error}</p>}
        </div>

        {/* Right column: Task List */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0,0,0,0.4)",
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          <h2>Tasks</h2>
          {loading && <p>Loading...</p>}
          {!loading && tasks.length === 0 && <p>No incomplete tasks.</p>}
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  padding: 10,
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#fff",
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
    </div>
  );
}

export default App;
